import {
    Injectable,
    ViewContainerRef,
    ElementRef,
    Compiler
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
    TaskerModel,
    RequestType,
    TaskerRefreshType,
    ConditionApi,
    StateManager,
    ConditionService
} from '../../../common';

import { DashboardsService } from '../../dashboard/dashboards.service';
import { getTaskerClassInfo } from '../../../plugins/taskers';
import { TaskerListService } from '../../sidebar/tasker-list/tasker-list.service';

@Injectable()
export class TaskerContainerService {

    constructor(
        private compiler: Compiler,
        private stateManager: StateManager,
        private condition: ConditionService,
        private dashboards: DashboardsService,
        private taskerList: TaskerListService
    ) { }

    createTasker(
        taskerContainer: any,
        taskerGeneratorEl: ViewContainerRef,
        taskerBodyEl: ElementRef,
        taskerApiObservable$: Observable<TaskerRefreshType>,
        taskerContainerNotifier: Subject<RequestType>,
        containerElement: any
    ): any {
        /*************************************************************
         *
         * Get Condition
         *
         *************************************************************/
        return this.condition
            .list(taskerContainer.taskerModel.workspaceId, taskerContainer.taskerModel.taskerId)
            .then((response: any) => {
                // TODO
                // condition 값이 tasker의 in-condition 설정에 맞도록 다시 셋업되어야 하는가???
                // set drilldown info
                (<any>taskerContainer.taskerModel).conditions = [];

                // TODO Old version, will detete them(dashboardId)
                let dashboardId: number;
                _.each(response, (item: any) => {
                    if (item.key === 'dashboardId') {
                        dashboardId = item.value;
                    }
                });

                _.each(response, (item: any) => {
                    // TODO Old version, will detete them(widgetId, taskerId)
                    if (item.key === 'widgetId') {
                        taskerContainer.parentType = this.stateManager.getWidget(item.value, dashboardId);

                        // when reload tasker, can be nullable.
                        if (!taskerContainer.parentType) {
                            this.dashboards
                                .getWidget(dashboardId, item.value)
                                .then((dashboardResponse: any) => {
                                    if (dashboardResponse) {
                                        taskerContainer.parentType = dashboardResponse;
                                    } else {
                                        // if widget deleted
                                        taskerContainer.parentType = {
                                            'dashboardId': dashboardId,
                                            'widgetId': item.value,
                                            'title': 'Deleted Widget'
                                        };
                                    }
                                    taskerContainer.parentType.drilldown = 'widget';
                                });
                        } else {
                            taskerContainer.parentType.drilldown = 'widget';
                        }
                    }
                    else if (item.key === 'taskerId') {
                        taskerContainer.parentType = this.stateManager.getTasker(undefined, item.value);
                        if (taskerContainer.parentType && taskerContainer.parentType.taskerType) {
                            taskerContainer.parentType.title = taskerContainer.parentType.taskerType.title;
                        }
                        taskerContainer.parentType.drilldown = 'tasker';
                    }
                    // New Version, check condition.service.js
                    else if (item.key === 'widget') {
                        taskerContainer.parentType = item.value;
                        // drilldown이 tasker일 때만 tasker header의 drill down from 정보가 display 된다.
                        taskerContainer.parentType.drilldown = 'widget';
                    }
                    else if (item.key === 'tasker') {
                        taskerContainer.parentType = item.value;
                        if (taskerContainer.parentType && taskerContainer.parentType.taskerType) {
                            taskerContainer.parentType.title = taskerContainer.parentType.taskerType.title;
                            taskerContainer.parentType.drilldown = 'tasker';
                        }
                    }
                    else {
                        taskerContainer.taskerModel.conditions.push(item);
                    }
                });

                let taskerType = this.stateManager.getTaskerType(taskerContainer.taskerModel.taskerTypeId);

                if (!taskerType) {
                    return this.taskerList.get().then((newTaskerTypes: any) => {
                        this.stateManager.setTaskerTypes(newTaskerTypes);

                        // taskerTypeId must set uppercase in first charactor ex) ProcessTime
                        // make prefix 'a3w' + taskerTypeId = directive name
                        taskerContainer.taskerModel.taskerType = this.stateManager.getTaskerType(taskerContainer.taskerModel.taskerTypeId);

                        // create tasker
                        return this._createTasker(
                            taskerContainer.taskerModel,
                            taskerGeneratorEl,
                            taskerBodyEl,
                            taskerApiObservable$,
                            taskerContainerNotifier,
                            containerElement
                        );
                    });
                }
                else {
                    taskerContainer.taskerModel.taskerType = taskerType;
                    taskerType = null;

                    // create tasker
                    return this._createTasker(
                        taskerContainer.taskerModel,
                        taskerGeneratorEl,
                        taskerBodyEl,
                        taskerApiObservable$,
                        taskerContainerNotifier,
                        containerElement
                    );
                }
            });
    }

