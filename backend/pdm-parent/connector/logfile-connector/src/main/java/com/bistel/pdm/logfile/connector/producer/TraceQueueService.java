package com.bistel.pdm.logfile.connector.producer;

import com.bistel.pdm.common.util.Strings;
import com.bistel.pdm.data.stream.*;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.header.Headers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.LinkedBlockingQueue;

/**
 *
 */
public class TraceQueueService {
    private final static Logger log = LoggerFactory.getLogger(TraceQueueService.class);

    private static TraceQueueService instance = null;
    private static BlockingQueue<File> waitingQueue = null;

    private static ConcurrentHashMap<String, PreviousData> svidPreviousValue = new ConcurrentHashMap<>();

    public static TraceQueueService getInstance() {
        if (instance == null) {
            instance = new TraceQueueService();
        }
        return instance;
    }

    private void initialize(String key, Properties producerProperties) {
        if (waitingQueue == null) {
            waitingQueue = new LinkedBlockingQueue<>();
            DataSender dataSender = new DataSender(key, new KafkaProducer<>(producerProperties));
            dataSender.start();
        }
    }

    public void putFileInQueue(String key, Properties producerProperties, File eventData) {
        try {
            initialize(key, producerProperties);
            waitingQueue.put(eventData);
        } catch (InterruptedException ex) {
            log.error(ex.getMessage(), ex);
        }
    }

    class DataSender extends Thread {

        private String key;
        private Producer<String, byte[]> producer;

        private static final String TIME_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
        private static final String TOPIC_NAME = "pdm-input-trace";
        private static final String HEADER_MSG_TYPE = "msgType";

        DataSender(String key, Producer<String, byte[]> producer) {
            this.key = key;
            this.producer = producer;
        }

