package com.bistel.a3.portal.domain.pdm.enums;

public enum BinDataType {
    SPECTRUM(0), TIMEWAVE(2);

    private final int cd;

    BinDataType(int cd) {
        this.cd = cd;
    }

    public int cd() {
        return cd;
    }
}
