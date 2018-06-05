package com.bistel.a3.portal.domain.pdm;

public class LegacyState {
    private Long alarm;
    private Long warning;
    private Long inactive;

    public Long getAlarm() {
        return alarm;
    }

    public void setAlarm(Long alarm) {
        this.alarm = alarm;
    }

    public Long getWarning() {
        return warning;
    }

    public void setWarning(Long warning) {
        this.warning = warning;
    }

    public Long getInactive() {
        return inactive;
    }

    public void setInactive(Long inactive) {
        this.inactive = inactive;
    }
}
