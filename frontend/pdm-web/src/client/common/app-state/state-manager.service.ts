import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import { AppState } from './app-state.type';
import { WidgetModel } from './dashboard/dashboard.type';
import { Observable } from 'rxjs/Observable';

let _widgetTypes: any = [],
    _taskerTypes: any = [];

@Injectable()
export class StateManager {

    constructor(private store: Store<AppState>) { }

    getState() {
        // @see https://github.com/ngrx/store/blob/master/README.md
        // return this.store.getState(); <- depericated
        let state: AppState;
        this.store.take(1).subscribe(s => state = s);
        return state;
    }

    rxCurrent(): any {
        return this.store.select('current');
    }

    getCurrent(): any {
        return this.getState().current;
    }

    rxPage(): any {
        return this.store.select('page');
    }

    getPage(): any {
        return this.getState().page;
    }

    // rxAppConfig(): any {
    //     return this.store.select('appconfig');
    // }

    // getAppConfig(): any {
    //     return this.getState().appconfig;
    // }

    rxConfiguration(): any {
        return this.store.select('configuration');
    }

    getConfiguration(): any {
        return this.getState().configuration;
    }

    rxRouter(): any {
        return this.store.select('router');
    }

    getRouter(): any {
        return this.getState().router;
    }

    rxSidebar(): any {
        return this.store.select('sidebar');
    }

    getSidebar(): any {
        return this.getState().sidebar;
    }

    rxFilter(): any {
        return this.store.select('filter');
    }

    getFilter(): any {
        return this.getState().filter;
    }

    getProperties(): any {
        return this.getState().properties;
    }

    rxProperties(): any {
        return this.store.select('properties');
    }

    getCommunication(): any {
        return this.getState().communication;
    }

    rxCommunication(): any {
        return this.store.select('communication');
    }

    getSyncCondition(): any {
        return this.getState().syncCondition;
    }

    rxSyncCondition(): any {
        return this.store.select('syncCondition');
    }

    getContextMenu(): any {
        return this.getState().contextMenu;
    }

    rxContextMenu(): any {
        return this.store.select('contextMenu');
    }

    getPush(): any {
        return this.getState().push;
    }

    rxPush(): any {
        return this.store.select('push');
    }

    getUser(): any {
        return this.getState().user;
    }

    rxUser(): any {
        return this.store.select('user');
    }

    getModal(): any {
        return this.getState().modal;
    }

    rxModal(): any {
        return this.store.select('modal');
    }

    getLink(): any {
        return this.getState().link;
    }

    rxLink(): any {
        return this.store.select('link');
    }

    /////////////////////////////////////////////////////////////////////
    //
    // Dashboard
    //
    /////////////////////////////////////////////////////////////////////

    rxDashboards(): Observable<any> {
        return this.store.select('dashboards');
    }

    getDashboards(isObservable?: boolean): any {
        if (isObservable) {
            return this.store.select('dashboards');
        } else {
            return this.getState().dashboards;
        }
    }

    getCurrentDashboardId(): any {
        const current = this.getCurrent();
        return typeof current.dashboardId === 'number' ? parseInt(current.dashboardId, 10) : current.dashboardId;
    }

    getCurrentDashboardPage(): any {
        const current = this.getCurrent();
        let page = typeof current.currentPage === 'number' ? parseInt(current.currentPage, 10) : current.currentPage;
        page = page === undefined || page <= 0 ? 1 : page;
        // console.log('current page of dashboard is', page);
        return page;
    }

    getCurrentWorkspaceId() {
        return this.getCurrent().workspaceId;
    }

    getHomeDashboard() {
        return _.findWhere(this.getState().dashboards, {
            home: true
        });
    }

    getDashboard(dashboardId?: any) {
        if (!dashboardId) {
            dashboardId = this.getCurrent().dashboardId;
        }

        return _.findWhere(this.getState().dashboards, {
            dashboardId: parseInt(dashboardId, 10)
        });
    }

    getDashboardIndex(dashboardId?: any) {
        if (!dashboardId) {
            dashboardId = this.getCurrent().dashboardId;
        }

        return _.findIndex(this.getState().dashboards, this.getDashboard(parseInt(dashboardId, 10)));
    }

    getWidgets(dashboardId: any) {
        if (!dashboardId) {
            dashboardId = parseInt(this.getCurrent().dashboardId, 10);
        }

        const dashboard = _.findWhere(this.getState().dashboards, {
            dashboardId: parseInt(dashboardId, 10)
        });

        return dashboard.widgets;
    }

    isExistWidgets() {
        const widgets = this.getWidgets(this.getCurrent().dashboardId);
        return widgets.length > 0;
    }

    getWidget(widgetId: any, dashboardId?: any) {
        const dashboard = _.findWhere(this.getState().dashboards, {
            'dashboardId': dashboardId ? dashboardId : this.getCurrentDashboardId()
        });

        if (dashboard) {
            return _.findWhere(dashboard.widgets, {
                widgetId: widgetId
            });
        }
    }

    getWidgetSimple(widgetId: number, dashboardId?: number) {
        const dashboard = _.findWhere(this.getState().dashboards, {
            'dashboardId': dashboardId ? dashboardId : this.getCurrentDashboardId()
        });

        if (dashboard) {
            let widget = _.findWhere(dashboard.widgets, {
                widgetId: widgetId
            });

            if (widget) {
                widget = {
                    dashboardId: widget.dashboardId,
                    widgetId: widget.widgetId,
                    title: widget.title,
                    widgetTypeId: widget.widgetTypeId,
                    properties: widget.properties
                }
            }

            return widget;
        }
    }

