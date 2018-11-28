package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ConditionalSpecRuleMaster {

    @JsonProperty("eqpRawId")
    private Long eqpRawId;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("ruleName")
    private String ruleName;

    @JsonProperty("expression")
    private String expression;

    @JsonProperty("expressionValue")
    private String expressionValue;

    @JsonProperty("useYn")
    private String useYn;

    @JsonProperty("ordering")
    private Integer ordering;

    public Long getEqpRawId() {
        return eqpRawId;
    }

    public void setEqpRawId(Long eqpRawId) {
        this.eqpRawId = eqpRawId;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getExpressionValue() {
        return expressionValue;
    }

    public void setExpressionValue(String expressionValue) {
        this.expressionValue = expressionValue;
    }

    public String getUseYn() {
        return useYn;
    }

    public void setUseYn(String useYn) {
        this.useYn = useYn;
    }

    public Integer getOrdering() {
        return ordering;
    }

    public void setOrdering(Integer ordering) {
        this.ordering = ordering;
    }
}