interface IActionType {
	////////////////////////////////////////
	// Sample
	COUNTER_INCREMENT: string;
	COUNTER_DECREMENT: string;

	////////////////////////////////////////
	// current to dashboard; workspace when routing
	DASHBOARD: string;
	WORKSPACE: string;
	WORKSPACE_TASKER: string;
	APPCONFIG: string;
	GLOBALCONFIG: string;
	USERCONFIG: string;


	SIGNED_USER: string;
	LOGOUT_USER: string;

	CHECK_PAGE: string;

	////////////////////////////////////////
	// DASHBOARD
	SET_DASHBOARDS: string;
	ADD_DASHBOARD: string;
	UPDATE_DASHBOARD: string;
	UPDATE_DASHBOARD_ORDER: string;
	REMOVE_DASHBOARD: string;
	CLEAR_DASHBOARDS: string;
	SET_HOME_DASHBOARD: string;
	SET_CURRENT_PAGE_IN_DASHBOARD: string
	MOVE_WIDGET_IN_DASHBOARD: string

	////////////////////////////////////////
	// WIDGET
	ADD_WIDGET: string;
	ADDING_WIDGET: string;
	REMOVE_WIDGET: string;
	UPDATE_WIDGET: string;
	UPDATE_WIDGET_SIZE: string;
	UPDATE_WIDGET_TITLE: string;

	SELECT_WIDGET_CHART_ITEM: string;
	UNSELECT_WIDGET_CHART_ITEM: string;
	CLEAR_WIDGET_CHART_ALL_ITEMS: string;

	////////////////////////////////////////
	// WORKSPACE
	SET_WORKSPACES: string;
	ADD_WORKSPACE: string;
	REMOVE_WORKSPACE: string;
	CLEAR_WORKSPACES: string;

	////////////////////////////////////////
	// TASKER
	SET_TASKER: string;
	SET_TASKERS: string;
	ADD_TASKER: string;
	REMOVE_TASKER: string;
	UPDATE_TASKER: string;

	SELECT_TASKER_CHART_ITEM: string;
	UNSELECT_TASKER_CHART_ITEM: string;
	CLEAR_TASKER_CHART_ALL_ITEMS: string;

	////////////////////////////////////////
	// GMB Sidebar
	// open close
	OPEN_SIDE_BAR_SMALL: string;
	OPEN_SIDE_BAR_FULL: string;
	CLOSE_SIDE_BAR: string;

	OPEN_FILTER_CONTAINER: string;
	CLOSE_FILTER_CONTAINER: string;

	// GMB Type Id
	// must set directive name
	GNB_APP_LIST: string;
	GNB_WIDGET_LIST: string;
	GNB_NOTICE_LIST: string;
	GNB_DASHBOARD_LIST: string;
	GNB_ACUBED_MAP: string;
	GNB_ACUBED_NET: string;
	GNB_APP_CONFIG: string;

	// widget configuration
	OPEN_WIDGET_PROPERTIES: string;
	CLOSE_WIDGET_PROPERTIES: string;
	APPLY_WIDGET_PROPERTIES: string;

	// in ther future
	OPEN_TASKER_PROPERTIES: string;
	CLOSE_TASKER_PROPERTIES: string;
	APPLY_TASKER_PROPERTIES: string;

	////////////////////////////////////////
	// ROUTER
	ROUTER_CHANGE_START: string;
	ROUTER_CHANGE_SUCCESS: string;
	ROUTER_NOT_FOUND: string;
	ROUTER_CHANGE_ERROR: string;

	////////////////////////////////////////
	// Communication Instantly
	// widget
	COMMUNICATION_ADD_WIDGET: string;
	COMMUNICATION_REMOVE_WIDGET: string;
	COMMUNICATION_FULLSIZE_WIDGET: string;
	COMMUNICATION_ORIGINALSIZE_WIDGET: string;

	COMMUNICATION_SHOW_APP_LIST_FOR_WIDGET: string;
	COMMUNICATION_SHOW_APP_LIST_FOR_TASKER: string;
	// COMMUNICATION_REFRESH_SYNC_WIDGET: string;
	// COMMUNICATION_REFRESH_APPLY_WIDGET: string;

	// dashboard
	COMMUNICATION_ADD_DASHBOARD: string;
	COMMUNICATION_REMOVE_DASHBOARD: string;


	COMMUNICATION_REMOVE_WORKSPACE: string;
	COMMUNICATION_REMOVE_TASKER: string;

	////////////////////////////////////////
	// Notify
	NOTIFY_ERROR: string;
	NOTIFY_SUCCESS: string;

	SYNC_OUT_CONDITION: string;

	SHOW_CONTEXT_MENU: string;
	CLOSE_CONTEXT_MENU: string;

	////////////////////////////////////////
	// Modal
	SHOW_CONFIRM_MODAL: string;
	SHOW_CONFIRM_DELETE_MODAL: string;
	SHOW_ALERT_MODAL: string;
	SHOW_SHARE_MODAL: string;
	SHOW_WORKSPACE_EDIT_MODAL: string;
	SHOW_CONFIGURATION_EDIT_MODAL: string;
	SHOW_APPLY_MODULE_MODAL: string;

	////////////////////////////////////////
	// Push based on WebSocket
	PUSH_SHARED_DASHBOARD: string;
	PUSH_SHARED_WORKSPACE: string;
	PUSH_PREDEFINED_DASHBOARD: string;
	PUSH_DELETE_USER: string

	////////////////////////////////////////
	// Link based on email, notification
	LINK_SAVE_PARAMS: string;

}

declare var ActionType: IActionType;
