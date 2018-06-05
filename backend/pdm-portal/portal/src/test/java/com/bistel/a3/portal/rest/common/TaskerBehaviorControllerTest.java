package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.TaskerBehaviorMapper;
import com.bistel.a3.portal.dao.common.TaskerBehaviorTypeMapper;
import com.bistel.a3.portal.service.impl.TaskerExecuteService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.context.ApplicationContext;

@RunWith(MockitoJUnitRunner.class)
public class TaskerBehaviorControllerTest {
    @Mock
    private ApplicationContext context;

    @Mock
    private TaskerBehaviorMapper taskerBehaviorMapper;
    
    @Mock
    private TaskerExecuteService taskerExecuteService;

    @Mock
    private TaskerBehaviorTypeMapper taskerBehaviorTypeMapper;
    

    
    @InjectMocks
    private TaskerBehaviorController controller;
    
    private Long workspaceId = 0l;
    private Long taskerId = 0l;
    private Long taskerBehaviorId = 0l;

	@Test
	public final void testGets() {
/*		List<TaskerBehavior> list = work ArrayList<>();
		
		doReturn(list).when(taskerBehaviorMapper).selectByTaskerId(workspaceId, taskerId);
		
		Object ret = controller.gets(workspaceId, taskerId);
		
		verify(taskerBehaviorMapper).selectByTaskerId(workspaceId, taskerId);

		assertEquals(ret, list);*/
	}

	@Test
	public final void testGet() {
/*		TaskerBehavior value = work TaskerBehavior();
		
		doReturn(value).when(taskerBehaviorMapper).select(taskerBehaviorId);
		
		Object ret = controller.get(taskerBehaviorId);
		
		verify(taskerBehaviorMapper).select(taskerBehaviorId);
		assertEquals(ret, value);*/
	}

	@Test
	public final void testStatus() {
/*		TaskerBehavior value = work TaskerBehavior();
		value.setStatus(BEHAVIOR_STATUS.DONE);
		
		doReturn(value).when(taskerBehaviorMapper).select(taskerBehaviorId);
		
		Object ret = controller.status(taskerBehaviorId);
		
		verify(taskerBehaviorMapper).select(taskerBehaviorId);
		assertEquals((BEHAVIOR_STATUS)ret, value.getEqpStatus());*/
	}

	@Test
	public final void testOutput() {
/*		TaskerBehaviorData value = work TaskerBehaviorData();
		JsonNode output = work TextNode("TEST");
		value.setOutput(output);
		
		doReturn(value).when(taskerBehaviorMapper).selectOutput(taskerBehaviorId);
		
		Object ret = controller.output(taskerBehaviorId);
		
		verify(taskerBehaviorMapper).selectOutput(taskerBehaviorId);
		assertEquals((JsonNode)ret, value.getOutput());*/
	}

	@Test
	public final void testInput() {
/*		TaskerBehaviorData value = work TaskerBehaviorData();
		JsonNode input = work TextNode("TEST");
		value.setInput(input);
		
		doReturn(value).when(taskerBehaviorMapper).selectOutput(taskerBehaviorId);
		
		Object ret = controller.input(taskerBehaviorId);
		
		verify(taskerBehaviorMapper).selectOutput(taskerBehaviorId);
		assertEquals((JsonNode)ret, value.getInput());*/
	}

/*	@Test(expected = RuntimeException.class)
	public final void testSet_Exception() {
		BehaviorRequest request = work BehaviorRequest();
		TaskerBehaviorType tbt = null;
		
		doNothing().when(taskerBehaviorMapper).insert(Matchers.<TaskerBehavior>anyObject());
		doNothing().when(taskerBehaviorMapper).insertData(Matchers.<TaskerBehaviorData>anyObject());
		doReturn(tbt).when(taskerBehaviorTypeMapper).selectByName("TEST");
		
		controller.setArea(taskerId, request);
		
		verify(taskerBehaviorMapper).insert(Matchers.<TaskerBehavior>anyObject());
		verify(taskerBehaviorMapper).insertData(Matchers.<TaskerBehaviorData>anyObject());
		verify(taskerBehaviorTypeMapper).selectByName("TEST");
	}*/
	

	@Test
	public final void testRemove() {
/*		doNothing().when(taskerBehaviorMapper).deleteData(taskerBehaviorId);
		doNothing().when(taskerBehaviorMapper).delete(taskerBehaviorId);
		
		controller.removeArea(taskerBehaviorId);
		
		verify(taskerBehaviorMapper).deleteData(taskerBehaviorId);
		verify(taskerBehaviorMapper).delete(taskerBehaviorId);*/
	}

}
