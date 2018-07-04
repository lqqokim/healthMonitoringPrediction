package com.bistel.pdm.lambda.kafka.expression.listener;

import com.bistel.pdm.lambda.kafka.expression.PrimaryExpressions;
import com.bistel.pdm.lambda.kafka.expression.RuleBaseListener;
import com.bistel.pdm.lambda.kafka.expression.RuleParser;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import static java.util.Objects.requireNonNull;

public class EqualityListener extends RuleBaseListener {

    private final PrimaryExpressions primaryExpressions;

    public EqualityListener(PrimaryExpressions primaryExpressions) {
        requireNonNull(primaryExpressions, "Primary expressions must not be null");
        this.primaryExpressions = primaryExpressions;
    }

    @Override
    public void exitEqualityExpression(RuleParser.EqualityExpressionContext ctx) {
        RuleParser.EqualityExpressionContext equalityExpression =
                ctx.equalityExpression();
        if (equalityExpression != null) {
            Object secondOperand = trimTime(dateToLocalDate(primaryExpressions.pop()));
            Object firstOperand = trimTime(dateToLocalDate(primaryExpressions.pop()));
            String operator = ctx.getChild(1).getText();
            Boolean primaryExpression = null;
            switch (operator) {
                case "==":
                    primaryExpression = firstOperand.equals(secondOperand);
                    break;
                case "!=":
                    primaryExpression = !firstOperand.equals(secondOperand);
                    break;
            }
            primaryExpressions.push(primaryExpression);
        }
    }

    private static Object dateToLocalDate(Object input) {
        if (input instanceof Date) {
            return ((Date) input).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        return input;
    }

    private static Object trimTime(Object input) {
        if (input instanceof LocalDateTime) {
            return ((LocalDateTime) input).toLocalDate();
        }
        return input;
    }

}
