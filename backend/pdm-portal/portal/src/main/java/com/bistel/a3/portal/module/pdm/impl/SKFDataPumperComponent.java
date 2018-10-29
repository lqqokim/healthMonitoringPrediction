package com.bistel.a3.portal.module.pdm.impl;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.dao.pdm.db.SKFPumpMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDConditionalSpecMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDEqpMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDEtcMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDParamMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.master.ParamMapper;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.domain.pdm.std.master.STDParamHealth;
import com.bistel.a3.portal.module.pdm.IDataPumperComponent;
import com.bistel.a3.portal.util.ApacheHttpClientGet;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.PartitionInfo;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import javax.annotation.PostConstruct;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Component
public class SKFDataPumperComponent implements IDataPumperComponent {
    private static Logger logger = LoggerFactory.getLogger(SKFDataPumperComponent.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private ApacheHttpClientGet apacheHttpClientGet;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

//    private Producer<String, byte[]> fab1Producer;
//    private Producer<String, byte[]> fab2Producer;
//    private Producer<String, byte[]> fab3Producer;
//    private Producer<String, byte[]> fab4Producer;
//    private Producer<String, byte[]> fab5Producer;

    @PostConstruct
    public void init() {
//        Properties prop1 = new Properties();
//        Properties prop2 = new Properties();
//        Properties prop3 = new Properties();
//        Properties prop4 = new Properties();
//        Properties prop5 = new Properties();
//
//        ClassLoader classLoader = getClass().getClassLoader();
//        File f1 = new File(classLoader.getResource("./config/producer1.properties").getFile());
//        File f2 = new File(classLoader.getResource("./config/producer2.properties").getFile());
//        File f3 = new File(classLoader.getResource("./config/producer3.properties").getFile());
//        File f4 = new File(classLoader.getResource("./config/producer4.properties").getFile());
//        File f5 = new File(classLoader.getResource("./config/producer5.properties").getFile());
//
//        try (InputStream confStream = new FileInputStream(f1)) {
//            prop1.load(confStream);
//            logger.debug("loaded config file : {}", ""); //"configPath"
//        } catch (Exception e) {
//            logger.error(e.getMessage(), e);
//        }
//
//        try (InputStream confStream = new FileInputStream(f2)) {
//            prop2.load(confStream);
//            logger.debug("loaded config file : {}", ""); //"configPath"
//        } catch (Exception e) {
//            logger.error(e.getMessage(), e);
//        }
//
//        try (InputStream confStream = new FileInputStream(f3)) {
//            prop3.load(confStream);
//            logger.debug("loaded config file : {}", ""); //"configPath"
//        } catch (Exception e) {
//            logger.error(e.getMessage(), e);
//        }
//
//        try (InputStream confStream = new FileInputStream(f4)) {
//            prop4.load(confStream);
//            logger.debug("loaded config file : {}", ""); //"configPath"
//        } catch (Exception e) {
//            logger.error(e.getMessage(), e);
//        }
//
//        try (InputStream confStream = new FileInputStream(f5)) {
//            prop5.load(confStream);
//            logger.debug("loaded config file : {}", ""); //"configPath"
//        } catch (Exception e) {
//            logger.error(e.getMessage(), e);
//        }
//
//        this.fab1Producer = new KafkaProducer<>(prop1);
//        this.fab2Producer = new KafkaProducer<>(prop2);
//        this.fab3Producer = new KafkaProducer<>(prop3);
//        this.fab4Producer = new KafkaProducer<>(prop4);
//        this.fab5Producer = new KafkaProducer<>(prop5);
    }

    @Override
    public void dataPumpBase(String fabId, String regacyName, String url) throws NoSuchMethodException {
        SKFPumpMapper getMapper = SqlSessionUtil.getMapper(sessions, regacyName, SKFPumpMapper.class);
        SKFPumpMapper putMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);


        /* information */
        //Bearing
        pump(Bearing.class, getMapper, putMapper, manager);
        //Area
        pump(Area.class, getMapper, putMapper, manager);
        //Eqp
        pump(Eqp.class, getMapper, putMapper, manager);
        //EqpEtc
        //pump(EqpEtc.class, getMapper, putMapper, manager);
        //Part
        pump(Part.class, getMapper, putMapper, manager);
        //Param
        pump(Param.class, getMapper, putMapper, manager);
        //ParamWithCommon
        //pump(ParamWithCommon.class, getMapper, putMapper, manager);
        //ManualRpm
        pump(ManualRpm.class, getMapper, putMapper, manager);
        //OverallSpec
//        pump(OverallSpec.class, getMapper, putMapper, manager);
        pumpSpec(fabId, regacyName);
        //Health
        pumpParamHealth(fabId);

        //request to Kafka

            STDEqpMapper eqpMapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
            List<Eqp> eqpList = eqpMapper.selectEqps();
            for (Eqp eqp : eqpList) {
                Long eqpId = eqp.getEqp_id();
                EqpWithEtc eqpWithEtc = eqpMapper.selectOne(eqpId);
                String eqp_name = eqpWithEtc.getName();
                eqp_name.replaceAll(",","_");
                String area_name = eqpWithEtc.getArea_name();
                apacheHttpClientGet.setUrl(url);
                apacheHttpClientGet.requestReload(area_name + "," + eqp_name);
            }

    }