    private _createTasker(
        taskerModel: TaskerModel,
        taskerGeneratorEl: ViewContainerRef,
        taskerBodyEl: ElementRef,
        taskerApiObservable$: Observable<TaskerRefreshType>,
        taskerContainerNotifier: Subject<RequestType>,
        containerElement: any
    ): any {
        /*************************************************************
         *
         * Create Tasker Component
         *
         *************************************************************/
        const taskerType = this.stateManager.getTaskerType(taskerModel.taskerTypeId);
        // name is tasker type's KEY
        const taskerModule = getTaskerClassInfo(taskerType.name);
        if (!taskerModule.config || typeof taskerModule.config !== 'function') {
            console.error('A static config() is not in taskerModule. Please setup static config()');
            return;
        }
        const config = taskerModule.config();

        return this.compiler
            .compileModuleAndAllComponentsAsync(taskerModule)
            .then((mod: any): any => {
                const factory = mod.componentFactories.find((comp) =>  
                    comp.componentType === config.component
                );
                if (!factory) {
                    console.warn(`${taskerModule} Factory is null. Please check your tasker module config.`);
                    return;
                }

                const cmp = taskerGeneratorEl.createComponent(factory);
                const instance: any = cmp.instance;

                instance.setInfo(taskerModel, taskerBodyEl, containerElement);

                // if (config.properties) {
                //     return instance
                //             .setPropertiesConfig(new config.properties())
                //             .then(() => {
                //                 if (config.inCondition) {
                //                     instance.setInConditionConfig(new config.inCondition());
                //                 }

                //                 if (config.outCondition) {
                //                     instance.setOutConditionConfig(new config.outCondition());
                //                 }

                //                 // set taskerApi
                //                 if (config.chartConfigs) {
                //                     if (_.isArray(config.chartConfigs)) {
                //                         config.chartConfigs.forEach((chartConfig: any) => {
                //                             chartConfig(instance);
                //                         });
                //                     } else {
                //                         console.warn('chartConfigs for TaskerContainer config must be Array');
                //                     }
                //                 }

                                    // if (config.viewConfig) {
                                    //     instance.setViewConfig(new config.viewConfig());
                                    // }

                //                 if (instance.listenContainer && typeof instance.listenContainer === 'function') {
                //                     instance.listenContainer(taskerApiObservable$, taskerContainerNotifier);
                //                 }

                                    // if (instance.ngOnSetup) {
                                    //     instance.ngOnSetup();
                                    // }

                //                 return cmp;
                //             });
                // } else {
                        if (config.inCondition) {
                            instance.setInConditionConfig(new config.inCondition());
                        }

                        if (config.outCondition) {
                            instance.setOutConditionConfig(new config.outCondition());
                        }

                        // set taskerApi
                        if (config.chartConfigs) {
                            if (_.isArray(config.chartConfigs)) {
                                config.chartConfigs.forEach((chartConfig: any) => {
                                    chartConfig(instance);
                                });
                            } else {
                                console.warn('chartConfigs for TaskerContainer config must be Array');
                            }
                        }

                        if (config.viewConfig) {
                            instance.setViewConfig(new config.viewConfig());
                        }

                        if (instance.listenContainer && typeof instance.listenContainer === 'function') {
                            instance.listenContainer(taskerApiObservable$, taskerContainerNotifier);
                        }

                        if (instance.ngOnSetup) {
                            instance.ngOnSetup();
                        }

                        return cmp;
                // }
            });
    }

}
