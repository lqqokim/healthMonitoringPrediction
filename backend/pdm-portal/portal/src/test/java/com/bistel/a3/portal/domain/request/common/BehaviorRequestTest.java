package com.bistel.a3.portal.domain.request.common;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class BehaviorRequestTest {
    private String taskerBehaviorTypeName;
    private JsonNode input;

    @InjectMocks
    private BehaviorRequest actual = new BehaviorRequest();

    @Test
    public final void testTaskerBehaviorTypeName() {
        String taskerBehaviorTypeName = "testBehavior";
        this.taskerBehaviorTypeName = taskerBehaviorTypeName;
        actual.setTaskerBehaviorTypeName(taskerBehaviorTypeName);

        assertEquals(this.taskerBehaviorTypeName, actual.getTaskerBehaviorTypeName());
    }

    @Test
    public final void testInput() {
        JsonNode input = null;
        this.input = input;
        actual.setInput(input);

        assertEquals(this.input, actual.getInput());
    }
}
