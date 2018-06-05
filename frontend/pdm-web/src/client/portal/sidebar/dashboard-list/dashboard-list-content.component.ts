import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { 
    StateManager, 
    DashboardModelService, 
    DashboardAction, 
    SidebarAction, 
    CommunicationAction,
    CurrentModel,
    ModalAction,
    ModalModel,
    ModalRequester,
    RequestType,
    SessionService,
    PushModel
} from '../../../common';

import { RouterService } from '../../router/router.service';
import { SidebarService } from '../sidebar.service';

@Component({
    moduleId: module.id,
    selector: '[a3p-dashboard-list-content]',
    templateUrl: 'dashboard-list-content.html'
})
export class DashboardListContentComponent implements OnInit, OnDestroy {

    dashboards: any = [];
    loginUserId: string;
    // sortableOption = {
    //     //containment: "parent",
    //     //placeholder: "dashboard-card",
    //     tolerance: "pointer",
    //     stop: function (e: any, ui: any) {
    //         if (ui.item.sortable.dropindex !== undefined) {
    //             this._saveOrder(ui.item.sortable.dropindex, this.dashboardsService[ui.item.sortable.dropindex]);
    //         }
    //     }
    // };
    private _currentSubscription: Subscription;
    private _pushSubscription: Subscription;

    constructor(
        private session: SessionService,
        private router: RouterService,
        private stateManager: StateManager,
        private dashboardsService: DashboardModelService,
        private dashboardAction: DashboardAction,
        private sidebarAction: SidebarAction,
        private communicationAction: CommunicationAction,
        private sidebar: SidebarService,
        private modalRequester: ModalRequester,
        private modalAction: ModalAction
    ) {}

    ngOnInit() {
        this.loginUserId = this.session.getUserId();
        this._setState();

        const current = this.stateManager.getCurrent();
        if (!current.isDashboard() && this.stateManager.getDashboards().length === 0) {
            this.dashboardsService
                .getDashboards()
                .then((dashboards: any) => {
                    dashboards = dashboards;
                    this.dashboardAction.setDashboards(dashboards);
                    this.sidebar.hideSpinner();
                }, 
                (err: any) => {
                    this.sidebar.showError();
                    console.error('Error while getting dashboards.', err);
                });
        } else {
            this.dashboards = this.stateManager.getDashboards();
            this.sidebar.hideSpinner();
        }
    }

    _setState() {
        const current$ = this.stateManager.rxCurrent();

        this._currentSubscription = current$.subscribe((current: CurrentModel) => {
            if (current.actionType === ActionType.REMOVE_DASHBOARD) {
                this.dashboards = this.stateManager.getDashboards();
            }
        });

        const push$ = this.stateManager.rxPush();

        this._pushSubscription = push$.subscribe((push: PushModel) => {
            if (push.type === ActionType.PUSH_SHARED_DASHBOARD 
             || push.type === ActionType.PUSH_SHARED_WORKSPACE) {
               setTimeout(() => {
                   this.dashboards = this.stateManager.getDashboards();
               }, 500);        
            }
        });
    }

    goDashhboard(dashboardId: number) {
        const sidebar = this.stateManager.getSidebar();
        if (sidebar.status !== 'small') {
            this.sidebarAction.close();
        }
        this.router.goDashboard(dashboardId);
    }

    deleteDashboard(dashboardId: number) {
        // 1) execute modal action
        this.modalAction.showConfirmDelete({
            info: {
                title: undefined,
                confirmMessage: 'MESSAGE.DASHBOARD.DELETE_SELECTED_DASHBOARDS',
                dashboardId: dashboardId
            },
            requester: this.modalRequester
        });

        // 2) subscribe only once response 
        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                if (response.data.dashboardId) {
                    this._deleteDashboard(response.data.dashboardId);
                }
            }
        });
    }

    sharedDashboard(dashboard: any) {
        // 1) execute modal action
        this.modalAction.showShare({
            info: {
                type: A3_CONFIG.MODAL.TYPE.SHARE_DASHBOARD, 
                id: dashboard.dashboardId,
                name: dashboard.title
            },
            requester: this.modalRequester
        });
        // 2) subscribe only once response
        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {

            }
        });
    }

    private _deleteDashboard(dashboardId: number) {
        this.communicationAction.removeDashboard(dashboardId);
    }

    saveOrder(index: number, dashboard: any) {
        if (index === this.dashboards.length - 1) {
            dashboard.dashboardOrder = this.dashboards[index - 1].dashboardOrder + 1;
        } else {
            dashboard.dashboardOrder = this.dashboards[index + 1].dashboardOrder;
        }

        return this.dashboardsService.updateDashboard(dashboard, dashboard.dashboardId).then(
            () => {
                this.dashboardAction.updateDashboardOrder(dashboard);
            },
            (err: any) => {
                console.error('Error while updating dashboard - ' + dashboard.dashboardId, err);
            }
        );
    }

    dragStart(idx: number) {
        this.sidebar.setOverflowHidden(true);
    }

    dragEnd(indx: number) {
         this.sidebar.setOverflowHidden(false);
    }

    ngOnDestroy() {
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }

        if (this._pushSubscription) {
            this._pushSubscription.unsubscribe();
        }
    }
}