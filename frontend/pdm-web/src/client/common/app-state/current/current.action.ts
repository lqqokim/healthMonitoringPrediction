import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class CurrentAction {

    constructor(private store: Store<AppState>) {}
    
    setDashboard(dashboardId: any) {
        var action = {
            type: ActionType.DASHBOARD,
            payload: {
                dashboardId: parseInt(dashboardId, 10),
                widgetId: -1,
                workspaceId: -1,
                taskerId: -1
            }
        };

        this.store.dispatch(action);
    }

    setWorkspace(workspaceId: any, taskerId: any) {
        var action = {
            type: ActionType.WORKSPACE,
            payload: {
                dashboardId: -1,
                widgetId: -1,
                workspaceId: parseInt(workspaceId, 10),
                taskerId: parseInt(taskerId, 10)
            }
        };

        this.store.dispatch(action);
    }

    setTasker(taskerId: any) {
        var action = {
            type: ActionType.WORKSPACE_TASKER,
            payload: {
                dashboardId: -1,
                widgetId: -1,
                workspaceId: -1,
                taskerId: parseInt(taskerId, 10)
            }
        };

        this.store.dispatch(action);
    }
}
