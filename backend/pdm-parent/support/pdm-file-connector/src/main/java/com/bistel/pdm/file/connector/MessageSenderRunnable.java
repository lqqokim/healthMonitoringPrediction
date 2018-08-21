package com.bistel.pdm.file.connector;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.lambda.kafka.partitioner.CustomStreamPartitioner;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.PartitionInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

/**
 *
 */
public class MessageSenderRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(MessageSenderRunnable.class);

    private final String topicName;
    private final String watchDir;
    private final String clientId;
    private final Producer<String, byte[]> producer;

    public MessageSenderRunnable(String configPath, String watchDir, String clientId, String topicName) {

        this.producer = new KafkaProducer<>(createConsumerConfig(clientId, configPath));
        this.watchDir = watchDir;
        this.clientId = clientId;
        this.topicName = topicName;

        MasterCache.ServingAddress = "http://192.168.0.102:28000";

        log.debug("[{}] - watch dir : {}", clientId, watchDir);
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new Thread(producer::close));

        File folder = new File(watchDir);
        File[] listOfFiles = folder.listFiles();
        Arrays.sort(listOfFiles);

        int lineCount = 0;
        int rcount = 0;
        int icount = 0;
        int runCount = 60;
        int idleCount = 30;

        for (File file : listOfFiles) {
            log.debug("file : {}", file.getPath());

            try (BufferedReader br = new BufferedReader(new FileReader(file))) {
                for (String line; (line = br.readLine()) != null; ) {
                    // process the line.
                    lineCount++;
                    rcount++;
                    icount++;

                    // INDEX,TIME,LINE,PROCESSLINE,EQPTYPE,EQPID,UNITID,
                    //
                    // VEHICLE_CURRENT_POSITION(POINT),
                    // REGULATOR_TEMPERATURE,
                    // FRONT_AXIS_TORQUE,
                    // REAR_AXIS_TORQUE,
                    // HOIST_AXIS_TORQUE,
                    // SLIDE_AXIS_TORQUE,
                    // ACCUMULATED_DRIVING_DISTANCE,
                    // ACCUMULATED_DRIVING_TIME(HOUR),
                    // ACCUMULATED_HOIST_DISTANCE(M),
                    // ACCUMULATED_HOIST_TIME(HOUR),
                    // ACCUMULATED_SLIDE_DISTANCE(M),
                    // ACCUMULATED_SLIDE_TIME(HOUR),
                    // VEHICLE_STATUS,
                    // 20: VEHICLE_MODE,
                    // TRAY_DETECT(100:NOT CONTAIN200:CONTAIN),
                    // DRIVING_VELOCITY(MM/SEC),
                    // HOIST_VELOCITY(MM/SEC),
                    // SLIDE_VELOCITY(MM/SEC),
                    // REGULATOR_INPUT_VOLTAGE(V),
                    // REGULATOR_OUTPUT_VOLTAGE(V),
                    // FRONT_VIBRATION_DATA(G),
                    // REAR_VIBRATION_DATA(G),
                    // LEFT_LITZ_WIRE_TEMPERATURE,
                    // 30: RIGHT_LITZ_WIRE_TEMPERATURE,
                    // ECO_VOLTAGE(V),
                    // ECO_CURRENT(A),
                    // ECO_TEMPERATURE,
                    // REGULATOR_OUTPUT_CURRENT(A),
                    // COMPONENT_IN,
                    // GET_ANTIDROP_OPEN,
                    // GET_SLIDE_FWD,
                    // GET_HOIST_DOWN,
                    // GET_FORK_STRETCH,
                    // GET_FORK_UP,
                    // TRAY_ON_CHECK,
                    // GET_FORK FOLD,
                    // GET_TOP PUSHER DOWN,
                    // GET_HOIST_UP,
                    // GET_SLIDE_HOME,
                    // GET_ANTIDROP_CLOSE,
                    // COMPONENT_OUT,
                    // PUT_ANTIDROP_OPEN,
                    // PUT_SLIDE_FWD,
                    // 50 : PUT_HOIST_DOWN,
                    // PUT_TOP_PUSHER_UP,
                    // PUT_FORK_STRETCH,
                    // PUT_FORK_DOWN,
                    // TRAY_OFF_CHECK,
                    // PUT_FORK FOLD,
                    // PUT_HOIST_UP,
                    // PUT_SLIDE_HOME,
                    // PUT_ANTIDROP_CLOSE,
                    // VEHICLE_MOVE,
                    // 60 : VEHICLE_STOP,
                    // FRONT_LEFT_STEER_UP,
                    // FRONT_RIGHT_STEER_UP,
                    // REAR_RIGHT_STEER_UP,
                    // REAR_RIGHT_STEER_UP,
                    // TRANSFER_WAIT_BEFORE_START,
                    // Z_RMS,
                    // X_RMS,
                    // TEMP,
                    // STATUS

                    String[] column = line.split(",");
                    if (!column[0].equalsIgnoreCase("INDEX")) {

                        StringBuilder sbMsg = new StringBuilder();

                        Timestamp ts = new Timestamp(System.currentTimeMillis());
                        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(ts);
                        sbMsg.append(timeStamp).append(",");

                        for (int i = 7; i < 69; i++) {
                            sbMsg.append(column[i]).append(",");
                        }

                        if (rcount <= runCount) {
                            sbMsg.append("1"); //status
                            icount = 0;
                        } else {
                            if (icount <= idleCount) {
                                sbMsg.append("0"); //status
                            } else {
                                sbMsg.append("0"); //status
                                rcount = 0;
                                icount = 0;
                            }
                        }

                        List<PartitionInfo> partitions = producer.partitionsFor(topicName);
                        CustomStreamPartitioner csp = new CustomStreamPartitioner();
                        int partitionNum = csp.partition(clientId, sbMsg.toString().getBytes(), partitions.size());

                        producer.send(new ProducerRecord<>(topicName, partitionNum,
                                clientId, sbMsg.toString().getBytes()));

                        log.debug("[{}] - {}", clientId, timeStamp);

                        try {
                            Thread.sleep(1000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
                // line is not visible here.
                log.debug("lines : {}", lineCount);

            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }
    }

    private Properties createConsumerConfig(String clientId, String configPath) {
        Properties prop = new Properties();

        try (InputStream confStream = new FileInputStream(configPath)) {
            prop.load(confStream);
            log.debug("loaded config file : {}", configPath);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        prop.replace("client.id", clientId);

        return prop;
    }
}
