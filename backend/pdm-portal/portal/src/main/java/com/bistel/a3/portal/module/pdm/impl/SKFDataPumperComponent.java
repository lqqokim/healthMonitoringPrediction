package com.bistel.a3.portal.module.pdm.impl;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.dao.pdm.db.SKFPumpMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.master.ParamMapper;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.module.pdm.IDataPumperComponent;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class SKFDataPumperComponent implements IDataPumperComponent {
    private static Logger logger = LoggerFactory.getLogger(SKFDataPumperComponent.class);

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Override
    public void dataPumpBase(String fabId, String regacyName) throws NoSuchMethodException {
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
        pump(EqpEtc.class, getMapper, putMapper, manager);
        //Param
        pump(Param.class, getMapper, putMapper, manager);
        //ParamWithCommon
        pump(ParamWithCommon.class, getMapper, putMapper, manager);
        //ManualRpm
        pump(ManualRpm.class, getMapper, putMapper, manager);
        //Part
        pump(Part.class, getMapper, putMapper, manager);
        //OverallSpec
        pump(OverallSpec.class, getMapper, putMapper, manager);
    }

    @Override
    public void dataPump(String fabId, String regacyName, Date from, Date to, Long eqpId) throws NoSuchMethodException {
        SKFPumpMapper getMapper = SqlSessionUtil.getMapper(sessions, regacyName, SKFPumpMapper.class);
        SKFPumpMapper putMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);

        /* transaction */
        //EqpAlarmTrx
        pump(EqpAlarmTrx.class, getMapper, putMapper, manager, from, to, eqpId);
        //AlarmTrx
        pump(AlarmTrx.class, getMapper, putMapper, manager, from, to, eqpId);
        //MeasureTrx
        pump(MeasureTrx.class, getMapper, putMapper, manager, from, to, eqpId);
        //MeasureTrxBin
        pump(MeasureTrxBin.class, getMapper, putMapper, manager, from, to, eqpId);

        //OverallMinuteTrx
        ParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        List<Param> paramList = paramMapper.selectByEqpId(eqpId);
        pumpOverall(getMapper, putMapper, manager, from, to, paramList);
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

                    if (alarmTrx.getStatus_cd()==256 && alarmTrx.getAlarm() != null) {
                        alarmCount++;
                        alarmSum += alarmTrx.getAlarm();
                    } else if (alarmTrx.getStatus_cd()==128 && alarmTrx.getWarn() != null) {
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
                Double alarm = null,warning =null;

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
                        warning =  alarm * overallSpec.getWarn() / overallSpec.getAlarm();
                    }
                    alarmTrxSum.setWarn(warning);
                }

                Date startDate = alarmTrxSum.getAlarm_dtts();
                Date endDate = DateUtil.add(startDate,Calendar.DATE,1);

                putMapper.updateOverallMinuteTrxByPDM(param.getParam_id(),startDate,endDate,alarm,warning);
            }
        }
    }

    private Double getAlarmValueByNear(List<AlarmTrx> datasSummary, int i,String type) {
        AlarmTrx alarmTrx = datasSummary.get(i);
        int iPos =1;

        for (int j = i; j >=0; j--) {
            AlarmTrx tempAlarmTrx = datasSummary.get(j);
            Double value = null;
            if(type.equals("alarm")){
                value = tempAlarmTrx.getAlarm();
            }else{
                value = tempAlarmTrx.getWarn();
            }
            if(value!=null){
                return value;
            }
        }

        for (int j = i+1; j < datasSummary.size(); j++) {
            AlarmTrx tempAlarmTrx = datasSummary.get(j);
            Double value = null;
            if(type.equals("alarm")){
                value = tempAlarmTrx.getAlarm();
            }else{
                value = tempAlarmTrx.getWarn();
            }
            if(value!=null){
                return value;
            }
        }

        return null;
    }

    private void pumpOverall(SKFPumpMapper getMapper, SKFPumpMapper putMapper, PlatformTransactionManager manager, Date from, Date to, List<Param> paramList) {
        for(Param param : paramList) {
            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
            try {
                Long paramId = param.getParam_id();
                List<OverallMinuteTrx> list = getMapper.selectOverallMinuteTrxByParamId(paramId, from, to);
                putMapper.deleteOverallMinuteTrxByParamId(paramId, from, to);

                //중간에 Data가져 오는 일은 거의 없다고 보고 현재 Spec값을 입력
                OverallSpec overallSpec = putMapper.selectOverallSpecByPdM(paramId);

                for(OverallMinuteTrx l : list) {
                    try {
                        l.setAlarm(overallSpec.getAlarm());
                        l.setWarn(overallSpec.getWarn());
                        putMapper.insertOverallMinuteTrx(l);
                    } catch (DuplicateKeyException e) {
                        logger.info("{}, {}", l, e.getMessage());
                    }
                }
                manager.commit(status);
            } catch (Exception e) {
                manager.rollback(status);
                Throwable ee = e.getCause();
                logger.error("{}, {}", param, ee == null ? e.getMessage() : ee.getMessage());
            }
        }
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

            for(int i=0; i<list.size(); i++) {
                t = list.get(i);

                try {
                    insert.invoke(putMapper, t);
                } catch (InvocationTargetException ie) {
                    Throwable iee = ie.getTargetException();
                    if(iee instanceof DuplicateKeyException) {
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

            for(int i=0; i<list.size(); i++) {
                t = list.get(i);

                try {
                    insert.invoke(putMapper, t);
                } catch (InvocationTargetException ie) {
                    Throwable iee = ie.getTargetException();
                    if(iee instanceof DuplicateKeyException) {
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
