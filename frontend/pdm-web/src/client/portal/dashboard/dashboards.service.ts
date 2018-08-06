import { Injectable } from '@angular/core';
import { StateManager, DashboardAction, DashboardModel, WidgetModel } from '../../common';
import { Util, NotifyService } from '../../sdk';
import { RouterService } from '../router/router.service';
import { DashboardModelService } from "../../common/model/platform/dashboard-model.service";

@Injectable()
export class DashboardsService {

    constructor(
        private stateManager: StateManager,
        private model: DashboardModelService,
        private dashboardAction: DashboardAction,
        private router: RouterService,
        private notify: NotifyService
    ) {}

    getDashboards() {
        return this.model
            .getWidgetList()
            .then((widgetTypes: any) => {
                this.stateManager.setWidgetTypes(widgetTypes);

                // TODO: onlyMyDashboard=false 를 통해 shared dashboard를 가져온다. 
                return this.model.getDashboards({onlyMyDashboard: false})
					.then((myDashboards: any) => {
                        if (myDashboards.length > 0) {
                            return this._getAllWidgets(myDashboards).then(() => myDashboards);
                        } else {
                            return myDashboards;
                        }
                    }
                );
            });
    }

    createDashboard(home?: boolean, newDashboard?: any) {
        newDashboard = Util.Data.mergeDeep({
            dashboardId: null,
            title: 'My Board',
            home: home,
            dashboardOrder: null
        }, newDashboard || {});

        return this.model.createDashboard(newDashboard)
                    .then((newDashboard: any) => {
                        newDashboard.widgets = [];
                        return newDashboard;
                    });
    }

    addDashboard() {
        this.createDashboard()
            .then((newDashboard: any) => {
                this.notify.success('MESSAGE.GENERAL.ADDED_DASHBOARD');
                this.dashboardAction.addDashboard(newDashboard);
                this.router.goDashboard(newDashboard.dashboardId);
            }, (err: any) => {
                this.notify.error('MESSAGE.GENERAL.ADDING_ERROR_DASHBOARD');
                console.log('Error while creating a new dashboard. ', err);
            });
    }

    updateDashboard(dashboard: DashboardModel) {
        let updateDashboard = {
            dashboardId: dashboard.dashboardId,
            title: dashboard.title,
            home: dashboard.home,
            dashboardOrder: dashboard.dashboardOrder
        };
		return this.model.updateDashboard(updateDashboard, dashboard.dashboardId);
    }

    deleteDashboard(dashboardId: number) {
        return this.model.deleteDashboard(dashboardId);
    }

    updateHomeDashboard(dashboardId: number) {
        return this.model.updateDashboardHome(dashboardId);
    }

    getWidgets(dashboardId: number) {
        return this.model.getWidgets(dashboardId);
    }

    getWidget(dashboardId: number, widgetId: number) {
        return this.model.getWidget(dashboardId, widgetId);
    }

    createWidget(dashboardId: number, widget: WidgetModel) {
        return this.model.createWidget(dashboardId, widget);
    }

    updateWidget(dashboardId: number, widget: WidgetModel) {
        return this.model.updateWidget(dashboardId, widget.widgetId, widget);
    }

    deleteWidget(dashboardId: number, widgetId: number) {
        return this.model.deleteWidget(dashboardId, widgetId);
    }

    _getAllWidgets(myDashboards: DashboardModel[]) {
        let promise: any = new Promise((resolve, reject) => resolve());

        myDashboards.forEach((dashboard: DashboardModel) => {
            promise = promise.then(() => {
                return this.getWidgets(dashboard.dashboardId)
                    .then((widgets: any) => {                       
                                               
                        if ( _.isArray(widgets) ) {

                            // 해당 위젯이 존재하는 것만 추려 냄
                            let usedWidgets: Array<any> = [], i: number;
                            const len: number = widgets.length;

                            for( i=0; i<len; i++ ){
                                if( this.stateManager.getWidgetType(widgets[i].widgetTypeId) === undefined ){
                                    continue;
                                }
                                usedWidgets.push( widgets[i] );
                            }                            

                            dashboard.widgets = usedWidgets;
                        } else {
                            dashboard.widgets = [];
                        }
                    });
            });
        });

        return promise;
    }

    applyWidgetProperties(widget: WidgetModel) {
        var props = {
            properties: widget.properties
        };

        // TODO: widgetModel include dashboardId ???
        return this.model.updateWidgetConfiguration(widget.dashboardId, widget.widgetId, props);
        // return this.model.getDashboards().customPUT(props, widget.dashboardId + '/widgets/' + widget.widgetId + '/configuration');
    }
}
