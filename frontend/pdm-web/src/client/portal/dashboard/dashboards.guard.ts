/**
 * When routing enter into path, let's check out authorization. If not valid, go login
 */
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { RouterService } from '../router/router.service';
import { SessionStore, Util, NotifyService } from '../../sdk';
import { DashboardAction, DashboardModel, DashboardModelService, SessionService, RouterAction, LinkAction } from '../../common';
import { DashboardsService } from './dashboards.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DashboardsGuard implements CanActivate {

    constructor(
        private sessionService: SessionService,
        private sessionStore: SessionStore,
        private router: RouterService,
        private routerAction: RouterAction,
        private linkAction: LinkAction,
        private model: DashboardModelService,
        private dashboards: DashboardsService,
        private dashboardAction: DashboardAction,
        private dashboardModelService:DashboardModelService,
        private notify: NotifyService
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // console.log('>> DashboardsGuard check');
        // console.log('>> state.url', state.url);

        // set dashboards and set home dashboard => dashboards/23232
        let dashboardId: number;
        try {
            const tmp = state.url.substring(1).split('/');
            if (tmp && tmp.length === 2) {
                dashboardId = parseInt(tmp[1], 10);
            }
        } catch (e) {
            console.error('Dashboards Guard exception', e);
        }

        if (location.search.indexOf('dashboardId') > 0
            || location.search.indexOf('workspaceId') > 0) {
            Util.Data.setCookie('dfd_link_location', location.search);
        }
        let linkLocation: string = Util.Data.getCookie('dfd_link_location');
        let params: any = Util.Restful.parseQueryString(linkLocation);

        if (!this.sessionStore || !this.sessionStore.isSignin()) {
            this.router.goLogin();
            return false;
        }

        // session vaid check
        this.sessionService.get()
            .subscribe((response: any) => {
                if (this.sessionStore && this.sessionStore.isSignin()) {
                    this._setDashboards(dashboardId, params);
                }
            }, (error: any) => {
                this.router.goLogin();
                console.error('session check error', error);
            });

        return true;
    }

    /**
     * 1) set Home Dashboard
     * 2) check wrong dashboard id and then set home dashboard
     */
    private _setDashboards(dashboardIdInUrlPath: number, params: any) {
        this.dashboards
            .getDashboards()
            .then((dashboards: any) => {
                if (dashboards.length) {
                    this.dashboardAction.setDashboards(dashboards);

                    let isMatchingParams: boolean;
                    let homeDashboard: DashboardModel;
                    let matchingDashboard: DashboardModel;
                    dashboards.forEach((dashboard: DashboardModel) => {
                        if (dashboard.home) {
                            homeDashboard = dashboard;
                        }
                        if (dashboard.dashboardId === dashboardIdInUrlPath) {
                            matchingDashboard = dashboard;
                        }
                        if (params && (+params['dashboardId'] === dashboard.dashboardId)) {
                            dashboard.widgets.forEach((widget: any) => {
                                if (+params['widgetId'] === widget.widgetId) {
                                    isMatchingParams = true;
                                    
                                }
                            });
                            if (isMatchingParams) {
                                matchingDashboard = dashboard;
                            }
                        }
                    });

                    if (!matchingDashboard) {
                        if (homeDashboard) {
                            matchingDashboard = homeDashboard;
                        } else {
                            matchingDashboard = dashboards[0];
                        }
                    }

                    // TODO: TEST
                    // matchingDashboard.predefined = true;

                    Util.Restful.notRefreshAndAddUri(`/${A3_CONFIG.DASHBOARD_PATH}/${matchingDashboard.dashboardId}`);
                    if (isMatchingParams) {
                        this.router.goWidgetOnDashboard(params['dashboardId'], params['widgetId'])
                            .then((obj: any) => {
                                this.routerAction.changeSuccess(ActionType.DASHBOARD,
                                    `/${A3_CONFIG.DASHBOARD_PATH}`,
                                    { dashboardId: matchingDashboard.dashboardId },
                                    obj.subject
                                );
                                this.linkAction.saveLink(params);
                            })
                    } else {
                        this.router.goDashboard(matchingDashboard.dashboardId);
                    }

                    Util.Data.removeCookie('dfd_link_location');
                } else {
                    this._createDashboard();
                }
            }, (err: any) => {
                console.log('Error while getting dashboards.', err);
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

    // private _createDashboard() {
    //     this.createNewDashboard('2공장 모니터링','HV12','현대자동차 울산 완성차2공장').then(() => {
    //         this.createNewDashboard('4공장 모니터링','HV14','현대자동차 울산 완성차4공장');
    //     });
    // }
    // private createNewDashboard(dashboardTitle,planId,planName) {
    //     return this.dashboards
    //         .createDashboard(true,{title:dashboardTitle})
    //         .then((newDashboard: any) => {
    //             this.notify.success('MESSAGE.GENERAL.ADDED_DASHBOARD');
    //             this.dashboardAction.setDashboards([newDashboard]);
    //             this.router.goDashboard(newDashboard.dashboardId);

    //             let newWidget: any = {'dashboardId':newDashboard.dashboardId,'widgetTypeId':1,'title':'Shop Status Overview','x':1,'y':1,'width':24,'height':4,'conditions':{},'properties':{'from':'','to':'','communication':{'widgets':[]}}};
    //             this.dashboards.createWidget(newDashboard.dashboardId,newWidget).then((data)=>{
    //                 let shopWidgetId = data.widgetId;
    //                 newWidget = {'dashboardId':newDashboard.dashboardId,'widgetTypeId':3,'title':'Eqp Status Overview','x':1,'y':5,'width':24,'height':8,'conditions':{},'properties':{'from':'','to':'','communication':{'widgets':[]}}}
    //                 this.dashboards.createWidget(newDashboard.dashboardId,newWidget).then((data)=>{
    //                     let eqpWidgetId = data.widgetId;
    //                     newWidget = {'dashboardId':newDashboard.dashboardId,'widgetTypeId':2,'title':'EQP Param Analysis','x':1,'y':13,'width':24,'height':12,'conditions':{},'properties':{'from':'','to':'','communication':{'widgets':[]}}}
    //                     this.dashboards.createWidget(newDashboard.dashboardId,newWidget).then((data)=>{
    //                         let monitoringDetailWidgetId = data.widgetId;
    //                         newWidget = {'dashboardId':newDashboard.dashboardId,'widgetTypeId':4,'title':'Report','x':1,'y':25,'width':24,'height':12,'conditions':{},'properties':{'from':'','to':'','communication':{'widgets':[]}}}
    //                         this.dashboards.createWidget(newDashboard.dashboardId,newWidget).then((data)=>{
    //                             let reportWidgetId = data.widgetId;
    //                             let linkLocation: string = Util.Data.getCookie('dfd_link_location');
    //                             let params: any = Util.Restful.parseQueryString(linkLocation);
    //                             newWidget = {'dashboardId':newDashboard.dashboardId,'widgetTypeId':5,'title':'Modeling Status','x':1,'y':37,'width':24,'height':12,'conditions':{},'properties':{'from':'','to':'','communication':{'widgets':[]}}}
    //                             this.dashboards.createWidget(newDashboard.dashboardId,newWidget).then((data)=>{
    //                                 let modelListWidgetId = data.widgetId;
    //                                 let modifyEqpWidget:any = {'properties':{'from':'','to':'','communication':{'widgets':[eqpWidgetId]},'plant':{'plantId':planId,'plantName':planName},'cutoffType':'DAY','dayPeriod':1,'timePeriod':{'from':1500390000000,'to':1500529728830}}}
    //                                 this.dashboardModelService.updateWidgetConfiguration(newDashboard.dashboardId,shopWidgetId,modifyEqpWidget);
    //                                 let modifyDetailWidget:any = {'properties':{'from':'','to':'','communication':{'widgets':[monitoringDetailWidgetId]},'plant':{'plantId':planId,'plantName':planName},'cutoffType':'DAY','dayPeriod':1,'timePeriod':{'from':1500390000000,'to':1500529728830}}}
    //                                 this.dashboardModelService.updateWidgetConfiguration(newDashboard.dashboardId,eqpWidgetId,modifyDetailWidget);

    //                                 let modifyMonitoringDetailWidget:any = {'properties':{'from':'','to':'','plant':{'plantId':planId,'plantName':planName},'cutoffType':'DAY','dayPeriod':1,'timePeriod':{'from':1500390000000,'to':1500529728830}}}
    //                                 this.dashboardModelService.updateWidgetConfiguration(newDashboard.dashboardId,monitoringDetailWidgetId, modifyMonitoringDetailWidget);

    //                                 let modifyReportWidget:any = {'properties':{'from':'','to':'','plant':{'plantId':planId,'plantName':planName},'cutoffType':'DAY','dayPeriod':1,'timePeriod':{'from':1500390000000,'to':1500529728830}}}
    //                                 this.dashboardModelService.updateWidgetConfiguration(newDashboard.dashboardId,reportWidgetId,modifyReportWidget);

    //                                 let modifyModelListWidget:any = {'properties':{'from':'','to':'','plant':{'plantId':planId,'plantName':planName},'cutoffType':'DAY','dayPeriod':1,'timePeriod':{'from':1500390000000,'to':1500529728830}}}
    //                                 this.dashboardModelService.updateWidgetConfiguration(newDashboard.dashboardId,modelListWidgetId,modifyModelListWidget);

    //                                 this._setDashboards(newDashboard.dashboardId,params);
    //                             })
    //                         });
    //                     });
    //                 });
    //             });
    //         }, (err: any) => {
    //             this.notify.error('MESSAGE.GENERAL.ADDING_ERROR_DASHBOARD');
    //             console.log('Error while creating dashboard.', err);
    //         });

    // }
}
