package com.bistel.pdm.scheduler.job.mapper;

import com.bistel.pdm.scheduler.domain.ParamHealthInfo;
import com.bistel.pdm.scheduler.domain.ParamRULSummary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

@Mapper
public interface HealthSummaryMapper {

    void deleteSummarizedHealth(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void insertSummarizedHealth(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void insertSummarizedHealthDiff(@Param("fromdate") String fromdate, @Param("todate") String todate);

    void deleteParamHealthRUL(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<ParamRULSummary> selectRULSummary(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    ParamHealthInfo selectHealthInfo(@Param("param_id") Long param_id);

    void insertParamHealthRULTRX(@Param("param_health_mst_rawid") Long param_health_mst_rawid,
                                 @Param("intercept") Double intercept, @Param("slope") Double slope,
                                 @Param("xvalue") Double xvalue, @Param("create_dtts") Date create_dtts);

    void insertSummaryHealthRUL(@Param("eqp_mst_rawid") Long eqp_mst_rawid,
                                @Param("param_health_mst_rawid") Long param_health_mst_rawid,
                                @Param("score") Double score, @Param("fromdate") Date fromdate);

}
