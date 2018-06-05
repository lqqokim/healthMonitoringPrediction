import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import {
    DashboardAction,
    WorkspaceAction,
    RouterAction,
    PageAction,
    StateManager,
    LinkAction
} from '../../common';
import { Util, InjectorUtil } from '../../sdk';

import { WorkspaceService } from '../workspace/workspace.service';

/**
 * ACubed routing url type
 */
const HOME_URL = /^\/$/;
const LOGIN_URL = /^\/login/;
const DASHBOARD_URL = /^\/?[a-z]*\/(dashboards)\/[0-9]+/;
const DASHBOARD2_URL = /^\/?[a-z]*\/(dashboards2)\/[0-9]+/;
const WORKSPACE_URL = /^\/?[a-z]*\/(workspaces)\/[0-9]+\/(taskers)\/[0-9]+/;
const APPCONFIG_URL = /^\/?[a-z]*\/(appconfigs)\/[\w]+\/(menus)\/[\w]+/;

@Injectable()
export class RouterService {

    apiAddress: string;

    constructor(
        private dashboardAction: DashboardAction,
        private workspaceAction: WorkspaceAction,
        private routerAction: RouterAction,
        private pageAction: PageAction,
        private linkAction: LinkAction,
        private stateManager: StateManager,
        private router: Router
    ) {

        // TODO: make context path.
        this.apiAddress = Util.Restful.getAPIAddress();
    }
    // $timeout: any,
    // workspace: any,
    // dashboards: any) {}

    goLogin() {
        // if (angular.element('.modal-backdrop').length) {
        //     angular.element('.modal-backdrop').remove();
        //     angular.element('.modal-open').removeClass('modal-open');
        // }
        // $state.go('login');

        this.routerAction.changeStart('SESSION', '/login');
        this.router.navigate(['/login'])
            .then((isSuccessRouting: any) => {
                if (isSuccessRouting) {
                    this.routerAction.changeSuccess('SESSION', '/login')
                }
            });
    }

    refreshDashboard() {
        // dashboards.getDashboards()
        //     .then((dashboards) {
        //         dashboardAction.setDashboards(dashboards);
        //         $state.reload('home.dashboards.dashboard');
        //     }, (err) {
        //         logger.error('Error while rloading dashboard', err);
        //     });
    }

    /**
     * If uri isn't available, it should always go a default home dashboard.
     */
    goHomeDashboard() {
        const home = this.stateManager.getHomeDashboard();
        if (home) {
            this.goDashboard(home.dashboardId)
        } else {
            this.goFirstDashboard();
        }
    }

    /*
    goHomeDashboard() {
        // wrong dashboardId
        let dashboardId: number;
        const dashboard = this.stateManager.getHomeDashboard();
        if (dashboard) {
            dashboardId = dashboard.dashboardId;
        }

        if (dashboardId) {
            return this.router.navigate(['/dashboards', dashboardId])
                .then((isSuccessRouting: any) => {
                    if (isSuccessRouting) {
                        this.routerAction.changeSuccess(ActionType.DASHBOARD, '/dashboards', { dashboardId });
                    }
                });
        } else {
            return this.router.navigate(['/dashboards'])
                .then((isSuccessRouting: any) => {
                    if (isSuccessRouting) {
                        this.routerAction.changeSuccess(ActionType.DASHBOARD, '/dashboards', {});
                    }
                });
        }
    }
    */

    goFirstDashboard() {
        let dashboards = this.stateManager.getDashboards();
        if (dashboards && dashboards.length > 0) {
            this.goDashboard(dashboards[0].dashboardId)
        }
    }

    goDashboards() {
        return this.router.navigate([`/${A3_CONFIG.DASHBOARD_PATH}`])
            .then((isSuccessRouting: any) => {
                if (isSuccessRouting) {
                    this.routerAction.changeSuccess(ActionType.DASHBOARD, `/${A3_CONFIG.DASHBOARD_PATH}`, {});
                }
            });
    }

    goDashboard(dashboardId: any) {
        // If dashboardId is undefined or including 0, you must set home dashboard view.
        // if (!dashboardId) {
        //     const dashboard = this.stateManager.getHomeDashboard();
        //     if (dashboard) {
        //         dashboardId = dashboard.dashboardId;
        //     }
        // }

        return this.router.navigate([`/${A3_CONFIG.DASHBOARD_PATH}`, dashboardId])
            .then((isSuccessRouting: any) => {
                if (isSuccessRouting) {
                    this.routerAction.changeSuccess(ActionType.DASHBOARD, `/${A3_CONFIG.DASHBOARD_PATH}`, { dashboardId });
                }
            });
    }

