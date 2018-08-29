package com.bistel.pdm.expression;

import com.bistel.pdm.expression.listener.*;
import com.bistel.pdm.lambda.kafka.expression.RuleLexer;
import com.bistel.pdm.lambda.kafka.expression.RuleParser;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;

import java.util.Map;

import static java.util.Objects.requireNonNull;

public class RuleEvaluator {

    public final RuleVariables ruleVariables;

    public RuleEvaluator(RuleVariables ruleVariables) {
        requireNonNull(ruleVariables, "Rule variables must not be null");
        this.ruleVariables = ruleVariables;
    }

    public RuleEvaluator(Map<String, Object> ruleVariables) {
        requireNonNull(ruleVariables, "Rule variables must not be null");
        this.ruleVariables = new RuleVariables(ruleVariables);
    }

    public RuleEvaluator() {
        this.ruleVariables = new RuleVariables();
    }

    public boolean evaluate(String rule) {

        requireNonNull(rule, "Rule must not be null");
        RuleErrorListener ruleErrorListener = new RuleErrorListener(rule);

        RuleLexer lexer = new RuleLexer(CharStreams.fromString(rule));
        lexer.removeErrorListeners();
        lexer.addErrorListener(ruleErrorListener);

        CommonTokenStream tokens = new CommonTokenStream(lexer);

        PrimaryExpressions primaryExpressions = new PrimaryExpressions();

        RuleParser parser = new RuleParser(tokens);

        parser.addParseListener(new PrimaryListener(primaryExpressions, ruleVariables));
        //parser.addParseListener(new NotListener(primaryExpressions));
        parser.addParseListener(new RelationalListener(primaryExpressions));
        parser.addParseListener(new EqualityListener(primaryExpressions));
        parser.addParseListener(new LogicalAndListener(primaryExpressions));
        parser.addParseListener(new LogicalOrListener(primaryExpressions));

        parser.removeErrorListeners();
        parser.addErrorListener(ruleErrorListener);

        parser.expression();

        return (boolean) primaryExpressions.pop();
    }

}
