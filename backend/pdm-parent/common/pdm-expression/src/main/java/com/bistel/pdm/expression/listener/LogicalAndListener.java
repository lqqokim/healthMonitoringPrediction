package com.bistel.pdm.expression.listener;

import com.bistel.pdm.expression.PrimaryExpressions;
import com.bistel.pdm.lambda.kafka.expression.RuleBaseListener;
import com.bistel.pdm.lambda.kafka.expression.RuleParser;

import static java.util.Objects.requireNonNull;

public class LogicalAndListener extends RuleBaseListener {

    private final PrimaryExpressions primaryExpressions;

    public LogicalAndListener(PrimaryExpressions primaryExpressions) {
        requireNonNull(primaryExpressions, "Primary expressions must not be null");
        this.primaryExpressions = primaryExpressions;
    }

    @Override
    public void exitLogicalAndExpression(RuleParser.LogicalAndExpressionContext ctx) {
        RuleParser.LogicalAndExpressionContext logicalAndExpression =
                ctx.logicalAndExpression();
        if (logicalAndExpression != null) {
            Boolean secondOperand = (Boolean) primaryExpressions.pop();
            Boolean firstOperand = (Boolean) primaryExpressions.pop();
            primaryExpressions.push(secondOperand && firstOperand);
        }
    }

}
