package com.bistel.a3.portal.domain.pdm;

public class EqpHealthSPCRule {

    private Long param_health_id;
    private Long param_id;
    private Long health_logic_id;
    private String apply_logic_yn;
    private Long health_logic_option_id;
    private String option_name;
    private int option_value;

    public Long getParam_health_id() {
        return param_health_id;
    }

    public void setParam_health_id(Long param_health_id) {
        this.param_health_id = param_health_id;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Long getHealth_logic_id() {
        return health_logic_id;
    }

    public void setHealth_logic_id(Long health_logic_id) {
        this.health_logic_id = health_logic_id;
    }

    public String getApply_logic_yn() {
        return apply_logic_yn;
    }

    public void setApply_logic_yn(String apply_logic_yn) {
        this.apply_logic_yn = apply_logic_yn;
    }

    public Long getHealth_logic_option_id() {
        return health_logic_option_id;
    }

    public void setHealth_logic_option_id(Long health_logic_option_id) {
        this.health_logic_option_id = health_logic_option_id;
    }

    public String getOption_name() {
        return option_name;
    }

    public void setOption_name(String option_name) {
        this.option_name = option_name;
    }

    public int getOption_value() {
        return option_value;
    }

    public void setOption_value(int option_value) {
        this.option_value = option_value;
    }
}
