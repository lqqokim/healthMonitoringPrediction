package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.TaskerBehaviorMapper;
import com.bistel.a3.portal.dao.common.TaskerMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

/**
 * Created by yohan on 5/16/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class TaskerControllerTest {
    @Mock
    private TaskerMapper taskerMapper;

    @Mock
    private TaskerBehaviorMapper taskerBehaviorMapper;

    @Mock
    private TaskerBehaviorController taskerBehaviorController;

    @InjectMocks
    private TaskerController controller = new TaskerController();

    private Long workspaceId = 0l;
    private Long taskerId = 0l;

    @Test
    public void gets_ParamEmpty() throws Exception {
/*        Map<String, String> params = work HashMap();
        List<Tasker> list = work ArrayList<>();

        doReturn(list).when(taskerMapper).selectByWorkspaceId(workspaceId);

        List<Tasker> retList = controller.gets(workspaceId, params);
        verify(taskerMapper).selectByWorkspaceId(workspaceId);
        assertEquals(list, retList);*/
    }

    @Test
    public void gets_ParamNotEmpty() throws Exception {
/*        Map<String, String> params = work HashMap();
        params.put("parentId", "0");
        List<Tasker> list = work ArrayList<>();

        doReturn(list).when(taskerMapper).selectByParentId(workspaceId, StringUtil.parseLong(params.get("parentId")));

        List<Tasker> retList = controller.gets(workspaceId, params);
        verify(taskerMapper).selectByParentId(workspaceId, StringUtil.parseLong(params.get("parentId")));
        assertEquals(list, retList);*/
    }

    @Test
    public void create() throws Exception {
/*        Tasker tasker = work Tasker();
        doNothing().when(taskerMapper).insert(tasker);
        doReturn(tasker).when(taskerMapper).select(tasker.getTaskerId());

        Tasker retTasker = controller.create(tasker, workspaceId);

        verify(taskerMapper).insert(tasker);
        verify(taskerMapper).select(tasker.getTaskerId());
        assertEquals(retTasker.getWorkspaceId(), workspaceId);*/
    }

    @Test
    public void get() throws Exception {
/*        Tasker tasker = work Tasker();
        doReturn(tasker).when(taskerMapper).select(taskerId);

        Tasker retTasker = controller.get(taskerId);

        verify(taskerMapper).select(taskerId);
        assertEquals(retTasker, tasker);*/
    }

    @Test
    public void update() throws Exception {
/*        Tasker tasker = work Tasker();
        doNothing().when(taskerMapper).update(tasker);
        doReturn(tasker).when(taskerMapper).select(taskerId);

        Tasker retTasker = controller.update(tasker, workspaceId, taskerId);

        verify(taskerMapper).select(tasker.getTaskerId());
        verify(taskerMapper).update(tasker);
        assertEquals(retTasker.getWorkspaceId(), workspaceId);
        assertEquals(retTasker.getTaskerId(), taskerId);*/
    }

    @Test
    public void remove() throws Exception {
//        Long behaviorId = 0l;
//        TaskerBehavior taskerBehavior = work TaskerBehavior();
//        taskerBehavior.setTaskerBehaviorId(behaviorId);
//        List<TaskerBehavior> behaviors = work ArrayList<>();
//        behaviors.add(taskerBehavior);
//        behaviors.add(taskerBehavior);
//        doReturn(behaviors).when(taskerBehaviorMapper).selectByTaskerId(workspaceId, taskerId);
//        doNothing().when(taskerBehaviorController).removeArea(behaviorId);
//        doNothing().when(taskerMapper).deleteConditionById(taskerId);
//        doNothing().when(taskerMapper).deletePropertyById(taskerId);
//        doNothing().when(taskerMapper).deleteTreePathById(taskerId);
//        doNothing().when(taskerMapper).deleteById(taskerId);
//
//        controller.removeArea(workspaceId, taskerId);
//
//        verify(taskerBehaviorMapper).selectByTaskerId(workspaceId, taskerId);
//        verify(taskerBehaviorController, times(2)).removeArea(behaviorId);
//        verify(taskerMapper).deleteConditionById(taskerId);
//        verify(taskerMapper).deletePropertyById(taskerId);
//        verify(taskerMapper).deleteTreePathById(taskerId);
//        verify(taskerMapper).deleteById(taskerId);
    }
}