package com.bistel.a3.portal.service.pdm;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;

public interface IDataCollectService {
    @Transactional
    HashMap<String,Object> inserData(String fabId, long eqpId, long paramId, Date date, double[] timewave, long rpm, double samplingTime, int samplingCount);

    @Transactional
    HashMap<String, Object> copyData(String fabId, long fromParamId, long toParamId, Date fromDate, Date toDate, Date targetDate);

    ////// DELETE DATA ////////////
    @Transactional
    HashMap<String, Object> deleteData(String fabId, long paramId, Date fromDate, Date toDate);

    @Transactional(readOnly = true)
    @Scheduled(cron="${schedule.demoDataCopy}")
    void demoDataCopy() throws NoSuchMethodException;

    HashMap<String, Object> deleteAndCopy(String fabId, long paramId, Date fromDate, Date toDate, Date targetDate);

    HashMap<String, Object> demoDataCopyByEqp(String fabId, long fromEqpId, long toEapId, Date fromDate, Date toDate, Date targetDate);

    void sampleDataCopy() throws NoSuchMethodException;
    void sampleTraceWrite() throws NoSuchMethodException ;
    void sampleTraceRawWrite() throws NoSuchMethodException;
}