    private void pumpSpec(String fabId, String regacyName) {
        SKFPumpMapper skfPumpMapper = SqlSessionUtil.getMapper(sessions, regacyName, SKFPumpMapper.class);
        STDConditionalSpecMapper conditionalSpecMapper = SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        List<OverallSpec> specs = skfPumpMapper.selectOverallSpec();
        List<OverallSpec> eqps = skfPumpMapper.selectEqps();

        String model_name = null;
        Long eqp_id = null;
        Long rule_id = null;

        //스펙 데이터 삭제
        conditionalSpecMapper.deleteEqpSpecLinkAll();
        conditionalSpecMapper.deleteModelParamSpecAll();
        conditionalSpecMapper.deleteConditionalSpecAll();

        for (int i = 0; i < eqps.size(); i++) {
            model_name = eqps.get(i).getArea_name() + "_" + eqps.get(i).getEqp_name();
            eqp_id = eqps.get(i).getEqp_id();
            conditionalSpecMapper.insertConditionalSpec(model_name, "DEFAULT", null, null, null, "SYSTEM", null);

            rule_id = conditionalSpecMapper.selectConditionalSpecRawId(model_name, "DEFAULT");

            conditionalSpecMapper.insertEqpSpecLink(eqp_id, rule_id, null, null, "SYSTEM");

            String param_name = null;
            Double alarm = null;
            Double warn = null;
            for (int j = 0; j < specs.size(); j++) {

                if (eqp_id.equals(specs.get(j).getEqp_id())) {
                    param_name = specs.get(j).getParam_name();
                    alarm = specs.get(j).getAlarm();
                    warn = specs.get(j).getWarn();
                    conditionalSpecMapper.insertModelParamSpec(rule_id, param_name, alarm, warn, null, null, null, null, "SYSTEM");
                }
            }
        }
    }

    private void pumpParamHealth(String fabId) {
        STDEtcMapper stdEtcMapper = SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);
        STDParamMapper stdParamMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        List<Param> params = stdParamMapper.selectParamEqpList();
        List<Param> eqps = stdParamMapper.selectEqpList();

        stdEtcMapper.deleteParamHealthOptMstAll();
        stdEtcMapper.deleteParamHealthMstAll();

        Long paramId = null;
        for (int i = 0; i < params.size(); i++) {
            paramId = params.get(i).getParam_id();
            stdEtcMapper.insertParamHealth(paramId, 1L, "Y", "SYSTEM"); // param_health_mst_pdm
            stdEtcMapper.insertParamHealth(paramId, 2L, "Y", "SYSTEM"); // param_health_mst_pdm
            stdEtcMapper.insertParamHealth(paramId, 3L, "N", "SYSTEM"); // param_health_mst_pdm
            stdEtcMapper.insertParamHealth(paramId, 4L, "N", "SYSTEM"); // param_health_mst_pdm
            stdEtcMapper.insertParamHealth(paramId, 5L, "N", "SYSTEM"); // param_health_mst_pdm
        }

