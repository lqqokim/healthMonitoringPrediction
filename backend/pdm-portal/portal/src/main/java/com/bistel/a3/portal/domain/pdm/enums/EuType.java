package com.bistel.a3.portal.domain.pdm.enums;

public enum EuType {
    Speed(4), Acceleration(1), Envelop(7), Sensor(0);

    private final int eutype;

    EuType(int i) {
        this.eutype = i;
    }

    public int eutype() {
        return eutype;
    }
}
