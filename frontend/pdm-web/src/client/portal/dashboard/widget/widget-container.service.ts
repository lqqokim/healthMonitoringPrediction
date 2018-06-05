import {
    Injectable,
    ElementRef,
    ViewContainerRef,
    Compiler
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
    WidgetModel,
    StateManager,
    WidgetRefreshType,
    RequestType,
    ConditionApi,
    WidgetConfigApi
} from '../../../common';
import { getWidgetClassInfo } from '../../../plugins/widgets';

@Injectable()
export class WidgetContainerService {

    constructor(
        private compiler: Compiler,
        private stateManager: StateManager
    ) { }

    /**
     * create dynamic widget from lazyloading process
     * @see http://embed.plnkr.co/jAmMZKz2VqponmFtPpes/
     */
    createWidget(
        widgetModel: WidgetModel,
        widgetGeneratorEl: ViewContainerRef,
        widgetBodyEl: ElementRef,
        widgetApiObservable$: Observable<WidgetRefreshType>,
        widgetContainerNotifier: Subject<RequestType>,
        conatinerElement: any,
        isConfigurationWidget: boolean
    ): any {
        const widgetModule = this.getWidgetModule(widgetModel);
        if (!widgetModule) { return; }
        const config = widgetModule.config();

        return this.compiler
            .compileModuleAndAllComponentsAsync(widgetModule)
            .then((mod) => {
                const factory = mod.componentFactories.find((comp) =>
                    comp.componentType === config.component
                );
                if (!factory) {
                    console.warn(`${widgetModule} Factory is null. Please check your widget module config.`);
                    return;
                }

                const cmp = widgetGeneratorEl.createComponent(factory);
                const instance: any = cmp.instance;

                // set WidgetApi
                if (config.chartConfigs) {
                    if (_.isArray(config.chartConfigs)) {
                        config.chartConfigs.forEach((chartConfig: any) => {
                            if (chartConfig.name === '' || chartConfig.name === 'setWidgetApi') {
                                // 기존 setWidgetApi 일 경우 
                                chartConfig(instance);
                            } else {
                                // Class로 구성할 경우 
                                const chartConfigInstance: WidgetConfigApi = new chartConfig();
                                chartConfigInstance.setWidgetApi(instance);
                                instance.setChartConfigInstance(chartConfigInstance);
                            }
                        });
                    } else {
                        // config.chartConfigs(instance);
                        console.warn('chartConfigs for WidgetContainer config must be Array');
                    }
                }

                instance.setInfo(widgetModel, widgetBodyEl, conatinerElement, isConfigurationWidget);

                if (config.properties) {
                    return instance
                        .setPropertiesConfig(new config.properties())
                        .then(() => {
                            if (config.inCondition) {
                                instance.setInConditionConfig(new config.inCondition());
                            }

                            if (config.outCondition) {
                                instance.setOutConditionConfig(new config.outCondition());
                            }

                            if (config.viewConfig) {
                                instance.setViewConfig(new config.viewConfig());
                            }

                            if (instance.listenContainer && typeof instance.listenContainer === 'function') {
                                instance.listenContainer(widgetApiObservable$, widgetContainerNotifier);
                            }

                            if (instance.ngOnSetup) {
                                instance.ngOnSetup();
                            }

                            instance.displayConfiguaration()

                            return cmp;
                        });
                } else {
                    if (config.inCondition) {
                        instance.setInConditionConfig(new config.inCondition());
                    }

                    if (config.outCondition) {
                        instance.setOutConditionConfig(new config.outCondition());
                    }

                    // set WidgetApi
                    // if (config.chartConfigs) {
                    //     if (_.isArray(config.chartConfigs)) {
                    //         config.chartConfigs.forEach((chartConfig: any) => {
                    //             chartConfig(instance);
                    //         });
                    //     } else {
                    //         config.chartConfigs(instance);
                    //     }
                    // }

                    if (config.viewConfig) {
                        instance.setViewConfig(new config.viewConfig());
                    }

                    if (instance.listenContainer && typeof instance.listenContainer === 'function') {
                        instance.listenContainer(widgetApiObservable$, widgetContainerNotifier);
                    }

                    if (instance.ngOnSetup) {
                        instance.ngOnSetup();
                    }

                    return cmp;
                }
            });
    }

    getWidgetModule(widgetModel: WidgetModel) {
        const widgetType = this.stateManager.getWidgetType(widgetModel.widgetTypeId);
        // name is widget type's KEY
        const widgetModule = getWidgetClassInfo(widgetType.name);
        if (!widgetModule.config || typeof widgetModule.config !== 'function') {
            console.error('A static config() is not in widgetModule. Please setup static config()');
            return;
        }
        return widgetModule;
    }
}
