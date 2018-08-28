package com.bistel.pdm.simulator;

import org.apache.commons.math3.stat.regression.SimpleRegression;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class RulSimulator {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yy/MM/dd HH:mm:ss.SSS");

    public static void main(String args[]) {

        File file = new File(args[0]);
        String absolutePath = file.getAbsolutePath();


        try (BufferedReader br = new BufferedReader(new FileReader(file))) {

            SimpleRegression regression = new SimpleRegression();

            Long lastTime = 0L;
            for (String line; (line = br.readLine()) != null; ) {

                //X,Y,UPPER_ALARM,UPPER_WARN,LOWER_ALARM,LOWER_WARN
                String[] column = line.split(",");

                //18/08/17 00:00:00.000000000,0.18558458586666666666666666666666666667,1,0.8,,

                Long time = parseStringToTimestamp(column[0]);
                Double value = Double.parseDouble(column[1]);

                regression.addData(time, value);
                lastTime = time;
            }

            Double alarmSpec = 1D;

            double intercept = regression.getIntercept();
            double slope = regression.getSlope();
            double x = (alarmSpec - intercept) / slope;

            // y = intercept + slope * x
            // remain = x - today
            long remain = TimeUnit.DAYS.convert((long) x - lastTime, TimeUnit.MILLISECONDS);

            System.out.println("intercept:" + new BigDecimal(intercept).toPlainString()
                    + ", slope: " + new BigDecimal(slope).toPlainString()
                    + ", x: " + new BigDecimal(x).toPlainString()
                    + ", remain day:" + remain);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Long parseStringToTimestamp(String item) {
        Long time = 0L;

        try {
            Date parsedDate = dateFormat.parse(item);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            time = timestamp.getTime();
        } catch (Exception e) {
            //log.error(e.getMessage() + " : " + item, e);
        }

        return time;
    }
}
