package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.HealthModel;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EqpWithHealthModel extends HealthModel {
    @JsonProperty("shopName")
    private String shop_name;
    @JsonProperty("eqpName")
    private String eqp_name;
    private String exist;

    public String getShop_name() {
        return shop_name;
    }

    public void setShop_name(String shop_name) {
        this.shop_name = shop_name;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public String getExist() {
        return exist;
    }

    public void setExist(String exist) {
        this.exist = exist;
    }
}