        paramId = null;
        Long eqpId = null;
        for (int i = 0; i < eqps.size(); i++) {
            eqpId = eqps.get(i).getEqp_id();

            for (int j = 0; j < params.size(); j++) {

                if (eqpId.equals(params.get(j).getEqp_id())) {
                    paramId = params.get(j).getParam_id();

                    STDParamHealth paramHealths = stdEtcMapper.selectParamHealth(eqpId, paramId);
                    Long param_health_mst_rawid = paramHealths.getParam_health_mst_rawid();

                    stdEtcMapper.insertParamHealthOptionTotal(param_health_mst_rawid, "M", 6L, null, "SYSTEM");
                    stdEtcMapper.insertParamHealthOptionTotal(param_health_mst_rawid, "N", 3L, null, "SYSTEM");
                }
            }
        }
    }

    private double[] getTimewaveData(byte[] rawData, double scaleFactor) {
        double[] fftdata = new double[rawData.length / 2];
        for (int i = 0; i < fftdata.length; i++) {
            int data = (rawData[i * 2] & 0xFF | (rawData[i * 2 + 1] & 0xFF) << 8);
            if ((data & 0x8000) > 0) {
                data = data - 0x10000;
            }
            fftdata[i] = scaleFactor * data;
        }

        return fftdata;
    }

    @Override
    public void dataPump(String fabId, String regacyName, Date from, Date to, Long eqpId, Producer<String, byte[]> fabProducer) throws NoSuchMethodException {
        SKFPumpMapper getMapper = SqlSessionUtil.getMapper(sessions, regacyName, SKFPumpMapper.class);
        SKFPumpMapper putMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);

        /* transaction */
