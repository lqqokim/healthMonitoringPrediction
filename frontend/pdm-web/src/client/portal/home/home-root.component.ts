import { Component,
    OnInit,
    OnDestroy,
    HostBinding
} from '@angular/core';
import {
    ActivatedRoute,
    Router
} from '@angular/router';

import { StateManager, CurrentModel } from '../../common';

@Component({
    moduleId: module.id,
    selector: 'div.a3-wrapper',
    templateUrl: 'home-root.html'
})
export class HomeRootComponent implements OnInit, OnDestroy {

    // 'a3-dashboard': isDashboard, 'a3-workspace': isWorkspace, 'a3-app-configuration': isAppconfig
    @HostBinding('class.a3-dashboard') isDashboard: boolean;
    @HostBinding('class.a3-workspace') isWorkspace: boolean;
    @HostBinding('class.a3-app-configuration') isAppconfig: boolean;
    subscription: any;

    constructor(
        private stateManager: StateManager
    ) { }

    ngOnInit() {
        this._setCurrentState();
    }

    private _setCurrentState() {
        const current$ = this.stateManager.rxCurrent();
        this.subscription = current$.subscribe((current: CurrentModel) => {
            if (current.homeType === ActionType.WORKSPACE) {
                let tasker = this.stateManager.getTasker(current.workspaceId, current.taskerId);
                if (tasker) {
                    this._titleChange(_.string.sprintf('[%d] %s', current.workspaceId, tasker.title));
                }
                this.isDashboard = false;
                this.isWorkspace = true;
                this.isAppconfig = false;
            } else if (current.homeType === ActionType.DASHBOARD) {
                let dashboard = this.stateManager.getDashboard(current.dashboardId);
                if (dashboard) {
                    this._titleChange(dashboard.title);
                }
                this.isDashboard = true;
                this.isWorkspace = false;
                this.isAppconfig = false;
            } else {
                this._titleChange(A3_CONFIG.INFO.TITLE);
                this.isDashboard = false;
                this.isWorkspace = false;
                this.isAppconfig = true;
            }

            // TODO: try to check action

            // if (current.homeType === ActionType.DASHBOARD && current.actionType === ActionType.DASHBOARD) {
            //     var route = this.stateManager.getRoute();
            //     if (route.toParams.dashboardId === undefined) {
            //         $timeout(function () {
            //             router.goDashboard();
            //         });
            //     }
            // } else

            // if (current.actionType === ActionType.COMMUNICATION_REMOVE_WORKSPACE) {
            //     var params = this.stateManager.getCommunicationParams(ActionType.COMMUNICATION_REMOVE_WORKSPACE);
            //     if (!params) {
            //         return;
            //     }

            //     workspace
            //         .deleteWorkspace(params.workspaceId)
            //         .then(function (response) {
            //             workspaceAction.removeWorkspace(params.workspaceId);
            //             notify.success('MESSAGE.GENERAL.REMOVED_WORKSPACE');
            //             if (current.homeType === ActionType.WORKSPACE && current.workspaceId === params.workspaceId) {
            //                 router.goDashboard();
            //             }
            //         }, function (error) {
            //             notify.error('MESSAGE.GENERAL.REMOVING_ERROR_WORKSPACE');
            //             console.log('Error delete workspace ', error);
            //         });

            // } else if (current.actionType === ActionType.COMMUNICATION_REMOVE_TASKER) {
            //     var params = stateManager.getCommunicationParams(ActionType.COMMUNICATION_REMOVE_TASKER);
            //     if (!params) {
            //         return;
            //     }

            //     workspace
            //         .deleteTasker(params.workspaceId, params.taskerId)
            //         .then(function (response) {
            //             workspaceAction.removeTasker(params.workspaceId, params.taskerId);
            //             notify.success('MESSAGE.GENERAL.REMOVED_TASKER');
            //         }, function (error) {
            //             notify.error('MESSAGE.GENERAL.REMOVING_ERROR_TASKER');
            //             console.log('Error delete tasker ', error);
            //         });
            // }
        }, this._handleError);
    }

    private _handleError(e: any) {
        console.log('Home Root Component, Exception', e);
    }

    private _titleChange(title: string) {
        jQuery(document).attr({
            title: title
        });
    }

    ngOnDestroy() {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
