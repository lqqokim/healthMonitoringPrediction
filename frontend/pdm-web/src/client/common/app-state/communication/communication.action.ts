import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';
import { StateManager } from '../state-manager.service';

@Injectable()
export class CommunicationAction {

    constructor(
        private store: Store<AppState>,
        private stateManager: StateManager
    ) {}

    addDashboard() {
        var action = {
            type: ActionType.COMMUNICATION_ADD_DASHBOARD,
            payload: {
                isDashboard: true
            }
        };

        this.store.dispatch(action);
    }

    removeDashboard(dashboardId: any) {
        var action = {
            type: ActionType.COMMUNICATION_REMOVE_DASHBOARD,
            payload: {
                isDashboard: true,
                dashboardId: dashboardId
            }
        };

        this.store.dispatch(action);
    }

    // widget
    addWidget(widget: any) {
        var action = {
            type: ActionType.COMMUNICATION_ADD_WIDGET,
            payload: {
                isDashboard: true,
                dashboardId: this.stateManager.getCurrentDashboardId(),
                currentPage: this.stateManager.getCurrentDashboardPage(),
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    originalSizeWidget(widget: any) {
        var action = {
            type: ActionType.COMMUNICATION_ORIGINALSIZE_WIDGET,
            payload: {
                isDashboard: true,
                dashboardId: this.stateManager.getCurrentDashboardId(),
                currentPage: this.stateManager.getCurrentDashboardPage(),
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    fullSizeWidget(widget: any) {
        var action = {
            type: ActionType.COMMUNICATION_FULLSIZE_WIDGET,
            payload: {
                isDashboard: true,
                dashboardId: this.stateManager.getCurrentDashboardId(),
                currentPage: this.stateManager.getCurrentDashboardPage(),
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    removeWidget(widgetId: any) {
        var action = {
            type: ActionType.COMMUNICATION_REMOVE_WIDGET,
            payload: {
                isDashboard: true,
                dashboardId: this.stateManager.getCurrentDashboardId(),
                currentPage: this.stateManager.getCurrentDashboardPage(),
                widgetId: widgetId
            }
        };

        this.store.dispatch(action);
    }

    showWidgetAppList(widgetId: number, properties: any, syncOutCondition: any, appListType: any) {
        var action = {
            type: ActionType.COMMUNICATION_SHOW_APP_LIST_FOR_WIDGET,
            payload: {
                isDashboard: true,
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widgetId,
                properties,
                syncOutCondition,
                appListType
            }
        };

        this.store.dispatch(action);
    }

    showTaskerAppList(taskerId: any, syncOutCondition: any, appListType: any) {
        var action = {
            type: ActionType.COMMUNICATION_SHOW_APP_LIST_FOR_TASKER,
            payload: {
                isDashboard: false,
                workspaceId: this.stateManager.getCurrentWorkspaceId(),
                taskerId,
                syncOutCondition,
                appListType
            }
        };

        this.store.dispatch(action);
    }

    // 1) refresh communication: sync to other widget
    // 3) refresh menu in widget menu
    // refreshSyncWidget(targetWidgetId: any, params: any) {
    //     var action = {
    //         type: ActionType.COMMUNICATION_REFRESH_SYNC_WIDGET,
    //         payload: {
    //             dashboardId: this.stateManager.getCurrentDashboardId(),
    //             sourceWidgetId: params.widgetId,
    //             widgetId: targetWidgetId,
    //             properties: params.properties,
    //             selectedItems: params.selectedItems
    //         }
    //     };

    //     this.store.dispatch(action);
    // }

    // 2) refresh in configuration: widget configuration
    // refreshApplyWidget(targetWidgetId: any, params: any) {
    //     var action = {
    //         type: ActionType.COMMUNICATION_REFRESH_APPLY_WIDGET,
    //         payload: {
    //             dashboardId: this.stateManager.getCurrentDashboardId(),
    //             sourceWidgetId: params.widgetId,
    //             widgetId: targetWidgetId,
    //             properties: params.properties,
    //             selectedItems: params.selectedItems
    //         }
    //     };

    //     this.store.dispatch(action);
    // }

    removeWorkspace(workspaceId: any) {
        var action = {
            type: ActionType.COMMUNICATION_REMOVE_WORKSPACE,
            payload: {
                isDashboard: false,
                workspaceId: workspaceId
            }
        };

        this.store.dispatch(action);
    }

    /**
     * 2016.07.18 hongsikyoo
     * workspaceId parameter 추가
     * acubedmap에서 tasker 삭제시 사용
     * 하위 tasker까지 모두 삭제하기 때문에 관련된 로직 확인 필요
     */
    removeTasker(workspaceId: any, taskerId: any) {
        var action = {
            type: ActionType.COMMUNICATION_REMOVE_TASKER,
            payload: {
                isDashboard: false,
                workspaceId: workspaceId,
                taskerId: taskerId
            }
        };

        this.store.dispatch(action);
    }

    /*
    removeTasker(taskerId) {
        var action = {
            type: ActionType.COMMUNICATION_REMOVE_TASKER,
            payload: {
                workspaceId: this.stateManager.getCurrentWorkspaceId(),
                taskerId: taskerId
            }
        };

        this.store.dispatch(action);
    }
    */
}
