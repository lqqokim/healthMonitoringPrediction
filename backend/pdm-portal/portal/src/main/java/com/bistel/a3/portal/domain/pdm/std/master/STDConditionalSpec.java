package com.bistel.a3.portal.domain.pdm.std.master;

import net.bitnine.agensgraph.deps.org.json.simple.JSONObject;

import java.util.List;

public class STDConditionalSpec {


    private Long model_param_spec_mst_rawid;
    private Long eqp_spec_link_mst_rawid;

    private Long rule_id;
    private String model_name;
    private String rule_name;
    private String condition;
    private String expression;
    private String expression_value;
    private String[] expression_values;
    private String description;
    private Long ordering;

    private Long param_id;
    private String param_name;
    private Double param_value;
    private String operand;
    private Double upper_alarm_spec;
    private Double upper_warning_spec;
    private Double model_upper_alarm_spec;
    private Double model_upper_warning_spec;
    private Double eqp_upper_alarm_spec;
    private Double eqp_upper_warning_spec;
    private Double lower_alarm_spec;
    private Double lower_warning_spec;
    private Double model_lower_alarm_spec;
    private Double model_lower_warning_spec;
    private Double eqp_lower_alarm_spec;
    private Double eqp_lower_warning_spec;
    private String type;
    private Double target;
    private boolean used_yn;

    private String userName;
    private Long eqp_id;

    List<STDConditionalSpec> parameter;


    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Long getEqp_spec_link_mst_rawid() {
        return eqp_spec_link_mst_rawid;
    }

    public void setEqp_spec_link_mst_rawid(Long eqp_spec_link_mst_rawid) {
        this.eqp_spec_link_mst_rawid = eqp_spec_link_mst_rawid;
    }

    public boolean isUsed_yn() {
        return used_yn;
    }

    public void setUsed_yn(boolean used_yn) {
        this.used_yn = used_yn;
    }

    public Long getOrdering() {
        return ordering;
    }

    public void setOrdering(Long ordering) {
        this.ordering = ordering;
    }

    public String[] getExpression_values() {
        return expression_values;
    }

    public void setExpression_values(String[] expression_values) {
        this.expression_values = expression_values;
    }

    public Long getModel_param_spec_mst_rawid() {
        return model_param_spec_mst_rawid;
    }

    public void setModel_param_spec_mst_rawid(Long model_param_spec_mst_rawid) {
        this.model_param_spec_mst_rawid = model_param_spec_mst_rawid;
    }

    public Double getLower_alarm_spec() {
        return lower_alarm_spec;
    }

    public void setLower_alarm_spec(Double lower_alarm_spec) {
        this.lower_alarm_spec = lower_alarm_spec;
    }

    public Double getLower_warning_spec() {
        return lower_warning_spec;
    }

    public void setLower_warning_spec(Double lower_warning_spec) {
        this.lower_warning_spec = lower_warning_spec;
    }

    public Double getTarget() {
        return target;
    }

    public void setTarget(Double target) {
        this.target = target;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getModel_name() {
        return model_name;
    }

    public void setModel_name(String model_name) {
        this.model_name = model_name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExpression_value() {
        return expression_value;
    }

    public void setExpression_value(String expression_value) {
        this.expression_value = expression_value;
    }

    public String getOperand() {
        return operand;
    }

    public void setOperand(String operand) {
        this.operand = operand;
    }

    public Double getParam_value() {
        return param_value;
    }

    public void setParam_value(Double param_value) {
        this.param_value = param_value;
    }



    public List<STDConditionalSpec> getParameter() {
        return parameter;
    }

    public void setParameter(List<STDConditionalSpec> parameter) {
        this.parameter = parameter;
    }

    public Long getRule_id() {
        return rule_id;
    }

    public void setRule_id(Long rule_id) {
        this.rule_id = rule_id;
    }

    public String getRule_name() {
        return rule_name;
    }

    public void setRule_name(String rule_name) {
        this.rule_name = rule_name;
    }



    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public String getParam_name() {
        return param_name;
    }

    public void setParam_name(String param_name) {
        this.param_name = param_name;
    }

    public Double getUpper_alarm_spec() {
        return upper_alarm_spec;
    }

    public void setUpper_alarm_spec(Double upper_alarm_spec) {
        this.upper_alarm_spec = upper_alarm_spec;
    }

    public Double getUpper_warning_spec() {
        return upper_warning_spec;
    }

    public void setUpper_warning_spec(Double upper_warning_spec) {
        this.upper_warning_spec = upper_warning_spec;
    }

    public Double getModel_upper_alarm_spec() {
        return model_upper_alarm_spec;
    }

    public void setModel_upper_alarm_spec(Double model_upper_alarm_spec) {
        this.model_upper_alarm_spec = model_upper_alarm_spec;
    }

    public Double getModel_upper_warning_spec() {
        return model_upper_warning_spec;
    }

    public void setModel_upper_warning_spec(Double model_upper_warning_spec) {
        this.model_upper_warning_spec = model_upper_warning_spec;
    }

    public Double getEqp_upper_alarm_spec() {
        return eqp_upper_alarm_spec;
    }

    public void setEqp_upper_alarm_spec(Double eqp_upper_alarm_spec) {
        this.eqp_upper_alarm_spec = eqp_upper_alarm_spec;
    }

    public Double getEqp_upper_warning_spec() {
        return eqp_upper_warning_spec;
    }

    public void setEqp_upper_warning_spec(Double eqp_upper_warning_spec) {
        this.eqp_upper_warning_spec = eqp_upper_warning_spec;
    }

    public Double getModel_lower_alarm_spec() {
        return model_lower_alarm_spec;
    }

    public void setModel_lower_alarm_spec(Double model_lower_alarm_spec) {
        this.model_lower_alarm_spec = model_lower_alarm_spec;
    }

    public Double getModel_lower_warning_spec() {
        return model_lower_warning_spec;
    }

    public void setModel_lower_warning_spec(Double model_lower_warning_spec) {
        this.model_lower_warning_spec = model_lower_warning_spec;
    }

    public Double getEqp_lower_alarm_spec() {
        return eqp_lower_alarm_spec;
    }

    public void setEqp_lower_alarm_spec(Double eqp_lower_alarm_spec) {
        this.eqp_lower_alarm_spec = eqp_lower_alarm_spec;
    }

    public Double getEqp_lower_warning_spec() {
        return eqp_lower_warning_spec;
    }

    public void setEqp_lower_warning_spec(Double eqp_lower_warning_spec) {
        this.eqp_lower_warning_spec = eqp_lower_warning_spec;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}

