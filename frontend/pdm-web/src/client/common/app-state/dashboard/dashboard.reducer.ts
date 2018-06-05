import { ActionReducer, Action } from '@ngrx/store';
import { DashboardModel, WidgetModel } from './dashboard.type';
import { Util } from '../../../sdk';

export const DashboardReducer: ActionReducer<DashboardModel[]> = (state: DashboardModel[], action: Action) => {
    //console.log('>> dashboard.reducer state', state);
    if (typeof state === 'undefined') {
        state = [];
    }

    switch (action.type) {
        case ActionType.SET_DASHBOARDS:
            return setDashboards(state, action.payload);
        case ActionType.ADD_DASHBOARD:
            return addDashboard(state, action.payload);
        case ActionType.UPDATE_DASHBOARD:
            return updateDashboard(state, action.payload);
        case ActionType.UPDATE_DASHBOARD_ORDER:
            return updateDashboardOrder(state, action.payload);
        case ActionType.REMOVE_DASHBOARD:
            return removeDashboard(state, action.payload);
        case ActionType.CLEAR_DASHBOARDS:
            return clearDashboards(state, action.payload);
        case ActionType.SET_HOME_DASHBOARD:
            return setHomeDashboard(state, action.payload);
        case ActionType.SET_CURRENT_PAGE_IN_DASHBOARD:
            return setCurrentPage(state, action.payload);

        case ActionType.ADD_WIDGET:
            return addWidget(state, action.payload);
        case ActionType.REMOVE_WIDGET:
            return removeWidget(state, action.payload);
        case ActionType.UPDATE_WIDGET:
            return updateWidget(state, action.payload);
        case ActionType.UPDATE_WIDGET_SIZE:
            return updateWidgetSize(state, action.payload);
        case ActionType.UPDATE_WIDGET_TITLE:
            return updateWidgetTitle(state, action.payload);

        case ActionType.SELECT_WIDGET_CHART_ITEM:
            return selectWidgetItems(state, action.payload);
        case ActionType.UNSELECT_WIDGET_CHART_ITEM:
            return unselecteWidgetItems(state, action.payload);
        case ActionType.CLEAR_WIDGET_CHART_ALL_ITEMS:
            return clearSelectedWidgetItems(state, action.payload);

        default:
            return state;
    }

    function setDashboards(state: any, payload: any) {
        state = [];

        _.each(payload.dashboards, function (dashboard: DashboardModel) {
            _.each(dashboard.widgets, function (widget: WidgetModel) {
                widget.selected = false;
                widget.selectedItems = [];
            });

            // add initialization state in state model
            state.push(dashboard);
        });

        return state;
    }

    function addDashboard(state: DashboardModel[], payload: any) {
        if (!payload.dashboard.widgets) {
            payload.dashboard.widgets = [];

        } else {
            _.each(payload.dashboard.widgets, function (widget: WidgetModel) {
                widget.selected = false;
                widget.selectedItems = [];
            });
        }

        state.push(payload.dashboard);

        return [...state];
    }

    function removeDashboard(state: DashboardModel[], payload: any) {
        state = _.filter(state, (dashboard: DashboardModel) => {
            if (dashboard.dashboardId !== payload.dashboardId) {
                return true;
            }
            return false;
        });

        // 삭제를 했을 때 마지막 한개는 반드시 home이 된다.
        if (state.length === 1) {
            state[0].home = true;
        }

        return [...state];
    }

    function clearDashboards(state: DashboardModel[], payload: any) {
        state = [];
        return state;
    }

    function setHomeDashboard(state: DashboardModel[], payload: any) {
        state = _.map(state, (dashboard: DashboardModel) => {
            if (dashboard.dashboardId === payload.dashboardId) {
                dashboard.home = true;
            } else {
                dashboard.home = false;
            }
            return dashboard;
        });

        return [...state];
    }

    function setCurrentPage(state: DashboardModel[], payload: any) {
        state = _.map(state, (dashboard: DashboardModel) => {
            if (dashboard.dashboardId === payload.dashboardId) {
                dashboard.currentPage = payload.page;
            } else {
                // 과거 대시보드들은 1 page로 초기화 
                dashboard.currentPage = 1;
            }
            return dashboard;
        });

        return [...state];
    }

    function updateDashboard(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler._updateDashboard, There is not dashboard of ' + payload.dashboardId;
        }

        dashboard = payload.dashboard;

        return [...state];
    }

    function updateDashboardOrder(state: DashboardModel[], payload: any) {
        var dashboard = payload.dashboard;

        if (!dashboard) {
            throw 'dashboard.handler._updateDashboardOrder, There is not dashboard.';
        }

        state.forEach((stateDashboard: DashboardModel) => {
            if (stateDashboard.dashboardId !== dashboard.dashboardId && stateDashboard.dashboardOrder >= dashboard.dashboardOrder) {
                stateDashboard.dashboardOrder++;
            }
        });

        state = state.sort(function (a, b) {
            return a.dashboardOrder - b.dashboardOrder;
        });

        return [...state];
    }

    // widget
    function addWidget(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler._addWidget, There is not dashboard of ' + payload.dashboardId;
        }

        var widget = payload.widget;
        widget.selected = false;
        widget.selectedItems = [];

        dashboard.widgets.push(widget);

        return [...state];
    }

    function removeWidget(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler._removeWidget, There is not dashboard of ' + payload.dashboardId;
        }

        dashboard.widgets = _.filter(dashboard.widgets, (widget: WidgetModel) => {
            if (widget.widgetId !== payload.widgetId) {
                // if(widget.properties.communication) {
                //     widget.properties.communication = _.filter(widget.properties.communication, function(widgetId) {
                //         if(widget.widgetId !== widgetId) {
                //             return widgetId;
                //         }
                //     });
                // }
                return true;
            } else {
                // must call destroy, cause unsubscribe redux's action for widget container
                // if (widget.scope) {
                //     widget.scope.$destroy();
                // }
                return false;
            }
        });

        return [...state];
    }

    function updateWidget(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler._updateWidget, There is not dashboard of ' + payload.dashboardId;
        }

        dashboard.widgets.map((widget: WidgetModel) => {
            if (widget.widgetId === payload.widget.widgetId) {
                widget.title = payload.widget.title;
                widget.x = payload.widget.x;
                widget.y = payload.widget.y;
                widget.width = payload.widget.width;
                widget.height = payload.widget.height;
                widget.properties = payload.widget.properties;
            }
            return widget;
        });

        return [...state];
    }

    function updateWidgetSize(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler.updateWidgetSize, There is not dashboard of ' + payload.dashboardId;
        }

        dashboard.widgets.map((widget: WidgetModel) => {
            if (widget.widgetId === payload.widget.widgetId) {
                widget.x = payload.widget.x;
                widget.y = payload.widget.y;
                widget.width = payload.widget.width;
                widget.height = payload.widget.height;
            }
            return widget;
        });

        return [...state];
    }

    function updateWidgetTitle(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler._updateWidgetTitle, There is not dashboard of ' + payload.dashboardId;
        }

        dashboard.widgets.map((widget: WidgetModel) => {
            if (widget.widgetId === payload.widget.widgetId) {
                widget.title = payload.widget.title;
            }
            return widget;
        });

        return [...state];
    }

    // widget select & unselect items
    function selectWidgetItems(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler._selectWidgetItems, There is not dashboard of ' + payload.dashboardId;
        }

        dashboard.widgets.map((widget: WidgetModel) => {
            if (widget.widgetId === payload.widgetId) {
                _.each(payload.items, (actionItem: any) => {
                    // 중복을 제거한다.
                    // item = {id: <id>, data: <data>};
                    if (widget.selectedItems.length > 0) {
                        widget.selectedItems = _.filter(widget.selectedItems, (selectedItem: any) => {
                            if (selectedItem.id !== actionItem.id) {
                                return selectedItem;
                            }
                        });
                    }

                    widget.selectedItems.push(actionItem);
                });

                if (widget.selectedItems && widget.selectedItems.length > 0) {
                    widget.selected = true;
                }
            }
            return widget;
        });

        return [...state];
    }

    function unselecteWidgetItems(state: DashboardModel[], payload: any) {
        var dashboard = _dashboard(state, payload.dashboardId);

        if (!dashboard) {
            throw 'dashboard.handler._unselectWidgetItems, There is not dashboard of ' + payload.dashboardId;
        }

        dashboard.widgets.map((widget: WidgetModel) => {
            if (widget.widgetId === payload.widgetId) {
                widget.selectedItems = _.filter(widget.selectedItems, (item: any) => {
                    if (item.id !== payload.items[0].id) {
                        return item;
                    }
                });

                if (widget.selectedItems && widget.selectedItems.length === 0) {
                    widget.selected = false;
                }
            }

            return widget;
        });

        return [...state];
    }

    function clearSelectedWidgetItems(state: DashboardModel[], payload: any) {
        _.each(state, (dashboard: DashboardModel) => {
            _.each(dashboard.widgets, (widget: WidgetModel) => {
                if (payload.widgetId) {
                    if (payload.widgetId === widget.widgetId) {
                        widget.selectedItems = [];
                        return;
                    }
                } else {
                    widget.selectedItems = [];
                }
            });
        });
        return [...state];
    }

    function _dashboard(state: DashboardModel[], dashboardId: any) {
        return _.findWhere(state, {
            dashboardId: dashboardId
        });
    }
};

