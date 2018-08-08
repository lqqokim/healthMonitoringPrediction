package com.bistel.pdm.speed.processor;

import com.bistel.pdm.lambda.kafka.expression.RuleEvaluator;
import com.bistel.pdm.lambda.kafka.expression.RuleVariables;
import org.junit.Test;

import static org.junit.Assert.*;

public class RuleEvaluateTest {

    @Test
    public void process() {
        String text = "p1>10.0 and p2<4.0 or p3>=10.0";

        RuleVariables ruleVariables = new RuleVariables();
        ruleVariables.putValue("p1", 11.0);
        ruleVariables.putValue("p2", 2.0);
        ruleVariables.putValue("p3", 9.0);
        RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);

        boolean isRun = ruleEvaluator.evaluate(text);
        System.out.println(isRun);
    }
}