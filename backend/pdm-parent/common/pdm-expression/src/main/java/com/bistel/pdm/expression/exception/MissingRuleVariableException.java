package com.bistel.pdm.expression.exception;

public class MissingRuleVariableException extends RuntimeException {

    private final String variableName;

    public MissingRuleVariableException(String variableName) {
        super(String.format("Variable with name '%s' not found", variableName));
        this.variableName = variableName;
    }
}