//        EqpAlarmTrx
//        pump(EqpAlarmTrx.class, getMapper, putMapper, manager, from, to, eqpId);
//        AlarmTrx
//        pump(AlarmTrx.class, getMapper, putMapper, manager, from, to, eqpId);
//        MeasureTrx
//        pump(MeasureTrx.class, getMapper, putMapper, manager, from, to, eqpId);
//        MeasureTrxBin
//        pump(MeasureTrxBin.class, getMapper, putMapper, manager, from, to, eqpId);

        ParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        List<Param> paramList = paramMapper.selectByEqpId(eqpId);

        if (fabId.equals("fab1")) {

            pumpMeasureTrx(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
            pumpOverall(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
        } else if (fabId.equals("fab2")) {
            pumpMeasureTrx(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
            pumpOverall(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
        }
        else if (fabId.equals("fab3")){
            pumpMeasureTrx(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
            pumpOverall(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
        }
        else if (fabId.equals("fab4")){
            pumpMeasureTrx(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
            pumpOverall(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
        }
        else if (fabId.equals("fab5")){
            pumpMeasureTrx(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
            pumpOverall(getMapper, putMapper, manager, from, to, paramList, eqpId, fabProducer);
        }
    }

    private double[] getSpectrum(byte[] rawData, Integer spectraLines, double scaleFactor) {
        double[] fftdata = new double[spectraLines];
        for (int i = 0; i < fftdata.length; i++) {
            fftdata[i] = scaleFactor * (rawData[i * 2] & 0xFF | (rawData[i * 2 + 1] & 0xFF) << 8);
        }
        return fftdata;
    }

    private void pumpMeasureTrx(SKFPumpMapper getMapper, SKFPumpMapper putMapper, PlatformTransactionManager manager, Date from, Date to, List<Param> paramList, Long eqpId, Producer<String, byte[]> fabProducer) {
        List<String> paramIds = new ArrayList<>();
        for (int i = 0; i < paramList.size(); i++) {
            paramIds.add(Long.toString(paramList.get(i).getParam_id()));
        }

        List<MeasureTrx> list = getMapper.selectMeasureTrx(from, to, eqpId);
        OverallMinuteTrx areaEqp = getMapper.selectAreaEqpNameByParams(eqpId);
        String key = areaEqp.getArea_name() + "," + areaEqp.getEqp_name();

        // time, param_name, param_value(rms), freq.value, timewave, freq. count, max freq, rpm, sampling time(sec)

//        List<PartitionInfo> partitions = fabProducer.partitionsFor("pdm-input-raw");
//        int partitionNum = eqpId.intValue() % partitions.size();

        for (MeasureTrx trx : list) {
            StringBuilder sb = new StringBuilder();
            sb.append(dateFormat.format(trx.getEvent_dtts())).append(",");

            String paramName = "";
            for (Param p : paramList) {
                if (p.getParam_id().equals(trx.getParam_id())) {
                    paramName = p.getName();
                    break;
                }
            }

            sb.append(paramName).append(",").append(trx.getValue()).append(",");

            double[] freq = this.getSpectrum(trx.getFrequency(), trx.getFreq_count(), trx.getScale_factor());
            double[] timewave = this.getTimewaveData(trx.getTimewave(), trx.getScale_factor());

            StringBuilder sbFreq = new StringBuilder();
            for (double d : freq) {
                sbFreq.append(d).append("^");
            }
            sbFreq.setLength(sbFreq.length() - 1);

            StringBuilder sbTimewave = new StringBuilder();
            for (double d : timewave) {
                sbTimewave.append(d).append("^");
            }
            sbTimewave.setLength(sbTimewave.length() - 1);

            // frequency , timewave
            sb.append(sbFreq.toString()).append(",").append(sbTimewave.toString()).append(",");

            sb.append(trx.getFreq_count()).append(",")
                    .append(trx.getMax_freq()).append(",")
                    .append(trx.getRpm()).append(",")
                    .append("0.0").append(",");

            String[] column = sb.toString().split(",");
            try {
                RecordMetadata meta = fabProducer.send(new ProducerRecord<>("pdm-input-raw", key, sb.toString().getBytes())).get();
//                logger.debug(sb.toString());
                logger.debug("[{}] - RAW:{} > partition:{}, offset:{}", eqpId, column[0], meta.partition(), meta.offset());

            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }
    }

    @Override
    public void alarmUpdate(String fabId, String regacyName, Date from, Date to, Long eqpId) throws NoSuchMethodException {
        SKFPumpMapper getMapper = SqlSessionUtil.getMapper(sessions, regacyName, SKFPumpMapper.class);
        SKFPumpMapper putMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);

        List<Param> params = putMapper.selectParamByPDM(eqpId);
        for (int iParam = 0; iParam < params.size(); iParam++) {
            Param param = params.get(iParam);
            List<AlarmTrx> alarmTrxes = getMapper.selectAlarmTrxByParamId(param.getParam_id());
            List<AlarmTrx> alarmDates = new ArrayList<>();

            OverallSpec overallSpec = putMapper.selectOverallSpecByPdM(param.getParam_id());
            if (overallSpec == null) continue;

            //Alarm을 date 기준으로 정리  ==> 하루에 alarm waring이 여러번 발생 가능
            //date 기준으로 평균값 선택임
            //alarm 이나 warning 을 앞에값 기준으로 채움 alarm 이 warning 보다 작은 경우 비율 계산을  값을 만듬.

            HashMap<String, List<AlarmTrx>> datasByDate = new HashMap<>();

            SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd");

            for (int i = 0; i < alarmTrxes.size(); i++) {

                AlarmTrx alarmTrx = alarmTrxes.get(i);
                String date = transFormat.format(alarmTrx.getAlarm_dtts());
                AlarmTrx newAlarmTrx = new AlarmTrx();
                Double alarm = null;
                Double warning = null;
                if (alarmTrx.getStatus_cd() == 256) {
                    alarm = alarmTrx.getLvl();
                } else if (alarmTrx.getStatus_cd() == 128) {
                    warning = alarmTrx.getLvl();
                } else {
                    continue;
                }
                newAlarmTrx.setStatus_cd(alarmTrx.getStatus_cd());
                newAlarmTrx.setAlarm(alarm);
                newAlarmTrx.setWarn(warning);

                if (datasByDate.containsKey(date)) {
                    List<AlarmTrx> newAlarmTrxes = datasByDate.get(date);
                    newAlarmTrxes.add(newAlarmTrx);
                } else {
                    List<AlarmTrx> newAlarmTrxes = new ArrayList<>();
                    newAlarmTrxes.add(newAlarmTrx);
                    datasByDate.put(date, newAlarmTrxes);
                }
            }

            List<AlarmTrx> datasSummary = new ArrayList<>();

            Iterator<String> keys = datasByDate.keySet().iterator();
            while (keys.hasNext()) {
                String key = keys.next();
                List<AlarmTrx> datas = datasByDate.get(key);
                int alarmCount = 0, warningCount = 0;
                Double alarmSum = 0.0, waringSum = 0.0;
                for (int i = 0; i < datas.size(); i++) {
                    AlarmTrx alarmTrx = datas.get(i);

                    if (alarmTrx.getStatus_cd() == 256 && alarmTrx.getAlarm() != null) {
                        alarmCount++;
                        alarmSum += alarmTrx.getAlarm();
                    } else if (alarmTrx.getStatus_cd() == 128 && alarmTrx.getWarn() != null) {
                        warningCount++;
                        waringSum += alarmTrx.getWarn();
                    }
                }

                Double alarmAVG = null;
                Double warningAVG = null;
                if (alarmCount > 0) {
                    alarmAVG = alarmSum / alarmCount;
                }
                if (warningCount > 0) {
                    warningAVG = waringSum / warningCount;
                }

                AlarmTrx alarmTrx = new AlarmTrx();
                alarmTrx.setAlarm_dtts(DateUtil.createDate(key));
                alarmTrx.setAlarm(alarmAVG);
                alarmTrx.setWarn(warningAVG);

                datasSummary.add(alarmTrx);

            }

            Collections.sort(datasSummary, new Comparator<AlarmTrx>() {
                @Override
                public int compare(AlarmTrx o1, AlarmTrx o2) {
                    return o1.getAlarm_dtts().compareTo(o2.getAlarm_dtts());
                }
            });

            AlarmTrx alarmTrx = new AlarmTrx();
            alarmTrx.setAlarm_dtts(new Date());
            alarmTrx.setAlarm(overallSpec.getAlarm());
            alarmTrx.setWarn(overallSpec.getWarn());
            datasSummary.add(alarmTrx);

            for (int i = 0; i < datasSummary.size() - 1; i++) {
                AlarmTrx alarmTrxSum = datasSummary.get(i);
                Double alarm = null, warning = null;

                if (alarmTrxSum.getAlarm() == null) {
                    Double value = getAlarmValueByNear(datasSummary, i, "alarm");
                    if (value > alarmTrxSum.getAlarm()) {
                        alarm = value;
                    } else {
                        alarm = warning * overallSpec.getAlarm() / overallSpec.getWarn();
                    }
                    alarmTrxSum.setAlarm(alarm);

                } else if (warning == null) {
                    Double value = getAlarmValueByNear(datasSummary, i, "warning");
                    if (alarm > value) {
                        warning = value;
                    } else {
                        warning = alarm * overallSpec.getWarn() / overallSpec.getAlarm();
                    }
                    alarmTrxSum.setWarn(warning);
                }

                Date startDate = alarmTrxSum.getAlarm_dtts();
                Date endDate = DateUtil.add(startDate, Calendar.DATE, 1);

                putMapper.updateOverallMinuteTrxByPDM(param.getParam_id(), startDate, endDate, alarm, warning);
            }
        }
    }

    @Override
    public void dataPumpBase(String fab, String legacy) throws NoSuchMethodException {

    }

    private Double getAlarmValueByNear(List<AlarmTrx> datasSummary, int i, String type) {
        AlarmTrx alarmTrx = datasSummary.get(i);
        int iPos = 1;

        for (int j = i; j >= 0; j--) {
            AlarmTrx tempAlarmTrx = datasSummary.get(j);
            Double value = null;
            if (type.equals("alarm")) {
                value = tempAlarmTrx.getAlarm();
            } else {
                value = tempAlarmTrx.getWarn();
            }
            if (value != null) {
                return value;
            }
        }

        for (int j = i + 1; j < datasSummary.size(); j++) {
            AlarmTrx tempAlarmTrx = datasSummary.get(j);
            Double value = null;
            if (type.equals("alarm")) {
                value = tempAlarmTrx.getAlarm();
            } else {
                value = tempAlarmTrx.getWarn();
            }
            if (value != null) {
                return value;
            }
        }

        return null;
    }


    private void pumpOverall(SKFPumpMapper getMapper, SKFPumpMapper putMapper, PlatformTransactionManager manager,
                             Date from, Date to, List<Param> paramList, Long eqpId, Producer<String, byte[]> fabProducer) {

        List<String> paramIds = new ArrayList<>();
        for (int i = 0; i < paramList.size(); i++) {
            paramIds.add(Long.toString(paramList.get(i).getParam_id()));
        }

        List<OverallMinuteTrx> list = getMapper.selectOverallMinuteTrx(from, to, eqpId);
        if (list.size() <= 0) {
            logger.debug("[{}] - No data.", eqpId);
            return;
        }

        OverallMinuteTrx areaEqp = getMapper.selectAreaEqpNameByParams(eqpId);
        String key = areaEqp.getArea_name() + "," + areaEqp.getEqp_name();

        //group_dtts,
        SortedMap<String, Date> sortedTimeMap = new TreeMap<>();
        HashMap<String, ArrayList<AbstractMap.SimpleEntry<Long, Double>>> valueMap = new HashMap<>();

        for (OverallMinuteTrx trx : list) {
            if (!sortedTimeMap.containsKey(trx.getGroup_dtts())) {
                sortedTimeMap.put(trx.getGroup_dtts(), trx.getRead_dtts());
            }

            if (!valueMap.containsKey(trx.getGroup_dtts())) {
                ArrayList<AbstractMap.SimpleEntry<Long, Double>> d = new ArrayList<>();
                d.add(new AbstractMap.SimpleEntry<>(trx.getParam_id(), trx.getValue()));
                valueMap.put(trx.getGroup_dtts(), d);
            } else {
                ArrayList<AbstractMap.SimpleEntry<Long, Double>> d = valueMap.get(trx.getGroup_dtts());
                d.add(new AbstractMap.SimpleEntry<>(trx.getParam_id(), trx.getValue()));
            }
        }

//        List<PartitionInfo> partitions = fabProducer.partitionsFor("pdm-input-trace");
//        int partitionNum = eqpId.intValue() % partitions.size();

        //Map<String, Date> sortedTimeMap = sortByValue(timeMap);

        SortedSet<String> keyList = new TreeSet<>(sortedTimeMap.keySet());
        for (String k : keyList) {
            StringBuilder sb = new StringBuilder();
            sb.append(dateFormat.format(sortedTimeMap.get(k))).append(",");  // time

            ArrayList<AbstractMap.SimpleEntry<Long, Double>> valueList = valueMap.get(k);

            String[] record = new String[paramList.size()];
            for (Param p : paramList) {
                Double value = Double.NaN;
                for (AbstractMap.SimpleEntry<Long, Double> t : valueList) {
                    if (p.getParam_id().equals(t.getKey())) {
                        value = t.getValue();
                        break;
                    }
                }

                if (Double.isNaN(value)) {
                    record[p.getParse_index().intValue() - 1] = "";
                } else {
                    record[p.getParse_index().intValue() - 1] = value.toString();
                }
            }

            for (int i = 0; i < record.length; i++) {
                sb.append(record[i]).append(",");
            }
            sb.setLength(sb.length() - 1);

            String[] column = sb.toString().split(",");
            try {
                RecordMetadata meta = fabProducer.send(new ProducerRecord<>("pdm-input-trace", key, sb.toString().getBytes())).get();
                logger.debug("[{}] - TRACE:{} > partition:{}, offset:{}", eqpId, column[0], meta.partition(), meta.offset());
//                logger.debug("[{}] - TRACE:{}",eqpId,column[0]);

            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }
    }




    private static Map<String, Date> sortByValue(Map<String, Date> unsortMap) {

        // 1. Convert Map to List of Map
        List<Map.Entry<String, Date>> list =
                new LinkedList<Map.Entry<String, Date>>(unsortMap.entrySet());

        // 2. Sort list with Collections.sort(), provide a custom Comparator
        //    Try switch the o1 o2 position for a different order
        Collections.sort(list, new Comparator<Map.Entry<String, Date>>() {
            public int compare(Map.Entry<String, Date> o1,
                               Map.Entry<String, Date> o2) {
                return (o1.getValue()).compareTo(o2.getValue());
            }
        });

        // 3. Loop the sorted list and put it into a new insertion order Map LinkedHashMap
        Map<String, Date> sortedMap = new LinkedHashMap<String, Date>();
        for (Map.Entry<String, Date> entry : list) {
            sortedMap.put(entry.getKey(), entry.getValue());
        }

        /*
        //classic iterator example
        for (Iterator<Map.Entry<String, Integer>> it = list.iterator(); it.hasNext(); ) {
            Map.Entry<String, Integer> entry = it.next();
            sortedMap.put(entry.getKey(), entry.getValue());
        }*/


        return sortedMap;
    }

    private <T> void pump(Class<T> tClass, SKFPumpMapper getMapper, SKFPumpMapper putMapper, PlatformTransactionManager manager) throws NoSuchMethodException {
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

        String className = tClass.getSimpleName();
        Method select = getMapper.getClass().getMethod("select" + className);
        Method delete = putMapper.getClass().getMethod("delete" + className);
        Method insert = putMapper.getClass().getMethod("insert" + className, tClass);

        T t = null;
        try {
            List<T> list = (List<T>) select.invoke(getMapper);
            delete.invoke(putMapper);

            for (int i = 0; i < list.size(); i++) {
                t = list.get(i);

                try {
                    insert.invoke(putMapper, t);
                } catch (InvocationTargetException ie) {
                    Throwable iee = ie.getTargetException();
                    if (iee instanceof DuplicateKeyException) {
                        logger.info("{}, {}", t, iee.getMessage());
                    } else {
                        throw ie;
                    }
                }
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            Throwable ee = e.getCause();
            logger.error("{}, {}", t, ee == null ? e.getMessage() : ee.getMessage());
        }
    }

    private <T> void pump(Class<T> tClass, SKFPumpMapper getMapper, SKFPumpMapper putMapper, PlatformTransactionManager manager, Date from, Date to, Long eqpId) throws NoSuchMethodException {
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

        String className = tClass.getSimpleName();
        Method select = getMapper.getClass().getMethod("select" + className, Date.class, Date.class, Long.class);
        Method delete = putMapper.getClass().getMethod("delete" + className, Date.class, Date.class, Long.class);
        Method insert = putMapper.getClass().getMethod("insert" + className, tClass);

        T t = null;
        try {
            List<T> list = (List<T>) select.invoke(getMapper, from, to, eqpId);
            delete.invoke(putMapper, from, to, eqpId);

            for (int i = 0; i < list.size(); i++) {
                t = list.get(i);

                try {
                    insert.invoke(putMapper, t);
                } catch (InvocationTargetException ie) {
                    Throwable iee = ie.getTargetException();
                    if (iee instanceof DuplicateKeyException) {
                        logger.info("{}, {}", t, iee.getMessage());
                    } else {
                        throw ie;
                    }
                }
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            Throwable ee = e.getCause();
            logger.error("{}, {}", t, ee == null ? e.getMessage() : ee.getMessage());
        }
    }
}