    getSelectedItemsWidgets(widgetId: any) {
        const dashboard = _.findWhere(this.getState().dashboards, {
            dashboardId: this.getCurrentDashboardId()
        });

        if (widgetId) {
            const widget = _.findWhere(dashboard.widgets, {
                widgetId: widgetId
            });
            return widget;
        } else {
            const widgets: WidgetModel[] = [];
            _.each(dashboard.widgets, (widget: WidgetModel) => {
                if (widget.selectedItems.length > 0) {
                    widgets.push(widget);
                }
            });

            return widgets;
        }
    }

    getSelectedItemsWidget(widget: WidgetModel, selectedId: any) {
        if (widget.selectedItems.length === 0) {
            return;
        }

        return _.each(widget.selectedItems, function (item: any) {
            if (item.id === selectedId) {
                return item;
            }
        });
    }


    /////////////////////////////////////////////////////////////////////
    //
    // Workspace
    //
    /////////////////////////////////////////////////////////////////////

    rxWorkspaces() {
        return this.store.select('workspaces');
    }

    getWorkspaces(): any {
        return this.getState().workspaces;
    }

    getWorkspace(workspaceId?: any) {
        if (!workspaceId) {
            workspaceId = this.getCurrent().workspaceId;
        }

        return _.findWhere(this.getState().workspaces, {
            workspaceId: parseInt(workspaceId, 10)
        });
    }

    getTaskers(workspaceId?: any) {
        if (!workspaceId) {
            workspaceId = this.getCurrent().workspaceId;
        }

        const workspace = _.findWhere(this.getState().workspaces, {
            workspaceId: parseInt(workspaceId, 10)
        });

        if (workspace) {
            return workspace.taskers;
        } else {
            return undefined;
        }
    }

    getTasker(workspaceId: any, taskerId: any) {
        if (!workspaceId) {
            workspaceId = this.getCurrent().workspaceId;
        }

        const workspace = _.findWhere(this.getState().workspaces, {
            workspaceId: parseInt(workspaceId, 10)
        });

        if (workspace) {
            return _.findWhere(workspace.taskers, {
                taskerId: parseInt(taskerId, 10)
            });
        } else {
            return undefined;
        }
    }

    getTaskerSimple(workspaceId: any, taskerId: any) {
        if (!workspaceId) {
            workspaceId = this.getCurrent().workspaceId;
        }

        const workspace = _.findWhere(this.getState().workspaces, {
            workspaceId: parseInt(workspaceId, 10)
        });

        if (workspace) {
            let tasker = _.findWhere(workspace.taskers, {
                taskerId: parseInt(taskerId, 10)
            });

            if (tasker) {
                tasker = {
                    workspaceId: tasker.workspaceId,
                    taskerId: tasker.taskerId,
                    title: tasker.title,
                    taskerType: tasker.taskerType,
                    taskerTypeId: tasker.taskerTypeId,
                    conditions: tasker.conditions
                };
            }

            return tasker;
        } else {
            return undefined;
        }
    }

    getTaskerIndex(workspaceId?: any, taskerId?: any) {
        var taskers = this.getTaskers(workspaceId);

        if (!taskerId) {
            taskerId = this.getCurrent().taskerId;
        }

        return _.findIndex(taskers, this.getTasker(workspaceId, taskerId));
    }


    /////////////////////////////////////////////////////////////////////
    //
    // Cache
    //
    /////////////////////////////////////////////////////////////////////
    getWidgetTypes() {
        return _widgetTypes;
    }

    getWidgetType(widgetTypeId: any) {
        return _.findWhere(_widgetTypes, {
            widgetTypeId: widgetTypeId
        });
    }

    getWidgetTypeSelector(widgetTypeId: any): any {
        const widget: any = _.findWhere(_widgetTypes, {
            widgetTypeId: widgetTypeId
        });

        if (widget) {
            return 'a3w-' + _.string.dasherize(widget.name);
        }
        return;
    }

    setWidgetTypes(newWidgetTypes: any) {
        if (_.isArray(newWidgetTypes)) {
            _widgetTypes.splice(0);
            newWidgetTypes.forEach((widgetType: any) => {
                _widgetTypes.push(widgetType);
            });
        }
    }

    getTaskerTypes() {
        return _taskerTypes;
    }

    getTaskerType(taskerTypeId: any) {
        return _.findWhere(_taskerTypes, {
            taskerTypeId: taskerTypeId
        });
    }

    setTaskerTypes(newTaskerTypes: any) {
        if (_.isArray(newTaskerTypes)) {
            _taskerTypes.splice(0);
            newTaskerTypes.forEach((taskerType: any) => {
                _taskerTypes.push(taskerType);
            });
        }
    }

    setTaskerType(taskerType: any) {
        if (_.findIndex(_taskerTypes, { taskerTypeId: taskerType.taskerTypeId }) < 0) {
            _taskerTypes.push(taskerType);
        }
    }

    /////////////////////////////////////////////////////////////////////
    //
    // Communication
    //
    /////////////////////////////////////////////////////////////////////
    getCommunicationParams(actionType: any, isNotUndefined: boolean = false) {
        const current: any = this.getState().current;
        const communication: any = this.getState().communication;

        if ((current.actionType !== actionType) || (communication.actionType !== actionType)) {
            return;
        }

        // must set params to undefined because it is instantly communication
        const params = communication.params;
        if (!isNotUndefined) {
            communication.params = undefined;
        }

        return params;
    }

    setCommunicationParams(value: any) {
        (<any>this.getState().communication).params = value;
    }
}