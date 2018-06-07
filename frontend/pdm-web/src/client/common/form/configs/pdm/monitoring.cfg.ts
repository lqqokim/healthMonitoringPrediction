import { FormConfigType, MultiSelectorForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { PdmModelService } from '../../../model/app/pdm/pdm-model.service';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */

export const monitoring = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.MONITORING,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                const pdmModel = InjectorUtil.getService(PdmModelService);
                return pdmModel.getPlants().then((plants: any[]) => {
                   return pdmModel.getMonitoring(plants[0].fabId).toPromise().then((monitorings: any[]) => {
                        if (!formConfigType) {
                            console.log('We must set FormConfigType arguments');
                        }
                        formConfigType.config.initValue = monitorings;
                        formConfigType.config.setItem = ({ key, item }) => {
                            cloneWidgetModel.properties[key] = item;
                        };
                        return formConfigType;
                    });
                });
            }
        },
        component: MultiSelectorForm,
        config: {
            title: Condic.Label.monitoring(),
            initValue: [],
            idField: CD.MONITORING_ID,
            labelField: CD.MONITORING_NAME,
            isMultiple: false,
            isShowSelectedList: false,
            outsideClassToClose: '.a3-configuration-wrapper',
        }
    },
        newConfig);
};
