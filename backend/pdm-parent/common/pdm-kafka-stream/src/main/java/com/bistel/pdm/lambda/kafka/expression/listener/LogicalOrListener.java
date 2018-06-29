package com.bistel.pdm.lambda.kafka.expression.listener;

import com.bistel.pdm.lambda.kafka.expression.PrimaryExpressions;
import com.bistel.pdm.lambda.kafka.expression.RuleBaseListener;
import com.bistel.pdm.lambda.kafka.expression.RuleParser;

import static java.util.Objects.requireNonNull;

/**
 * Created by daniel on 03.07.17.
 */
public class LogicalOrListener extends RuleBaseListener {

    private final PrimaryExpressions primaryExpressions;

    public LogicalOrListener(PrimaryExpressions primaryExpressions) {
        requireNonNull(primaryExpressions, "Primary expressions must not be null");
        this.primaryExpressions = primaryExpressions;
    }

    @Override
    public void exitLogicalOrExpression(RuleParser.LogicalOrExpressionContext ctx) {
        RuleParser.LogicalOrExpressionContext logicalOrExpression =
                ctx.logicalOrExpression();
        if (logicalOrExpression != null) {
            Boolean secondOperand = (Boolean) primaryExpressions.pop();
            Boolean firstOperand = (Boolean) primaryExpressions.pop();
            primaryExpressions.push(secondOperand || firstOperand);
        }
    }

}