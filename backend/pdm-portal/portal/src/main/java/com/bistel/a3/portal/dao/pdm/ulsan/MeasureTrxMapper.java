package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.RpmWithPart;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrxBin;
import com.bistel.a3.portal.domain.pdm.work.MeasureTrxWithBin;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

public interface MeasureTrxMapper {
    List<MeasureTrxWithBin> selectMeasureTrxWithRaw(@Param("start") Date start, @Param("end") Date end, @Param("data_type") Integer data_type, @Param("param_id") Long param_id);

    List<MeasureTrx> selectMeasureTrx(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);

    MeasureTrxWithBin selectMeasureTrxWithBinById(@Param("data_type") Integer data_type, @Param("measure_trx_id") Long measure_trx_id);

    RpmWithPart selectRpmByMeasureTrxId(@Param("measure_trx_id") Long measure_trx_id);

    MeasureTrx selectModelMeasureTrx(@Param("measure_trx_id") Long measure_trx_id);

    MeasureTrx selectLastMeasureTrx(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);

    long selectMaxMeasureTrxId();

    MeasureTrx selectMeasureTrxById(@Param("measure_trx_id") Long measure_trx_id);

    List<MeasureTrx> selectMeasureTrxData(@Param("start") Date start, @Param("end") Date end);

    MeasureTrx selectMeasureTrxByEutype(@Param("measure_trx_id") Long measure_trx_id, @Param("eu_type") Integer eu_type);

    Double selectListRpmByMeasureId(@Param("param_id") Long param_id, @Param("measure_dtts") Date measure_dtts);

    void insertMeasureTrx(MeasureTrx r);

    List<MeasureTrx> selectMeasureTrxWithSpec(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);


    void insertMeasureTrxBin(MeasureTrxBin r);

    void deleteMeasureTrxBinbyParamId(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);

    void deleteMeasureTrxbyParamId(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);

    List<HashMap<String,Object>>   selectSpecOutMeasureTrxId(@Param("param_id") Long param_id,@Param("start") Date start, @Param("end") Date end);
    List<HashMap<String,Object>>   selectWarningRateMeasureTrxId(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end, @Param("rate") Double rate);

    List<MeasureTrx> selectSampleTraceByRawId(@Param("problem_data_rawid") Long problem_data_rawid);

    MeasureTrxWithBin selectSampleTraceWithBinById(@Param("data_type") Integer data_type, @Param("measure_trx_id") Long measure_trx_id);

}


