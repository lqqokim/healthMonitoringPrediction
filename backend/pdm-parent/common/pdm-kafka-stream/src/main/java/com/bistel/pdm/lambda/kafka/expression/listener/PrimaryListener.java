package com.bistel.pdm.lambda.kafka.expression.listener;

import com.bistel.pdm.lambda.kafka.expression.PrimaryExpressions;
import com.bistel.pdm.lambda.kafka.expression.RuleBaseListener;
import com.bistel.pdm.lambda.kafka.expression.RuleParser;
import com.bistel.pdm.lambda.kafka.expression.RuleVariables;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.time.LocalDate;
import java.util.function.Function;

import static java.util.Objects.requireNonNull;

/**
 * Created by daniel on 03.07.17.
 */
public class PrimaryListener extends RuleBaseListener {

    private final PrimaryExpressions primaryExpressions;

    private final RuleVariables ruleVariables;

    public PrimaryListener(PrimaryExpressions primaryExpressions, RuleVariables ruleVariables) {
        requireNonNull(primaryExpressions, "Primary expressions must not be null");
        requireNonNull(ruleVariables, "Rule variables must not be null");
        this.primaryExpressions = primaryExpressions;
        this.ruleVariables = ruleVariables;
    }

    @Override
    public void exitPrimaryExpression(RuleParser.PrimaryExpressionContext ctx) {

        if (pushPrimaryExpression(ctx.DECIMAL_CONSTANT(),
                Double::valueOf))
            return;

        if (pushPrimaryExpression(ctx.IDENTIFIER(),
                ruleVariables::getValue))
            return;

        if (pushPrimaryExpression(ctx.BOOLEAN_CONSTANT(),
                Boolean::valueOf))
            return;

        if (pushPrimaryExpression(ctx.DATE_CONSTANT(),
               LocalDate::parse))
            return;

        pushPrimaryExpression(ctx.STRING_LITERAL(),
                (text) -> text.substring(1, text.length() - 1));

    }

    private boolean pushPrimaryExpression(TerminalNode terminalNode,
                                          Function<String, ?> conversionFunction) {
        if (terminalNode != null) {
            String text = terminalNode.getText();
            Object primaryExpression = conversionFunction.apply(text);
            primaryExpressions.push(primaryExpression);
            return true;
        }
        return false;
    }


}
