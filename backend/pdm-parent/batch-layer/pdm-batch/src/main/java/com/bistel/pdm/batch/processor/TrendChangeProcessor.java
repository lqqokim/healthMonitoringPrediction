package com.bistel.pdm.batch.processor;

import com.bistel.pdm.batch.util.ServingRequestor;
import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.common.json.SummarizedFeature;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.PunctuationType;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class TrendChangeProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(TrendChangeProcessor.class);

    private final static String SEPARATOR = ",";

    //private WindowStore<String, Double> kvFeatureDataStore;
    private KeyValueStore<Long, String> kvMovingAvgStore;

    private final Timer timer = new Timer();

    private final static List<SummarizedFeature> paramFeatureValueList = new ArrayList<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvMovingAvgStore = (KeyValueStore) context().getStateStore("batch-moving-average");

        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.DATE, 1);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);

        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                Date date = new Date();
                Calendar cal = Calendar.getInstance();
                cal.setTime(date);
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);

                Long to = cal.getTime().getTime();
                Long from = to - TimeUnit.DAYS.toMillis(90);

                paramFeatureValueList.clear();
                //String url = "http://10.50.21.240:28000/pdm/api/feature/" + from + "/" + to;
                String url = MasterDataCache.getInstance().getServingAddress() + "/pdm/api/feature/" + from + "/" + to;
                paramFeatureValueList.addAll(ServingRequestor.getParamFeatureAvgFor(url));
                log.info("90-days summary from {} to {}. - refresh count : {}",
                        new Timestamp(from), new Timestamp(to), paramFeatureValueList.size());

                for (SummarizedFeature sumFeature : paramFeatureValueList) {
                    kvMovingAvgStore.put(sumFeature.getParamRawId(), "0,0");
                }
            }
        }, c.getTime(), TimeUnit.DAYS.toMillis(1));

        log.debug("scheduler start time : {} ", c.getTime());
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);

        try {
            if (paramFeatureValueList.size() <= 0) {
                Date date = new Date();
                Calendar cal = Calendar.getInstance();
                cal.setTime(date);
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);

                Long to = cal.getTime().getTime();
                Long from = to - TimeUnit.DAYS.toMillis(90);

                String url = MasterDataCache.getInstance().getServingAddress() + "/pdm/api/feature/" + from + "/" + to;
                paramFeatureValueList.addAll(ServingRequestor.getParamFeatureAvgFor(url));
                log.info("90-days summary from {} to {}. - refresh count : {}",
                        new Timestamp(from), new Timestamp(to), paramFeatureValueList.size());

                if (paramFeatureValueList.size() < 0) {
                    log.debug("[{}] - The 90 days average value does not exist. because logic 3 can not be executed.", partitionKey);
                    return;
                }
            }

            // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
            String[] recordColumns = recordValue.split(SEPARATOR);
            String strParamRawid = recordColumns[2];
            Long paramRawid = Long.parseLong(strParamRawid);
            String paramKey = partitionKey + ":" + paramRawid;

            ParameterMasterDataSet paramMaster =
                    MasterDataCache.getInstance().getParamMasterDataSetWithRawId(partitionKey, paramRawid);

            if (paramMaster == null) return;

            ParameterHealthDataSet fd03HealthInfo =
                    MasterDataCache.getInstance().getParamHealthFD03(paramRawid);

            if (fd03HealthInfo != null && fd03HealthInfo.getApplyLogicYN().equalsIgnoreCase("Y")) {

                Integer count = Integer.parseInt(recordColumns[3]);
                Double dValue = Double.parseDouble(recordColumns[7]) * count; //avg * count

                Long endTime = Long.parseLong(recordColumns[1]);
                //Long startTime = endTime - TimeUnit.DAYS.toMillis(1);

                if (kvMovingAvgStore.get(paramRawid) == null) {
                    kvMovingAvgStore.put(paramRawid, dValue + ",1");
                } else {
                    String val = kvMovingAvgStore.get(paramRawid);
                    String[] vv = val.split(",");
                    int n = Integer.parseInt(vv[1]) + 1;
                    Double ma = dValue + Double.parseDouble(vv[0]);
                    kvMovingAvgStore.put(paramRawid, ma + "," + n);

                    Double mean = null;
                    Double sigma = null;

                    for (SummarizedFeature sf : paramFeatureValueList) {
                        if (sf.getParamRawId().equals(paramRawid)) {
                            mean = sf.getMean();
                            sigma = sf.getSigma();
                            break;
                        }
                    }

                    Double index = 0D;
                    if (mean == null || sigma == null) {
                        log.debug("[{}] - Historical data does not exist.", paramKey);
                    } else {
                        //logic 3 - calculate index
                        index = ((ma / n) - mean) / sigma;
                    }

                    log.debug("[{}] - status changes rate : {}", paramKey, index);

                    String statusCode = "N";

                    if (index >= 1) {
                        statusCode = "A";
                    } else if (index >= 0.5 && index < 1) {
                        statusCode = "W";
                    }

                    // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
                    String newMsg = endTime + ","
                            + paramMaster.getEquipmentRawId() + ","
                            + paramRawid + ","
                            + fd03HealthInfo.getParamHealthRawId() + ","
                            + statusCode + ","
                            + count + ","
                            + index + ","
                            + (paramMaster.getUpperAlarmSpec() == null ? "" : paramMaster.getUpperAlarmSpec()) + ","
                            + (paramMaster.getUpperWarningSpec() == null ? "" : paramMaster.getUpperWarningSpec()) + ","
                            + (paramMaster.getTarget() == null ? "" : paramMaster.getTarget()) + ","
                            + (paramMaster.getLowerAlarmSpec() == null ? "" : paramMaster.getLowerAlarmSpec()) + ","
                            + (paramMaster.getLowerWarningSpec() == null ? "" : paramMaster.getLowerWarningSpec());

                    context().forward(partitionKey, newMsg.getBytes());
                    context().commit();
                    log.debug("[{}] - logic 3 health : {}", paramKey, newMsg);
                }
            } else {
                log.debug("[{}] - No health because skip the logic 3.", paramKey);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
