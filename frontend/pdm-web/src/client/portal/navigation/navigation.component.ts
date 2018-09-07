import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SessionStore, Translater } from '../../sdk';
import {
    StateManager,
    SidebarAction, CommunicationAction, ConfigurationAction, FilterAction,
    CurrentModel, SidebarModel, PushModel,
    PlatformModelService,
    UserAction,
    SessionService
} from '../../common';

import { RouterService } from '../router/router.service';
import { DashboardsService } from '../dashboard/dashboards.service';
import { ConfigurationMenuService } from '../configuration/configuration-menu.service';
import { PushService } from '../push/push.service';

@Component({
    moduleId: module.id,
    selector: 'div.a3-header.row',
    templateUrl: 'navigation.html'
})
export class NavigationComponent implements OnInit, OnDestroy {

    gnbLogo = A3_CONFIG.INFO.GNB_LOGO;
    gnbTypeId = ActionType;
    homeType: any;
    mainTitle = 'Dashboard';
    widgetListTitle = 'Widget List';
    isDisabledWidgetList = false;
    _currentGmbTypeId: any;

    isNotice: boolean;
    isAcubedMap: boolean;
    isAcubedNet: boolean;
    isWidgetList: boolean;
    isDashboardList: boolean;

    mainArea: string;
    main: any;

    _currentSubscription: Subscription;
    _sidebarSubscription: Subscription;
    _pushSubscription: Subscription;

    // dashboard
    dashboardLength = -1;
    dashboardIndex = -1;

    // workspace
    taskerLength = 0;
    taskerIndex = 0;

    appConfigWindow: any;

    notificationUnreadCount: number = 0;
    loginUserId: string;
    viewOwnerId: string;

    buildInfo: string;

    constructor(
        private stateManager: StateManager,
        private router: RouterService,
        private sessionStore: SessionStore,
        private session: SessionService,
        private dashboards: DashboardsService,
        private sidebarAction: SidebarAction,
        private filterAction: FilterAction,
        private communicationAction: CommunicationAction,
        private configurationMenu: ConfigurationMenuService,
        private configurationAction: ConfigurationAction,
        private platform: PlatformModelService,
        private push: PushService,
        private translater: Translater,
        private userAction: UserAction
    ) { }

    ngOnInit() {
        this._createBuildInfo();
        this._setCurrentState();
        this._setSidebarState();
        this._setUnReadCountNotificationState();
        this.loginUserId = this.session.getUserId();
        if (this.loginUserId) {
            this._unreadCountNotification();
        }
    }

    _createBuildInfo() {
        // this.buildInfo = 'DFD 1.0 (Build No: #<%=BUILD_NO%>, Build Date: <%=BUILD_DATE%>)';
        this.buildInfo = 'HMP 1.1.1';
    }

    isAdmin() {
        return this.session.isAdmin();
    }

    // if you click close button in sidebar
    _setCurrentState() {
        let current$ = this.stateManager.rxCurrent();

        this._currentSubscription = current$.subscribe((current: CurrentModel) => {
            if (current.actionType !== ActionType.DASHBOARD
                && current.actionType !== ActionType.WORKSPACE
                && current.actionType !== ActionType.APPCONFIG
                && current.actionType !== ActionType.SET_TASKER
                && current.actionType !== ActionType.CLOSE_SIDE_BAR
                && current.actionType !== ActionType.OPEN_SIDE_BAR_SMALL
                && current.actionType !== ActionType.OPEN_SIDE_BAR_FULL
                && current.actionType !== ActionType.SET_DASHBOARDS
                && current.actionType !== ActionType.ADD_DASHBOARD
                && current.actionType !== ActionType.REMOVE_DASHBOARD
                && current.actionType !== ActionType.SET_TASKERS
                && current.actionType !== ActionType.UPDATE_DASHBOARD_ORDER) {
                return;
            }

            // set dashboard, workspace when change dashboard, workspace
            if (current.homeType === ActionType.DASHBOARD) {
                this.mainArea = 'Dashboard';
                this.main = this.stateManager.getDashboard();
                if (this.main) {
                    this.viewOwnerId = this.main.userId;
                }

                this.isDisabledWidgetList = false;
                if (this.loginUserId !== this.viewOwnerId) {
                    this.translater.get('MESSAGE.DASHBOARD.NOT_AVAILABLE_WIDGET_LIST').subscribe((translatedMsg) => {
                        this.widgetListTitle = translatedMsg;
                    });
                } else {
                    this.widgetListTitle = 'Widget List';
                }

                this.dashboardLength = _.isArray(this.stateManager.getDashboards()) ? this.stateManager.getDashboards().length : 0;
                this.dashboardIndex = this.stateManager.getDashboardIndex();

            } else if (current.homeType === ActionType.WORKSPACE) {
                this.mainArea = 'Workspace';
                this.main = this.stateManager.getWorkspace();
                if (this.main) {
                    this.viewOwnerId = this.main.userId;
                }

                this.isDisabledWidgetList = true;
                this.translater.get('MESSAGE.WORKSPACE.NOT_AVAILABLE_WIDGET_LIST').subscribe((translatedMsg) => {
                    this.widgetListTitle = translatedMsg;
                });

                this.taskerLength = _.isArray(this.stateManager.getTaskers()) ? this.stateManager.getTaskers().length : 0;
                this.taskerIndex = this.stateManager.getTaskerIndex();
            }

            this.homeType = current.homeType;
        });
    }

