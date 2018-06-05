package com.bistel.a3.portal.domain.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Param;
import com.bistel.a3.portal.domain.pdm.enums.EuType;
import com.bistel.a3.portal.domain.pdm.enums.ParamType;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ParamWithCommon extends Param {
    private String eu;
    @JsonProperty("euType")
    private int eu_type;

    public String getEu() {
        return eu;
    }

    public void setEu(String eu) {
        this.eu = eu;
    }

    public int getEu_type() {
        return eu_type;
    }

    public void setEu_type(int eu_type) {

        this.eu_type = eu_type;
        if(this.eu_type == EuType.Speed.eutype()){
            this.setParam_type_cd(ParamType.Velocity.toString());
        }else if(this.eu_type == EuType.Acceleration.eutype()){
            this.setParam_type_cd(ParamType.Acceleration.toString());
        }else if(this.eu_type == EuType.Envelop.eutype()){
            this.setParam_type_cd(ParamType.Enveloping.toString());
        }
    }
}
