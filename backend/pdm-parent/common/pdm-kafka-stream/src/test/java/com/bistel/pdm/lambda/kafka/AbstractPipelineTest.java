package com.bistel.pdm.lambda.kafka;

import com.bistel.pdm.lambda.kafka.expression.RuleEvaluator;
import com.bistel.pdm.lambda.kafka.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterDataUpdater;
import org.junit.Test;

import static org.junit.Assert.*;

public class AbstractPipelineTest {

    @Test
    public void reloadTest() {
        String tartgetUrl = "http://192.168.7.230:28000/pdm/api/master/latest/features";
        //MasterDataUpdater.updateParamFeatureDataSet(tartgetUrl);
    }

    @Test
    public void rule_test(){
        RuleVariables ruleVariables = new RuleVariables();
        ruleVariables.putValue("value", 0.446542);
        RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
        boolean isRun = ruleEvaluator.evaluate("value>0.446541");

        if(isRun){
            System.out.println("run");
        }
    }
}