    _setSidebarState() {
        const sidebar$ = this.stateManager.rxSidebar();

        this._sidebarSubscription = sidebar$.subscribe((sidebar: SidebarModel) => {
            if (sidebar.status === 'hide') {
                this._allDisable();
                return;
            }
            else if (
                sidebar.status === 'small'
                || sidebar.status === 'full'
            ) {
                this._status(sidebar.gnbTypeId, sidebar.isToggle);
                return;
            }
        });
    }

    _setUnReadCountNotificationState() {
        const push$ = this.stateManager.rxPush();

        this._pushSubscription = push$.subscribe((push: PushModel) => {
            if (push.type === ActionType.PUSH_SHARED_DASHBOARD
                || push.type === ActionType.PUSH_SHARED_WORKSPACE) {
                console.log('>> reload unread notification count');
                this._unreadCountNotification();
            }
        });
    }

    /**
     * https://wiki.bistel.com:8443/pages/viewpage.action?pageId=47164453
     */
    _unreadCountNotification() {
        this.platform
            .getNotificationUnreadCount({ command: 'unread_count', userId: this.session.getUserId() })
            .then(
            (response) => {
                if (response) {
                    this.notificationUnreadCount = response.unreadCount
                }
            },
            (error) => {
                console.error('unread count notification exception', error);
            }
            )
    }

    toggleSidebar(gnbTypeId: any, sidebarType: any) {
        //If widget filter container is opened, and it should be closed.
        this.filterAction.close();

        if (gnbTypeId === ActionType.GNB_WIDGET_LIST
            && (this.isDisabledWidgetList || (this.loginUserId !== this.viewOwnerId))
        ) {
            return;
        }

        // toggle in gmb button by self
        if (this._currentGmbTypeId === gnbTypeId) {
            this._allDisable();
            // small -> hide로 가야한다. 
            this.sidebarAction.close();
            return;
        }

        this._status(gnbTypeId);

        if (sidebarType === 'small') {
            this.sidebarAction.openSmall(gnbTypeId);
        } else { // 'full'
            this.sidebarAction.openFull(gnbTypeId);
        }
    }

    _allDisable() {
        this._currentGmbTypeId = undefined;
        this.isNotice = false;
        this.isAcubedMap = false;
        this.isAcubedNet = false;
        this.isWidgetList = false;
        this.isDashboardList = false;
    }

    _status(gnbTypeId: any, isToggle?: any) {
        if (gnbTypeId === ActionType.GNB_NOTICE_LIST) {
            // if click notification, set unread conout to zero value 
            this.notificationUnreadCount = 0;

            this.isNotice = true;
            this.isAcubedMap = false;
            this.isAcubedNet = false;
            this.isWidgetList = false;
            this.isDashboardList = false;
        } else if (gnbTypeId === ActionType.GNB_ACUBED_MAP) {
            this.isNotice = false;
            this.isAcubedMap = true;
            this.isAcubedNet = false;
            this.isWidgetList = false;
            this.isDashboardList = false;
        } else if (gnbTypeId === ActionType.GNB_ACUBED_NET) {
            this.isNotice = false;
            this.isAcubedMap = false;
            this.isAcubedNet = true;
            this.isWidgetList = false;
            this.isDashboardList = false;
        } else if (gnbTypeId === ActionType.GNB_WIDGET_LIST) {
            this.isNotice = false;
            this.isAcubedMap = false;
            this.isAcubedNet = false;
            this.isWidgetList = true;
            this.isDashboardList = false;
        } else if (gnbTypeId === ActionType.GNB_DASHBOARD_LIST) {
            this.isNotice = false;
            this.isAcubedMap = false;
            this.isAcubedNet = false;
            this.isWidgetList = false;
            this.isDashboardList = true;
        } else if (gnbTypeId === ActionType.GNB_APP_CONFIG) {
            this.isNotice = false;
            this.isAcubedMap = false;
            this.isAcubedNet = false;
            this.isWidgetList = false;
            this.isDashboardList = false;
        }

        this._currentGmbTypeId = gnbTypeId;
    }

