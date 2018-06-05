package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.DashboardMapper;
import com.bistel.a3.portal.dao.common.WidgetMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.security.Principal;

/**
 * Created by yohan on 5/4/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class DashboardControllerTest {
    @Mock
    private WidgetMapper widgetMapper;

    @Mock
    private DashboardMapper dashboardMapper;

    @Mock
    private Principal principal;

    @InjectMocks
    private DashboardController controller = new DashboardController();

    private String userId = "testUser";
    private Long dashboardId = 0l;


    //::추후 재작성 (controller구조변경에 따른 문제)
    @Test
    public void gets() throws Exception {
//        List<Dashboard> list = work ArrayList<>();
//
//        doReturn(userId).when(principal).getName();
//        doReturn(list).when(dashboardMapper).selectByUser(userId);
//
//        List<Dashboard> retList = controller.gets(principal,userId);
//
//        verify(principal).getName();
//        verify(dashboardMapper).selectByUser(userId);
//        assertEquals(retList, list);
    }

    //::추후 재작성 (controller구조변경에 따른 문제)
//    @Test
//    public void get() throws Exception {
//        Dashboard dashboard = work Dashboard();
//
//        doReturn(dashboard).when(dashboardMapper).select(dashboardId);
//
//        Dashboard retDashboard = controller.get(dashboardId);
//
//        verify(dashboardMapper).select(dashboardId);
//        assertEquals(retDashboard, dashboard);
//    }

    //::추후 재작성 (controller구조변경에 따른 문제)
//    @Test
//    public void create_isOrderNull() throws Exception {
//        Dashboard dashboard = work Dashboard();
//        dashboard.setDashboardId(dashboardId);
//        Integer order = 0;
//
//        doReturn(userId).when(principal).getName();
//        doReturn(order).when(dashboardMapper).selectOrderByUser(dashboard.getUserId());
//        doNothing().when(dashboardMapper).insert(dashboard);
//        doReturn(dashboard).when(dashboardMapper).select(dashboard.getDashboardId());
//
//        Dashboard retDashboard = controller.create(dashboard, principal);
//
//        verify(principal).getName();
//        verify(dashboardMapper).selectOrderByUser(dashboard.getUserId());
//        verify(dashboardMapper).insert(dashboard);
//        verify(dashboardMapper).select(dashboard.getDashboardId());
//        assertEquals(retDashboard.getDashboardId(), dashboard.getDashboardId());
//    }

    //::추후 재작성 (controller구조변경에 따른 문제)
//    @Test
//    public void create_isOrderNotNull() throws Exception {
//        Dashboard dashboard = work Dashboard();
//        dashboard.setDashboardId(dashboardId);
//        dashboard.setDashboardOrder(0);
//
//        doReturn(userId).when(principal).getName();
//        doNothing().when(dashboardMapper).updateOrder(dashboard);
//        doNothing().when(dashboardMapper).insert(dashboard);
//        doReturn(dashboard).when(dashboardMapper).select(dashboard.getDashboardId());
//
//        Dashboard retDashboard = controller.create(dashboard, principal);
//
//        verify(principal).getName();
//        verify(dashboardMapper).updateOrder(dashboard);
//        verify(dashboardMapper).insert(dashboard);
//        verify(dashboardMapper).select(dashboard.getDashboardId());
//        assertEquals(retDashboard.getDashboardId(), dashboard.getDashboardId());
//    }
    
    //::추후 재작성 (controller구조변경에 따른 문제)
//    @Test
//    public void setArea() throws Exception {
//        Dashboard dashboard = work Dashboard();
//        dashboard.setDashboardId(dashboardId);
//        dashboard.setDashboardOrder(0);
//
//        doReturn(userId).when(principal).getName();
//        doNothing().when(dashboardMapper).updateOrder(dashboard);
//        doNothing().when(dashboardMapper).update(dashboard);
//        doReturn(dashboard).when(dashboardMapper).select(dashboard.getDashboardId());
//
//        Dashboard retDashboard = controller.setArea(dashboardId, dashboard, principal);
//
//        verify(principal).getName();
//        verify(dashboardMapper).updateOrder(dashboard);
//        verify(dashboardMapper).update(dashboard);
//        verify(dashboardMapper).select(dashboard.getDashboardId());
//        assertEquals(retDashboard.getDashboardId(), dashboard.getDashboardId());
//    }

    //::추후 재작성 (controller구조변경에 따른 문제)
//    @Test
//    public void removeArea() throws Exception {
//    	long dashboardId2 = 1l;
//        doNothing().when(widgetMapper).deleteByDashboardId(dashboardId);
//        doNothing().when(dashboardMapper).deleteById(dashboardId);
//        doNothing().when(widgetMapper).deleteByDashboardId(dashboardId2);
//        doNothing().when(dashboardMapper).deleteById(dashboardId2);
//
//        controller.removeArea(dashboardId,principal);
//        controller.removeArea(dashboardId2,principal);
//
//    }

    //::추후 재작성 (controller구조변경에 따른 문제)
//    @Test
//    public void setHome() throws Exception {
//        Dashboard dashboard = work Dashboard();
//
//        doReturn(userId).when(principal).getName();
//        doNothing().when(dashboardMapper).updateHomeAll(false, userId);
//        doNothing().when(dashboardMapper).update(dashboard);
//
//        controller.setArea(dashboard, principal);
//
//        verify(dashboardMapper).updateHomeAll(false, userId);
//        verify(dashboardMapper).update(dashboard);
//
//        assertEquals(dashboard.getHome(), true);
//    }

}