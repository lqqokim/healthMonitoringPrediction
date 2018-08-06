package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.BatchJobHst;
import com.bistel.a3.portal.enums.JOB_TYPE;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;

public interface IBatchTaskService {
    void dataPumpBase(Set<String> fabs, Date date, JOB_TYPE jobFrom, String userId) throws NoSuchMethodException;

    void dataPump(Date from, Date to, Set<String> fabs, JOB_TYPE jobFrom, String userId) throws NoSuchMethodException;

    void summaryData(String userName,Date from, Date to, Set<String> fabs, Set<Long> eqpIds, JOB_TYPE jobFrom, String userId) throws InterruptedException, ExecutionException, ParseException, IOException;

    void summaryRealTimeData(String userName,Date from, Date to, Set<String> fabs, Set<Long> eqpIds, JOB_TYPE jobFrom, String userId) throws InterruptedException, ExecutionException, ParseException, IOException;

    void createFeature(Date from, Date to, Set<String> fabs);

    void createPartition(Date from, int count, Set<String> fabs, JOB_TYPE jobStart);

    List<BatchJobHst> getJobHst(String fab, Date start, Date end, JOB_TYPE jobFrom);

    void alarmUpdate(Date date, Date ceiling, Set<String> fabs, JOB_TYPE manual, String name) throws NoSuchMethodException;

    void summaryHealthSTDSPC(Set<String> fabs, Date from, Date to) ;

    void summaryHealthDiff(Set<String> fabs, Date from, Date to);

    void summaryHealthRUL(Set<String> fabs, Date from, Date to);

    void deleteHealthDailySum(Set<String> fabs, Date start, Date end);

    void deleteEqpAlarmDailySum(Set<String> fabs, Date from, Date to);

    void summaryEqpAlarmDaily(Set<String> fabs, Date from, Date to);

    void summaryParamHealthRUL(Set<String> fabs,Date rulFrom, Date from, Date to);

    void deleteParamHealthRUL(Set<String> fabs, Date from, Date to);



}
