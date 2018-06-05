package com.bistel.pdm.app.datagen;

import com.beust.jcommander.ParameterException;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;

import static java.util.concurrent.TimeUnit.SECONDS;

public class Starter {

    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

//    @Parameter(names = "-a", description = "async, default true")
//    private Boolean async = true;
//
//    @Parameter(names = "-th", description = "thread count, work only when async true, default is processors count")
//    private Integer threadCount;
//
//    @Parameter(names = "-s", required = true, description = "Generation schema json file")
//    private String schemaFile;

    public static void main(String[] args) throws Exception {
        final Starter starter = new Starter();
//        JCommander jCommander = new JCommander(starter);
        try {
            //for test
            //MasterDataGenerator.createArea();
            //MasterDataGenerator.createEquipment();
            //MasterDataGenerator.createParameter();

//            jCommander.parse(args);

            final ScheduledFuture<?> oneMinDataGen =
                    scheduler.scheduleAtFixedRate(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                starter.start("RMS");
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }, 5, 30, SECONDS);

//            final ScheduledFuture<?> tenMinDataGen =
//                    scheduler.scheduleAtFixedRate(new Runnable() {
//                        @Override
//                        public void run() {
//                            try {
//                                starter.start("F");
//                            } catch (IOException e) {
//                                e.printStackTrace();
//                            }
//                        }
//                    }, 10, 60, SECONDS);

            //starter.start();

        } catch (ParameterException e) {
            System.out.println(e.getMessage());
//            jCommander.usage();
        }
    }

    public void start(String type) throws IOException {
        TestLogGenerator generator = new TestLogGenerator();
        generator.setAsync(true);
        generator.setDataType(type);
        generator.generate();
    }
}
