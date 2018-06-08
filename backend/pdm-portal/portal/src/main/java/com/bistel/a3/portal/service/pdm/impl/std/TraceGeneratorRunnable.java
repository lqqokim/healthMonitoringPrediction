package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceDataMapper;
import com.bistel.a3.portal.domain.pdm.Overall;
import com.bistel.a3.portal.domain.pdm.db.OverallMinuteTrx;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.math3.util.Pair;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class TraceGeneratorRunnable implements Runnable {
    private static Logger logger = LoggerFactory.getLogger(TraceGeneratorRunnable.class);

    private final String fabId = "fab1";
    private final String areaId = "Demo_Area";
    private final FileSinker sinker;
    private final List<ParamWithCommonWithRpm> params;
    private Map<String, SqlSessionTemplate> sessions;

    public TraceGeneratorRunnable(FileSinker sinker,
                                  List<ParamWithCommonWithRpm> params, Map<String, SqlSessionTemplate> sessions) {
        this.sinker = sinker;
        this.params = params;
        this.sessions = sessions;
    }

    @Override
    public void run() {
        String problemType=getProblemType();
        for (ParamWithCommonWithRpm p : params) {
//            if (p.getName().equals("Motor Temperature")) {
//                this.sampleTraceTempWrite(p.getEqp_name(), p.getName());
//            } else {
//                Random random = new Random();
//                int sampleMin = 1;//sample_data테이블의 problem_Data칼럼중 가장작은 숫자
//                int sampleMax = 11;//sample_data테이블의 problem_data칼럼중 가장 큰 숫자
//                int sampleRandom = random.nextInt(sampleMax - sampleMin + 1) + sampleMin;
//                this.sampleTraceWrite(p.getEqp_name(), p.getName(), sampleRandom);
//

                    if (p.getName().equals("Motor Temperature"))
                    {
                        this.sampleTraceTempWrite(p.getEqp_name(), p.getName());
                    }
                    else if(p.getParam_id().equals(2163L)) //Demo1 Moter DE Velocity Alarm_Misalignment
                    {
                        this.sampleTraceWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Alarm_Misalignment");
                    }
                    else if(p.getParam_id().equals(2188L)) //Demo2 Motor DE Velocity Alarm_Unbalance
                    {
                        this.sampleTraceWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Alarm_Unbalance");
                    }
                    else if(p.getParam_id().equals(2204L)) //Demo3 Fan DE1 Accleration Alarm_Lubrication
                    {
                        this.sampleTraceWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Acceleration", "Alarm");
                    }
                    else if(p.getParam_id().equals(8803L)) //Demo11 Fan DE1 Enveloping Alarm_
                    {
                        this.sampleTraceWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Enveloping", "Alarm");
                    }

                    else if(p.getParam_id().equals(8900L)) //Demo12 Fan NDE Velocity Warning
                    {
                        this.sampleTraceWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Warning");
                    }

                    else if(p.getParam_id().equals(8924L)) //Demo13 Fan NDE Acceleration Warning
                    {
                        this.sampleTraceWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Warning");
                    }

                    else
                    {
                        this.sampleTraceWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", p.getParam_type_cd(), "Normal");
                    }



//            }
        }
    }

//    static String prevDate="";
//    static Map<String,Long> eqpParamSampleRawIds = new HashMap<>(); //key: eqpId+param_name value: sampleRawid

    //하나의 eqp에 하나의 param은 하루동안 한가지 sample데이터를 가지고 가게 해야 한다.
    private HashMap<String, Object> sampleTraceWrite(String eqpId, String param_name, String eqpType, String dataType, String problemType)
    {
        STDTraceDataMapper traceDataMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
        STDTraceDataMapper traceTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);

        Double value = null;
        String data_type_cd = "RMS";

        Long sampleRawId = null;

        Date toDay = new Date();
        toDay =DateUtils.truncate(toDay,Calendar.DATE); //2018-05-04



        sampleRawId = getSampleRawId(eqpType, dataType, problemType, traceTrxMapper);

        String key = eqpId+param_name;

        //logger.info("key : {}, map size : {}", key, OneDaySample.getMap().size());

        if(OneDaySample.getMap().containsKey(key)){//Demo1FanDE1Velocity
            Pair<Long, Date> pair = OneDaySample.getMap().get(key);

            Date prev = pair.getSecond();
            long difference = toDay.getTime() - prev.getTime();
            float daysBetween = (difference / (1000*60*60*24));
            if(daysBetween >= 1.0){
                OneDaySample.getMap().put(key, new Pair<Long, Date>(sampleRawId, toDay));
            } else {
                sampleRawId = pair.getFirst();
            }
        } else {
            OneDaySample.getMap().put(key, new Pair<Long, Date>(sampleRawId, toDay));
        }



//        if(prevDate.isEmpty() ||!prevDate.equals(toDay)){ //prevDate가 오늘 날짜와 같다면
//            prevDate = toDay.toString();
//
//            sampleRawId = getSampleRawId(eqpType, dataType, problemType, traceTrxMapper);
//            if (sampleRawId == null) return null;
//
//            if(eqpParamSampleRawIds.containsKey(eqpId+param_name)){
//                eqpParamSampleRawIds.remove(eqpId+param_name);
//            }
//            eqpParamSampleRawIds.put(eqpId+param_name,sampleRawId);
//
//
//        }
//
//        sampleRawId = eqpParamSampleRawIds.get(eqpId+param_name);


        //get sample_trace
//        List<OverallMinuteTrx> overallMinuteTrxes = traceDataMapper.selectSampleTraceByRawId(sampleRawId);
//
//
//        if(overallMinuteTrxes.size() <= 0) return null;
//
////        Random random = new Random();
////        int randomList = random.nextInt(overallMinuteTrxes.size());
////        OverallMinuteTrx overallMinuteTrx = overallMinuteTrxes.get(randomList);
//
//        SimpleDateFormat simpleDateFormat = new  SimpleDateFormat("HH:mm");
//        SimpleDateFormat sYearFormat = new  SimpleDateFormat("yyyy-MM-dd");
//        SimpleDateFormat sFullDate = new  SimpleDateFormat("yyyy-mm-dd HH:mm");
//
//
//        long toDayTime = new Date().getTime();
//        String todayYear = sYearFormat.format(toDay);
//        OverallMinuteTrx overallMinuteTrx= null;
//        for (int i = 0; i < overallMinuteTrxes.size(); i++) {
//
//            Date originDate=overallMinuteTrxes.get(i).getRead_dtts();
//            String time = simpleDateFormat.format(originDate);
//
//            try {
//                long timeData = sFullDate.parse(todayYear+" "+time+":00").getTime();
//                if(timeData>toDayTime){
//                    if(i>0){
//                        overallMinuteTrx = overallMinuteTrxes.get(i-1);
//                        break;
//                    }
//                }
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//
//
////            String newDate=dtString.format(originDate);
////            String[] newHHMMSS=newDate.split(" ");
////            String newTime=newHHMMSS[1];
//        }

        OverallMinuteTrx overallMinuteTrx=null;

        overallMinuteTrx=traceDataMapper.selectSampleTraceClosedTimeWithCurrentASC(sampleRawId);

        if(overallMinuteTrx==null)
        {
            overallMinuteTrx=traceDataMapper.selectSampleTraceClosedTimeWithCurrentDESC(sampleRawId);
        }


        long time = System.currentTimeMillis();
        SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String sEvent_timestamp = dayTime.format(new Date(time));

        value = overallMinuteTrx.getValue();
        String sValue = Double.toString(value);

        double xValue = Math.random();
        double yValue = Math.random();
        int xAxis = (int) (xValue * 1000) + 0;
        int yAxis = (int) (yValue * 1000) + 0;

        String location = Integer.toString(xAxis) + ":" + Integer.toString(yAxis);

        String data = sEvent_timestamp + ',' + fabId + ',' + areaId + ',' + eqpId + ',' + param_name + ',' + data_type_cd + ',' + "1.6" + ',' + sValue + ',' + location + "\n";
        //String.format("%s,%s,%s,%s,%s,%s,%s",sEvent_timestamp,fab,area_name,
        this.createDirectory(directoryPath(fabId, areaId, eqpId));
        //this.createFile(filePath(fab,area_name,eqp));
        String filePath = filePath(fabId, areaId, eqpId);

        sinker.write(filePath, data);

        String key2 = fabId + "," + areaId + "," + eqpId;
        sinker.close(key2, filePath);

        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;

    }
