package com.bistel.pdm.expression.listener;

import com.bistel.pdm.expression.PrimaryExpressions;
import com.bistel.pdm.lambda.kafka.expression.RuleBaseListener;
import com.bistel.pdm.lambda.kafka.expression.RuleParser;

import static java.util.Objects.requireNonNull;

public class NotListener extends RuleBaseListener {

    private final PrimaryExpressions primaryExpressions;

    public NotListener(PrimaryExpressions primaryExpressions) {
        requireNonNull(primaryExpressions, "Primary expressions must not be null");
        this.primaryExpressions = primaryExpressions;
    }

    @Override
    public void exitNotExpression(RuleParser.NotExpressionContext ctx) {
        if (ctx.notExpression() != null) {
            Boolean primaryExpression = (Boolean) primaryExpressions.pop();
            primaryExpressions.push(!primaryExpression);
        }
    }

}
