package com.bistel.a3.portal.service.pdm.impl.ulsan;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.dao.pdm.db.SKFPumpMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDParamMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceDataMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.MeasureTrxMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.OverallMinuteTrxMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.ParamDataMapper;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrxBin;
import com.bistel.a3.portal.domain.pdm.db.OverallMinuteTrx;
import com.bistel.a3.portal.domain.pdm.db.Param;
import com.bistel.a3.portal.domain.pdm.work.MeasureTrxWithBin;
import com.bistel.a3.portal.enums.JOB_TYPE;
import com.bistel.a3.portal.module.pdm.FabsComponent;
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

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;

import static com.bistel.a3.portal.util.frequencyData.FrequencyUtil.*;

@Service
@ConditionalOnExpression("!${run.standard}")
public class DataCollectService implements IDataCollectService {
    private static Logger logger = LoggerFactory.getLogger(DataCollectService.class);

    private static FastDateFormat ff = FastDateFormat.getDateInstance(DateFormat.LONG);

    @Autowired
    private FabsComponent fabsComponent;

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private BatchTaskService batchTaskService;

    @Override
    @Transactional
    public HashMap<String,Object> inserData(String fabId, long eqpId, long paramId, Date date, double[] timewave, long rpm, double samplingTime, int samplingCount){
        SKFPumpMapper pumpMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);

