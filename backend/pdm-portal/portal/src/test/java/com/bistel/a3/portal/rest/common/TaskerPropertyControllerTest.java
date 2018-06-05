package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.TaskerPropertyMapper;
import com.bistel.a3.portal.domain.common.Property;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.TextNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Created by yohan on 5/16/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class TaskerPropertyControllerTest {
    @Mock
    private TaskerPropertyMapper taskerPropertyMapper;

    @InjectMocks
    private TaskerPropertyController controller = new TaskerPropertyController();

    private Long taskerId = 0l;
    private String key = "test";

    @Test
    public void properties() throws Exception {
        List<Property> list = new ArrayList<>();
        doReturn(list).when(taskerPropertyMapper).selectByTaskerId("property", taskerId);

        List<Property> retList = controller.properties(taskerId);

        verify(taskerPropertyMapper).selectByTaskerId("property", taskerId);
        assertEquals(retList, list);
    }

    @Test
    public void property() throws Exception {
        JsonNode node = new TextNode("TEST");
        doReturn(node).when(taskerPropertyMapper).select("property", taskerId, key);

        JsonNode retNode = controller.property(taskerId, key);

        verify(taskerPropertyMapper).select("property", taskerId, key);
        assertEquals(retNode, node);
    }

    @Test
    public void setProperties() throws Exception {
        Property property = new Property();
        List<Property> list = new ArrayList<>();
        list.add(property);
        list.add(property);
        doNothing().when(taskerPropertyMapper).insert("property", taskerId, property);

        controller.setProperties(taskerId, list);

        verify(taskerPropertyMapper, times(2)).insert("property", taskerId, property);
    }

    @Test
    public void setProperty() throws Exception {
        JsonNode node = new TextNode("TEST");
        doNothing().when(taskerPropertyMapper).update("property", taskerId, key, node);

        controller.setProperty(taskerId, key, node);

        verify(taskerPropertyMapper).update("property", taskerId, key, node);
    }

    @Test
    public void removeProperty() throws Exception {
        doNothing().when(taskerPropertyMapper).delete("property", taskerId, key);

        controller.removeProperty(taskerId, key);

        verify(taskerPropertyMapper).delete("property", taskerId, key);
    }

    @Test
    public void conditions() throws Exception {
        List<Property> list = new ArrayList<>();
        doReturn(list).when(taskerPropertyMapper).selectByTaskerId("condition", taskerId);

        List<Property> retList = controller.conditions(taskerId);

        verify(taskerPropertyMapper).selectByTaskerId("condition", taskerId);
        assertEquals(retList, list);
    }

    @Test
    public void condition() throws Exception {
        JsonNode node = new TextNode("TEST");
        doReturn(node).when(taskerPropertyMapper).select("condition", taskerId, key);

        JsonNode retNode = controller.condition(taskerId, key);

        verify(taskerPropertyMapper).select("condition", taskerId, key);
        assertEquals(retNode, node);
    }

    @Test
    public void setConditions() throws Exception {
        JsonNode node = new TextNode("TEST");
        Property property = new Property();
        List<Property> list = new ArrayList<>();
        list.add(property);
        list.add(property);
        doNothing().when(taskerPropertyMapper).insert("condition", taskerId, property);

        controller.setConditions(taskerId, list);

        verify(taskerPropertyMapper, times(2)).insert("condition", taskerId, property);
    }

    @Test
    public void setCondition() throws Exception {
        JsonNode node = new TextNode("TEST");
        doNothing().when(taskerPropertyMapper).update("condition", taskerId, key, node);

        controller.setCondition(taskerId, key, node);

        verify(taskerPropertyMapper).update("condition", taskerId, key, node);
    }

    @Test
    public void removeCondition() throws Exception {
        doNothing().when(taskerPropertyMapper).delete("condition", taskerId, key);

        controller.removeCondition(taskerId, key);

        verify(taskerPropertyMapper).delete("condition", taskerId, key);
    }

}