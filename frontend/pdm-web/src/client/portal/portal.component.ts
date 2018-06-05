import { Component, Injector, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from "@angular/http";

import { InjectorUtil, TranslaterService, Util } from '../sdk';

import { RouterService } from './router/router.service';

@Component({
    moduleId: module.id,
    selector: '[a3p-portal]',
    templateUrl: 'portal.html'
})
export class PortalComponent {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private routerService: RouterService,
        private injector: Injector,
        private http: Http,
        private viewContainerRef: ViewContainerRef
    ) {
        // console.log('Acubed PortalComponent Injector is',injector);
		InjectorUtil.getInstance().setInjector(injector);
		InjectorUtil.getService(TranslaterService);
    }

    /**
     * If not valid url, forward to going home dashboard
     */
    ngOnInit() {
        if (location.search.indexOf('dashboardId') > 0
            || location.search.indexOf('workspaceId') > 0) {
            Util.Data.setCookie('dfd_link_location', location.search);
        }

        if (window.location.pathname.indexOf('dashboards') > 0) {
            const dashboardPath = this._getParamValue(window.location.pathname);
            if (dashboardPath) {
                A3_CONFIG.DASHBOARD_PATH = dashboardPath;
            }
        }

        if (this.routerService.isValidRoutingUrl()) {
            if (this.routerService.isAppConfigUrl()) {
                this.router.navigate(['/appconfig']);
            }
            else if (this.routerService.isHomeUrl()
                || this.routerService.isDashboardUrl()
                || this.routerService.isDashboard2Url()) {
                this.router.navigate([`/${A3_CONFIG.DASHBOARD_PATH}`]);
            }
            else if (this.routerService.isWorkspaceUrl()) {
                //NOT USED in Angular v4
                // this.router.navigate(['/workspaces']);
            }
            else if (this.routerService.isLoginUrl()) {
                this.router.navigate(['/login']);
            }

        } else {
            this.router.navigate([`/${A3_CONFIG.DASHBOARD_PATH}`]);
        }
    }

    _getParamValue(originalPath) {
        let path2: string[] = originalPath.split('/');
        let path = 'dashboards';
        path2.forEach((p) => {
            if (p.indexOf('dashboards') >= 0) {
                path = p;
                return;
            }
        });
        return path;
    }
}
