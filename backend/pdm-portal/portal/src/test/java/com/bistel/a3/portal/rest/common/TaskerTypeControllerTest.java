package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.TaskerTypeMapper;
import com.bistel.a3.portal.domain.common.TaskerType;
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
public class TaskerTypeControllerTest {
    @Mock
    private TaskerTypeMapper taskerTypeMapper;

    @InjectMocks
    private TaskerTypeController controller = new TaskerTypeController();

    private Long taskerTypeId = 0l;

    @Test
    public void gets_TypeNull() throws Exception {
        List<TaskerType> list = new ArrayList<>();
        doReturn(list).when(taskerTypeMapper).selectAll();

        List<TaskerType> retList = controller.gets(null);

        verify(taskerTypeMapper).selectAll();
        assertEquals(retList, list);
    }

    @Test
    public void gets_TypeNotNull() throws Exception {
        String typeName = "TEST";
        List<TaskerType> list = new ArrayList<>();
        doReturn(list).when(taskerTypeMapper).selectByName(typeName);

        List<TaskerType> retList = controller.gets(typeName);

        verify(taskerTypeMapper).selectByName(typeName);
        assertEquals(retList, list);
    }

    @Test
    public void get() throws Exception {
        TaskerType type = new TaskerType();
        doReturn(type).when(taskerTypeMapper).selectById(taskerTypeId);

        TaskerType retType = controller.get(taskerTypeId);

        verify(taskerTypeMapper).selectById(taskerTypeId);
        assertEquals(retType, type);
    }

    @Test
    public void create() throws Exception {
        TaskerType type = new TaskerType();
        type.setTaskerTypeId(taskerTypeId);
        doNothing().when(taskerTypeMapper).insert(type);
        doReturn(type).when(taskerTypeMapper).selectById(taskerTypeId);

        TaskerType retType = controller.create(type);

        verify(taskerTypeMapper).insert(type);
        verify(taskerTypeMapper).selectById(taskerTypeId);
        assertEquals(retType, type);
    }

    @Test
    public void set() throws Exception {
        TaskerType type = new TaskerType();
        type.setTaskerTypeId(taskerTypeId);
        doNothing().when(taskerTypeMapper).update(type);
        doReturn(type).when(taskerTypeMapper).selectById(taskerTypeId);

        TaskerType retType = controller.set(type, taskerTypeId);

        verify(taskerTypeMapper).update(type);
        verify(taskerTypeMapper).selectById(taskerTypeId);
        assertEquals(retType, type);
    }

    @Test
    public void remove() throws Exception {
        doNothing().when(taskerTypeMapper).delete(taskerTypeId);

        controller.remove(taskerTypeId);

        verify(taskerTypeMapper).delete(taskerTypeId);
    }

}