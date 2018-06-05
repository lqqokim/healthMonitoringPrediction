package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.ReportAlarm;

public class ReportAlarmWithName extends ReportAlarm {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
