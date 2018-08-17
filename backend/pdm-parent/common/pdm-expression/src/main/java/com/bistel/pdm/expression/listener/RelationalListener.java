package com.bistel.pdm.expression.listener;

import com.bistel.pdm.expression.PrimaryExpressions;
import com.bistel.pdm.lambda.kafka.expression.RuleBaseListener;
import com.bistel.pdm.lambda.kafka.expression.RuleParser;

import static java.util.Objects.requireNonNull;

public class RelationalListener extends RuleBaseListener {

    private final PrimaryExpressions primaryExpressions;

    public RelationalListener(PrimaryExpressions primaryExpressions) {
        requireNonNull(primaryExpressions, "Primary expressions must not be null");
        this.primaryExpressions = primaryExpressions;
    }

    @Override
    public void exitRelationalExpression(RuleParser.RelationalExpressionContext ctx) {
        RuleParser.RelationalExpressionContext relationalExpression =
                ctx.relationalExpression();

        if (relationalExpression != null) {
            Double secondOperand = (Double) primaryExpressions.pop();
            Double firstOperand = (Double) primaryExpressions.pop();

            String operator = ctx.getChild(1).getText();
            Boolean primaryExpression = null;
            switch (operator) {
                case "<":
                    primaryExpression = firstOperand < secondOperand;
                    break;
                case ">":
                    primaryExpression = firstOperand > secondOperand;
                    break;
                case "<=":
                    primaryExpression = firstOperand <= secondOperand;
                    break;
                case ">=":
                    primaryExpression = firstOperand >= secondOperand;
                    break;
            }
            primaryExpressions.push(primaryExpression);
        }
    }

}
