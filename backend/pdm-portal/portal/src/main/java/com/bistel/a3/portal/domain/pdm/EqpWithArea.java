package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.Eqp;

public class EqpWithArea extends Eqp {
    private String shopName;

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }
}
