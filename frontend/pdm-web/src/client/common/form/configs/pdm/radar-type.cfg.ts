import { FormConfigType, MultiSelectorForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { PdmModelService } from '../../../model/app/pdm/pdm-model.service';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const radar_type = (newConfig: FormConfigType = {}): FormConfigType => {
    const radarType: any[] = [
        { typeId: 'AW', typeName: 'Alarm-Warning' },
        { typeId: 'G5', typeName: 'Good Variation' },
        { typeId: 'B5', typeName: 'Bad Variation' }
    ];
    
    return Util.Data.mergeDeep({
        key: CD.RADAR_TYPE,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                formConfigType.config.initValue = radarType;
                formConfigType.config.setItem = ({ key, item }) => {
                    cloneWidgetModel.properties[key] = item;
                };

                return Promise.resolve(formConfigType);
            }
        },
        component: MultiSelectorForm,
        config: {
            title: Condic.Label.radarType(),
            initValue: [],
            idField: CD.RADAR_TYPE_ID,
            labelField: CD.RADAR_TYPE_NAME,
            isMultiple: false,
            isShowSelectedList: false,
            outsideClassToClose: '.a3-configuration-wrapper'
        }
    }, newConfig);
};
