package com.bistel.a3.portal.dao.pdm.std.trace;

import com.bistel.a3.portal.domain.pdm.EqpWithHealthModel;
import com.bistel.a3.portal.domain.pdm.db.Feature;
import com.bistel.a3.portal.domain.pdm.db.HealthDaily;
import com.bistel.a3.portal.domain.pdm.db.HealthModel;
import com.bistel.a3.portal.domain.pdm.db.HealthStat;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

public interface STDHealthMapper {
    List<HealthModel> selectModels();

    void insertHealthDaily(HealthDaily h);

    void deleteHealthDaily(HealthDaily h);

    List<EqpWithHealthModel> selectEqpsWithModel();

    List<HealthDaily> selectHealthIndexes(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);

    void deleteHealthStat(HealthStat h);

    void insertHealthStat(HealthStat h);

    void insertFeature(Feature f);

    void deleteFeature(Feature f);

    HealthStat selectScoreByEqpId(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end, @Param("from90") Date from90);

    HealthModel selectModelByEqpId(@Param("eqp_id") Long eqpId);

    List<HashMap<String,Object>> selectFeatureByTime(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);
    List<HashMap<String,Object>> selectAveOverallByTime(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);
    List<HashMap<String,Object>> selectOverallByTime(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);


    List<HealthModel> selectModel(@Param("eqp_id") Long eqp_id);

    void insertHealthModel(
            @Param("eqp_id") Long eqp_id,
            @Param("model_obj") String model_obj,
            @Param("pca_model_obj") String pca_model_obj,
            @Param("start_dtts") Date start_dtts,
            @Param("end_dtts") Date end_dtts,
            @Param("create_user_id") String create_user_id,
            @Param("description") String description,
            @Param("create_type_cd") String create_type_cd,
            @Param("alarm_spec") double alarm_spec,
            @Param("warn_spec") double warn_spec,
            @Param("model_params") String model_params
    );
    void insertHealthModelHst(
            @Param("eqp_id") Long eqp_id,
            @Param("model_obj") String model_obj,
            @Param("pca_model_obj") String pca_model_obj,
            @Param("start_dtts") Date start_dtts,
            @Param("end_dtts") Date end_dtts,
            @Param("create_user_id") String create_user_id,
            @Param("description") String description,
            @Param("create_type_cd") String create_type_cd,
            @Param("alarm_spec") double alarm_spec,
            @Param("warn_spec") double warn_spec,
            @Param("model_params") String model_params,
            @Param("version") Long version
    );
    void updateHealthModel(
            @Param("eqp_id") Long eqp_id,
            @Param("model_obj") String model_obj,
            @Param("pca_model_obj") String pca_model_obj,
            @Param("start_dtts") Date start_dtts,
            @Param("end_dtts") Date end_dtts,
            @Param("create_user_id") String create_user_id,
            @Param("description") String description,
            @Param("create_type_cd") String create_type_cd,
            @Param("alarm_spec") double alarm_spec,
            @Param("warn_spec") double warn_spec,
            @Param("model_params") String model_params
    );

    List<HashMap<String,Object>> selectMaxVersionHealthModelHst(@Param("eqp_id") Long eqp_id);


    List<HashMap<String,Object>> selectAvgByMonthly(@Param("eqp_id") Long eqpId, @Param("fromDate") Date fromDate, @Param("toDate") Date toDate);
    List<HashMap<String,Object>> selectAvgByMonthlyForMinute(@Param("eqp_id") Long eqpId, @Param("fromDate") Date fromDate, @Param("toDate") Date toDate);

}