//
//    private HashMap<String, Object> sampleTraceWrite(String eqpId, String param_name, long sampleRawId) {
//        STDTraceDataMapper traceDataMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
//        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
//
//        Date today = new Date();
//
//        Double value = null;
//        String data_type_cd = "RMS";
//
//        //get sample_trace
//        List<OverallMinuteTrx> overallMinuteTrxes = traceDataMapper.selectSampleTraceByRawId(sampleRawId);
//
//        Random random = new Random();
//        int randomList = random.nextInt(overallMinuteTrxes.size());
//        OverallMinuteTrx overallMinuteTrx = overallMinuteTrxes.get(randomList);
//
//        String sEvent_timestamp = dtString.format(today);
//        value = overallMinuteTrx.getValue();
//        String sValue = Double.toString(value);
//
//        double xValue = Math.random();
//        double yValue = Math.random();
//        int xAxis = (int) (xValue * 1000) + 0;
//        int yAxis = (int) (yValue * 1000) + 0;
//
//        String location = Integer.toString(xAxis) + ":" + Integer.toString(yAxis);
//
//        String data = sEvent_timestamp + ',' + fabId + ',' + areaId + ',' + eqpId + ',' + param_name + ',' + data_type_cd + ',' + "1.6" + ',' + sValue + ',' + location + "\n";
//        //String.format("%s,%s,%s,%s,%s,%s,%s",sEvent_timestamp,fab,area_name,
//        this.createDirectory(directoryPath(fabId, areaId, eqpId));
//        //this.createFile(filePath(fab,area_name,eqp));
//        String filePath = filePath(fabId, areaId, eqpId);
//
//        sinker.write(filePath, data);
//
//        String key = fabId + "," + areaId + "," + eqpId;
//        sinker.close(key, filePath);
//
//        HashMap<String, Object> result = new HashMap<>();
//        result.put("result", "success");
//        result.put("data", "");
//        return result;
//    }

    private HashMap<String, Object> sampleTraceTempWrite(String eqpId, String param_name) {
        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
        Date today = new Date();

        Double value = null;
        String data_type_cd = "RMS";

        long time = System.currentTimeMillis();
        SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String sEvent_timestamp = dayTime.format(new Date(time));


        //온도 랜덤 생성
        Random random = new Random();
        int temp = random.nextInt(90 - 24 + 1) + 24;
        int temp2 = random.nextInt(99 - 0 + 1) + 0;

        String sValue = Integer.toString(temp) + "." + Integer.toString(temp2);

        double xValue = Math.random();
        double yValue = Math.random();
        int xAxis = (int) (xValue * 1000) + 0;
        int yAxis = (int) (yValue * 1000) + 0;

        String location = Integer.toString(xAxis) + ":" + Integer.toString(yAxis);

        String data = sEvent_timestamp + ',' + fabId + ',' + areaId + ',' + eqpId + ',' + param_name + ',' + data_type_cd + ',' + "0" + ',' + sValue + ',' + location + "\n";
        //String.format("%s,%s,%s,%s,%s,%s,%s",sEvent_timestamp,fab,area_name,
        this.createDirectory(directoryPath(fabId, areaId, eqpId));

        String filePath = filePath(fabId, areaId, eqpId);

        sinker.write(filePath, data);
        String key = fabId + "," + areaId + "," + eqpId;
        sinker.close(key, filePath);

        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    private String filePath(String fabId, String areaName, String eqpName) {
        Date today = new Date();
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
        String todayDate = date.format(today);

//        String filePath = "D:\\data" + File.separator + fabId + File.separator
//                + areaName + File.separator + eqpName + File.separator + "sensor_" + todayDate + ".log";
        String filePath="./"+ File.separator+fabId+File.separator+areaName+File.separator+eqpName+File.separator+"sensor_"+todayDate+".log";

        return filePath;
    }

    private String directoryPath(String fabId, String areaName, String eqpName) {
        String directoryPath="./"+File.separator+fabId+File.separator+areaName+File.separator+eqpName;
//        String directoryPath = "D:\\data" + File.separator + fabId + File.separator
//                + areaName + File.separator + eqpName;

        return directoryPath;
    }

    private void createDirectory(String directory) {
        File file = new File(directory);

        if (!file.exists()) {
            file.mkdirs();
        }
    }

    private String getProblemType(){
//        Min + (int)(Math.random() * ((Max - Min) + 1))
        Random random = new Random(System.currentTimeMillis());
        int index = (int)(Math.random() * (10+1));
        if(index>=0 && index<=3){
            return "Alarm";
        }else if (index>=4 && index<=6){
            return "Warning";
        }else{
            return "Normal";
        }

    }

    private Long getSampleRawId(String eqpType, String dataType, String problemType, STDTraceDataMapper traceTrxMapper) {
        List<HashMap<String,Object>> samples = traceTrxMapper.selectSample(eqpType,dataType,problemType);
        Random random = new Random(System.currentTimeMillis());

        if(samples.size()==0){
            return null;
        }

        int index = (int)(Math.random() * samples.size());

        Long sampleRawId =Long.valueOf(samples.get(index).get("RAWID").toString());
        return sampleRawId;
    }

}
