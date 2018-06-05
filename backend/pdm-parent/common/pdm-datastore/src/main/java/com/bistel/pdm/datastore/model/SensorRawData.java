package com.bistel.pdm.datastore.model;

public class SensorRawData {
    public long rawid;
    public long param_mst_rawid;
    public long trace_trx_rawid;
    public String data_type_cd;
    public Integer max_freq;
    public Integer freq_count;
    public Float rpm;
    public Float sampling_time;
    public String frequency_data;
    public String timewave_data;
    public Float rms;
    public long event_dtts;
    public Float alarm_spec;
    public Float warning_spec;
    public String reserved_col1;
    public String reserved_col2;
    public String reserved_col3;
    public String reserved_col4;
    public String reserved_col5;

    public long getRawid() {
        return rawid;
    }

    public void setRawid(long rawid) {
        this.rawid = rawid;
    }

    public long getParamMstRawid() {
        return param_mst_rawid;
    }

    public void setParamMstRawid(long param_mst_rawid) {
        this.param_mst_rawid = param_mst_rawid;
    }

    public long getTraceTrxRawid() {
        return trace_trx_rawid;
    }

    public void setTraceTrxRawid(long trace_trx_rawid) {
        this.trace_trx_rawid = trace_trx_rawid;
    }

    public String getDataTypeCd() {
        return data_type_cd;
    }

    public void setDataTypeCd(String data_type_cd) {
        this.data_type_cd = data_type_cd;
    }

    public Integer getMaxFreq() {
        return max_freq;
    }

    public void setMaxFreq(Integer max_freq) {
        this.max_freq = max_freq;
    }

    public Integer getFreqCount() {
        return freq_count;
    }

    public void setFreqCount(Integer freq_count) {
        this.freq_count = freq_count;
    }

    public Float getRpm() {
        return rpm;
    }

    public void setRpm(Float rpm) {
        this.rpm = rpm;
    }

    public Float getSamplingTime() {
        return sampling_time;
    }

    public void setSamplingTime(Float sampling_time) {
        this.sampling_time = sampling_time;
    }

    public double[] getFrequencyData() {
        return byteToDoubleArray(this.frequency_data);
    }

    public void setFrequencyData(String frequency_data) {
        this.frequency_data = frequency_data;
    }

    public double[] getTimewaveData() {
        return byteToDoubleArray(this.timewave_data);
    }

    public void setTimewaveData(String timewave_data) {
        this.timewave_data = timewave_data;
    }

    public Float getRms() {
        return rms;
    }

    public void setRms(Float rms) {
        this.rms = rms;
    }

    public long getEventDtts() {
        return event_dtts;
    }

    public void setEventDtts(long event_dtts) {
        this.event_dtts = event_dtts;
    }

    public Float getAlarmSpec() {
        return alarm_spec;
    }

    public void setAlarmSpec(Float alarm_spec) {
        this.alarm_spec = alarm_spec;
    }

    public Float getWarningSpec() {
        return warning_spec;
    }

    public void setWarningSpec(Float warning_spec) {
        this.warning_spec = warning_spec;
    }

    public String getReservedCol1() {
        return reserved_col1;
    }

    public void setReservedCol1(String reserved_col1) {
        this.reserved_col1 = reserved_col1;
    }

    public String getReservedCol2() {
        return reserved_col2;
    }

    public void setReservedCol2(String reserved_col2) {
        this.reserved_col2 = reserved_col2;
    }

    public String getReservedCol3() {
        return reserved_col3;
    }

    public void setReservedCol3(String reserved_col3) {
        this.reserved_col3 = reserved_col3;
    }

    public String getReservedCol4() {
        return reserved_col4;
    }

    public void setReservedCol4(String reserved_col4) {
        this.reserved_col4 = reserved_col4;
    }

    public String getReservedCol5() {
        return reserved_col5;
    }

    public void setReservedCol5(String reserved_col5) {
        this.reserved_col5 = reserved_col5;
    }

    private double[] byteToDoubleArray(String value) {
        String[] values = value.split("\\^");
        double[] doubles = new double[values.length];
        for(int i = 0; i < doubles.length; i++){
            doubles[i] = Double.parseDouble(values[i]);
        }
        return doubles;
    }
}
