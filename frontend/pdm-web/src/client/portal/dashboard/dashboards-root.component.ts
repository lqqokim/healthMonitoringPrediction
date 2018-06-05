import { Component, OnInit, HostBinding } from '@angular/core';
// import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DashboardsService } from './dashboards.service';
import { RouterService } from '../router/router.service';
import {
    DashboardAction,
    StateManager,
    CurrentModel,
    PushModel
} from '../../common';

import { NotifyService } from '../../sdk';

@Component({
    moduleId: module.id,
    selector: 'div.a3-wrapper[a3p-dashboards-root]',
    host: {
        'style': 'height: 100%'
    },
    templateUrl: 'dashboards-root.html'
})
export class DashboardsRootComponent implements OnInit {

    @HostBinding('class.a3-dashboard') isDashboard: boolean;
    _currentSubscription: Subscription;
    _pushSubscription: Subscription;

    constructor(
        private dashboardAction: DashboardAction,
        private dashboards: DashboardsService,
        private router: RouterService,
        private stateManager: StateManager,
        private notify: NotifyService
    ) {}

    ngOnInit() {
        // console.log('----DashboardsRootComponent init');
        this._setState();
        this._setSharedNotificationState();
    }

     private _setState() {
        const current$ = this.stateManager.rxCurrent();
        this._currentSubscription = current$.subscribe((current: CurrentModel) => {
            if (current.homeType === ActionType.DASHBOARD) {
                let dashboard = this.stateManager.getDashboard(current.dashboardId);
                if (dashboard) {
                    this._titleChange(dashboard.title);
                }
                this.isDashboard = true;
            }

            if (current.homeType === ActionType.WORKSPACE) {
                this.isDashboard = false;
                this.ngOnDestroy();
            }

            if (current.actionType === ActionType.COMMUNICATION_ADD_DASHBOARD) {
                this._addDashboard();
            } else if (current.actionType === ActionType.COMMUNICATION_REMOVE_DASHBOARD) {
                var params = this.stateManager.getCommunicationParams(ActionType.COMMUNICATION_REMOVE_DASHBOARD);
                this._deleteDashboard(params.dashboardId);
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

    private _setSharedNotificationState() {
        const push$ = this.stateManager.rxPush();

        this._pushSubscription = push$.subscribe((push: PushModel) => {
            // reload dashboards
            if (push.type === ActionType.PUSH_SHARED_DASHBOARD) {
                this.dashboards
                    .getDashboards()
                    .then((myDashboards: any) => {
                        this.dashboardAction.setDashboards(myDashboards);
                    }, (err: any) => {
                        console.log('Error while getting dashboards and shared dashboard', err);
                    });
            } 
        });
    }

    private _handleError(e: any) {
        console.log('Dashboard Root Component, Exception', e);
    }

    private _deleteDashboard(dashboardId: any) {
        let specific = true, isHome: boolean;

        if (dashboardId === undefined) {
            specific = false;
            dashboardId = this.stateManager.getCurrentDashboardId();
        }

        isHome = this.stateManager.getDashboard(dashboardId).home;

        this.dashboards
            .deleteDashboard(dashboardId)
            .then(() => {
                this.notify.success('MESSAGE.GENERAL.REMOVED_DASHBOARD');

                let index = this.stateManager.getDashboardIndex(dashboardId), dashboards: any;
                this.dashboardAction.removeDashboard(dashboardId);

                if (specific && this.stateManager.getCurrentDashboardId() !== dashboardId) {
                    return dashboardId;
                }

                dashboards = this.stateManager.getDashboards();

                if (dashboards.length) {
                    if (isHome) {
                        this._setHome(dashboards[0].dashboardId);
                    }
                    this.router.goDashboard(dashboards[index % dashboards.length].dashboardId);
                } else {
                    this._createDashboard();
                }
            }, (err: any) => {
                this.notify.error('MESSAGE.GENERAL.REMOVING_ERROR_DASHBOARD');
                console.log('Error while deleting dashboard.', err);
            });
    }

    private _setHome(dashboardId: any) {
        this.dashboards
            .updateHomeDashboard(dashboardId)
            .then(() => {
                this.dashboardAction.setHomeDashboard(dashboardId);
            }, (err: any) => {
                console.log('fail set home dashboard', err);
            });
    }

    private _createDashboard() {
        this.dashboards
            .createDashboard(true)
            .then((newDashboard: any) => {
                this.notify.success('MESSAGE.GENERAL.ADDED_DASHBOARD');
                this.dashboardAction.setDashboards([newDashboard]);
                this.router.goDashboard(newDashboard.dashboardId);
            }, (err: any) => {
                this.notify.error('MESSAGE.GENERAL.ADDING_ERROR_DASHBOARD');
                console.log('Error while creating dashboard.', err);
            });
    }

    private _addDashboard() {
        this.dashboards
            .createDashboard(false)
            .then((newDashboard: any) => {
                this.notify.success('MESSAGE.GENERAL.ADDED_DASHBOARD');
                this.dashboardAction.addDashboard(newDashboard);
                this.router.goDashboard(newDashboard.dashboardId);
            }, (err: any) => {
                this.notify.error('MESSAGE.GENERAL.ADDING_ERROR_DASHBOARD');
                console.log('Error while creating a new dashboard.', err);
            });
    }

    // TODO
    _clear() {
        // var current = stateManager.getCurrent();
        // if (current.actionType === ActionType.WORKSPACE) {
        //     $scope.$destroy();
        // } else if (current.homeType === ActionType.DASHBOARD && current.actionType === ActionType.ROUTER_CHANGE_SUCCESS) {
        //     var route = stateManager.getRoute();
        //     if (route.toParams.dashboardId === '') {
        //         $timeout(function () {
        //             router.goDashboard();
        //         });
        //     }
        // } 
    }

    private _titleChange(title: string) {
        jQuery(document).attr({
            title: title
        });
    }

    ngOnDestroy() {
        if(this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }
    }
}
