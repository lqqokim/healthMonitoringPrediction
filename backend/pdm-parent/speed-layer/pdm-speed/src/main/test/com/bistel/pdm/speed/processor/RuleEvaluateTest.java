package com.bistel.pdm.speed.processor;

import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import org.junit.Test;

public class RuleEvaluateTest {

    @Test
    public void process() {
        String text = "p1>=-11.867989 AND p2==100.0";

        RuleVariables ruleVariables = new RuleVariables();
        ruleVariables.putValue("p1", 11.0);
        ruleVariables.putValue("p2", 100.0);
        RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);

        boolean isRun = ruleEvaluator.evaluate(text);
        System.out.println(isRun);
    }
}