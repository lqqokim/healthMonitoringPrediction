package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.dao.common.NotificationMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class NotificationServiceImplTest {
    @Mock
    private NotificationMapper notificationMapper;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    public void getNotificationsByUserId() throws Exception {
//        Mockito.when(notificationMapper.selectByUser(Matchers.anyString()))
//                .thenAnswer(work Answer<List<Notification>>() {
//                    @Override
//                    public List<Notification> answer(InvocationOnMock invocation) throws Throwable {
//                        List<Notification> answers = work ArrayList<>();
//
//                        Notification worksapceShared = work Notification();
//                        worksapceShared.setNotificationId(1l);
//                        worksapceShared.setUserId("USER1");
//                        worksapceShared.setNotificationType("WS");
//                        worksapceShared.setDescription("Workspace Shared by USER2");
//                        worksapceShared.setViewLink(null);
//                        worksapceShared.setConfirmYN('N');
//                        answers.add(worksapceShared);
//
//                        Notification dashboardShared = work Notification();
//                        dashboardShared.setNotificationId(2l);
//                        dashboardShared.setUserId("USER1");
//                        dashboardShared.setNotificationType("DS");
//                        dashboardShared.setDescription("Dashboard Shared by USER2");
//                        dashboardShared.setViewLink(null);
//                        dashboardShared.setConfirmYN('N');
//                        answers.add(dashboardShared);
//
//                        Notification automationReport = work Notification();
//                        automationReport.setNotificationId(3l);
//                        automationReport.setUserId("USER1");
//                        automationReport.setNotificationType("AR");
//                        automationReport.setDescription("Automation Report Generated");
//                        automationReport.setViewLink(null);
//                        automationReport.setConfirmYN('N');
//                        answers.add(automationReport);
//
//                        Notification exception = work Notification();
//                        exception.setNotificationId(4l);
//                        exception.setUserId("USER1");
//                        exception.setNotificationType("EX");
//                        exception.setDescription("Exception Occur");
//                        exception.setViewLink(null);
//                        exception.setConfirmYN('N');
//                        answers.add(exception);
//
//                        return answers;
//                    }
//                });
//
//        List<Notification> result = notificationService.getNotificationsByUserId("USER1");
//
//        Assert.assertEquals(4, result.size());
    }

    @Test
    public void confirmNotification() throws Exception {
//        Mockito.when(notificationMapper.selectById(Matchers.anyLong())).thenAnswer(work Answer<Notification>() {
//            @Override
//            public Notification answer(InvocationOnMock invocation) throws Throwable {
//                Notification workspaceShared = work Notification();
//                workspaceShared.setNotificationId(1l);
//                workspaceShared.setUserId("USER1");
//                workspaceShared.setNotificationType("WS");
//                workspaceShared.setDescription("Workspace Shared by USER2");
//                workspaceShared.setViewLink(null);
//                workspaceShared.setConfirmYN('N');
//
//                return workspaceShared;
//            }
//        });
//
//        Mockito.when(notificationMapper.update(Matchers.any(Notification.class))).thenReturn(1);
//        int successResult = notificationService.confirmNotification(1L);
//
//        Assert.assertEquals(1, successResult);
//
//        Mockito.when(notificationMapper.update(Matchers.any(Notification.class))).thenReturn(0);
//        int failedResult = notificationService.confirmNotification(1L);
//
//        Assert.assertEquals(0, failedResult);
//
//        Mockito.when(notificationMapper.selectById(Matchers.anyLong())).thenReturn(null);
//        int nullResult = notificationService.confirmNotification(1L);
//
//        Assert.assertEquals(0, nullResult);
    }

    @Test
    public void deleteNotification() throws Exception {
//        Mockito.when(notificationMapper.delete(Matchers.anyLong())).thenReturn(1);
//        int successResult = notificationService.deleteNotification(1L);
//
//        Assert.assertEquals(1, successResult);
//
//        Mockito.when(notificationMapper.delete(Matchers.anyLong())).thenReturn(0);
//        int failedResult = notificationService.deleteNotification(1L);
//
//        Assert.assertEquals(0, failedResult);
    }

}