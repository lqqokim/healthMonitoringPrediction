import { FormConfigType, MultiSelectorForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, StateManager, WidgetModel } from '../../../../common';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const communication = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.COMMUNICATION,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                // 초기화 
                const stateManager = InjectorUtil.getService(StateManager);
                const currentWidgetModels = stateManager.getWidgets();
                let otherWidgets = _.filter(currentWidgetModels, (d) => {
                    return d.widgetTypeId !== cloneWidgetModel.widgetTypeId;
                });

                let selectedWidgets: any = [];
                if (cloneWidgetModel.properties.communication && cloneWidgetModel.properties.communication.widgets) {
                    cloneWidgetModel.properties.communication.widgets.forEach((widgetId: number) => {
                        const widget = _.findWhere(currentWidgetModels, { widgetId });
                        if (widget) {
                            selectedWidgets.push(widget);
                        }
                    });
                }

                formConfigType.config.initValue = otherWidgets;
                formConfigType.config.selectedValue = selectedWidgets;
                formConfigType.config.setItem = ({key, item}) => {
                    // item is widgetId list after tranformItem 
                    cloneWidgetModel.properties[key] = item;
                };
                return Promise.resolve(formConfigType);
            }
        },
        component: MultiSelectorForm,
        config: {
            title: Condic.Label.communication(),
            initValue: [],
            idField: 'widgetId',
            labelField: 'title',
            isMultiple: true,
            isShowSelectedList: true,
            outsideClassToClose: '.a3-configuration-wrapper',
            // from 에서 전달된느 데이터의 형식을 전환해 준다. 
            transformItem: (widgets: any) => {
                let selectedWidgetIds: any;
                if (widgets && widgets.length > 0) {
                    selectedWidgetIds = [];
                    widgets.forEach((widget: any) => {
                        selectedWidgetIds.push(widget.widgetId);
                    });
                }
                // return communication.widgets 형식으로 반환 
                return {
                    widgets: selectedWidgetIds
                };
            }
        }
    },
    newConfig);
}