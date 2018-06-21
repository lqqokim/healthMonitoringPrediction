package com.bistel.pdm.lambda.kafka.expression.exception;

/**
 * Created by daniel on 04.07.17.
 */
public class RuleSyntaxException extends RuntimeException {

    private int line;
    private int charPositionInLine;

    public RuleSyntaxException(String message) {
        super(message);
    }

    public void setLine(int line) {
        this.line = line;
    }

    public int getLine() {
        return line;
    }

    public void setCharPositionInLine(int charPositionInLine) {
        this.charPositionInLine = charPositionInLine;
    }

    public int getCharPositionInLine() {
        return charPositionInLine;
    }
}

