package com.bistel.a3.portal.service.pdm.impl.std;

import org.apache.commons.math3.util.Pair;
import org.springframework.stereotype.Component;


import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OneDaySample {

    static ConcurrentHashMap<String, Pair<Long, Date>> eqpParamSampleRawIds; //key: eqpId+param_name value: sampleRawid

    static {
        eqpParamSampleRawIds = new ConcurrentHashMap<>();
    }

    public static ConcurrentHashMap<String, Pair<Long, Date>> getMap(){
        return eqpParamSampleRawIds;
    }
}
