package com.bistel.a3.portal.domain.request.common;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class OperationsRequestTest extends ProductsRequest {
    private List<String> products;

    @InjectMocks
    private OperationsRequest actual = new OperationsRequest();

    @Test
    public final void  testProducts() {
        List<String> products = new ArrayList<>();
        products.add("test");
        this.products = products;
        actual.setProducts(products);

        assertEquals(this.products, actual.getProducts());
    }
}
