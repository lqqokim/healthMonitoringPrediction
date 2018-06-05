package com.bistel.a3.portal.domain.pdm.enums;

public enum NodeType {
    SPEED(4), ACCELERATION(1), ENVELOPING(7);

    private final int eutype;

    NodeType(int eutype) {
        this.eutype = eutype;
    }

    public int getEutype() {
        return eutype;
    }
}
