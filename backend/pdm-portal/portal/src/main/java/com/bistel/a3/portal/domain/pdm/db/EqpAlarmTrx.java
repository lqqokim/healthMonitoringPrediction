package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EqpAlarmTrx extends AlarmTrx {
    @JsonProperty("eqpId")
    private Long eqp_id;

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }
}
