package com.bistel.pdm.batch.function;

import com.bistel.pdm.data.stream.ConditionalSpecMaster;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

/**
 *
 */
public class ConditionSpecFunction {
    private static final Logger log = LoggerFactory.getLogger(ConditionSpecFunction.class);

    public static String evaluateCondition(String partitionKey, String[] record) {

        String conditionName = "";

        try {
            RuleVariables ruleVariables = new RuleVariables();

            List<ConditionalSpecMaster> eqpConditions = MasterCache.EquipmentCondition.get(partitionKey);
            Map<String, Integer> exprMap = MasterCache.ExprParameter.get(partitionKey);

            for (ConditionalSpecMaster cs : eqpConditions) {
                if (cs.getExpression() == null || cs.getExpression().length() <= 0) {
                    conditionName = "DEFAULT";
                    break;
                }

                String[] params = cs.getExpressionValue().split(",");
                for (int i = 1; i <= params.length; i++) {
                    Integer index = exprMap.get(params[i - 1]);
                    ruleVariables.putValue("p" + i, Double.parseDouble(record[index]));
                }

                RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
                if (ruleEvaluator.evaluate(cs.getExpression())) {
                    conditionName = cs.getConditionName();
                    break;
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return conditionName;
    }
}