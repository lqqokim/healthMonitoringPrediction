package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.dao.pdm.db.SKFPumpMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDEqpMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDParamMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceDataMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceRawDataMapper;
import com.bistel.a3.portal.domain.pdm.Spec;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.enums.BinDataType;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.bistel.a3.portal.domain.pdm.work.MeasureTrxWithBin;
import com.bistel.a3.portal.enums.JOB_TYPE;
import com.bistel.a3.portal.module.pdm.FabsComponent;
import com.bistel.a3.portal.service.pdm.IBatchTaskService;
import com.bistel.a3.portal.service.pdm.IDataCollectService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static com.bistel.a3.portal.util.date.DateUtil.getProgressStatusString;
import static com.bistel.a3.portal.util.frequencyData.FrequencyUtil.*;

@Service
@ConditionalOnExpression("${run.standard}")
public class DataCollectService implements IDataCollectService {
    private static Logger logger = LoggerFactory.getLogger(DataCollectService.class);

    private static FastDateFormat ff = FastDateFormat.getDateInstance(DateFormat.LONG);

    @Autowired
    private FabsComponent fabsComponent;

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private BatchTaskService batchTaskService;

    @Autowired
    private FileSinker fileSinker;

//    private static ExecutorService executor = Executors.newCachedThreadPool(); //Executors.newFixedThreadPool(4);
//
    @Override
    @Transactional
    public HashMap<String, Object> inserData(String fabId, long eqpId, long paramId, Date date, double[] timewave, long rpm, double samplingTime, int samplingCount) {
        SKFPumpMapper pumpMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);

        STDTraceRawDataMapper measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceRawDataMapper.class);

        HashMap<String, Object> result = new HashMap<>();
        try {
            long measureIdCount = measureTrxMapper.selectMaxMeasureTrxId();

            measureIdCount += 1;

            double[] frequency = getFFT(samplingTime, samplingCount, timewave);
            double overall = overall(timewave);
            OverallMinuteTrx overallMinuteTrx = new OverallMinuteTrx();
            overallMinuteTrx.setValue(overall);
            overallMinuteTrx.setRpm(rpm);
            overallMinuteTrx.setParam_id(paramId);
            overallMinuteTrx.setRead_dtts(date);
            pumpMapper.insertOverallMinuteTrx(overallMinuteTrx);

            MeasureTrx measureTrx = new MeasureTrx();
            measureTrx.setValue(overall);
            measureTrx.setRpm(Double.valueOf(rpm));
            measureTrx.setSpectra_line(samplingCount);
            measureTrx.setMeasure_dtts(date);
            measureTrx.setParam_id(paramId);
            measureTrx.setEnd_freq((long) (samplingCount / 2.0 / samplingTime));
            measureTrx.setMeasure_trx_id(measureIdCount);
            pumpMapper.insertMeasureTrx(measureTrx);

            MeasureTrxBin measureTrxBin = new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("2");
            measureTrxBin.setBinary(doubleToByteArray(timewave));
            measureTrxBin.setScale_factor(0.0);
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            pumpMapper.insertMeasureTrxBin(measureTrxBin);

            measureTrxBin = new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("0");
            measureTrxBin.setBinary(doubleToByteArray(frequency));
            measureTrxBin.setScale_factor(0.0);
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            pumpMapper.insertMeasureTrxBin(measureTrxBin);


        } catch (Exception err) {
            result.put("result", "fail");
            result.put("data", err.getMessage());
            return result;
        }
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    @Override
    @Transactional
    public HashMap<String, Object> copyData(String fabId, long fromParamId, long toParamId, Date fromDate, Date toDate, Date targetDate) {


        STDTraceDataMapper traceTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);

        STDTraceRawDataMapper traceRawTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceRawDataMapper.class);

        STDParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);


        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //String --> Date


//        Long sampleRawId = getSampleRawId(fixProblemType,eqpType, dataType, problemType, traceTrxMapper);
//        if (sampleRawId == null) return null;
//
//
//        //get sample_trace
//        List<OverallMinuteTrx> traceTrxes = traceTrxMapper.selectSampleTraceByRawId(sampleRawId);
//        //해당기간의 overall객체 생성

        List<OverallMinuteTrx> traceTrxes = traceTrxMapper.selectOverallMinuteTrxByParamId(fromParamId,fromDate,toDate);

        Date newTargetDate = null;

        //put sample_trace
        List<STDTraceTrx> batchData = new ArrayList<>();
        for (int i = 0; i < traceTrxes.size(); i++) {

            try {
                OverallMinuteTrx traceTrx = traceTrxes.get(i);

                //long newMillTime=overallMinuteTrx.getRead_dtts().getTime()+gapTargetDateFromDate;
                //Date newOverallTime=DateUtil.createDate(newMillTime);

                Date originDate = traceTrx.getRead_dtts();

                String sOriginDate = dtString.format(originDate); //String 1970.01.01 12:34:56
//                String sOriginTime[] = sOriginDate.split(" ");//String
//
//                String sTargetDate = dtString.format(targetDate);
//                String sDate[] = sTargetDate.split(" ");
//
//                String sNewTargetDate = sDate[0] + " " + sOriginTime[1];
                    long diff = originDate.getTime()- fromDate.getTime();
                    newTargetDate = new Date(targetDate.getTime()+ diff);

//                try {
//                    newTargetDate = dtDate.parse(sNewTargetDate);
//                } catch (ParseException e) {
//                    e.printStackTrace();
//                }

                traceTrx.setRead_dtts(newTargetDate);
                //logger.debug("sampletrace value: "+traceTrx.toString());
                traceTrx.setParam_id(toParamId);

                STDTraceTrx stdTraceTrx = new STDTraceTrx();
                stdTraceTrx.setAlarm_spec(traceTrx.getAlarm());
                stdTraceTrx.setWarning_spec(traceTrx.getWarn());
                stdTraceTrx.setEvent_dtts(traceTrx.getRead_dtts());
                stdTraceTrx.setParam_mst_rawid(toParamId);
                stdTraceTrx.setValue(traceTrx.getValue());


                //overallMinuteTrxMapper.insertOverallMinuteTrx(overallMinuteTrx);
                traceTrxMapper.insertTraceTrx(stdTraceTrx);
//            batchData.add(stdTraceTrx);\
            }catch(Exception e){
                e.printStackTrace();
            }
        }

