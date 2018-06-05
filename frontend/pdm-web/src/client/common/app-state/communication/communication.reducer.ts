import { ActionReducer, Action } from '@ngrx/store';
import { CommunicationModel } from './communication.type';

export const CommunicationReducer: ActionReducer<CommunicationModel> = (state: CommunicationModel, action: Action) => {

    if (typeof state === 'undefined') {
        state = {
            actionType: undefined,
            params: undefined
        };
    }

    switch (action.type) {
        case ActionType.COMMUNICATION_ADD_DASHBOARD:
            return _addDashboard(state, action);
        case ActionType.COMMUNICATION_REMOVE_DASHBOARD:
            return _removeDashboard(state, action);

        case ActionType.COMMUNICATION_ADD_WIDGET:
        case ActionType.COMMUNICATION_FULLSIZE_WIDGET:
        case ActionType.COMMUNICATION_ORIGINALSIZE_WIDGET:
            return _addWidget(state, action);
        case ActionType.COMMUNICATION_REMOVE_WIDGET:
            return _removeWidget(state, action);

        case ActionType.COMMUNICATION_SHOW_APP_LIST_FOR_WIDGET:
            return _showWidgetAppList(state, action);
        case ActionType.COMMUNICATION_SHOW_APP_LIST_FOR_TASKER:
            return _showTaskerAppList(state, action);

        // case ActionType.COMMUNICATION_REFRESH_SYNC_WIDGET:
        //     return _refreshWidgets(state, action);
        // case ActionType.COMMUNICATION_REFRESH_APPLY_WIDGET:
        //     return _refreshWidgets(state, action);

        case ActionType.COMMUNICATION_REMOVE_WORKSPACE:
            return _removeWorkspace(state, action);
        case ActionType.COMMUNICATION_REMOVE_TASKER:
            return _removeTasker(state, action);

        default:
            return state;
    }

    function _addDashboard(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard
            }
        };
        return state;
    }

    function _removeDashboard(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                dashboardId: action.payload.dashboardId
            }
        };

        return state;
    }

    // widget
    // click widget in widget list
    function _addWidget(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                dashboardId: action.payload.dashboardId,
                widget: action.payload.widget
            }
        };

        return state;
    }

    function _removeWidget(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                dashboardId: action.payload.dashboardId,
                widgetId: action.payload.widgetId
            }
        };

        return state;
    }

    function _showWidgetAppList(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                dashboardId: action.payload.dashboardId,
                widgetId: action.payload.widgetId,
                properties: action.payload.properties,
                syncOutCondition: action.payload.syncOutCondition,
                appListType: action.payload.appListType
            }
        };

        return state;
    }

    function _showTaskerAppList(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                workspaceId: action.payload.workspaceId,
                taskerId: action.payload.taskerId,
                syncOutCondition: action.payload.syncOutCondition,
                appListType: action.payload.appListType
            }
        };

        return state;
    }

    function _refreshWidgets(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                dashboardId: action.payload.dashboardId,
                sourceWidgetId: action.payload.sourceWidgetId,
                widgetId: action.payload.widgetId,
                properties: action.payload.properties,
                selectedItems: action.payload.selectedItems
            }
        };

        return state;
    }

    function _removeWorkspace(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                workspaceId: action.payload.workspaceId
            }
        };

        return state;
    }

    function _removeTasker(state: CommunicationModel, action: any) {
        state = {
            actionType: action.type,
            params: {
                isDashboard: action.payload.isDashboard,
                workspaceId: action.payload.workspaceId,
                taskerId: action.payload.taskerId
            }
        };

        return state;
    }
}