        @Override
        public void run() {
            while (true) {
                try {
                    log.debug("queue size : {}", waitingQueue.size());

                    File file = waitingQueue.take();
                    if (!file.exists()) {
                        log.debug("{} not existed.", file.getPath());
                        continue;
                    }

                    // parameter master info
                    List<ParameterMaster> parameterMasterList = MasterCache.Parameter.get(this.key);
                    CSVParser records = CSVFormat.RFC4180.withFirstRecordAsHeader().parse(new FileReader(file));
                    Map<String, Integer> header = records.getHeaderMap();

                    Map<Integer, String> paramSvidList = new HashMap<>();
                    for(ParameterMaster parameterMaster : parameterMasterList){
                        if(parameterMaster.getUseYN().equalsIgnoreCase("Y")) {
                            for (String vid : header.keySet()) {
                                if (parameterMaster.getSvid().equalsIgnoreCase(vid)) {
                                    Integer index = header.get(vid);
                                    paramSvidList.put(index, vid);
                                    break;
                                }
                            }
                        }
                    }

                    Map<Integer, String> eventSvidList = new HashMap<>();
                    ProcessGroupMaster processGroupMaster = MasterCache.ProcessGroup.get(key);
                    log.debug("process group type : {}", processGroupMaster.getGroupType());

                    if(processGroupMaster.getGroupType().equalsIgnoreCase("STATUS")){
                        List<StatusGroupMaster> statusGroupMasterList = MasterCache.StatusProcessGroup.get(key);

                        for(StatusGroupMaster statusGroupMaster : statusGroupMasterList){
                            Timestamp ts = new Timestamp(System.currentTimeMillis());
                            String timeStamp = new SimpleDateFormat(TIME_FORMAT).format(ts);
                            svidPreviousValue.putIfAbsent(statusGroupMaster.getSvid(), new PreviousData(timeStamp, Double.NaN));

                            for (String vid : header.keySet()) {
                                if(vid.equalsIgnoreCase(statusGroupMaster.getSvid())){
                                    eventSvidList.put(header.get(vid), vid);
                                }
                            }
                        }
                    } else if(processGroupMaster.getGroupType().equalsIgnoreCase("PARAM")) {
                        ParamConditionGroupMaster paramConditionGroupMaster = MasterCache.ParamConditionProcessGroup.get(key);
                        Timestamp ts = new Timestamp(System.currentTimeMillis());
                        String timeStamp = new SimpleDateFormat(TIME_FORMAT).format(ts);
                        svidPreviousValue.putIfAbsent(paramConditionGroupMaster.getSvid(), new PreviousData(timeStamp, 0D)); // idle

                        for (String vid : header.keySet()) {
                            if(vid.equalsIgnoreCase(paramConditionGroupMaster.getSvid())){
                                eventSvidList.put(header.get(vid), vid);
                            }
                        }
                    }

                    String time;
                    for (CSVRecord record : records.getRecords()) {
                        // trace data
                        StringBuilder sbSVIDList = new StringBuilder();

                        time = record.get("time");
                        for(Integer index : paramSvidList.keySet()){
                            String value = record.get(index);
                            //vid=value,vid=value, ...
                            sbSVIDList.append(paramSvidList.get(index)).append("=").append(value).append(",");
                        }

                        sbSVIDList.setLength(sbSVIDList.length() - 1);
                        String value = time + "," + sbSVIDList.toString();

                        ProducerRecord<String, byte[]> producerRecord = new ProducerRecord<>(TOPIC_NAME, key, value.getBytes());
                        Headers headers = producerRecord.headers();
                        headers.add(HEADER_MSG_TYPE, Strings.bytes("TRACE"));
                        RecordMetadata meta = producer.send(producerRecord).get();

                        Timestamp ts = new Timestamp(System.currentTimeMillis());
                        String timeStamp = new SimpleDateFormat(TIME_FORMAT).format(ts);

                        log.info("[{}] - {}, partition:{}, offset:{}", key, timeStamp, meta.partition(), meta.offset());


                        // event data
                        if(processGroupMaster.getGroupType().equalsIgnoreCase("STATUS")){

                            for(Integer index : eventSvidList.keySet()){
                                PreviousData previousData = svidPreviousValue.get(eventSvidList.get(index));
                                Double paramValue = Double.parseDouble(record.get(index));

                                StatusParamMaster statusParamMaster = MasterCache.StatusParam.get(key);

                                String statusCode = "I";
                                if(statusParamMaster.getSvid().equalsIgnoreCase(eventSvidList.get(key))){
                                    for(String val : statusParamMaster.getValue().split(",")){
                                        if(paramValue.equals(Double.parseDouble(val))){
                                            statusCode = "R";
                                        }
                                    }
                                }

                                if(statusCode.equalsIgnoreCase("R")
                                        && !previousData.getValue().equals(paramValue)){
                                    // time,event_id, event_name, event_flag, vid_1=value,vid_2=value,...vid_n=value

                                    String endEventName = processGroupMaster.getGroupId() + "_END";
                                    String startEventName = processGroupMaster.getGroupId() + "_START";

                                    String endEventMsg = previousData.getTime() + "," + endEventName + "," + endEventName + ",E";
                                    ProducerRecord<String, byte[]> endEventRecord = new ProducerRecord<>(TOPIC_NAME, key, endEventMsg.getBytes());
                                    Headers endHeaders = endEventRecord.headers();
                                    endHeaders.add(HEADER_MSG_TYPE, Strings.bytes("EVENT"));
                                    this.producer.send(endEventRecord).get();

//                                    this.producer.send(new ProducerRecord<>(TOPIC_NAME, this.key, endEventMsg.getBytes())).get();

                                    String startEventMsg = time + "," + startEventName + "," + startEventName + ",S";
                                    ProducerRecord<String, byte[]> startEventRecord = new ProducerRecord<>(TOPIC_NAME, key, startEventMsg.getBytes());
                                    Headers startHeaders = startEventRecord.headers();
                                    startHeaders.add(HEADER_MSG_TYPE, Strings.bytes("EVENT"));
                                    this.producer.send(startEventRecord).get();

//                                    this.producer.send(new ProducerRecord<>(TOPIC_NAME, this.key, startEventMsg.getBytes())).get();
                                }

                                svidPreviousValue.put(eventSvidList.get(index), new PreviousData(time, paramValue));
                            }

                        } else if(processGroupMaster.getGroupType().equalsIgnoreCase("PARAM")) {
                            ParamConditionGroupMaster paramConditionGroupMaster = MasterCache.ParamConditionProcessGroup.get(key);

                            for(Integer index : eventSvidList.keySet()){
                                PreviousData previousData = svidPreviousValue.get(eventSvidList.get(index));
                                Double paramValue = Double.parseDouble(record.get(index));

                                RuleVariables ruleVariables = new RuleVariables();
                                ruleVariables.putValue("value", paramValue);
                                RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
                                boolean isRun = ruleEvaluator.evaluate(paramConditionGroupMaster.getCondition());

                                if (isRun) {
                                    paramValue = 1D; // run
                                }

                                if(previousData.getValue().equals(0D) && paramValue.equals(1D)){
                                    // idle to run
                                    // time,event_id, event_name, event_flag, vid_1=value,vid_2=value,...vid_n=value

                                    String startEventName = processGroupMaster.getGroupId() + "_START";
                                    String startEventMsg = time + "," + startEventName + "," + startEventName + ",S";
                                    ProducerRecord<String, byte[]> eventRecord = new ProducerRecord<>(TOPIC_NAME, key, startEventMsg.getBytes());

                                    Headers eventHeaders = eventRecord.headers();
                                    eventHeaders.add(HEADER_MSG_TYPE, Strings.bytes("EVENT"));
                                    this.producer.send(eventRecord).get();

                                } else if(previousData.getValue().equals(1D) && paramValue.equals(0D)){
                                    // run to idle
                                    String endEventName = processGroupMaster.getGroupId() + "_END";
                                    String endEventMsg = previousData.getTime() + "," + endEventName + "," + endEventName + ",E";

                                    ProducerRecord<String, byte[]> eventRecord = new ProducerRecord<>(TOPIC_NAME, key, endEventMsg.getBytes());
                                    Headers eventHeaders = eventRecord.headers();
                                    eventHeaders.add(HEADER_MSG_TYPE, Strings.bytes("EVENT"));
                                    this.producer.send(eventRecord).get();

                                }

                                svidPreviousValue.put(eventSvidList.get(index), new PreviousData(time, paramValue));
                            }
                        }
                    }
                } catch (InterruptedException | IOException | ExecutionException e1) {
                    log.error(e1.getMessage(), e1);
                }
            }
        }
    }
}
