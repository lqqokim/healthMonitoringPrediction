package com.bistel.pdm.expression;

import java.util.ArrayDeque;
import java.util.Deque;

import static java.util.Objects.requireNonNull;

/**
 * Created by daniel on 03.07.17.
 */
public class PrimaryExpressions {

    private Deque<Object> primaryExpressions = new ArrayDeque<>();

    public void push(Object primaryExpression) {
        requireNonNull(primaryExpression, "Primary expression must not be null");
        primaryExpressions.push(primaryExpression);
    }

    public Object pop() {
        return primaryExpressions.pop();
    }
}
