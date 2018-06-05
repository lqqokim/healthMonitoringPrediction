package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.Param;

public class ParamStatus extends Param {
    private AlarmCount variant;
    private AlarmCount spec;

    public AlarmCount getVariant() {
        return variant;
    }

    public void setVariant(AlarmCount variant) {
        this.variant = variant;
    }

    public AlarmCount getSpec() {
        return spec;
    }

    public void setSpec(AlarmCount spec) {
        this.spec = spec;
    }
}
