import { ActionReducer, Action } from '@ngrx/store';
import { CurrentModel } from './current.type';

export const CurrentReducer: ActionReducer<CurrentModel> = (state: CurrentModel, action: Action) => {
    //console.log('>> current.reducer state', state);
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            homeType: ActionType.DASHBOARD,
            actionType: undefined,
            dashboardId: -1,
            widgetId: -1,
            workspaceId: -1,
            taskerId: -1,
            applicationId: undefined,
            menuId: undefined,
            isDashboard: function () {
                return true;
            },
            currentPage: -1
        };
    }

    let widgetId: number = -1;
    if (action.payload) {
        if (action.payload.widgetId) {
            widgetId = action.payload.widgetId;
        } else if(action.payload.widget) {
            widgetId = action.payload.widget.widgetId;
        }
    } else {
        widgetId = state.widgetId;
    }

    switch (action.type) {
        case ActionType.DASHBOARD:
            return {
                homeType: ActionType.DASHBOARD,
                actionType: action.type,
                dashboardId: payload.dashboardId,
                widgetId: widgetId,
                workspaceId: -1,
                taskerId: -1,
                applicationId: undefined,
                menuId: undefined,
                isDashboard: function () {
                    return true;
                },
                currentPage: state.currentPage
            };
        case ActionType.WORKSPACE:
            return {
                homeType: ActionType.WORKSPACE,
                actionType: action.type,
                dashboardId: -1,
                widgetId: -1,
                workspaceId: payload.workspaceId,
                taskerId: payload.taskerId,
                applicationId: undefined,
                menuId: undefined,
                isDashboard: function () {
                    return false;
                },
                currentPage: -1
            };
        case ActionType.WORKSPACE_TASKER:
            return {
                homeType: ActionType.WORKSPACE,
                actionType: action.type,
                dashboardId: -1,
                widgetId: -1,
                workspaceId: state.workspaceId,
                taskerId: payload.taskerId,
                applicationId: undefined,
                menuId: undefined,
                isDashboard: function () {
                    return false;
                },
                currentPage: -1
            };
        default:
            return {
                homeType: state.homeType,
                actionType: action.type ? action.type : state.actionType,
                dashboardId: state.dashboardId,
                widgetId: widgetId,
                workspaceId: state.workspaceId,
                taskerId: state.taskerId,
                applicationId: action.payload ? action.payload.applicationId : state.applicationId,
                menuId: action.payload ? action.payload.menuId : state.menuId,
                isDashboard: function () {
                    return this.homeType === ActionType.DASHBOARD;
                },
                currentPage: state.currentPage
            };
    }
};
