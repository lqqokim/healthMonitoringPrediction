package com.bistel.a3.portal.domain.request.common;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class RecipesRequestTest extends OperationsRequest {
    private List<String> operations;

    @InjectMocks
    private RecipesRequest actual = new RecipesRequest();

    @Test
    public final void testOperations() {
        List<String> operations = new ArrayList<>();
        operations.add("testRecipe");
        this.operations = operations;
        actual.setOperations(operations);

        assertEquals(this.operations, actual.getOperations());
    }
}

