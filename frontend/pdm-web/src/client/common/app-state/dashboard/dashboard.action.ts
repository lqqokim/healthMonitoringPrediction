import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { StateManager } from '../state-manager.service';
import { AppState } from '../app-state.type';
import { DashboardModel, WidgetModel } from './dashboard.type';

@Injectable()
export class DashboardAction {

    constructor(private store: Store<AppState>, private stateManager: StateManager) { }

    setDashboards(dashboards: DashboardModel[]) {
        const action = {
            type: ActionType.SET_DASHBOARDS,
            payload: {
                dashboards: dashboards
            }
        };

        this.store.dispatch(action);
    }

    addDashboard(dashboard: DashboardModel) {
        const action = {
            type: ActionType.ADD_DASHBOARD,
            payload: {
                dashboard: dashboard
            }
        };

        this.store.dispatch(action);
    }

    removeDashboard(dashboardId: number) {
        const action = {
            type: ActionType.REMOVE_DASHBOARD,
            payload: {
                dashboardId: dashboardId
            }
        };

        this.store.dispatch(action);
    }

    clearDashboards() {
        const action = {
            type: ActionType.CLEAR_DASHBOARDS,
            payload: {}
        };

        this.store.dispatch(action);
    }

    setHomeDashboard(dashboardId: number) {
        const action = {
            type: ActionType.SET_HOME_DASHBOARD,
            payload: {
                dashboardId: dashboardId
            }
        };

        this.store.dispatch(action);
    }

    updateDashboard(dashboard: DashboardModel) {
        const action = {
            type: ActionType.UPDATE_DASHBOARD,
            payload: {
                dashboardId: dashboard.dashboardId,
                dashboard: dashboard
            }
        };

        this.store.dispatch(action);
    }

    updateDashboardOrder(dashboard: DashboardModel) {
        const action = {
            type: ActionType.UPDATE_DASHBOARD_ORDER,
            payload: {
                dashboardId: dashboard.dashboardId,
                dashboard: dashboard
            }
        };

        this.store.dispatch(action);
    }

    setCurrentPage(dashboardId: number, page: number) {
        const action = {
            type: ActionType.SET_CURRENT_PAGE_IN_DASHBOARD,
            payload: {
                dashboardId,
                page
            }
        };

        this.store.dispatch(action);
    }

    // widget
    addWidget(widget: WidgetModel) {
        const action = {
            type: ActionType.ADD_WIDGET,
            payload: {
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    removeWidget(widgetId: number) {
        const action = {
            type: ActionType.REMOVE_WIDGET,
            payload: {
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widgetId: widgetId
            }
        };

        this.store.dispatch(action);
    }

    updateWidget(widget: WidgetModel) {
        const action = {
            type: ActionType.UPDATE_WIDGET,
            payload: {
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    updateWidgetSize(widget: WidgetModel) {
        const action = {
            type: ActionType.UPDATE_WIDGET_SIZE,
            payload: {
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    updateWidgetTitle(widget: WidgetModel) {
        const action = {
            type: ActionType.UPDATE_WIDGET_TITLE,
            payload: {
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    // widget select / unselect items
    selectWidgetItem(widgetId: number, items: any) {
        const current = this.stateManager.getCurrent();
        if (current.actionType === ActionType.OPEN_WIDGET_PROPERTIES) {
            return;
        }

        const action = {
            type: ActionType.SELECT_WIDGET_CHART_ITEM,
            payload: {
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widgetId: widgetId,
                items: items
            }
        };

        this.store.dispatch(action);
    }

    unSelectWidgetItem(widgetId: number, items: any) {
        const current = this.stateManager.getCurrent();
        if (current.actionType === ActionType.OPEN_WIDGET_PROPERTIES) {
            return;
        }

        const action = {
            type: ActionType.UNSELECT_WIDGET_CHART_ITEM,
            payload: {
                dashboardId: this.stateManager.getCurrentDashboardId(),
                widgetId: widgetId,
                items: items
            }
        };

        this.store.dispatch(action);
    }

    clearSelectedWidgetItems(widgetId: number) {
        const action = {
            type: ActionType.CLEAR_WIDGET_CHART_ALL_ITEMS,
            payload: {
                widgetId: widgetId
            }
        };

        this.store.dispatch(action);
    }
}
