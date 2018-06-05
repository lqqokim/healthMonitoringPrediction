package com.bistel.a3.portal.domain.request.common;

import java.util.List;

/**
 * Created by yohan on 15. 11. 5.
 */
public class OperationsRequest extends ProductsRequest {
    private List<String> products;

    public List<String> getProducts() {
        return products;
    }

    public void setProducts(List<String> products) {
        this.products = products;
    }
}