    /**
     * Notification이 메일 또는 목록에서 클릭할 경우 호출한다.
     * @param dashboardId
     * @param moveWidgetId
     */
    goWidgetOnDashboard(dashboardId: any, moveWidgetId: any, params?: any): Promise<any> {
        return this.router.navigate([`/${A3_CONFIG.DASHBOARD_PATH}`, dashboardId])
            .then((isSuccessRouting: any) => {
                let subject: any;
                if (+moveWidgetId > 0) {
                    subject = new Subject();
                    this._listenMoveWidget(subject, +dashboardId, +moveWidgetId);
                }
                return { subject, params };
            });
    }

    goWidgetOnQueryString(querystring: string) {
        const params = Util.Restful.parseQueryString(querystring);
        if (querystring.indexOf('dashboardId') > 0) {
            this.goWidgetOnDashboard(params['dashbaordId'], params['widgetId'])
        } else if (querystring.indexOf('workspaceId') > 0) {
            // TODO: If need, go workspace.
        }
        return
    }

    _listenMoveWidget(subject: any, dashboardId: number, widgetId: number) {
        subject
            .asObservable()
            .first()
            .subscribe(() => {
                this.pageAction.moveWidgetOnDashboard(dashboardId, widgetId);
            });
    }

    goNextDashboard() {
        let dashboards = this.stateManager.getDashboards(),
            current = this.stateManager.getCurrent(),
            next: any, dashboardId: any;

        if (dashboards.length === 0 || current.dashboardId === undefined) {
            return;
        }

        dashboardId = current.dashboardId;
        next = (this.stateManager.getDashboardIndex(dashboardId) + 1) % dashboards.length;

        this.goDashboard(dashboards[next].dashboardId);
    }

    goPrevDashboard() {
        var dashboards = this.stateManager.getDashboards(),
            current = this.stateManager.getCurrent(),
            prev: any, dashboardId: any;

        if (dashboards.length === 0 || current.dashboardId === undefined) {
            return;
        }

        dashboardId = current.dashboardId;
        prev = (dashboards.length + this.stateManager.getDashboardIndex(dashboardId) - 1) % dashboards.length;

        this.goDashboard(dashboards[prev].dashboardId);
    }

    goHomeWorkspace(workspaceId: any) {
        const taskers = this.stateManager.getTaskers(workspaceId);
        if (taskers && taskers.length > 0) {
            this.goWorkspace(workspaceId, taskers[0].takserId, window.open('', '_blank'));
        } else {
            const workspace: WorkspaceService = InjectorUtil.getService(WorkspaceService);
            if (workspace) {
                workspace
                    .getTaskers(workspaceId)
                    .then((taskers: any) => {
                        if (taskers && taskers.length > 0) {
                            this.goWorkspace(workspaceId, taskers[0].taskerId, window.open('', '_blank'));
                        }
                    });
            }
        }
    }

    // Workspace
    goWorkspace(workspaceId: any, taskerId: any, targetWindow?: any) {
        console.log('>>>> workspace', workspaceId, ' taskers', taskerId, ' targetWindow', targetWindow);
        if (targetWindow) {
            targetWindow.location.href = Util.Restful.notRefreshAndAddUri(`/workspaces/${workspaceId}/taskers/${taskerId}`, false);
        } else {
            this.router.navigate(['/workspaces', workspaceId, 'taskers', taskerId]);
        }

        this.routerAction.changeSuccess(ActionType.WORKSPACE, '/workspaces', { workspaceId, taskerId });
    }

    _setTaskers(workspaceId: any, taskerId: any) {
        // return workspace.getTaskers(workspaceId)
        //     .then((taskers) {
        //         if (!taskerId) {
        //             taskerId = taskers[0].taskerId;
        //         }

        //         // set taskers of workspace
        //         workspaceAction.setTaskers(workspaceId, taskers);

        //         // go tasker
        //         return _goWorkspace(workspaceId, taskerId);

        //     }, (err) {
        //         console.log('get taskers exception: ', err);
        //         // back dashboard
        //         router.goDashboard();
        //     });
    }

    _goWorkspace(workspaceId: any, taskerId: any) {
        // return $timeout(() {
        //     $state.go('home.workspace.tasker', {
        //         workspaceId: workspaceId,
        //         taskerId: taskerId
        //     });
        // });
    }

    // when click App List, create workspace and go workspace
    createWorkspace(taskerTypeId: any, params: any) {
        // return workspace
        //     .createWorkspace(taskerTypeId)
        //     .then((workspace) {
        //         // add workspace
        //         workspaceAction.addWorkspace(workspace);

        //         // set taskers
        //         return _setTaskers(workspace.workspaceId);

        //     }, (error) {
        //         console.log('create workspace exception: ', error);
        //     });
    }

