package com.bistel.a3.portal.dao.pdm.std.trace;

import com.bistel.a3.portal.domain.common.FilterAggregation;
import com.bistel.a3.portal.domain.common.FilterCriteriaData;
import com.bistel.a3.portal.domain.common.FilterTraceRequest;
import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.OverallMinuteTrx;
import com.bistel.a3.portal.domain.pdm.db.Part;
import com.bistel.a3.portal.domain.pdm.db.STDTraceTrx;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface STDTraceDataMapper {


    List<HashMap<String,Object> >selectSpecByEqpId(@Param("eqp_id") Long eqp_id);

    @MapKey("eqp_id")
    Map<Long, Count> selectCountByDate(@Param("area_id") Long area_id, @Param("start") Date start, @Param("end") Date end);

    List<ParamVariance> selectParamVariance(@Param("eqp_id") Long eqp_id, @Param("baseStart") Date baseStart, @Param("baseEnd") Date baseEnd, @Param("now") Date now);

    List<OverallMinuteTrx> selectOverallMinuteTrxByParamId(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);

    void deleteOverallMinuteTrxByParamId(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);

    void insertOverallMinuteTrx(OverallMinuteTrx r);

//    void deleteOverallMinuteTrx(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);


    List<OverallMinuteTrx> selectSampleTraceByRawId(long sampleRawId);
    OverallMinuteTrx selectSampleTraceClosedTimeWithCurrentASC(long sampleRawId);
    OverallMinuteTrx selectSampleTraceClosedTimeWithCurrentDESC(long sampleRawId);

    void insertOverallMinuteTrxWithSpec(OverallMinuteTrx r);

    void deleteTraceTrxByParamId(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);

    void insertTraceTrx(STDTraceTrx stdTraceTrx);
    void insertTraceTrxBatch(List<STDTraceTrx> stdTraceTrxes);

    List<HashMap<String,Object>> selectTraceData(@Param("eqpId") Long eqpId,  @Param("start") Date start, @Param("end") Date end, @Param("normalizeType") String normalizeType);
    List<STDTraceTrx> selectTraceDataByParamIdDate(@Param("paramId") Long paramId,  @Param("date") Date date);

    List<HashMap<String,Object>>  selectTraceRPMByTraceId(@Param("trace_mst_rawid") Long trace_mst_rawid);
    List<HashMap<String,Object>>   selectPartRPMByTraceId(@Param("trace_mst_rawid") Long trace_mst_rawid);
    List<HashMap<String,Object>>   selectPartBearingByTraceId(@Param("trace_mst_rawid") Long trace_mst_rawid);


    List<HashMap<String,Object>> selectSample(@Param("eqpType") String eqpType,@Param("dataType") String dataType,@Param("problemType") String problemType);

    List<HashMap<String,Object>> selectFilterTraceData(@Param("eqpIds") List<Long> eqpIds,@Param("paramNames") List<String> paramNames,@Param("start") Date start, @Param("end") Date end);
    List<HashMap<String,Object>> selectEqpIdsParamIdsInFilterTraceData(@Param("eqpIds") List<Long> eqpIds,@Param("paramNames") List<String> paramNames,@Param("start") Date start, @Param("end") Date end,@Param("filterDatas") List<FilterCriteriaData> filterDatas);
    List<STDTraceTrx> selectFilterTraceDataByEqpIdParamNames(@Param("eqpId") Long eqpId,@Param("paramIds") List<Long> paramNames,@Param("start") Date start, @Param("end") Date end);
    List<STDTraceTrx> selectFilterTraceDataByEqpIdParamId(@Param("eqpId") Long eqpId,@Param("paramId") Long paramId,@Param("start") Date start, @Param("end") Date end,@Param("filterDatas") List<FilterCriteriaData> filterDatas);
    List<STDTraceTrx> selectFilterTraceDataByEqpIdParamIdWithAggregation(@Param("eqpId") Long eqpId, @Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end, @Param("filterDatas") List<FilterCriteriaData> filterDatas,@Param("aggregationData") FilterAggregation aggregationData);


    List<HashMap<String,Object>> selectFilterTraceDataByEqpIdWithAggregation(@Param("eqpId") Long eqpId,@Param("start") Date start, @Param("end") Date end,@Param("filterDatas") List<FilterCriteriaData> filterDatas,@Param("aggregationData") FilterAggregation aggregationData);

    List<HashMap<String,Object>> selectTraceAggregationByEvent(@Param("paramId") Long paramId,@Param("start") Date start, @Param("end") Date end,@Param("eventType") String eventType, @Param("adHocTime") Integer adHocTime);
}


