package com.bistel.pdm.scheduler.jobs;

import org.mybatis.spring.SqlSessionTemplate;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class AlarmAggregationJob extends QuartzJobBean {

    @Autowired
    private SqlSessionTemplate sqlSession;

    //@Autowired private TestTableMapper mapper;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {

    }
}
