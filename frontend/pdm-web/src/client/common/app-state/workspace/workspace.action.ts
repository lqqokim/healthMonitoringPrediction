import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { StateManager } from '../state-manager.service';
import { AppState } from '../app-state.type';
import { WorkspaceModel, TaskerModel } from './workspace.type';

@Injectable()
export class WorkspaceAction {

    constructor(private store: Store<AppState>, private stateManager: StateManager) { }

    // workspace
    setWorkspaces(workspaces: WorkspaceModel[]) {
        var action = {
            type: ActionType.SET_WORKSPACES,
            payload: {
                workspaces: workspaces
            }
        };

        this.store.dispatch(action);
    }

    addWorkspace(workspace: WorkspaceModel) {
        var action = {
            type: ActionType.ADD_WORKSPACE,
            payload: {
                workspace: workspace
            }
        };

        this.store.dispatch(action);
    }

    removeWorkspace(workspaceId: any) {
        var action = {
            type: ActionType.REMOVE_WORKSPACE,
            payload: {
                workspaceId: workspaceId
            }
        };

        this.store.dispatch(action);
    }

    clearWorkspaces() {
        var action = {
            type: ActionType.CLEAR_WORKSPACES
        };

        this.store.dispatch(action);
    }

    // tasker
    setTaskers(workspaceId: any, taskers: TaskerModel[]) {
        var action = {
            type: ActionType.SET_TASKERS,
            payload: {
                workspaceId: workspaceId,
                taskers: taskers
            }
        };

        this.store.dispatch(action);
    }

    addTasker(tasker: TaskerModel) {
        var action = {
            type: ActionType.ADD_TASKER,
            payload: {
                workspaceId: this.stateManager.getCurrentWorkspaceId(),
                tasker: tasker
            }
        };

        this.store.dispatch(action);
    }

    removeTasker(taskerId: any) {
        var action = {
            type: ActionType.REMOVE_TASKER,
            payload: {
                workspaceId: this.stateManager.getCurrentWorkspaceId(),
                taskerId: taskerId
            }
        };

        this.store.dispatch(action);
    }

    updateTasker(tasker: TaskerModel) {
        var action = {
            type: ActionType.UPDATE_TASKER,
            payload: {
                workspaceId: this.stateManager.getCurrentWorkspaceId(),
                tasker: tasker
            }
        };

        this.store.dispatch(action);
    }

    // tasker select / unselect items
    selectTaskerItem(taskerId: any, items: any) {
        var action = {
            type: ActionType.SELECT_TASKER_CHART_ITEM,
            payload: {
                workspaceId: this.stateManager.getCurrentWorkspaceId(),
                taskerId: taskerId,
                items: items
            }
        };

        this.store.dispatch(action);
    }

    unSelectTaskerItem(taskerId: any, items: any) {
        var action = {
            type: ActionType.UNSELECT_TASKER_CHART_ITEM,
            payload: {
                workspaceId: this.stateManager.getCurrentWorkspaceId(),
                taskerId: taskerId,
                items: items
            }
        };

        this.store.dispatch(action);
    }

    clearSelectedTaskerItems(taskerId: any) {
        var action = {
            type: ActionType.CLEAR_TASKER_CHART_ALL_ITEMS,
            payload: {
                taskerId: taskerId
            }
        };

        this.store.dispatch(action);
    }
}
