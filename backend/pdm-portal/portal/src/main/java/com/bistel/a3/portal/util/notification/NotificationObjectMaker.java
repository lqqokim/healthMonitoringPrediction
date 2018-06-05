package com.bistel.a3.portal.util.notification;

import com.bistel.a3.portal.domain.common.Notification;
import com.bistel.a3.portal.enums.NOTIFICATION_TYPE;

import java.util.Date;

public class NotificationObjectMaker {
	
	private static final String DASHBOARD_LINK_URL ="/dashboards/";
	private static final String WORKSPACES_LINK_URL = "/workspaces/"; 

	/**
	 * 
	 * @param dashboardId
	 * @param dashboardName
	 * @param ownerId
	 * @param sourceUserId
	 * @param targetUserId
	 * @return
	 */
	public Notification makeDashboardShareCreateNotification(Long dashboardId, 
			       String dashboardName, String ownerId, String sourceUserId, String targetUserId) {
		
		String description = ownerId + " shared '" + dashboardName + "(id:" + dashboardId + ")' dashboard.";
		String linkUrl = DASHBOARD_LINK_URL + dashboardId;

		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.DS), linkUrl);
		
		return notification;
	}
	

	/**
	 * 
	 * @param dashboardId
	 * @param dashboardName
	 * @param ownerId
	 * @param sourceUserId
	 * @param targetUserId
	 * @return
	 */
    public Notification makeDashboardShareDeletedNotification(Long dashboardId, String dashboardName,  
    		       String ownerId, String sourceUserId, String targetUserId) {
		
		String description = ownerId + " has deleted the share on the '" + dashboardName +"(id:" + dashboardId +")' dashboard.";
		
		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.DS), "");			
		
		return notification;
	}	
	
	/**
	 * 
	 * @param dashboardId
	 * @param dashboardName
	 * @param ownerId
	 * @param sourceUserId
	 * @param targetUserId
	 * @return
	 */
    public Notification makeDashboardShareDeleteNotification(Long dashboardId, 
    		       String dashboardName, String ownerId, String sourceUserId, String targetUserId) {
		
			
		String description = sourceUserId + " has deleted the share on the '" + dashboardName +"(id:" + dashboardId +")' dashboard.";
		
		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.DS), "");			
		
		return notification;
	}    
    
	/**
	 * 
	 * @param dashboardId
	 * @param dashboardName
	 * @param ownerId
	 * @param sourceUserId
	 * @param targetUserId
	 * @return
	 */
    public Notification makeDashboardDeleteNotification(Long dashboardId, String dashboardName,
    		       String ownerId, String sourceUserId, String targetUserId) {
		
			
		String description = ownerId + " removed the '" + dashboardName +"(id:" + dashboardId +")' dashboard.";
		
		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.DS), "");			
		
		return notification;
	}   

	/**
	 * 
	 * @param workspaceId
	 * @param workspaceName
	 * @param ownerId
	 * @param sourceUserId
	 * @param targetUserId
	 * @return
	 */
	public Notification makeWorkspaceShareCreateNotification(Long workspaceId, 
			       String workspaceName, String ownerId, String sourceUserId, String targetUserId) {
		
		String description = ownerId + " shared '" + workspaceName + "(id:" + workspaceId + ")' workspace.";
		String linkUrl = WORKSPACES_LINK_URL + workspaceId;
		
		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.WS), linkUrl);
		
		return notification;
	}
	

   /**
    * 
    * @param workspaceId
    * @param workspaceName
    * @param ownerId
    * @param sourceUserId
    * @param targetUserId
    * @return
    */
    public Notification makeWorkspaceShareDeletedNotification(Long workspaceId, String workspaceName, 
    		       String ownerId, String sourceUserId, String targetUserId) {
    	String description = "";
    	if (sourceUserId.equals(ownerId)) {
    		description = sourceUserId + " has deleted own workspace '" + workspaceName +"(id:" + workspaceId +")'.";
    	} else {
    		description = sourceUserId + " has deleted " + ownerId + "'s shared-workspace '" + workspaceName +"(id:" + workspaceId +")' workspace.";	
    	}
		
		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.WS), "");
		
		return notification;
	}
    
    /**
     * 
     * @param workspaceId
     * @param workspaceName
     * @param ownerId
     * @param sourceUserId
     * @param targetUserId
     * @return
     */
     public Notification makeWorkspaceSharingDeletedNotification(Long workspaceId, String workspaceName, 
     		       String ownerId, String sourceUserId, String targetUserId) {
     	String description = sourceUserId + " has removed share relation on '" + workspaceName +"(id:" + workspaceId +")' workspace.";	

 		
 		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.WS), "");
 		
 		return notification;
 	}
    
    
    /**
     * 
     * @param workspacdId
     * @param workspaceName
     * @param ownerId
     * @param sourceUserId
     * @param targetUserId
     * @return
     */
     public Notification makeWorkspaceShareDeleteNotification(Long workspacdId, String workspaceName, 
     		        String ownerId, String sourceUserId, String targetUserId) {
 		
 		String description = sourceUserId + " has deleted the share on the '" + workspaceName +"(id:" + workspacdId +")' workspace.";
 		
 		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.WS), "");
 		
 		return notification;
 	}
     
    
    
    /**
     * 
     * @param workspaceId
     * @param workspaceName
     * @param ownerId
     * @param sourceUserId
     * @param targetUserId
     * @return
     */
     public Notification makeWorkspaceDeleteNotification(Long workspaceId, String workspaceName, 
     		       String ownerId, String sourceUserId, String targetUserId) {
 		
 		String description = sourceUserId + " removed the '" + workspaceName + "(id:" + workspaceId +")' workspace.";

 		Notification notification = getNotificationObject(description, sourceUserId, targetUserId, NOTIFICATION_TYPE.getValue(NOTIFICATION_TYPE.WS), "");
 		
 		return notification;
 	}


    private Notification getNotificationObject(String description, String sourceUserId, String targetUserId, 
    		     String notificationType, String linkUrl) {
    	
    	Date currentDate = new Date();
    	Notification notification = new Notification();

		notification.setSourceUserId(sourceUserId);		
		notification.setTargetUserId(targetUserId);
		notification.setNotificationType(notificationType); //MESSAGE
		notification.setMessage(description);
		notification.setLinkUrl(linkUrl);
		notification.setDetailViewYN(false);
    	notification.setDetailViewDtts(null);
		notification.setReadYN(false);
		notification.setReadDtts(null);
		notification.setCreateDtts(currentDate);
		notification.setUpdateDtts(currentDate);
		
		return notification;
    }
}
