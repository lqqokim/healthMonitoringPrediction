package com.bistel.a3.portal.domain.request.common;

import java.util.List;

/**
 * Created by yohan on 15. 11. 5.
 */
public class RecipesRequest extends OperationsRequest {
    private List<String> operations;

    public List<String> getOperations() {
        return operations;
    }

    public void setOperations(List<String> operations) {
        this.operations = operations;
    }
}

