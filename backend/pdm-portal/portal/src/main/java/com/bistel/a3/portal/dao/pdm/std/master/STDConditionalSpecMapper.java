package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.pdm.AreaWithTree;
import com.bistel.a3.portal.domain.pdm.Node;
import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.domain.pdm.master.AreaWithChildren;
import com.bistel.a3.portal.domain.pdm.std.master.STDConditionalSpec;
import com.bistel.a3.portal.domain.pdm.std.master.STDEqp;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface STDConditionalSpecMapper {

    List<STDEqp> selectModelList();

    List<STDConditionalSpec> selectConditionsByModel( @Param("model") String model);

    List<STDConditionalSpec> selectParamSpec(@Param("model") String model, @Param("rule_id") Long rule_id);

    List<STDConditionalSpec> selectConditionsByModelAndRule(@Param("model") String model, @Param("rule") String rule);

    List<STDConditionalSpec> selectConditionsByEqpId(@Param("eqpId") Long eqpId);

    List<STDConditionalSpec> selectParamSpecByeqpIdAndRule(@Param("eqpId") Long eqpId, @Param("rule_id") Long rule_id);

    List<STDConditionalSpec> selectParamListByModelName(@Param("model") String model);

    void insertConditionalSpec(@Param("model_name") String model_name, @Param("rule_name") String rule_name, @Param("expression") String expression, @Param("condition") String condition, @Param("description") String description, @Param("userName") String userName, @Param("expression_value") String expression_value);

    void updateConditionalSpec(@Param("rule_id") Long rule_id,@Param("model_name") String model_name, @Param("rule_name") String rule_name, @Param("expression") String expression, @Param("condition") String condition, @Param("description") String description, @Param("userName") String userName, @Param("expression_value") String expression_value);

    Long selectConditionalSpecRawId(@Param("model_name") String model_name, @Param("rule_name") String rule_name);

    Long selectCheckModelParam(@Param("rule_id") Long rule_id, @Param("param_name") String param_name);

    void insertModelParamSpec(@Param("rule_id") Long rule_id, @Param("param_name") String param_name,
                              @Param("upper_alarm_spec") Double upper_alarm_spec, @Param("upper_warning_spec") Double upper_warning_spec,
                              @Param("target") Double target, @Param("lower_alarm_spec") Double lower_alarm_spec, @Param("lower_warning_spec") Double lower_warning_spec,
                              @Param("description") String description, @Param("userName") String userName);

    void updateModelParamSpec( @Param("param_name") String param_name,
                              @Param("upper_alarm_spec") Double upper_alarm_spec, @Param("upper_warning_spec") Double upper_warning_spec,
                              @Param("target") Double target, @Param("lower_alarm_spec") Double lower_alarm_spec, @Param("lower_warning_spec") Double lower_warning_spec,
                              @Param("description") String description, @Param("userName") String userName,
                              @Param("model_param_spec_mst_rawid") Long model_param_spec_mst_rawid);

    void deleteModelParamSpec(@Param("rule_id") Long rule_id);

    void deleteConditionalSpec(@Param("rule_id") Long rule_id);

    void insertEqpSpecLink(@Param("eqp_id") Long eqp_id, @Param("rule_id") Long rule_id, @Param("ordering") Long ordering,
                            @Param("description") String description, @Param("userName") String userName);

    void deleteEqpSpecLink(@Param("eqp_id") Long eqp_id, @Param("rule_id") Long rule_id );

    void deleteParamSpec(@Param("eqp_spec_link_mst_rawid") Long eqp_spec_link_mst_rawid);

    void insertParamSpec(@Param("param_id") Long param_id, @Param("eqp_spec_link_mst_rawid") Long eqp_spec_link_mst_rawid,
                         @Param("spec_type") String spec_type, @Param("eqp_upper_alarm_spec") Double eqp_upper_alarm_spec,
                         @Param("eqp_upper_warning_spec") Double eqp_upper_warning_spec,
                         @Param("target") Double target,
                         @Param("eqp_lower_alarm_spec") Double eqp_lower_alarm_spec,
                         @Param("eqp_lower_warning_spec") Double eqp_lower_warning_spec,
                         @Param("String") String description,
                         @Param("String") String userName);

}
