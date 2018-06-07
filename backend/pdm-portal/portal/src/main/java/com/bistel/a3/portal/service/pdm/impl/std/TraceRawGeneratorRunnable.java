package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceDataMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceRawDataMapper;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.bistel.a3.portal.domain.pdm.work.MeasureTrxWithBin;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.math3.util.Pair;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.*;

public class TraceRawGeneratorRunnable implements Runnable {
    private static Logger logger = LoggerFactory.getLogger(TraceRawGeneratorRunnable.class);

    private final String fabId = "fab1";
    private final String areaId = "Demo_Area";
    private final FileSinker sinker;
    private final List<ParamWithCommonWithRpm> params;
    private List<MeasureTrx> measureTrxes;
    private MeasureTrxWithBin measureTrxWithBinTW;
    private MeasureTrxWithBin measureTrxWithBinFreq;
    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

//    public TraceRawGeneratorRunnable(FileSinker sinker,
//                                     List<ParamWithCommonWithRpm> params,
//                                     List<MeasureTrx> measureTrxes,
//                                     MeasureTrxWithBin measureTrxWithBinFreq,
//                                    MeasureTrxWithBin measureTrxWithBinTW) {
//        this.sinker = sinker;
//        this.params = params;
//        this.measureTrxes = measureTrxes;
//        this.measureTrxWithBinFreq = measureTrxWithBinFreq;
//        this.measureTrxWithBinTW = measureTrxWithBinTW;
//    }

    public TraceRawGeneratorRunnable(FileSinker sinker,
                                     List<ParamWithCommonWithRpm> params,
                                     Map<String, SqlSessionTemplate> sessions
                                     ) {
        this.sinker = sinker;
        this.params = params;
        this.sessions = sessions;
    }

    @Override
    public void run() {
        String eqpName = "";
        for (ParamWithCommonWithRpm p : params) {
            eqpName = p.getEqp_name();

//          if (p.getName().equals("Motor Temperature")) {
//            } else {
//                this.sampleTraceRawWrite(p.getEqp_name(), p.getName());
//                //this.test(p.getEqp_name(),p.getName(),"EQP_TYPE1", p.getParam_type_cd(), getProblemType());
//            }


            if (p.getName().equals("Motor Temperature")) {
            }
            else if(p.getParam_id().equals(2163L)) //Demo1 Moter DE Velocity Alarm
            {
                this.sampleTraceRawWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Alarm");
            }
            else if(p.getParam_id().equals(2188L)) //Demo2 Motor DE Velocity Alarm
            {
                this.sampleTraceRawWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Alarm_Unbalance");
            }
            else if(p.getParam_id().equals(2204L)) //Fan DE1 Accleration Alarm
            {
                this.sampleTraceRawWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Acceleration", "Alarm");
            }
            else if(p.getParam_id().equals(8803L)) //Fan DE1 Enveloping Alarm
            {
                this.sampleTraceRawWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Enveloping", "Alarm");
            }

            else if(p.getParam_id().equals(8900L)) //Fan NDE Velocity Warning
            {
                this.sampleTraceRawWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Warning");
            }

            else if(p.getParam_id().equals(8924L)) //Fan NDE Acceleration Warning
            {
                this.sampleTraceRawWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", "Velocity", "Warning");
            }
            else
            {
                this.sampleTraceRawWrite(p.getEqp_name(), p.getName(), "EQP_TYPE1", p.getParam_type_cd(), "Normal");
            }
        }
        logger.info("{} finished.", eqpName);
    }

    private String sampleTraceRawWrite(String eqpId, String param_name, String eqpType, String dataType, String problemType) {

        STDTraceDataMapper traceTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        STDTraceRawDataMapper traceRawDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDTraceRawDataMapper.class);

        this.createDirectory(directoryPath(fabId, areaId, eqpId));
        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String

        Date today = new Date();

//        Long sampleRawId = getSampleRawId(eqpType, dataType, problemType, traceTrxMapper);
//
//        List<MeasureTrx> measureTrxes = traceRawDataMapper.selectSampleTraceByRawId(sampleRawId);
//
//        if(measureTrxes.size() <= 0) return null;
//
//        Random random=new Random();
//        int randomList = random.nextInt(measureTrxes.size());
//
//        MeasureTrx measureTrx = measureTrxes.get(randomList);

        Long sampleRawId = null;

        Date toDay = new Date();
        toDay = DateUtils.truncate(toDay,Calendar.DATE); //2018-05-04

        sampleRawId = getSampleRawId(eqpType, dataType, problemType, traceTrxMapper);

        String eqpParamKey = eqpId+param_name;

        if(OneDaySample.getMap().containsKey(eqpParamKey)){//Demo1FanDE1Velocity
            Pair<Long, Date> pair = OneDaySample.getMap().get(eqpParamKey);

            Date prev = pair.getSecond();
            long difference = toDay.getTime() - prev.getTime();
            float daysBetween = (difference / (1000*60*60*24));
            if(daysBetween >= 1.0){
                OneDaySample.getMap().put(eqpParamKey, new Pair<Long, Date>(sampleRawId, toDay));
            } else {
                sampleRawId = pair.getFirst();
            }
        } else {
            OneDaySample.getMap().put(eqpParamKey, new Pair<Long, Date>(sampleRawId, toDay));
        }

