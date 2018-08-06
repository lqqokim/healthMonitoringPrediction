package com.bistel.a3.portal.domain.pdm.std.master;

public class STDParamHealth {

    private Long eqp_mst_rawid;

    private Long param_health_mst_rawid;

    private Long param_health_option_mst_rawid;

    private Long param_mst_rawid;

    private Long health_logic_mst_rawid;

    private String apply_logic_yn;

    public Long getEqp_mst_rawid() {
        return eqp_mst_rawid;
    }

    public void setEqp_mst_rawid(Long eqp_mst_rawid) {
        this.eqp_mst_rawid = eqp_mst_rawid;
    }

    public Long getParam_health_mst_rawid() {
        return param_health_mst_rawid;
    }


    public Long getParam_health_option_mst_rawid() {
        return param_health_option_mst_rawid;
    }

    public void setParam_health_option_mst_rawid(Long param_health_option_mst_rawid) {
        this.param_health_option_mst_rawid = param_health_option_mst_rawid;
    }


    public void setParam_health_mst_rawid(Long param_health_mst_rawid) {
        this.param_health_mst_rawid = param_health_mst_rawid;
    }

    public Long getParam_mst_rawid() {
        return param_mst_rawid;
    }

    public void setParam_mst_rawid(Long param_mst_rawid) {
        this.param_mst_rawid = param_mst_rawid;
    }

    public Long getHealth_logic_mst_rawid() {
        return health_logic_mst_rawid;
    }

    public void setHealth_logic_mst_rawid(Long health_logic_mst_rawid) {
        this.health_logic_mst_rawid = health_logic_mst_rawid;
    }

    public String getApply_logic_yn() {
        return apply_logic_yn;
    }

    public void setApply_logic_yn(String apply_logic_yn) {
        this.apply_logic_yn = apply_logic_yn;
    }
}
