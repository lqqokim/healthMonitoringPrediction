package com.bistel.pdm.batch.function;

import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StatusDefineFunction {
    private static final Logger log = LoggerFactory.getLogger(StatusDefineFunction.class);

    public synchronized String evaluateStatusCode(EventMaster eventInfo, double paramValue) {
        String nowStatusCode = "I";

        RuleVariables ruleVariables = new RuleVariables();
        ruleVariables.putValue("value", paramValue);
        RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
        boolean isRun = ruleEvaluator.evaluate(eventInfo.getCondition());

        if (isRun) {
            nowStatusCode = "R";
        }
        return nowStatusCode;
    }
}
