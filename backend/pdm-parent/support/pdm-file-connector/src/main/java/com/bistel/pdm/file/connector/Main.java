package com.bistel.pdm.file.connector;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.lambda.kafka.partitioner.CustomStreamPartitioner;
import org.apache.commons.cli.*;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.PartitionInfo;
import org.apache.log4j.PropertyConfigurator;
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
public class Main {
    private final static Logger log = LoggerFactory.getLogger(Main.class);

    private static final String TOPIC_PREFIX = "topicPrefix";
    private static final String WATCH_DIR = "watchDir";
    private static final String CLIENT_ID = "clientId";
    private static final String PARTITION = "partition";
    private static final String PROP_KAFKA_CONF = "kafkaConf";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    public static void main(String args[]) {

        CommandLine commandLine = parseCommandLine(args);

        String watchDir = commandLine.getOptionValue(WATCH_DIR);
        String partition = commandLine.getOptionValue(PARTITION);
        String clientId = commandLine.getOptionValue(CLIENT_ID);
        String destTopicPrefix = commandLine.getOptionValue(TOPIC_PREFIX);
        String configPath = commandLine.getOptionValue(PROP_KAFKA_CONF);
        String logPath = commandLine.getOptionValue(LOG_PATH);
        String topicName = destTopicPrefix + "-trace";

        try {
            Properties logProperties = new Properties();
            logProperties.load(new FileInputStream(logPath));
            PropertyConfigurator.configure(logProperties);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        Properties producerProperties = new Properties();

        try (InputStream propStream = new FileInputStream(configPath)) {
            producerProperties.load(propStream);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        producerProperties.replace("client.id", clientId);
        Producer<String, byte[]> producer = new KafkaProducer<>(producerProperties);


        log.debug("topic : {}", topicName);
        log.debug("client id : {}", clientId);


        File folder = new File(watchDir);
        File[] listOfFiles = folder.listFiles();
        Arrays.sort(listOfFiles);

        int lineCount = 0;
        int rcount = 0;
        int icount = 0;
        int runCount = 600;  // 1 min
        int idleCount = 300;

        MasterCache.ServingAddress = "http://192.168.0.102:28000";

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

                        log.debug("key: {}, msg time: {}", clientId, timeStamp);

                        try {
                            Thread.sleep(100);
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

    private static CommandLine parseCommandLine(String[] args) {
        Option topicPrefix = new Option(TOPIC_PREFIX, true, "kafka topic for input messages");
        Option watchDir = new Option(WATCH_DIR, true, "directory to monitor");
        Option clientId = new Option(CLIENT_ID, true, "client id");
        Option config = new Option(PROP_KAFKA_CONF, true, "kafka config path");
        Option logConfig = new Option(LOG_PATH, true, "log config path");
        Option partition = new Option(PARTITION, true, "partition number");

        options.addOption(topicPrefix)
                .addOption(watchDir).addOption(clientId)
                .addOption(partition).addOption(config).addOption(logConfig);

        if (args.length < 6) {
            printUsageAndExit();
        }
        CommandLineParser parser = new DefaultParser();
        CommandLine cmd = null;
        try {
            cmd = parser.parse(options, args);
        } catch (ParseException | NumberFormatException e) {
            log.error(e.getMessage(), e);
            printUsageAndExit();
        }
        return cmd;
    }

    private static void printUsageAndExit() {
        HelpFormatter formatter = new HelpFormatter();
        formatter.printHelp("file connector", options);
        System.exit(1);
    }

//    public static String getHostname() {
//        String hostName;
//        try {
//            hostName = InetAddress.getLocalHost().getHostName();
//            int firstDotPos = hostName.indexOf('.');
//            if (firstDotPos > 0) {
//                hostName = hostName.substring(0, firstDotPos);
//            }
//        } catch (Exception e) {
//            // fall back to env var.
//            hostName = System.getenv("HOSTNAME");
//        }
//        return hostName;
//    }
}
