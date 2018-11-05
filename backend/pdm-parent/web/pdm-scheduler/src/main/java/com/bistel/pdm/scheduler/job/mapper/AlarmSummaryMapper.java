package com.bistel.pdm.scheduler.job.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;

@Mapper
public interface AlarmSummaryMapper {

    void deleteSummarizedAlarm(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void insertSummarizedAlarm(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

}