        MeasureTrxMapper measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);

        HashMap<String,Object> result=new HashMap<>();
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
            measureTrx.setEnd_freq((long)(samplingCount / 2.0 / samplingTime));
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


        }catch(Exception err){
            result.put("result","fail");
            result.put("data",err.getMessage());
            return result;
        }
        result.put("result","success");
        result.put("data","");
        return result;
    }

    @Override
    @Transactional
    public HashMap<String, Object> copyData(String fabId, long fromParamId, long toParamId, Date fromDate, Date toDate, Date targetDate) {

        OverallMinuteTrxMapper overallMinuteTrxMapper=SqlSessionUtil.getMapper(sessions, fabId, OverallMinuteTrxMapper.class);

        MeasureTrxMapper measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        //SKFPumpMapper skfPumpMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);


        ////////////////////////////////////////////////////////////////////////////////////
        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        //milli까지 표현되는 fromdata, todata
        Date newFromDate=null;
        Date newToDate=null;
        Date newTargetDate=null;

        String sFromDate=dtString.format(fromDate);
        sFromDate+=" 00:00:00";
        try {
            newFromDate= dtDate.parse(sFromDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sToDate=dtString.format(toDate);
        sToDate+=" 00:00:00";
        try {
            newToDate= dtDate.parse(sToDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sTargetDate=dtString.format(targetDate);
        sTargetDate+=" 00:00:00";
        try {
            newTargetDate= dtDate.parse(sTargetDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        ///////////////////////////////////////////////////////////////////////////////////////////

        //long gapFromDateToDate=toDate.getTime()-fromDate.getTime();//FromDate와 TargetDate의 차이 값
        long gapTargetDateFromDate=newTargetDate.getTime()-newFromDate.getTime();//TargetDate와 FromDate의 차이값

        //get overall_minute_trx_pdm
        List<OverallMinuteTrx> overallMinuteTrxes=overallMinuteTrxMapper.selectOverallMinuteTrxByParamId(fromParamId,newFromDate,newToDate);
        //해당기간의 overall객체 생성

        //put overall_minute_trx_pdm
        for (int i = 0; i < overallMinuteTrxes.size(); i++) {

            OverallMinuteTrx overallMinuteTrx = overallMinuteTrxes.get(i);

            long newMillTime=overallMinuteTrx.getRead_dtts().getTime()+gapTargetDateFromDate;
            Date newOverallTime=DateUtil.createDate(newMillTime);

            overallMinuteTrx.setRead_dtts(newOverallTime);
            overallMinuteTrx.setParam_id(toParamId);
            logger.debug("overallminute value: "+overallMinuteTrx.toString());
            overallMinuteTrxMapper.insertOverallMinuteTrx(overallMinuteTrx);

        }


        //get measure_trx_pdm
        List<MeasureTrx> measureTrxes= measureTrxMapper.selectMeasureTrxWithSpec(fromParamId,newFromDate,newToDate);
        //put measure_trx_pdm
        for (int i = 0; i < measureTrxes.size(); i++) {

            MeasureTrx measureTrx=measureTrxes.get(i);
            long orgmeasuretrxid=measureTrx.getMeasure_trx_id();
           long newMillTime= measureTrx.getMeasure_dtts().getTime()+gapTargetDateFromDate;
           Date newMeasureMillTime=DateUtil.createDate(newMillTime);

           long trxId=measureTrxMapper.selectMaxMeasureTrxId();



            measureTrx.setMeasure_trx_id(trxId+1);
            measureTrx.setMeasure_dtts(newMeasureMillTime);
            measureTrx.setParam_id(toParamId);

           measureTrxMapper.insertMeasureTrx(measureTrx);

            //typecd 1
            MeasureTrxWithBin measureTrxWithBin=measureTrxMapper.selectMeasureTrxWithBinById(0,orgmeasuretrxid);
            MeasureTrxBin measureTrxBin=new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("0");
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            measureTrxBin.setBinary(measureTrxWithBin.getBinary());
            measureTrxBin.setScale_factor(measureTrxWithBin.getScale_factor());

            measureTrxMapper.insertMeasureTrxBin(measureTrxBin);

            //typecd 2
            measureTrxWithBin=measureTrxMapper.selectMeasureTrxWithBinById(2,orgmeasuretrxid);
            measureTrxBin=new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("2");
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            measureTrxBin.setBinary(measureTrxWithBin.getBinary());
            measureTrxBin.setScale_factor(measureTrxWithBin.getScale_factor());

            measureTrxMapper.insertMeasureTrxBin(measureTrxBin);
        }

        //get measure_trx_bin_pdm
        //measureTrxMapper.selectMeasureTrxWithBinById()


        //change measureId
        //put measure_trx_pdm
        //put measure_trx_bin_pdm

        HashMap<String,Object> result=new HashMap<>();
        result.put("result","success");
        result.put("data","");
        return result;

    }


    ////// DELETE DATA ////////////
    @Override
    @Transactional
    public HashMap<String, Object> deleteData(String fabId, long paramId, Date fromDate, Date toDate) {

        OverallMinuteTrxMapper overallMinuteTrxMapper=SqlSessionUtil.getMapper(sessions, fabId, OverallMinuteTrxMapper.class);
        MeasureTrxMapper measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);

        //delete overall_minute_trx_pdm
        Date TomorrowToDate=DateUtils.addDays(toDate, 1);

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        //milli까지 표현되는 fromdata, todata
        Date newFromDate=null;
        Date newToDate=null;

        String sFromDate=dtString.format(fromDate);
        sFromDate+=" 00:00:00";
        try {
            newFromDate= dtDate.parse(sFromDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sToDate=dtString.format(TomorrowToDate);
        sToDate+=" 00:00:00";
        try {
            newToDate= dtDate.parse(sToDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        //delete overall_trx_pdm
        overallMinuteTrxMapper.deleteOverallMinuteTrxByParamId(paramId,newFromDate,newToDate);

        //delete measure_trx_bin_pdm
        measureTrxMapper.deleteMeasureTrxBinbyParamId(paramId,newFromDate,newToDate);

        //delete measure_trx_pdm
        measureTrxMapper.deleteMeasureTrxbyParamId(paramId,newFromDate,newToDate);
        //
        HashMap<String,Object> result=new HashMap<>();
        result.put("result","success");
        result.put("data","");
        return result;
    }

    ///////////////////////////////

    @Value("${schedule.demoDataCopy.enable}")
    private boolean schedulerEnableDemoDataCopy;
    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron="${schedule.demoDataCopy}")
    public void demoDataCopy() throws NoSuchMethodException {
        if(schedulerEnableDemoDataCopy)
        {
            ParamDataMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", ParamDataMapper.class);

            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            Date start=DateUtils.addDays(new Date(), -180);

            String sStart=dtString.format(start);
            sStart+=" 00:00:00";
            try {
                start= dtDate.parse(sStart);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            Date end = DateUtils.addDays(start, 1);
            //Allen
            Date target=DateUtils.addDays(new Date(), -1);
            String sTarget=dtString.format(target);
            sTarget+=" 00:00:00";
            try {
                target= dtDate.parse(sTarget);
            } catch (ParseException e) {
                e.printStackTrace();
            }
            //
            List<Param> params=paramDataMapper.selectParamByEqp(2190L);

            logger.info("START scheduled demoDataCopy [{} ~ {})", ff.format(start), ff.format(end));

            for (int i = 0; i < params.size(); i++)
            {
                deleteAndCopy("fab1", params.get(i).getParam_id(),start, end, target);
            }

            //warning

            sStart="2018-03-25 00:00:00";
            try {
                start= dtDate.parse(sStart);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            end = DateUtils.addDays(start, 1);

            //copyData("fab1", 83,start, end, target);
            deleteAndCopy("fab1", 83,start, end, target);//83번 param의 과거데이터를 현재데이터로 끌고 오기
            //Alarm
            sStart="2018-03-25 00:00:00";
            try {
                start= dtDate.parse(sStart);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            end = DateUtils.addDays(start, 1);

            deleteAndCopy("fab1", 2182,start, end, target);

            logger.info("END   scheduled demoDataCopy [{} ~ {})", ff.format(start), ff.format(end));
        }


    }


    @Override
    public HashMap<String, Object> deleteAndCopy(String fabId, long paramId, Date fromDate, Date toDate, Date targetDate) {

        ParamDataMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", ParamDataMapper.class);

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        //Date newDeleteFrom=targetDate ; //+" 00:00:00"
        //Date newDeleteTo = null;// newDateFrom + ((toDate +" 23:59:59") - (fromDate+" 00:00:00")  ==> 몇일 만 사용)

        Date newDeleteFrom=null;
        Date newDeleteTo=null;
        Date newFromDate=null;

        String sTargetDate=dtString.format(targetDate);
        sTargetDate+=" 00:00:00";
        try {
            newDeleteFrom= dtDate.parse(sTargetDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sToDate=dtString.format(toDate);
        sToDate+=" 23:59:59";
        try {
            newDeleteTo= dtDate.parse(sToDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sFromDate=dtString.format(fromDate);
        sFromDate+=" 00:00:00";
        try {
            newFromDate= dtDate.parse(sFromDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        long millnewDeleteTo=(newDeleteTo.getTime()-newFromDate.getTime())+newDeleteFrom.getTime();

        Date DeleteTo=DateUtil.createDate(millnewDeleteTo);

        this.deleteData(fabId,paramId,newDeleteFrom,DeleteTo);
        this.copyData(fabId,paramId,paramId,fromDate,toDate,targetDate);

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


    @Override
    public HashMap<String, Object> demoDataCopyByEqp(String fabId, long fromEqpId, long toEapId, Date fromDate, Date toDate, Date targetDate) {


            //getparams
            ParamDataMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", ParamDataMapper.class);
            List<Param> fromParams = paramDataMapper.selectParamByEqp(fromEqpId);//DEMO1 EQP의 Param정보를 가져옴
            List<Param> toParams = paramDataMapper.selectParamByEqp(toEapId);//Test01 EQP의 Param정보를 가져옴

            long fromParamId=0;
            long toParamId=0;

            for (int i = 0; i < fromParams.size(); i++) {

                fromParamId=fromParams.get(i).getParam_id();//Demo1의 Param한개
                toParamId=toParams.get(i).getParam_id(); //Test1의 Param한개

                copyData(fabId,fromParamId, toParamId, fromDate, toDate, targetDate);
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

//    @Value("${schedule.sampleTraceWrite.enable}")
//    private boolean schedulerEnableSampleTraceWrite;
    @Override
//    @Transactional(readOnly = true)
//    @Scheduled(cron="${schedule.sampleTraceWrite}")
    public void sampleTraceWrite() throws NoSuchMethodException {
//        if(schedulerEnableSampleTraceWrite)
//        {
//        Date now=new Date();
//        SimpleDateFormat dtString=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//
//        String currentTime=dtString.format(now);
//
//        logger.info("Start   scheduled sampleTraceWrite(per 1Minute)"+currentTime);
//
//        STDParamMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDParamMapper.class);
//
//        List<Param> demo1Params=paramDataMapper.selectByEqpId(2190L);
//        List<Param> demo2Params=paramDataMapper.selectByEqpId(2453L);
//        List<Param> demo3Params=paramDataMapper.selectByEqpId(2454L);
//        List<Param> demo4Params=paramDataMapper.selectByEqpId(2455L);
//
//
//        Random random=new Random();
//
//
//        int sampleMin=1;//sample_data테이블의 problem_Data칼럼중 가장작은 숫자
//        int sampleMax=11;//sample_data테이블의 problem_data칼럼중 가장 큰 숫자
//        int sampleRandom=random.nextInt(sampleMax-sampleMin+1)+sampleMin;
//
//        for (int i = 0; i < demo1Params.size(); i++) {
//            this.sampleTraceWrite("fab1", sampleRandom, demo1Params.get(i).getParam_id());
//        }
//
//        for (int i = 0; i < demo2Params.size(); i++) {
//            this.sampleTraceWrite("fab1", sampleRandom, demo2Params.get(i).getParam_id());
//        }
//
//        for (int i = 0; i < demo3Params.size(); i++) {
//            this.sampleTraceWrite("fab1", sampleRandom, demo3Params.get(i).getParam_id());
//        }
//
//        for (int i = 0; i < demo4Params.size(); i++) {
//            this.sampleTraceWrite("fab1", sampleRandom, demo4Params.get(i).getParam_id());
//        }
//
//        logger.info("End   scheduled sampleTraceWrite(per 1Minute)"+currentTime);
////        }

    }


//    @Value("${schedule.sampleTraceRawWrite.enable}")
//    private boolean schedulerEnableSampleTraceRawWrite;
    @Override
//    @Transactional(readOnly = true)
//    @Scheduled(cron="${schedule.sampleTraceRawWrite}")
    public void sampleTraceRawWrite() throws NoSuchMethodException {
//        if(schedulerEnableSampleTraceRawWrite)
//        {
//            Date now=new Date();
//            SimpleDateFormat dtString=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//
//            String currentTime=dtString.format(now);
//
//            logger.info("Start   scheduled sampleTraceRawWrite(per 10Minute)"+currentTime);
//
//            STDParamMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDParamMapper.class);
//
//            List<Param> demo1Params=paramDataMapper.selectByEqpId(2190L);
//            List<Param> demo2Params=paramDataMapper.selectByEqpId(2453L);
//            List<Param> demo3Params=paramDataMapper.selectByEqpId(2454L);
//            List<Param> demo4Params=paramDataMapper.selectByEqpId(2455L);
//
//
//            Random random=new Random();
//
//            int sampleMin=1;
//            int sampleMax=11;
//            int sampleRandom=random.nextInt(sampleMax-sampleMin+1)+sampleMin;
//
//            for (int i = 0; i < demo1Params.size(); i++) {
//                this.sampleTraceRawWrite("fab1", sampleRandom, demo1Params.get(i).getParam_id());
//            }
//
//            for (int i = 0; i < demo2Params.size(); i++) {
//                this.sampleTraceRawWrite("fab1", sampleRandom, demo2Params.get(i).getParam_id());
//            }
//
//            for (int i = 0; i < demo3Params.size(); i++) {
//                this.sampleTraceRawWrite("fab1", sampleRandom, demo3Params.get(i).getParam_id());
//            }
//
//            for (int i = 0; i < demo4Params.size(); i++) {
//                this.sampleTraceRawWrite("fab1", sampleRandom, demo4Params.get(i).getParam_id());
//            }
//
//            logger.info("End   scheduled sampleTraceRawWrite(per 10Minute)"+currentTime);
//
//        }

    }


    private HashMap<String, Object> sampleDeleteAndCopy(String fabId,long sampleRawId, long ParamId, Date fromDate, Date toDate, Date targetDate) {

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        //Date newDeleteFrom=targetDate ; //+" 00:00:00"
        //Date newDeleteTo = null;// newDateFrom + ((toDate +" 23:59:59") - (fromDate+" 00:00:00")  ==> 몇일 만 사용)

        Date newDeleteFrom=null;
        Date newDeleteTo=null;
        Date newFromDate=null;

        String sTargetDate=dtString.format(targetDate);
        sTargetDate+=" 00:00:00";
        try {
            newDeleteFrom= dtDate.parse(sTargetDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sToDate=dtString.format(toDate);
        sToDate+=" 23:59:59";
        try {
            newDeleteTo= dtDate.parse(sToDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String sFromDate=dtString.format(fromDate);
        sFromDate+=" 00:00:00";
        try {
            newFromDate= dtDate.parse(sFromDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        long millnewDeleteTo=(newDeleteTo.getTime()-newFromDate.getTime())+newDeleteFrom.getTime();

        Date DeleteTo=DateUtil.createDate(millnewDeleteTo);

        this.deleteData(fabId,ParamId,newDeleteFrom,DeleteTo);
        this.sampleDataCopy(fabId,sampleRawId,ParamId,targetDate);

        return null;
    }

    //Allen Sample_Data에서 매일 하루치씩 데이터 끌고오기
    private HashMap<String, Object> sampleDataCopy(String fabId, long sampleRawId, long toParamId, Date targetDate) {


        STDTraceDataMapper overallMinuteTrxMapper=SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);

        MeasureTrxMapper measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);

        SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //Date -->String
        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //String --> Date


        //get sample_trace
        List<OverallMinuteTrx> overallMinuteTrxes=overallMinuteTrxMapper.selectSampleTraceByRawId(sampleRawId);
        //해당기간의 overall객체 생성

        Date newTargetDate=null;

        //put sample_trace
        for (int i = 0; i < overallMinuteTrxes.size(); i++) {

            OverallMinuteTrx overallMinuteTrx = overallMinuteTrxes.get(i);

            //long newMillTime=overallMinuteTrx.getRead_dtts().getTime()+gapTargetDateFromDate;
            //Date newOverallTime=DateUtil.createDate(newMillTime);

            Date originDate=overallMinuteTrx.getRead_dtts();

            String sOriginDate=dtString.format(originDate); //String 1970.01.01 12:34:56
            String sOriginTime[]=sOriginDate.split(" ");//String

            String sTargetDate=dtString.format(targetDate);
            String sDate[]=sTargetDate.split(" ");

            String sNewTargetDate=sDate[0]+" "+sOriginTime[1];

            try {
                newTargetDate=dtDate.parse(sNewTargetDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            overallMinuteTrx.setRead_dtts(newTargetDate);
            logger.debug("sampletrace value: "+overallMinuteTrx.toString());
            overallMinuteTrx.setParam_id(toParamId);

            //overallMinuteTrxMapper.insertOverallMinuteTrx(overallMinuteTrx);
            overallMinuteTrxMapper.insertOverallMinuteTrxWithSpec(overallMinuteTrx);
        }


        //get sample_trace_raw
        List<MeasureTrx> measureTrxes= measureTrxMapper.selectSampleTraceByRawId(sampleRawId);



        //put measure_trx_pdm
        for (int i = 0; i < measureTrxes.size(); i++)
        {

            MeasureTrx measureTrx=measureTrxes.get(i);
            long orgmeasuretrxid=measureTrx.getMeasure_trx_id();
            //
            Date originDate=measureTrx.getMeasure_dtts();

            String sOriginDate=dtString.format(originDate); //String 1970.01.01 12:34:56
            String sOriginTime[]=sOriginDate.split(" ");//String

            String sTargetDate=dtString.format(targetDate);
            String sDate[]=sTargetDate.split(" ");

            String sNewTargetDate=sDate[0]+" "+sOriginTime[1];

            try {
                newTargetDate=dtDate.parse(sNewTargetDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }
            //

            long trxId=measureTrxMapper.selectMaxMeasureTrxId();

            measureTrx.setMeasure_trx_id(trxId+1);
            measureTrx.setMeasure_dtts(newTargetDate);
            measureTrx.setParam_id(toParamId);

            measureTrxMapper.insertMeasureTrx(measureTrx);

            //typecd 1
            MeasureTrxWithBin measureTrxWithBin=measureTrxMapper.selectSampleTraceWithBinById(0,orgmeasuretrxid);
            MeasureTrxBin measureTrxBin=new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("0");
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            measureTrxBin.setBinary(measureTrxWithBin.getBinary());
            measureTrxBin.setScale_factor(measureTrxWithBin.getScale_factor());

            measureTrxMapper.insertMeasureTrxBin(measureTrxBin);


            //typecd 2
            measureTrxWithBin=measureTrxMapper.selectMeasureTrxWithBinById(2,orgmeasuretrxid);
            measureTrxBin=new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("2");
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            measureTrxBin.setBinary(measureTrxWithBin.getBinary());
            measureTrxBin.setScale_factor(measureTrxWithBin.getScale_factor());

            measureTrxMapper.insertMeasureTrxBin(measureTrxBin);

        }

        HashMap<String,Object> result=new HashMap<>();
        result.put("result","success");
        result.put("data","");
        return result;

    }

    @Value("${schedule.sampleDataCopy.enable}")
    private boolean schedulerEnableSampleDataCopy;
    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron="${schedule.sampleDataCopy}")
    public void sampleDataCopy() throws NoSuchMethodException {
        if(schedulerEnableSampleDataCopy)
        {
            ParamDataMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", ParamDataMapper.class);


            SimpleDateFormat dtString = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            Date yesterday=DateUtils.addDays(new Date(), -1);//yesterday

            String sStart=dtString.format(yesterday);
            sStart+=" 00:00:00";
            try {
                yesterday= dtDate.parse(sStart);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            Date today = new Date();//today


            //Demo1 => 1 misalignment_alarm
            //Demo2 => 4 misalignment_alarm
            //Demo3 => 3 Alarm
            //Demo4 => Normal

            List<Param> demo1Params=paramDataMapper.selectParamByEqp(2190L);
            List<Param> demo2Params=paramDataMapper.selectParamByEqp(2453L);
            List<Param> demo3Params=paramDataMapper.selectParamByEqp(2454L);
            List<Param> demo4Params=paramDataMapper.selectParamByEqp(2455L);

            logger.info("START scheduled sampleDataCopy [{} ~ {})", ff.format(yesterday), ff.format(today));

            //misalignment_alarm
            for (int i = 0; i < demo1Params.size(); i++)
            {
                if (i==0)
                {
                    sampleDeleteAndCopy("fab1",1, demo1Params.get(i).getParam_id(), yesterday , today, yesterday);
                }
                else
                {
                    sampleDeleteAndCopy("fab1",9, demo1Params.get(i).getParam_id(), yesterday , today, yesterday);
                }

            }
            logger.info("scheduled sampleDataCopy 25% [{} ~ {})", ff.format(yesterday), ff.format(today));
            //unbalance_warning
            for (int i = 0; i < demo2Params.size(); i++)
            {
                if (i==1)
                {
                    sampleDeleteAndCopy("fab1",4, demo2Params.get(i).getParam_id(), yesterday , today, yesterday);
                }
                else
                {
                    sampleDeleteAndCopy("fab1",9, demo2Params.get(i).getParam_id(), yesterday , today, yesterday);
                }
            }
            logger.info("scheduled sampleDataCopy 50% [{} ~ {})", ff.format(yesterday), ff.format(today));
            //Oiling_alarm
            for (int i = 0; i < demo3Params.size(); i++)
            {
                if (i==2)
                {
                    sampleDeleteAndCopy("fab1",5, demo3Params.get(i).getParam_id(), yesterday , today, yesterday);
                }
                else
                {
                    sampleDeleteAndCopy("fab1",10, demo3Params.get(i).getParam_id(), yesterday , today, yesterday);
                }
            }
            logger.info("scheduled sampleDataCopy 75% [{} ~ {})", ff.format(yesterday), ff.format(today));
            //normal
            for (int i = 0; i < demo4Params.size(); i++)
            {
                sampleDeleteAndCopy("fab1",11, demo4Params.get(i).getParam_id(), yesterday , today, yesterday);
            }

            logger.info("END   scheduled sampleDataCopy [{} ~ {})", ff.format(yesterday), ff.format(today));
        }

    }

}
