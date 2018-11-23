package com.bistel.pdm.data.event;

import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;

public class ThresholdBasedEvent {






    public String evaluateStatusCode(EventMaster eventInfo, double paramValue) {
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
