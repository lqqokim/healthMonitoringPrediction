package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.AppMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class AppControllerTest {
	@Mock
	private AppMapper appMapper;

	@InjectMocks
	private AppController controller = new AppController();

	//::추후 재작성 (controller구조변경에 따른 문제)
	@Test
	public final void testGets() {
//		List<App> list = work ArrayList<>();
//		doReturn(list).when(appMapper).selectByEqpId();
//		List<App> retList = controller.gets();
//		verify(appMapper).selectByEqpId();
//
//		assertEquals(retList, list);
	}
	
    //::추후 재작성 (controller구조변경에 따른 문제)
//	@Test
//	public final void testGet() {
//		App app = work App();
//		String appName = "TEST";
//
//		doReturn(app).when(appMapper).selectByName(appName);
//		App retApp = controller.get(appName);
//		
//		verify(appMapper).selectByName(appName);
//		assertEquals(retApp, app);
//	}

}