    logout() {
        // this.stateManager.clearState();
        this.session
            .logout()
            .then(() => {
                // if (this.sessionStore.isSignin()) {
                this.userAction.logout();
                this.sessionStore.clearSignin();
                this.sessionStore.removeToken();
                // }
            }, (err: any) => {
                // if (this.sessionStore.isSignin()) {
                this.userAction.logout();
                this.sessionStore.clearSignin();
                this.sessionStore.removeToken();
                // }
                // this.router.goLogin();
                console.error("logout fail: ", err);
            });
    }

    goHome() {
        var current = this.stateManager.getCurrent();
        if (current.homeType === ActionType.DASHBOARD) {
            this.router.goHomeDashboard();
        } else if (current.homeType === ActionType.WORKSPACE) {
            this.router.goFirstTasker();
        }
    }

    getHomeDashboard() {
        this.router.goHomeDashboard();
    }

    goNextDashboard() {
        this.router.goNextDashboard();
    }

    goPrevDashboard() {
        this.router.goPrevDashboard();
    }

    refreshDashboard() {
        this.router.refreshDashboard();
    }

    addDashboard() {
        this.communicationAction.addDashboard();
    }

    goNextTasker() {
        this.router.goNextTasker();
    }

    goPrevTasker() {
        this.router.goPrevTasker();
    }

    goAppConfig() {
        this.configurationMenu.getApplications()
            .then((applications: any) => {
                if (applications && applications.length > 0) {
                    this.configurationAction.openApp(applications[0].applicationId, applications[0].menus[0].menuId);
                }
            }, (err: any) => {
                console.log('get app configuration  exception: ', err);
            });
    }

    goGlobalConfig() {
        this.configurationMenu.getPdmGlobals()
            .then((applications: any) => {
                if (applications && applications.length > 0) {
                    this.configurationAction.openGlobal(applications[0].applicationId, applications[0].menus[0].menuId);
                }
            }, (err: any) => {
                console.log('get global configuration  exception: ', err);
            });
    }

    goUserConfig() {
        this.configurationMenu.getUser()
            .then((applications: any) => {
                if (applications && applications.length > 0) {
                    this.configurationAction.openUser(applications[0].applicationId, applications[0].menus[0].menuId);
                }
            }, (err: any) => {
                console.log('get user configuration exception: ', err);
            });
    }

    // deplicated
    // goAppConfig() {
    //     this.appConfigWindow = window.open('', '_blank');
    //     $(this.appConfigWindow).one('close', this._disposeWindow);

    //     this.configurationMenu.getApplications()
    //         .then((applications: any) => {
    //             if (applications && applications.length > 0) {
    //                 this.router.goAppConfig(applications[0].applicationId, applications[0].menus[0].menuId, this.appConfigWindow);
    //                 this._disposeWindow();
    //             }
    //         }, (err: any) => {
    //             console.log('get app-config applications exception: ', err);
    //         });
    // }

    // _disposeWindow() {
    //     this.appConfigWindow = null;
    // }

    // _closeWindow(reason: any) {
    //     if (this.appConfigWindow != null && !this.appConfigWindow.closed) {
    //         if (reason) {
    //             console.warn('Error is occured from API for creating workspace', reason);
    //         }
    //         this.appConfigWindow.close();
    //     }
    //     this._disposeWindow();
    // }

    ngOnDestroy() {
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }

        if (this._sidebarSubscription) {
            this._sidebarSubscription.unsubscribe();
        }

        if (this._pushSubscription) {
            this._pushSubscription.unsubscribe();
        }
    }
}