        MeasureTrx measureTrx=null;
        measureTrx=traceRawDataMapper.selectSampleTraceRawClosedTimeWithCurrentASC(sampleRawId);

        if(measureTrx==null)
        {
            measureTrx=traceRawDataMapper.selectSampleTraceRawClosedTimeWithCurrentDESC(sampleRawId);
        }

        long orgmeasuretrxid = measureTrx.getMeasure_trx_id();

        //Frequency==datatype1
        MeasureTrxWithBin measureTrxWithBinFreq = traceRawDataMapper.selectSampleTraceWithBinById(0, orgmeasuretrxid);
        MeasureTrxWithBin measureTrxWithBinTW = traceRawDataMapper.selectSampleTraceWithBinById(2, orgmeasuretrxid);

        //시간
        long time = System.currentTimeMillis();
        SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String sEvent_timestamp = dayTime.format(new Date(time));

        String max_freq = Long.toString(measureTrx.getEnd_freq());
        String freq_cnt = Integer.toString(measureTrx.getSpectra_line());
        String sRpm = Double.toString(measureTrx.getRpm());
        String data_type_cd = "RAW";

        String sRms = measureTrx.getValue().toString();
        String sFreq = this.byteToString(measureTrxWithBinFreq.getBinary()).toString();
        String sTW = this.byteToString(measureTrxWithBinTW.getBinary()).toString();

        String data =sEvent_timestamp + ',' + fabId + ',' + areaId + ',' + eqpId + ','
                + param_name + ',' + data_type_cd + ',' + "1.6" + ',' + sRms + ',' + sFreq
                + ',' + sTW + ',' + freq_cnt + ',' + max_freq + ',' + sRpm + "\n";

        String filePath = filePath(fabId, areaId, eqpId);
        sinker.write(filePath, data);
        String key = fabId + "," + areaId + "," + eqpId;
        sinker.close(key, filePath);

        return null;
    }

//    private void sampleTraceRawWrite(String eqpId, String param_name) {
//        this.createDirectory(directoryPath(fabId, areaId, eqpId));
//        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
//
//        Date today = new Date();
//
//        Random random = new Random();
//        int randomList = random.nextInt(measureTrxes.size());
//        MeasureTrx measureTrx = measureTrxes.get(randomList);
//
//        String sEvent_timestamp = dtString.format(today);
//
//        String max_freq = Long.toString(measureTrx.getEnd_freq());
//        String freq_cnt = Integer.toString(measureTrx.getSpectra_line());
//        String sRpm = Double.toString(measureTrx.getRpm());
//        String data_type_cd = "RAW";
//
//        String sRms = measureTrx.getValue().toString();
//        String sFreq = this.byteToString(measureTrxWithBinFreq.getBinary()).toString();
//        String sTW = this.byteToString(measureTrxWithBinTW.getBinary()).toString();
//
//        String data = sEvent_timestamp + ',' + fabId + ',' + areaId + ',' + eqpId + ','
//                + param_name + ',' + data_type_cd + ',' + "1.6" + ',' + sRms + ',' + sFreq
//                + ',' + sTW + ',' + freq_cnt + ',' + max_freq + ',' + sRpm + "\n";
//
//        String filePath = filePath(fabId, areaId, eqpId);
//        sinker.write(filePath, data);
//        String key = fabId + "," + areaId + "," + eqpId;
//        sinker.close(key, filePath);
//    }


    private static double[] byteToDoubleArray(byte[] bytes) {
        int times = Double.SIZE / Byte.SIZE;
        double[] doubles = new double[bytes.length / times];
        for (int i = 0; i < doubles.length; i++) {
            doubles[i] = ByteBuffer.wrap(bytes, i * times, times).getDouble();
        }
        return doubles;
    }

    private static StringBuilder byteToString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        int times = Double.SIZE / Byte.SIZE;
        double[] doubles = new double[bytes.length / times];

        for (int i = 0; i < doubles.length; i++) {
            sb.append(ByteBuffer.wrap(bytes, i * times, times).getDouble()).append("^");
        }
        sb.setLength(sb.length() - 1);
        return sb;
    }

    private String filePath(String fabId, String areaName, String eqpName) {
        Date today = new Date();
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
        String todayDate = date.format(today);

//        String filePath = "D:\\data" + File.separator + fabId + File.separator
//                + areaName + File.separator + eqpName + File.separator + "sensor_" + todayDate + ".log";
        String filePath = "./" + File.separator + fabId + File.separator + areaName + File.separator + eqpName + File.separator + "sensor_" + todayDate + ".log";

        return filePath;
    }

    private String directoryPath(String fabId, String areaName, String eqpName) {
        String directoryPath = "./" + File.separator + fabId + File.separator + areaName + File.separator + eqpName;
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
        int index = (int)(Math.random() * (10 + 1));
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
