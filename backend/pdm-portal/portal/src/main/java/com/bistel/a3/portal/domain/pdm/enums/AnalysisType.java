package com.bistel.a3.portal.domain.pdm.enums;

public enum AnalysisType {
    x_category(0), y_category(1), x(2), y(3), y2(4);

    private final int type;

    AnalysisType(int type) {
        this.type = type;
    }

    public int type() {
        return type;
    }
}
