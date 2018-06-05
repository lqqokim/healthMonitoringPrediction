package com.bistel.a3.portal.util.frequencyData;

import java.util.List;

public class FrequencyHarmonicParameter {
    String parameterName;
    List<FrequencyHarmonic> harmonics;

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public List<FrequencyHarmonic> getHarmonics() {
        return harmonics;
    }

    public void setHarmonics(List<FrequencyHarmonic> harmonics) {
        this.harmonics = harmonics;
    }
}
