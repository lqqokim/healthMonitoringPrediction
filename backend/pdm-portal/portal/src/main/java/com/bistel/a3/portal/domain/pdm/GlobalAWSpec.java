package com.bistel.a3.portal.domain.pdm;

public class GlobalAWSpec {


    private Double normalized_upper_alarm_spec;
    private Double normalized_upper_warning_spec;
    private Double normalized_lower_alarm_spec;
    private Double normalized_lower_warning_spec;

    public Double getNormalized_upper_alarm_spec() {
        return normalized_upper_alarm_spec;
    }

    public void setNormalized_upper_alarm_spec(Double normalized_upper_alarm_spec) {
        this.normalized_upper_alarm_spec = normalized_upper_alarm_spec;
    }

    public Double getNormalized_upper_warning_spec() {
        return normalized_upper_warning_spec;
    }

    public void setNormalized_upper_warning_spec(Double normalized_upper_warning_spec) {
        this.normalized_upper_warning_spec = normalized_upper_warning_spec;
    }

    public Double getNormalized_lower_alarm_spec() {
        return normalized_lower_alarm_spec;
    }

    public void setNormalized_lower_alarm_spec(Double normalized_lower_alarm_spec) {
        this.normalized_lower_alarm_spec = normalized_lower_alarm_spec;
    }

    public Double getNormalized_lower_warning_spec() {
        return normalized_lower_warning_spec;
    }

    public void setNormalized_lower_warning_spec(Double normalized_lower_warning_spec) {
        this.normalized_lower_warning_spec = normalized_lower_warning_spec;
    }
}
