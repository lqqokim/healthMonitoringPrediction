import { Injectable } from '@angular/core';
import { ModelCommonService } from "../model-common.service";

@Injectable()
export class DashboardModelService extends ModelCommonService {

	constructor() { super() }

	getDashboards(filter: any = {}) {
		return this.GET({
			uriPath: `dashboards`,
			querystring: filter
		});
	}

	getDashboard(dashboardId: number) {
		return this.GET({
			uriPath: `dashboards/${dashboardId}`
		});
	}

	createDashboard(request: any) {
		return this.PUT({
			uriPath: `dashboards`,
			params: request
		});
	}

	updateDashboard(request: any, dashboardId: number) {
		return this.PUT({
			uriPath: `dashboards/${dashboardId}`,
			params: request
		});
	}

	deleteDashboard(dashboardId: number) {
		return this.DELETE({
			uriPath: `dashboards/${dashboardId}`
		});
	}

	updateDashboardHome(dashboardId: number) {
		return this.PUT({
			uriPath: `dashboards/${dashboardId}/home`,
            params: {}
		});
	}

	getWidgets(dashboardId: number) {
		return this.GET({
			uriPath: `dashboards/${dashboardId}/widgets`
		});
	}

	getWidget(dashboardId: number, widgetId: number) {
		return this.GET({
			uriPath: `dashboards/${dashboardId}/widgets/${widgetId}`,
		});
	}

	createWidget(dashboardId: number, request: any) {
		return this.PUT({
			uriPath: `dashboards/${dashboardId}/widgets`,
			params: request
		});
	}

	updateWidget(dashboardId: number, widgetId: number, request: any) {
		return this.PUT({
			uriPath: `dashboards/${dashboardId}/widgets/${widgetId}`,
			params: request
		});
	}

	deleteWidget(dashboardId: number, widgetId: number) {
		return this.DELETE({
			uriPath: `dashboards/${dashboardId}/widgets/${widgetId}`
		});
	}

	updateWidgetConfiguration(dashboardId: number, widgetId: number, request: any) {
		return this.PUT({
			uriPath: `dashboards/${dashboardId}/widgets/${widgetId}/configuration`,
			params: request
		});
	}

	getWidgetList() {
		return this.GET({
			uriPath: `widgettypes`
		});
	}

	getWidgetType(widgetTypeId: number) {
		return this.GET({
			uriPath: `widgettypes/${widgetTypeId}`
		});
	}

	/************************************************************************
     *
     * Share dashboard
     *
     ************************************************************************/
	getDashboardsSharemembers(dashboardId: number) {
		return this.GET({
			uriPath: `dashboards/${dashboardId}/sharemembers`
		});
	}

	updateDashboardsSharemembers(dashboardId: number, request: any) {
		return this.PUT({
			uriPath: `dashboards/${dashboardId}/sharemembers`,
			params: request
		});
	}

	deleteDashboardsSharemembers(dashboardId: number, request: any) {
		return this.DELETE({
			uriPath: `dashboards/${dashboardId}/sharemembers`,
            params: request
		});
	}
}