    // go tasker in same workpsace
    createTasker(taskerTypeId: any) {
        // var workspaceId = this.stateManager.getCurrentWorkspaceId();

        // return workspace
        //     .createTasker(workspaceId, taskerTypeId)
        //     .then((tasker) {
        //         // add tasker
        //         tasker.taskerType = this.stateManager.getTaskerType(tasker.taskerTypeId);

        //         workspaceAction.addTasker(tasker);

        //         _goWorkspace(tasker.workspaceId, tasker.taskerId);

        //     }, (error) {
        //         console.log('create tasker exception: ', error);
        //     });
    }

    goNextTasker() {
        // var taskers = this.stateManager.getTaskers(),
        //     current = this.stateManager.getCurrent(),
        //     next, workspaceId, taskerId;

        // if (taskers.length === 0 || current.taskerId === undefined) {
        //     return;
        // }

        // workspaceId = current.workspaceId,
        //     taskerId = current.taskerId;
        // next = (this.stateManager.getTaskerIndex(workspaceId, taskerId) + 1) % taskers.length;

        // _goWorkspace(workspaceId, taskers[next].taskerId);
    }

    goPrevTasker() {
        // var taskers = this.stateManager.getTaskers(),
        //     current = this.stateManager.getCurrent(),
        //     prev, workspaceId, taskerId;

        // if (taskers.length === 0 || current.taskerId === undefined) {
        //     return;
        // }

        // workspaceId = current.workspaceId,
        //     taskerId = current.taskerId;
        // prev = (taskers.length + this.stateManager.getTaskerIndex(workspaceId, taskerId) - 1) % taskers.length;

        // _goWorkspace(workspaceId, taskers[prev].taskerId);
    }

    goFirstTasker() {
        // var taskers = this.stateManager.getTaskers(),
        //     current = this.stateManager.getCurrent(),
        //     prev, workspaceId, taskerId;

        // if (taskers.length === 0 || current.taskerId === undefined) {
        //     return;
        // }

        // workspaceId = current.workspaceId,
        //     taskerId = current.taskerId;

        // _goWorkspace(workspaceId, taskers[0].taskerId);
    }

    // Configuration
    // goAppConfig(applicationId: any, menuId: any, targetWindow?: any) {
    //     if (targetWindow) {
    //         targetWindow.location.href = Util.Restful.notRefreshAndAddUri(`/appconfigs/${applicationId}/menus/${menuId}`, false);
    //     } else {
    //         this.router.navigate(['/appconfigs', applicationId, 'menus', menuId]);
    //     }

    //     this.routerAction.changeSuccess(ActionType.APPCONFIG, '/appconfigs', { applicationId, menuId });
    // }

    /**
     * TODO: more checking for number ex) 221ab333 must be false, currently true :)
     * Check routing url
     * 1) http://<address>  or http://<address>/
     * 2) http://<address>/dashboards/<number> or
     *    http://<address>/dashboards/<number>/
     * 3) http://<address>/workspace/<number>/taskers/<number> or
     *    http://<address>/workspace/<number>/taskers/<number>/
     */
    isValidRoutingUrl() {
        const pathname = window.location.pathname;
        // console.log('ROOT_URL', ROOT_URL.test(pathname));
        // console.log('dashboards', dashboard.test(pathname));
        // console.log('workspace', workspace.test(pathname));

        if (HOME_URL.test(pathname)
            || LOGIN_URL.test(pathname)
            || APPCONFIG_URL.test(pathname)
            || DASHBOARD_URL.test(pathname)
            || DASHBOARD2_URL.test(pathname)
            || WORKSPACE_URL.test(pathname)) {
            return true;
        } else {
            return false;
        }
    }

    isHomeUrl() {
        const pathname = window.location.pathname;
        return HOME_URL.test(pathname);
    }

    isLoginUrl() {
        const pathname = window.location.pathname;
        return LOGIN_URL.test(pathname);
    }

    isAppConfigUrl() {
        const pathname = window.location.pathname;
        return APPCONFIG_URL.test(pathname);
    }

    isDashboardUrl() {
        const pathname = window.location.pathname;
        return DASHBOARD_URL.test(pathname);
    }

    isDashboard2Url() {
        const pathname = window.location.pathname;
        return DASHBOARD2_URL.test(pathname);
    }

    isWorkspaceUrl() {
        const pathname = window.location.pathname;
        return WORKSPACE_URL.test(pathname);
    }

}
