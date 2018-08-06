package com.bistel.pdm.speed.Function;

import com.bistel.pdm.common.json.ParameterMasterDataSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClassificationFunction {
    private static final Logger log = LoggerFactory.getLogger(ClassificationFunction.class);

    public static boolean evaluate(ParameterMasterDataSet param) {
        // fault classifications
        if (param.getParameterType().equalsIgnoreCase("Acceleration") ||
                param.getParameterType().equalsIgnoreCase("Velocity") ||
                param.getParameterType().equalsIgnoreCase("Enveloping")) {

            //log.debug("[{}] - fault classification : ", paramKey);

        }

        return false;
    }
}