//        traceTrxMapper.insertTraceTrxBatch(batchData);



        //get sample_trace_raw
        List<MeasureTrx> traceRawTrxes = traceRawTrxMapper.selectMeasureTrx(fromParamId,fromDate,toDate);


        //put measure_trx_pdm
        for (int i = 0; i < traceRawTrxes.size(); i++) {

            try {
                MeasureTrx traceRawTrx = traceRawTrxes.get(i);
                long orgmeasuretrxid = traceRawTrx.getMeasure_trx_id();
                //
                Date originDate = traceRawTrx.getMeasure_dtts();

                String sOriginDate = dtString.format(originDate); //String 1970.01.01 12:34:56
                String sOriginTime[] = sOriginDate.split(" ");//String

                String sTargetDate = dtString.format(targetDate);
                String sDate[] = sTargetDate.split(" ");

                String sNewTargetDate = sDate[0] + " " + sOriginTime[1];

                try {
                    newTargetDate = dtDate.parse(sNewTargetDate);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                //

//            long trxId= traceRawTrxMapper.selectMaxMeasureTrxId();

                Spec spec = paramMapper.selectSpec(toParamId);

//            OverallMinuteTrx traceTrx = new OverallMinuteTrx();
//            tracetrx.setValue(traceRawTrx.getValue());
//            tracetrx.setAlarm(spec.getAlarm());
//            tracetrx.setWarn(spec.getWarn());
//            tracetrx.setParam_id(toParamId);
//            tracetrx.setRead_dtts(newTargetDate);
//            traceTrxMapper.insertOverallMinuteTrxWithSpec(tracetrx);

                STDTraceTrx stdTraceTrx = new STDTraceTrx();

                List<STDTraceTrx> result = traceTrxMapper.selectTraceDataByParamIdDate(toParamId, newTargetDate);
                if (result.size() > 0) {
                    stdTraceTrx = result.get(0);
                } else {

                    stdTraceTrx.setAlarm_spec(spec.getAlarm());
                    stdTraceTrx.setWarning_spec(spec.getWarn());
                    stdTraceTrx.setEvent_dtts(newTargetDate);
                    stdTraceTrx.setParam_mst_rawid(toParamId);
                    stdTraceTrx.setValue(traceRawTrx.getValue());
                    //overallMinuteTrxMapper.insertOverallMinuteTrx(overallMinuteTrx);
                    traceTrxMapper.insertTraceTrx(stdTraceTrx);
                }

                //typecd 1
                MeasureTrxWithBin measureTrxWithBin = traceRawTrxMapper.selectSampleTraceWithBinById(0, orgmeasuretrxid);
                STDTraceRawTrx stdTraceRawTrx = new STDTraceRawTrx();

                stdTraceRawTrx.setBinary(measureTrxWithBin.getBinary());
                stdTraceRawTrx.setData_type_cd("F");
                stdTraceRawTrx.setEvent_dtts(newTargetDate);
                stdTraceRawTrx.setMax_freq(measureTrxWithBin.getEnd_freq());
                stdTraceRawTrx.setRpm(measureTrxWithBin.getRpm());
                stdTraceRawTrx.setParam_mst_rawid(toParamId);
                stdTraceRawTrx.setSampling_time(measureTrxWithBin.getSampling_time());
                stdTraceRawTrx.setTrace_trx_rawid(stdTraceTrx.getRawid());
                stdTraceRawTrx.setFreq_count(measureTrxWithBin.getSpectra_line());


                traceRawTrxMapper.insertTraceRaw(stdTraceRawTrx);


                //typecd 2
                measureTrxWithBin = traceRawTrxMapper.selectSampleTraceWithBinById(2, orgmeasuretrxid);
                stdTraceRawTrx = new STDTraceRawTrx();

                stdTraceRawTrx.setBinary(measureTrxWithBin.getBinary());
                stdTraceRawTrx.setData_type_cd("T");
                stdTraceRawTrx.setEvent_dtts(newTargetDate);
                stdTraceRawTrx.setMax_freq(measureTrxWithBin.getEnd_freq());
                stdTraceRawTrx.setRpm(measureTrxWithBin.getRpm());
                stdTraceRawTrx.setParam_mst_rawid(toParamId);
                stdTraceRawTrx.setSampling_time(measureTrxWithBin.getSampling_time());
                stdTraceRawTrx.setTrace_trx_rawid(stdTraceTrx.getRawid());
                stdTraceRawTrx.setFreq_count(measureTrxWithBin.getSpectra_line());

//            traceRawTrxMapper.insertMeasureTrxBin(measureTrxBin);
                traceRawTrxMapper.insertTraceRaw(stdTraceRawTrx);
            }catch(Exception err){
                logger.error(err.getMessage());
            }
        }

        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }


    ////// DELETE DATA ////////////
    @Override
    @Transactional
    public HashMap<String, Object> deleteData(String fabId, long paramId, Date fromDate, Date toDate) {

        STDTraceDataMapper traceTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        STDTraceRawDataMapper traceRawTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceRawDataMapper.class);

