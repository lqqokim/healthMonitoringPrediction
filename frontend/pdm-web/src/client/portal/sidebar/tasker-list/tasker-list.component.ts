import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateManager, CommunicationModel } from '../../../common';

import { TaskerListService } from './tasker-list.service';
import { SidebarService } from '../sidebar.service';

@Component({
    moduleId: module.id,
    selector: '[a3p-sidebar-panel][a3p-tasker-list]',
    template: '<div a3p-tasker-list-content [category]="category" *ngFor="let category of applicationList"></div>',
    providers: [TaskerListService]
})
export class TaskerListComponent implements OnInit, OnDestroy {

    applicationList: any;
    _drillDownRelation: any;
    _communicationSubscription: Subscription;

    constructor(
        private stateManager: StateManager,
        private taskerList: TaskerListService,
        private sidebar: SidebarService
    ) {}

    ngOnInit() {
        this._drillDownRelation = this.taskerList.getDrillDownInfo();
        this._setState();
    }

    private _setState() {
        const sidebar = this.stateManager.getSidebar();
        if (sidebar.gnbTypeId !== ActionType.GNB_APP_LIST) { return; }

        let communication$ = this.stateManager.rxCommunication();
        // 오직 한번만 subscribe 해야한다.
        // dynamic creation and then only one time subsribe
        this._communicationSubscription = communication$.first().subscribe(
            (communication: CommunicationModel) => {
                // TODO : tasker에서 applist 호출시 아래 조건에서 걸려서 주석 처리함
                // if (communication.actionType !== ActionType.COMMUNICATION_SHOW_APP_LIST_FOR_WIDGET) {
                //     return;
                // }

                // let params = this.stateManager.getCommunicationParams(ActionType.COMMUNICATION_SHOW_APP_LIST_FOR_WIDGET);
                let params = communication.params;
                if (!params) {
                    // TODO
                    this.sidebar.hideSpinner();
                    return;
                }

                let typeIds: any = [];
                if (params.isDashboard) {
                    let widget = this.stateManager.getWidget(params.widgetId);
                    typeIds.push(widget.widgetTypeId);

                    this.taskerList.getTaskerList(typeIds).then((data) => {
                        let widgetTypeName = this.stateManager.getWidgetType(widget.widgetTypeId).name;
                        let tmp: any = [];

                        _.each(data, (w: any) => {
                            // macke category
                            w.name = widget.title;
                            w.type = 'widget';
                            w.id = params.widgetId;
                            w.properties = params.properties;
                            w.syncOutCondition = params.syncOutCondition;

                            w.taskerList = w.taskerList.filter((taskerType: any) => {
                                // console.log('widget appListType: ', params.appListType);
                                if (params.appListType && params.appListType !== '') {
                                    return this._drillDownRelation.widgets.sub_widgets.hasOwnProperty(widgetTypeName)
                                        && (
                                            this._drillDownRelation.widgets.sub_widgets[widgetTypeName][params.appListType].indexOf(taskerType.name) > -1
                                        );
                                } else {
                                    return this._drillDownRelation.widgets.hasOwnProperty(widgetTypeName)
                                        && (
                                            this._drillDownRelation.widgets[widgetTypeName] === '*'
                                            || this._drillDownRelation.widgets[widgetTypeName].indexOf(taskerType.name) > -1
                                        );
                                }
                            });

                            tmp.push(w);
                        });

                        this.applicationList = tmp;
                        this.sidebar.hideSpinner();
                    }, (error: any) => {
                        this.sidebar.showError();
                        console.log('get app list for widget exception: ', error);
                    });

                } else {
                    let tasker = this.stateManager.getTasker(params.workspaceId, params.taskerId);
                    typeIds.push(tasker.taskerTypeId);

                    this.taskerList.getTaskerList(typeIds).then((data: any) => {
                        let taskerTypeName = this.stateManager.getTaskerType(tasker.taskerTypeId).name;
                        let tmp: any = [];

                        _.each(data, (t: any) => {
                            // make category
                            t.name = tasker.taskerType.title;
                            t.type = 'tasker';
                            t.id = params.taskerId;
                            // TODO
                            t.properties = params.properties;
                            t.syncOutCondition = params.syncOutCondition;

                            t.taskerList = t.taskerList.filter((taskerType: any) => {
                                //console.log('tasker appListType: ', params.appListType);
                                if (params.appListType && params.appListType !== '') {
                                    return this._drillDownRelation.taskers.sub_taskers.hasOwnProperty(taskerTypeName)
                                        && (
                                            this._drillDownRelation.taskers.sub_taskers[taskerTypeName][params.appListType].indexOf(taskerType.name) > -1
                                        );
                                } else {
                                    return this._drillDownRelation.taskers.hasOwnProperty(taskerTypeName)
                                        && (
                                            this._drillDownRelation.taskers[taskerTypeName] === '*'
                                            || this._drillDownRelation.taskers[taskerTypeName].indexOf(taskerType.name) > -1
                                        );
                                }
                            });

                            tmp.push(t);
                        });

                        this.applicationList = tmp;
                        this.sidebar.hideSpinner();
                    }, (error: any) => {
                        this.sidebar.showError();
                        console.log('get app list for tasker exception: ', error);
                    });
                }

            },
            this._handleError
        );
    }

    private _handleError(e: any) {
        console.log('Tasker List Component, Exception', e);
    }

    ngOnDestroy() {
        if (this._communicationSubscription) {
            this._communicationSubscription.unsubscribe();
        }
    }

}
