import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
    StateManager,
    CurrentAction,
    CurrentModel,
    WorkspaceAction,
    TaskerModel
} from '../../../common';

import { WorkspaceService } from '../workspace.service';

@Component({
    moduleId: module.id,
    selector: 'div[a3p-workspace]',
    templateUrl: 'workspace.html',
    host: {
        'style': 'height: 100%'
    }
})
export class WorkspaceComponent implements OnInit, OnDestroy {

    taskerModel: TaskerModel;
    private _currentSubscription: Subscription;

    constructor(
        private stateManager: StateManager,
        private currentAction: CurrentAction,
        private workspaceAction: WorkspaceAction,
        private workspace: WorkspaceService
    ) { }

    ngOnInit() {
        this._setState();
    }

    private _setState() {
        // current 
        const current$ = this.stateManager.rxCurrent();
        this._currentSubscription = current$.subscribe((current: CurrentModel) => {
            if (current.homeType === ActionType.DASHBOARD) {
                this.ngOnDestroy();
            }
            else if (current.homeType === ActionType.WORKSPACE
                && (current.actionType === ActionType.SET_WORKSPACES
                    || current.actionType === ActionType.ROUTER_CHANGE_SUCCESS)) {
                // 라우팅 할 경우 
                if (this._isNewTasker(current.workspaceId, current.taskerId)) {
                    this._setTasker(current.workspaceId, current.taskerId);
                }
            }
            else if (current.homeType === ActionType.WORKSPACE
                && (current.workspaceId > 0 && current.taskerId > 0)) {
                // history back 할 경우 
                if (this._isNewTasker(current.workspaceId, current.taskerId)) {
                    this._setTasker(current.workspaceId, current.taskerId);
                }
            }
        }, this._handleError);
    }

    private _isNewTasker(workspaceId: number, taskerId: number) {
        return (workspaceId > 0 && taskerId > 0)
            && this.stateManager.getWorkspaces().length > 0
            && (!this.taskerModel || (this.taskerModel.taskerId !== taskerId));
    }

    private _setTasker(workspaceId: number, taskerId: number) {
        const taskers = this.stateManager.getTaskers(workspaceId);
        if (!_.isArray(taskers) || taskers.length === 0) {
            if (this.stateManager.getWorkspace()) {
                this.workspace
                    .getTaskers(workspaceId)
                    .then((taskers) => {
                        this.workspaceAction.setTaskers(workspaceId, taskers);
                        this._setTaskerModel(workspaceId, taskerId);
                        this._titleChange(_.string.sprintf('[%d] %s', workspaceId, this.taskerModel.title));
                    }, (err: any) => {
                        console.error('Workspace component setTasker', err);
                    });
            }
        } else {
            this._setTaskerModel(workspaceId, taskerId);
            this._titleChange(_.string.sprintf('[%d] %s', workspaceId, this.taskerModel.title));
        }
    }

    private _setTaskerModel(workspaceId: number, taskerId: number) {
        let model = this.stateManager.getTasker(workspaceId, taskerId);
        // set workspacdId into TaskerModel
        model.workspaceId = workspaceId;
        this.taskerModel = model;
    }

    private _titleChange(title: string) {
        jQuery(document).attr({
            title: title
        });
    }

    private _handleError(e: any) {
        console.log('Workspace Root Component, Exception', e);
    }

    ngOnDestroy() {
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }
    }
}