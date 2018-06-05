package com.bistel.a3.portal.domain.pdm.enums;

public enum PartType {
    Bearing(2);

    private final int type;

    PartType(int type) {
        this.type = type;
    }

    public int type() {
        return type;
    }
}
