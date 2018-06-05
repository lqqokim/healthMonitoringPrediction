package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.Count;
import com.bistel.a3.portal.domain.pdm.ParamVariance;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrxBin;
import com.bistel.a3.portal.domain.pdm.db.OverallMinuteTrx;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface OverallMinuteTrxMapper {
    List<HashMap<String,Object> >selectSpecByEqpId(@Param("eqp_id") Long eqp_id);

    @MapKey("eqp_id")
    Map<Long, Count> selectCountByDate(@Param("area_id") Long area_id, @Param("start") Date start, @Param("end") Date end);

    List<ParamVariance> selectParamVariance(@Param("eqp_id") Long eqp_id, @Param("baseStart") Date baseStart, @Param("baseEnd") Date baseEnd, @Param("now") Date now);

    List<OverallMinuteTrx> selectOverallMinuteTrxByParamId(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);

    void deleteOverallMinuteTrxByParamId(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);

    void insertOverallMinuteTrx(OverallMinuteTrx r);

    void deleteOverallMinuteTrx(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);

    List<OverallMinuteTrx> selectSampleTraceByRawId(@Param("problem_data_rawid") Long problem_data_rawid);

    void insertSampleTrace(OverallMinuteTrx r);

}