//        //delete overall_minute_trx_pdm
//        Date TomorrowToDate=DateUtils.addDays(toDate, 1);
//
//        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
//        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        //milli까지 표현되는 fromdata, todata
//        Date newFromDate=null;
//        Date newToDate=null;
//
//        String sFromDate=dtString.format(fromDate);
//        sFromDate+=" 00:00:00";
//        try {
//            newFromDate= dtDate.parse(sFromDate);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//
//        String sToDate=dtString.format(TomorrowToDate);
//        sToDate+=" 00:00:00";
//        try {
//            newToDate= dtDate.parse(sToDate);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }


        //delete measure_trx_bin_pdm
        traceRawTrxMapper.deleteTraceRawTrxByParamId(paramId, fromDate, toDate);

        //delete overall_trx_pdm
        traceTrxMapper.deleteTraceTrxByParamId(paramId, fromDate, toDate);

        //
        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    ///////////////////////////////

    @Value("${schedule.demoDataCopy.enable}")
    private boolean schedulerEnableDemoDataCopy;

    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron = "${schedule.demoDataCopy}")
    public void demoDataCopy() throws NoSuchMethodException {
//        if(schedulerEnableDemoDataCopy)
//        {
//            STDReportMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDReportMapper.class);
//
//            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
//            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//
//            Date start=DateUtils.addDays(new Date(), -180);
//
//            String sStart=dtString.format(start);
//            sStart+=" 00:00:00";
//            try {
//                start= dtDate.parse(sStart);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//
//            Date end = DateUtils.addDays(start, 1);
//            //Allen
//            Date target=DateUtils.addDays(new Date(), -1);
//            String sTarget=dtString.format(target);
//            sTarget+=" 00:00:00";
//            try {
//                target= dtDate.parse(sTarget);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//            //
//            List<Param> params=paramDataMapper.selectParamByEqp(2190L);
//
//            logger.info("START scheduled demoDataCopy [{} ~ {})", ff.format(start), ff.format(end));
//
//            for (int i = 0; i < params.size(); i++)
//            {
//                deleteAndCopy("fab1", params.get(i).getParam_id(),start, end, target);
//            }
//
//            //warning
//
//            sStart="2018-03-25 00:00:00";
//            try {
//                start= dtDate.parse(sStart);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//
//            end = DateUtils.addDays(start, 1);
//
//            //copyData("fab1", 83,start, end, target);
//            deleteAndCopy("fab1", 83,start, end, target);//83번 param의 과거데이터를 현재데이터로 끌고 오기
//            //Alarm
//            sStart="2018-03-25 00:00:00";
//            try {
//                start= dtDate.parse(sStart);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//
//            end = DateUtils.addDays(start, 1);
//
//            deleteAndCopy("fab1", 2182,start, end, target);
//
//            logger.info("END   scheduled demoDataCopy [{} ~ {})", ff.format(start), ff.format(end));
//        }


    }



    @Override
    public HashMap<String, Object> deleteAndCopy(String fabId, long fromParamId,long toParamId, Date fromDate, Date toDate, Date targetDate) {

//        ParamDataMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", ParamDataMapper.class);

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        //Date newDeleteFrom=targetDate ; //+" 00:00:00"
        //Date newDeleteTo = null;// newDateFrom + ((toDate +" 23:59:59") - (fromDate+" 00:00:00")  ==> 몇일 만 사용)

        Date newDeleteFrom = null;
        Date newDeleteTo = null;
        Date newFromDate = null;

        String sTargetDate = dtString.format(targetDate);
        sTargetDate += " 00:00:00";
        try {
            newDeleteFrom = dtDate.parse(sTargetDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sToDate = dtString.format(toDate);
        sToDate += " 23:59:59";
        try {
            newDeleteTo = dtDate.parse(sToDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sFromDate = dtString.format(fromDate);
        sFromDate += " 00:00:00";
        try {
            newFromDate = dtDate.parse(sFromDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        long millnewDeleteTo = (newDeleteTo.getTime() - newFromDate.getTime()) + newDeleteFrom.getTime();

        Date DeleteTo = DateUtil.createDate(millnewDeleteTo);

        this.deleteData(fabId, toParamId, newDeleteFrom, DeleteTo);
        this.copyData(fabId, fromParamId, toParamId, fromDate, toDate, targetDate);

        return null;
    }
    /*
    public HashMap<String, Object> deleteAndCopyByEqpId(String fabId, long eqpId, Date fromDate, Date toDate, Date targetDate,String userId) {
        //getparams
        ParamDataMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", ParamDataMapper.class);
        List<Param> params=paramDataMapper.selectParamByEqp(eqpId);

        //this.deleteAndCopy();
        for (int i = 0; i < params.size(); i++) {
            this.deleteAndCopy(fabId,params.get(i).getParam_id(),fromDate,toDate, targetDate);
        }

        Set<String> fabs = new HashSet<>();
        fabs.add("fab1");
        Set<Long> eqps = new HashSet<>();
        eqps.add(eqpId);
        try {
            batchTaskService.summaryData(fromDate,toDate,fabs,eqps, JOB_TYPE.MANUAL,userId);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    */



    private boolean skip = false;
    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron ="0/1 * * * * *")
    public void schedulerDataCopyByEqp() throws NoSuchMethodException {

//        if(skip==true) return;
//        skip = true;
//
//
//        STDEqpMapper eqpMapper=SqlSessionUtil.getMapper(sessions, "fab1", STDEqpMapper.class);
//        List<EqpWithEtc> eqps100=eqpMapper.selectList4to100(200L);
//        List<EqpWithEtc> eqps200=eqpMapper.selectList200(200L);
//        List<EqpWithEtc> eqps300=eqpMapper.selectList300(200L);
//        List<EqpWithEtc> eqps400=eqpMapper.selectList400(200L);
//        List<EqpWithEtc> eqps500=eqpMapper.selectList500(200L);
//
//        Date today = DateUtils.truncate(new Date(),Calendar.DATE);
//        Date yesterday = DateUtils.addDays(today, -1);
//
//        for(int i=0; i<eqps100.size(); i++)
//        {
//            this.demoDataCopyByEqp("fab1",2190L,eqps100.get(i).getEqp_id(),yesterday,today,today);
//        }
//        logger.info(" datacopy100 done");
//
//        for(int i=0; i<eqps200.size(); i++)
//        {
//            this.demoDataCopyByEqp("fab1",2453L,eqps200.get(i).getEqp_id(),yesterday,today,today);
//        }
//        logger.info(" datacopy200 done");
//
//        for(int i=0; i<eqps300.size(); i++)
//        {
//            this.demoDataCopyByEqp("fab1",2454L,eqps300.get(i).getEqp_id(),yesterday,today,today);
//        }
//        logger.info(" datacopy300 done");
//
//        for(int i=0; i<eqps400.size(); i++)
//        {
//            this.demoDataCopyByEqp("fab1",2455L,eqps400.get(i).getEqp_id(),yesterday,today,today);
//        }
//        logger.info(" datacopy400 done");
//
//        for(int i=0; i<eqps500.size(); i++)
//        {
//            this.demoDataCopyByEqp("fab1",179L,eqps500.get(i).getEqp_id(),yesterday,today,today);
//        }
//        logger.info(" datacopy500 done");

    }

    @Override
    public HashMap<String, Object> demoDataCopyByEqp(String fabId, long fromEqpId, long toEapId, Date fromDate, Date toDate, Date targetDate)
    {


            //getparams
            STDParamMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDParamMapper.class);
            List<Param> fromParams = paramDataMapper.selectParamByEqp(fromEqpId);//DEMO1 EQP의 Param정보를 가져옴
            List<Param> toParams = paramDataMapper.selectParamByEqp(toEapId);//Test01 EQP의 Param정보를 가져옴

            long fromParamId = 0;
            long toParamId = 0;

            for (int i = 0; i < fromParams.size(); i++) {

                fromParamId = fromParams.get(i).getParam_id();//Demo1의 Param한개
                toParamId = toParams.get(i).getParam_id(); //Test1의 Param한개

                long diffTime = toDate.getTime()-fromDate.getTime();

                Date targetTodate = new Date(targetDate.getTime()+diffTime);

                deleteData(fabId,toParamId,targetDate,targetTodate);
                copyData(fabId, fromParamId, toParamId, fromDate, toDate, targetDate);
            }



        return null;
    }


    /*
    @Value("${schedule.shedulerEqpCopy.enable}")
    private boolean schedulerEnableDemoEqpCopy;
    @Transactional(readOnly = true)
    @Scheduled(cron="${schedule.shedulerEqpCopy}")
    public HashMap<String, Object> shedulerEqpCopy() {

        if(schedulerEnableDemoEqpCopy)
        {
            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            Date start=new Date();

            String sStart="2018-03-25 00:00:00";
            try {
                start= dtDate.parse(sStart);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            Date end = DateUtils.addDays(start, 1);

            Date targetDate=new Date();

            String sTargetDate=dtString.format(targetDate);
            sTargetDate+=" 00:00:00";

            try {
                targetDate= dtDate.parse(sTargetDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }


            //Alarm(Demo1-->test1,2,3,4,5)
            demoDataCopyByEqp("fab1",2190,2280,start,end,targetDate);
            demoDataCopyByEqp("fab1",2190,2281,start,end,targetDate);
            demoDataCopyByEqp("fab1",2190,2282,start,end,targetDate);
            demoDataCopyByEqp("fab1",2190,2283,start,end,targetDate);
            demoDataCopyByEqp("fab1",2190,2284,start,end,targetDate);

            //Warning(81-->test6,7,8,9,10)
            demoDataCopyByEqp("fab1",81,2285,start,end,targetDate);
            demoDataCopyByEqp("fab1",81,2286,start,end,targetDate);
            demoDataCopyByEqp("fab1",81,2287,start,end,targetDate);
            demoDataCopyByEqp("fab1",81,2288,start,end,targetDate);
            demoDataCopyByEqp("fab1",81,2289,start,end,targetDate);

        }
        return null;
    }
    */

    private String filePath(String fabId, String areaName, String eqpName) {
        Date today = new Date();
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
        String todayDate = date.format(today);

        String filePath = "D:" + File.separator + fabId + File.separator + areaName + File.separator + eqpName + File.separator + "sensor_" + todayDate + ".log";
//        String filePath="./"+ File.separator+fabId+File.separator+areaName+File.separator+eqpName+File.separator+"sensor_"+todayDate+".log";
        logger.info(filePath);
        return filePath;
    }

    private String directoryPath(String fabId, String areaName, String eqpName) {
//        String directoryPath="./"+File.separator+fabId+File.separator+areaName+File.separator+eqpName;
        String directoryPath = "D:" + File.separator + fabId + File.separator + areaName + File.separator + eqpName;
        logger.info(directoryPath);
        return directoryPath;
    }

    private void createFile(String filePath) {

        File file = new File(filePath);
        try {
            FileWriter fileWriter = new FileWriter(file, true);
            fileWriter.flush();
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void createDirectory(String directory) {
        File file = new File(directory);

        if (!file.exists()) {
            file.mkdirs();
        }
    }

    private HashMap<String, Object> sampleTraceWrite(String fabId, long sampleRawId, long toParamId) {

        STDTraceDataMapper traceDataMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        STDParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String

        Date today = new Date();

        //System.out.println(dtString.format(today));

        String fab = fabId;
        String area_name = "Demo_Area";
        String eqp = null;
        String param_name = null;
        Double value = null;
        String data_type_cd = "RMS";

        //get sample_trace
        List<OverallMinuteTrx> overallMinuteTrxes = traceDataMapper.selectSampleTraceByRawId(sampleRawId);
        //해당기간의 overall객체 생성
        ParamWithCommonWithRpm paramWithCommonWithRpm = paramMapper.selectOne(toParamId);
        eqp = paramWithCommonWithRpm.getEqp_name();
        param_name = paramWithCommonWithRpm.getName();


        Random random = new Random();
        int randomList = random.nextInt(overallMinuteTrxes.size());
        OverallMinuteTrx overallMinuteTrx = overallMinuteTrxes.get(randomList);

        overallMinuteTrx.setRead_dtts(today);
        //logger.debug("sampletrace value: "+overallMinuteTrx.toString());
        overallMinuteTrx.setParam_id(toParamId);
        String sEvent_timestamp = dtString.format(today);

        value = overallMinuteTrx.getValue();
        String sValue = Double.toString(value);

        double xValue = Math.random();
        double yValue = Math.random();
        int xAxis = (int) (xValue * 1000) + 0;
        int yAxis = (int) (yValue * 1000) + 0;

        String location = Integer.toString(xAxis) + ":" + Integer.toString(yAxis);

        String data = sEvent_timestamp + ',' + fab + ',' + area_name + ',' + eqp + ',' + param_name + ',' + data_type_cd + ',' + "1.6" + ',' + sValue + ',' + location + "\n";
        //String.format("%s,%s,%s,%s,%s,%s,%s",sEvent_timestamp,fab,area_name,
        this.createDirectory(directoryPath(fab, area_name, eqp));
        //this.createFile(filePath(fab,area_name,eqp));
        String filePath = filePath(fab, area_name, eqp);

        fileSinker.write(filePath, data);

        String key = fab + "," + area_name + "," + eqp;
        fileSinker.close(key, filePath);

//                try{
//            BufferedWriter fw=new BufferedWriter(new FileWriter(filePath(fab,area_name,eqp), true));
//
//            fw.write(data);
//            //fw.newLine();
//            fw.flush();
//            fw.close();
//        }
//        catch(Exception e)
//        {
//            e.printStackTrace();
//        }

        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    private static double[] byteToDoubleArray(byte[] bytes) {
        int times = Double.SIZE / Byte.SIZE;
        double[] doubles = new double[bytes.length / times];
        for (int i = 0; i < doubles.length; i++) {
            doubles[i] = ByteBuffer.wrap(bytes, i * times, times).getDouble();
        }
        return doubles;
    }

    private HashMap<String, Object> sampleTraceRawWrite(String fabId, long sampleRawId, long toParamId) {

        STDTraceRawDataMapper traceRawDataMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceRawDataMapper.class);
        STDParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        //get sample_trace_raw
        List<MeasureTrx> measureTrxes = traceRawDataMapper.selectSampleTraceByRawId(sampleRawId);

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //String --> Date

        Date today = new Date();

        String fab = fabId;
        String area_name = "Demo_Area";
        String eqp = null;
        String param_name = null;
        byte[] freq = null;
        byte[] timewave = null;
        String data_type_cd = "";
        Double rpm = null;
        String max_freq = "";
        String freq_cnt = "";
        Double rms = null;


        ParamWithCommonWithRpm paramWithCommonWithRpm = paramMapper.selectOne(toParamId);
        eqp = paramWithCommonWithRpm.getEqp_name();
        param_name = paramWithCommonWithRpm.getName();


        //가져온 Measure data가 최소 2개(하루 2번 측정) 이상 내가 넣을 데이타는 1분 데이타
        //그래서 Measure중 하나만 취함.
        //그러면 Measure에 해당하는 bin 2개의 데이타를 write 하면 됨.

        Random random = new Random();
        int randomList = random.nextInt(measureTrxes.size());
        MeasureTrx measureTrx = measureTrxes.get(randomList);

        long orgmeasuretrxid = measureTrx.getMeasure_trx_id();

        //Allen 2018-04-13 selectMaxMeasureTrxId--> selectMaxTraceRawRawId
        measureTrx.setMeasure_dtts(today);
        measureTrx.setParam_id(toParamId);


        //Frequency==datatype1
        MeasureTrxWithBin measureTrxWithBin = traceRawDataMapper.selectSampleTraceWithBinById(2, orgmeasuretrxid);
//        R : time, fab, area(area-area-...), equipment, parameter name, data type, parameter value(RMS Value)
//        F : time, fab, area(area-area-...), equipment, parameter name, data type, parameter value(byte[]), frequency count, max frequency, rpm
//        T : time, fab, area(area-area-...), equipment, parameter name, data type, parameter value(byte[])

        String sEvent_timestamp = dtString.format(today);

        max_freq = Long.toString(measureTrx.getEnd_freq());
        freq_cnt = Integer.toString(measureTrx.getSpectra_line());
        rpm = measureTrx.getRpm();
        String sRpm = Double.toString(rpm);
        data_type_cd = "RAW"; //measureTrxBin.getBin_data_type_cd();

        rms = measureTrx.getValue();
        String sRms = rms.toString();


        freq = measureTrxWithBin.getBinary();
        double[] dFreq = this.byteToDoubleArray(freq);

        String sFreq = "";
        for (int i = 0; i < dFreq.length; i++) {
            sFreq += (Double.toString(dFreq[i]) + "^");
        }
        sFreq = sFreq.substring(0, sFreq.length() - 1);

        String data = sEvent_timestamp + ',' + fab + ',' + area_name + ',' + eqp + ',' + param_name + ',' + data_type_cd + ',' + "1.6" + ',' + sRms + ',' + sFreq;
        //time,fab,area,eqp,param,type
        //String.format("%s,%s,%s,%s,%s,%s,%s",sEvent_timestamp,fab,area_name,
        this.createDirectory(directoryPath(fab, area_name, eqp));
        //this.createFile(filePath(fab,area_name,eqp));

//        try{
//            BufferedWriter fw=new BufferedWriter(new FileWriter(filePath(fab,area_name,eqp), true));
//
//            fw.write(data);
//            //fw.newLine();
//            fw.flush();
//            fw.close();
//        }
//        catch(Exception e)
//        {
//            e.printStackTrace();
//        }


        //Timewave==datatype2
        measureTrxWithBin = traceRawDataMapper.selectSampleTraceWithBinById(0, orgmeasuretrxid);


        timewave = measureTrxWithBin.getBinary();
        double[] dTimewave = this.byteToDoubleArray(timewave);

        String sTimewave = "";
        for (int i = 0; i < dTimewave.length; i++) {
            sTimewave += (Double.toString(dTimewave[i]) + "^");
        }
        sTimewave = sTimewave.substring(0, sTimewave.length() - 1);


        data += ',' + sTimewave + ',' + freq_cnt + ',' + max_freq + ',' + sRpm + "\n";
        //time,fab,area,eqp,param,type
        //String.format("%s,%s,%s,%s,%s,%s,%s",sEvent_timestamp,fab,area_name,
        //this.createDirectory(directoryPath(fab,area_name,eqp));
//        this.createFile(filePath(fab,area_name,eqp));


        String filePath = filePath(fab, area_name, eqp);

        fileSinker.write(filePath, data);
        String key = fab + "," + area_name + "," + eqp;
        fileSinker.close(key, filePath);


//        BufferedOutputStream fw = null;
//        try{
//            fw=new BufferedOutputStream(new FileOutputStream(filePath(fab,area_name,eqp), true));
//            fw.write(data.getBytes());
//        }
//        catch(Exception e)
//        {
//            e.printStackTrace();
//        } finally{
//            try {
//                fw.close();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }


        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    //Allen Sample_Data에서 매일 하루치씩 데이터 끌고오기
    private HashMap<String, Object> sampleDataCopy(String fixProblemType, String fabId,String eqpType,String dataType,String problemType, long toParamId, Date targetDate) {


        STDTraceDataMapper traceTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);

        STDTraceRawDataMapper traceRawTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceRawDataMapper.class);

        STDParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);


        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //String --> Date


        Long sampleRawId = getSampleRawId(fixProblemType,eqpType, dataType, problemType, traceTrxMapper);
        if (sampleRawId == null) return null;


        //get sample_trace
        List<OverallMinuteTrx> traceTrxes = traceTrxMapper.selectSampleTraceByRawId(sampleRawId);
        //해당기간의 overall객체 생성

        Date newTargetDate = null;

        //put sample_trace
        List<STDTraceTrx> batchData = new ArrayList<>();
        for (int i = 0; i < traceTrxes.size(); i++) {

            OverallMinuteTrx traceTrx = traceTrxes.get(i);

            //long newMillTime=overallMinuteTrx.getRead_dtts().getTime()+gapTargetDateFromDate;
            //Date newOverallTime=DateUtil.createDate(newMillTime);

            Date originDate = traceTrx.getRead_dtts();

            String sOriginDate = dtString.format(originDate); //String 1970.01.01 12:34:56
            String sOriginTime[] = sOriginDate.split(" ");//String

            String sTargetDate = dtString.format(targetDate);
            String sDate[] = sTargetDate.split(" ");

            String sNewTargetDate = sDate[0] + " " + sOriginTime[1];

            try {
                newTargetDate = dtDate.parse(sNewTargetDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            traceTrx.setRead_dtts(newTargetDate);
            //logger.debug("sampletrace value: "+traceTrx.toString());
            traceTrx.setParam_id(toParamId);

            STDTraceTrx stdTraceTrx = new STDTraceTrx();
            stdTraceTrx.setAlarm_spec(traceTrx.getAlarm());
            stdTraceTrx.setWarning_spec(traceTrx.getWarn());
            stdTraceTrx.setEvent_dtts(traceTrx.getRead_dtts());
            stdTraceTrx.setParam_mst_rawid(toParamId);
            stdTraceTrx.setValue(traceTrx.getValue());


            //overallMinuteTrxMapper.insertOverallMinuteTrx(overallMinuteTrx);
            traceTrxMapper.insertTraceTrx(stdTraceTrx);
//            batchData.add(stdTraceTrx);
        }

//        traceTrxMapper.insertTraceTrxBatch(batchData);



        //get sample_trace_raw
        List<MeasureTrx> traceRawTrxes = traceRawTrxMapper.selectSampleTraceByRawId(sampleRawId);


        //put measure_trx_pdm
        for (int i = 0; i < traceRawTrxes.size(); i++) {

            MeasureTrx traceRawTrx = traceRawTrxes.get(i);
            long orgmeasuretrxid = traceRawTrx.getMeasure_trx_id();
            //
            Date originDate = traceRawTrx.getMeasure_dtts();

            String sOriginDate = dtString.format(originDate); //String 1970.01.01 12:34:56
            String sOriginTime[] = sOriginDate.split(" ");//String

            String sTargetDate = dtString.format(targetDate);
            String sDate[] = sTargetDate.split(" ");

            String sNewTargetDate = sDate[0] + " " + sOriginTime[1];

            try {
                newTargetDate = dtDate.parse(sNewTargetDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }
            //

//            long trxId= traceRawTrxMapper.selectMaxMeasureTrxId();

            Spec spec = paramMapper.selectSpec(toParamId);

//            OverallMinuteTrx traceTrx = new OverallMinuteTrx();
//            tracetrx.setValue(traceRawTrx.getValue());
//            tracetrx.setAlarm(spec.getAlarm());
//            tracetrx.setWarn(spec.getWarn());
//            tracetrx.setParam_id(toParamId);
//            tracetrx.setRead_dtts(newTargetDate);
//            traceTrxMapper.insertOverallMinuteTrxWithSpec(tracetrx);

            STDTraceTrx stdTraceTrx = new STDTraceTrx();

            List<STDTraceTrx> result =  traceTrxMapper.selectTraceDataByParamIdDate(toParamId,newTargetDate);
            if(result.size()>0){
                stdTraceTrx = result.get(0);
            }else {

                stdTraceTrx.setAlarm_spec(spec.getAlarm());
                stdTraceTrx.setWarning_spec(spec.getWarn());
                stdTraceTrx.setEvent_dtts(newTargetDate);
                stdTraceTrx.setParam_mst_rawid(toParamId);
                stdTraceTrx.setValue(traceRawTrx.getValue());
                 //overallMinuteTrxMapper.insertOverallMinuteTrx(overallMinuteTrx);
                traceTrxMapper.insertTraceTrx(stdTraceTrx);
            }
            try {
                //typecd 1
                MeasureTrxWithBin measureTrxWithBin = traceRawTrxMapper.selectSampleTraceWithBinById(0, orgmeasuretrxid);
                STDTraceRawTrx stdTraceRawTrx = new STDTraceRawTrx();

                stdTraceRawTrx.setBinary(measureTrxWithBin.getBinary());
                stdTraceRawTrx.setData_type_cd("F");
                stdTraceRawTrx.setEvent_dtts(newTargetDate);
                stdTraceRawTrx.setMax_freq(measureTrxWithBin.getEnd_freq());
                stdTraceRawTrx.setRpm(measureTrxWithBin.getRpm());
                stdTraceRawTrx.setParam_mst_rawid(toParamId);
                stdTraceRawTrx.setSampling_time(measureTrxWithBin.getSampling_time());
                stdTraceRawTrx.setTrace_trx_rawid(stdTraceTrx.getRawid());
                stdTraceRawTrx.setFreq_count(measureTrxWithBin.getSpectra_line());


                traceRawTrxMapper.insertTraceRaw(stdTraceRawTrx);


                //typecd 2
                measureTrxWithBin = traceRawTrxMapper.selectSampleTraceWithBinById(2, orgmeasuretrxid);
                stdTraceRawTrx = new STDTraceRawTrx();

                stdTraceRawTrx.setBinary(measureTrxWithBin.getBinary());
                stdTraceRawTrx.setData_type_cd("T");
                stdTraceRawTrx.setEvent_dtts(newTargetDate);
                stdTraceRawTrx.setMax_freq(measureTrxWithBin.getEnd_freq());
                stdTraceRawTrx.setRpm(measureTrxWithBin.getRpm());
                stdTraceRawTrx.setParam_mst_rawid(toParamId);
                stdTraceRawTrx.setSampling_time(measureTrxWithBin.getSampling_time());
                stdTraceRawTrx.setTrace_trx_rawid(stdTraceTrx.getRawid());
                stdTraceRawTrx.setFreq_count(measureTrxWithBin.getSpectra_line());

//            traceRawTrxMapper.insertMeasureTrxBin(measureTrxBin);
                traceRawTrxMapper.insertTraceRaw(stdTraceRawTrx);
            }catch(Exception err){
                logger.error(err.getMessage());
            }
        }

        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;

    }

    private Long getSampleRawId(String fixProblemType, String eqpType, String dataType, String problemType, STDTraceDataMapper traceTrxMapper) {
        String problemTypeData = problemType;
        if(fixProblemType!=null){
            problemTypeData = fixProblemType;
        }
        List<HashMap<String,Object>> samples = traceTrxMapper.selectSample(eqpType,dataType,problemTypeData);
        Random random = new Random(System.currentTimeMillis());

        if(samples.size()==0){
            return null;
        }

        int index = (int)(Math.random() * samples.size());

        Long sampleRawId =Long.valueOf(samples.get(index).get("RAWID").toString());
        return sampleRawId;
    }

    private HashMap<String, Object> sampleDeleteAndCopy(String fixProblemType,String fabId,String eqpType,String dataType,String problemType, long ParamId, Date fromDate, Date toDate, Date targetDate) {

        try {
            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            //Date newDeleteFrom=targetDate ; //+" 00:00:00"
            //Date newDeleteTo = null;// newDateFrom + ((toDate +" 23:59:59") - (fromDate+" 00:00:00")  ==> 몇일 만 사용)

            Date newDeleteFrom = null;
            Date newDeleteTo = null;
            Date newFromDate = null;

            String sTargetDate = dtString.format(targetDate);
            sTargetDate += " 00:00:00";
            try {
                newDeleteFrom = dtDate.parse(sTargetDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            String sToDate = dtString.format(toDate);
            sToDate += " 23:59:59";
            try {
                newDeleteTo = dtDate.parse(sToDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            String sFromDate = dtString.format(fromDate);
            sFromDate += " 00:00:00";
            try {
                newFromDate = dtDate.parse(sFromDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            long millnewDeleteTo = (newDeleteTo.getTime() - newFromDate.getTime()) + newDeleteFrom.getTime();

            Date DeleteTo = DateUtil.createDate(millnewDeleteTo);

            this.deleteData(fabId, ParamId, newDeleteFrom, DeleteTo);
            this.sampleDataCopy(fixProblemType, fabId, eqpType, dataType, problemType, ParamId, targetDate);
        }catch(Exception err){
            logger.error(err.getMessage());
        }
        return null;
    }


    @Value("${schedule.sampleDataCopy.enable}")
    private boolean schedulerEnableSampleDataCopy;

    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron = "${schedule.sampleDataCopy}")
    public void sampleDataCopy() throws NoSuchMethodException {
        String fab = "fab1";
        if (schedulerEnableSampleDataCopy) {
            schedulerEnableSampleDataCopy=false;
            STDParamMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, fab, STDParamMapper.class);


            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            int beforDay = -5;


            Date startDate= DateUtils.addDays(new Date(), beforDay);//yesterday
            Date processingDate = DateUtils.truncate(startDate, Calendar.DATE);
            startDate = DateUtils.truncate(startDate, Calendar.DATE);
            Date endDate = DateUtils.addDays(processingDate, 1);

            Date yesterDay = new Date();
            yesterDay = DateUtils.addDays(yesterDay, -1);//yesterday
            yesterDay =DateUtils.truncate(yesterDay, Calendar.DATE);
//            String sStart=dtString.format(yesterday);
//            sStart+=" 00:00:00";
//            try {
//                yesterday= dtDate.parse(sStart);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//
//            Date today = new Date();//today


            //Demo1 => 1 misalignment_alarm
            //Demo2 => 4 misalignment_alarm
            //Demo3 => 3 Alarm
            //Demo4 => Normal

            Long totalCount = yesterDay.getTime() - processingDate.getTime();

            Long startTime = processingDate.getTime();


            List<Param> demo1Params = paramDataMapper.selectParamByEqp(2190L);
            List<Param> demo2Params = paramDataMapper.selectParamByEqp(2453L);
            List<Param> demo3Params = paramDataMapper.selectParamByEqp(2454L);
            List<Param> demo4Params = paramDataMapper.selectParamByEqp(2455L);


            while (processingDate.getTime() < yesterDay.getTime()) {



                logger.info("START scheduled sampleDataCopy [{} ~ {})", ff.format(processingDate), ff.format(endDate));

                //misalignment_alarm
                for (int i = 0; i < demo1Params.size(); i++) {
                    sampleDeleteAndCopy("Alarm","fab1", "EQP_TYPE1",demo1Params.get(i).getParam_type_cd().toString(),getProblemType(), demo1Params.get(i).getParam_id(), processingDate, endDate, processingDate);
                }
                logger.info("scheduled sampleDataCopy 25% [{} ~ {})", ff.format(processingDate), ff.format(endDate));
                //unbalance_warning
                for (int i = 0; i < demo2Params.size(); i++) {
                    sampleDeleteAndCopy("Warning","fab1", "EQP_TYPE1",demo2Params.get(i).getParam_type_cd().toString(),getProblemType(), demo2Params.get(i).getParam_id(), processingDate, endDate, processingDate);
                }
                logger.info("scheduled sampleDataCopy 50% [{} ~ {})", ff.format(processingDate), ff.format(endDate));
                //Oiling_alarm
                for (int i = 0; i < demo3Params.size(); i++) {
                    sampleDeleteAndCopy(null,"fab1", "EQP_TYPE1",demo3Params.get(i).getParam_type_cd().toString(),getProblemType(), demo3Params.get(i).getParam_id(), processingDate, endDate, processingDate);
                }
                logger.info("scheduled sampleDataCopy 75% [{} ~ {})", ff.format(processingDate), ff.format(endDate));
                //normal
                for (int i = 0; i < demo4Params.size(); i++) {
                    sampleDeleteAndCopy(null,"fab1", "EQP_TYPE1",demo4Params.get(i).getParam_type_cd().toString(),getProblemType(), demo4Params.get(i).getParam_id(), processingDate, endDate, processingDate);
                }

                logger.info("END   scheduled sampleDataCopy [{} ~ {})", ff.format(processingDate), ff.format(endDate));

                processingDate = DateUtils.addDays(processingDate, 1);
                endDate = DateUtils.addDays(processingDate, 1);
                Long currTime = processingDate.getTime()-startTime;
                getProgressStatusString(fab,Integer.valueOf(totalCount.toString()),Integer.valueOf(currTime.toString()),startDate,"SampleDataCopy");

            }

//            Date start = DateUtils.addDays(DateUtils.truncate(new Date(), Calendar.DATE), beforDay);
//            //Date end = DateUtils.ceiling(start, Calendar.DATE);
//            Date end = DateUtils.truncate(new Date(), Calendar.DATE);
//            logger.info("START scheduled summaryData [{} ~ {})", ff.format(start), ff.format(end));
//
//            long day = TimeUnit.DAYS.convert(end.getTime()-start.getTime(),TimeUnit.MICROSECONDS);
//
//            Date start1 = start;
//
//            for(int i=0; i<day; i++ ) {
//
//                Date end1 = DateUtils.addDays(start1, 1);
//
//                try {
//                    batchTaskService.summaryData("System", start1, end1, fabsComponent.scheduleFabs(), Collections.EMPTY_SET, JOB_TYPE.SCHEDULER, "SCHEDULER");
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                } catch (ExecutionException e) {
//                    e.printStackTrace();
//                } catch (ParseException e) {
//                    e.printStackTrace();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//                start1 = DateUtils.addDays(start1, 1);
//
//            }
//            logger.info("END   scheduled summaryData [{} ~ {})", ff.format(start), ff.format(end));

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

    private HashMap<String, Object> sampleTraceTempWrite(String fabId, String eqp, String param_name, long toParamId) {

        //STDTraceDataMapper traceDataMapper =SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        //STDParamMapper paramMapper=SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String

        Date today = new Date();

        //System.out.println(dtString.format(today));

        String fab = fabId;
        String area_name = "Demo_Area";
        Double value = null;
        String data_type_cd = "RMS";


        //해당기간의 overall객체 생성
        //ParamWithCommonWithRpm paramWithCommonWithRpm=paramMapper.selectOne(toParamId);
        //eqp = paramWithCommonWithRpm.getEqp_name();
        //param_name = paramWithCommonWithRpm.getName();


        String sEvent_timestamp = dtString.format(today);


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

        String data = sEvent_timestamp + ',' + fab + ',' + area_name + ',' + eqp + ',' + param_name + ',' + data_type_cd + ',' + "0" + ',' + sValue + ',' + location + "\n";
        //String.format("%s,%s,%s,%s,%s,%s,%s",sEvent_timestamp,fab,area_name,
        this.createDirectory(directoryPath(fab, area_name, eqp));

        String filePath = filePath(fab, area_name, eqp);

        fileSinker.write(filePath, data);
        String key = fab + "," + area_name + "," + eqp;
        fileSinker.close(key, filePath);

//        this.createFile(filePath(fab,area_name,eqp));
//        BufferedOutputStream fw= null;
//
//        try{
//            fw=new BufferedOutputStream(new FileOutputStream(filePath(fab,area_name,eqp), true));
//            fw.write(data.getBytes());
//        }
//        catch(Exception e)
//        {
//            e.printStackTrace();
//        }
//        finally {
//            try {
//                fw.close();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }


        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }


    @Value("${schedule.sampleTraceWrite.enable}")
    private boolean schedulerEnableSampleTraceWrite;

    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron = "${schedule.sampleTraceWrite}")
    public void sampleTraceWrite() throws NoSuchMethodException {
        if (schedulerEnableSampleTraceWrite) {
            Date now = new Date();
            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            String currentTime = dtString.format(now);

            logger.info("Start   scheduled sampleTraceWrite(per 1Minute) " + currentTime);

            STDParamMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDParamMapper.class);
            STDEqpMapper eqpMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDEqpMapper.class);

            //Allen 2018-04-24
//            List<EqpWithEtc> eqps = eqpMapper.selectList(200L);
//            List<EqpWithEtc> eqps = eqpMapper.selectList4(200L);
//            List<EqpWithEtc> eqps = eqpMapper.selectList500(200L);
            List<EqpWithEtc> eqps = eqpMapper.selectList9(200L);
//            List<EqpWithEtc> eqps = eqpMapper.selectList500(200L);
            ArrayList<Long> eqpIds = new ArrayList<>();
            ArrayList<List<ParamWithCommonWithRpm>> params = new ArrayList<>();

            for (int i = 0; i < eqps.size(); i++) {// eqpId들을 리스트에 저장
                eqpIds.add(eqps.get(i).getEqp_id());
            }

            for (int j = 0; j < eqpIds.size(); j++) {
                params.add(paramDataMapper.selectList(eqpIds.get(j)));
            }

            int core = Runtime.getRuntime().availableProcessors();
            ExecutorService executor = Executors.newFixedThreadPool(core);

            for (int i = 0; i < eqpIds.size(); i++) {
                executor.execute(new TraceGeneratorRunnable(fileSinker, params.get(i), sessions));
            }

            executor.shutdown();
            try {
                if (!executor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS)) {
                    executor.shutdownNow();
                }
            } catch (Exception e) {
                executor.shutdownNow();
                e.printStackTrace();
            }
            logger.info("End   scheduled sampleTraceWrite(per 1Minute) " + currentTime);
        }

    }


    @Value("${schedule.sampleTraceRawWrite.enable}")
    private boolean schedulerEnableSampleTraceRawWrite;

    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron = "${schedule.sampleTraceRawWrite}")
    public void sampleTraceRawWrite() throws NoSuchMethodException {
        if (schedulerEnableSampleTraceRawWrite) {
            Date now = new Date();
            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            String currentTime = dtString.format(now);

            logger.info("Start scheduled sampleTraceRawWrite(per 10Minute)" + " " + currentTime);

            STDParamMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDParamMapper.class);
            STDEqpMapper eqpMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDEqpMapper.class);
            STDTraceDataMapper traceTrxMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDTraceDataMapper.class);

            //Allen 2018-04-24
            //List<EqpWithEtc> eqps = eqpMapper.selectList(200L);
//            List<EqpWithEtc> eqps = eqpMapper.selectList4(200L);
//            List<EqpWithEtc> eqps = eqpMapper.selectList500(200L);
//            List<EqpWithEtc> eqps = eqpMapper.selectList500(200L);
            List<EqpWithEtc> eqps = eqpMapper.selectList9(200L);
            ArrayList<Long> eqpIds = new ArrayList<>();
            ArrayList<List<ParamWithCommonWithRpm>> params = new ArrayList<>();

            for (int i = 0; i < eqps.size(); i++) {// eqpId들을 리스트에 저장
                eqpIds.add(eqps.get(i).getEqp_id());
            }

            for (int j = 0; j < eqpIds.size(); j++) {
                params.add(paramDataMapper.selectList(eqpIds.get(j)));
            }

            int core = Runtime.getRuntime().availableProcessors();
            ExecutorService executor = Executors.newFixedThreadPool(core);
            logger.info("Available Cores : {}", core);

//            Random random = new Random();
//            int sampleMin = 1;//sample_data테이블의 problem_Data칼럼중 가장작은 숫자
//            int sampleMax = 11;//sample_data테이블의 problem_data칼럼중 가장 큰 숫자


            STDTraceRawDataMapper traceRawDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDTraceRawDataMapper.class);

            for (int i = 0; (i < eqpIds.size()); i++) {

//                int sampleRawId = random.nextInt(sampleMax - sampleMin + 1) + sampleMin;
//
//
//                //get sample_trace_raw
//                List<MeasureTrx> measureTrxes = traceRawDataMapper.selectSampleTraceByRawId(sampleRawId);
//
//                int randomList = random.nextInt(measureTrxes.size());
//                MeasureTrx measureTrx = measureTrxes.get(randomList);
//                long orgmeasuretrxid = measureTrx.getMeasure_trx_id();
//
//                //Frequency==datatype1
//                MeasureTrxWithBin measureTrxWithBinFreq = traceRawDataMapper.selectSampleTraceWithBinById(0, orgmeasuretrxid);
//
//                MeasureTrxWithBin measureTrxWithBinTW = traceRawDataMapper.selectSampleTraceWithBinById(2, orgmeasuretrxid);


                //logger.info("{} job submitted.", i);
//                executor.execute(new TraceRawGeneratorRunnable(fileSinker, params.get(i), measureTrxes, measureTrxWithBinFreq, measureTrxWithBinTW));
                executor.execute(new TraceRawGeneratorRunnable(fileSinker, params.get(i),sessions));
            }

            executor.shutdown();
            try {
                if (!executor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS)) {
                    executor.shutdownNow();
                }
            } catch (Exception e) {
                executor.shutdownNow();
                e.printStackTrace();
            }

            logger.info("End scheduled sampleTraceRawWrite(per 10Minute)" + currentTime);

        }

    }

    private boolean skipEnveloping = false;
    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron ="0/1 * * * * *")
    public void schedulerMakeEnvelopingData() throws NoSuchMethodException {

        if(skipEnveloping==true) return;
        skipEnveloping = true;

//        STDTraceRawDataMapper traceRawDataMapper=SqlSessionUtil.getMapper(sessions, "fab1", STDTraceRawDataMapper.class);
//
//        MeasureTrxWithBin measureTrxWithBin=traceRawDataMapper.selectMeasureTrxWithBinById("F",0L);
//
//        byte[] binary = measureTrxWithBin.getBinary();
//
//        double[] dFreq = this.byteToDoubleArray(binary);
//
//        double max=dFreq[0];
//        int index=0;
//        int size=dFreq.length;
//        for(int i=1200; i<dFreq.length; i++)
//        {
//            dFreq[i-1200]=dFreq[i];
//            dFreq[i-800]=dFreq[i];
//            dFreq[i-400]=dFreq[i];
//        }
//        dFreq[320]=0.75;
//        dFreq[640]=0.75;
//        dFreq[960]=0.75;
//        dFreq[1280]=0.75;
//
//        for(int i=0; i<dFreq.length; i++)
//        {
//            if(dFreq[i]>max)
//            {
//                max=dFreq[i];
//            }
//
//            if(dFreq[i] == 0.75)
//            {
//                index=i;
//                System.out.println("index: "+index+","+ "value: "+ dFreq[i]+ "size: "+ size);
//
//            }
//
//        }
//
//        binary=this.doubleToByteArray(dFreq);
//        measureTrxWithBin.setBinary(binary);
//
//
//        System.out.println("최댓값: "+max+" index: "+index +"size: "+dFreq.length);
//        traceRawDataMapper.updateBinSpecOut(measureTrxWithBin);
////확인
//        measureTrxWithBin=traceRawDataMapper.selectMeasureTrxWithBinById("F",0L);
//
//        byte[] new_freq = measureTrxWithBin.getBinary();
//
//        double[] new_dFreq = this.byteToDoubleArray(new_freq);
//
//        for(int i=0; i<new_dFreq.length; i++)
//        {
//            if(new_dFreq[i]>max)
//            {
//                max=new_dFreq[i];
//
//            }
//
//            if(new_dFreq[i] == 0.75)
//            {
//                index=i;
//                System.out.println(index+",");
//
//            }
//
//        }

    }

    public byte[] doubleToByteArray(double[] doubleArray){

        int times = Double.SIZE / Byte.SIZE;
        byte[] bytes = new byte[doubleArray.length * times];
        for(int i=0;i<doubleArray.length;i++){
            ByteBuffer.wrap(bytes, i*times, times).putDouble(doubleArray[i]);
        }
        return bytes;
    }



}
