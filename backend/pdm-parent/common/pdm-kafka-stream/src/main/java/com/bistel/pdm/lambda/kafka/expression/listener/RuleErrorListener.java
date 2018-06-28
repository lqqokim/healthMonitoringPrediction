package com.bistel.pdm.lambda.kafka.expression.listener;

import com.bistel.pdm.lambda.kafka.expression.exception.RuleSyntaxException;
import org.antlr.v4.runtime.BaseErrorListener;
import org.antlr.v4.runtime.RecognitionException;
import org.antlr.v4.runtime.Recognizer;

/**
 * Created by daniel on 04.07.17.
 */
public class RuleErrorListener extends BaseErrorListener {

    private String rule;

    public RuleErrorListener(String rule) {
        this.rule = rule;
    }

    @Override
    public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol, int line, int charPositionInLine, String msg, RecognitionException e) {
        RuleSyntaxException ruleSyntaxException = new RuleSyntaxException(msg);
        ruleSyntaxException.setLine(line);
        ruleSyntaxException.setCharPositionInLine(charPositionInLine);
        throw ruleSyntaxException;
    }
}
