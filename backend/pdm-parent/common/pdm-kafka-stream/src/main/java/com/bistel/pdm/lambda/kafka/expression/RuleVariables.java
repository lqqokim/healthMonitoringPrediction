package com.bistel.pdm.lambda.kafka.expression;

import com.bistel.pdm.lambda.kafka.expression.exception.MissingRuleVariableException;

import java.util.HashMap;
import java.util.Map;

public class RuleVariables {

    private Map<String, Object> variables;

    public RuleVariables() {
        variables = new HashMap<>();
    }

    public RuleVariables(Map<String, Object> ruleVariables) {
        variables = new HashMap<>(ruleVariables);
    }

    public void putValue(String name, Object value) {
        variables.put(name, value);
    }

    public Object getValue(String name) {
        Object value = variables.get(name);
        if (value == null) {
            throw new MissingRuleVariableException(name);
        }
        return value;
    }

}
