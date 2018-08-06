import { FormConfigType, TextboxForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { PdmModelService } from '../../../model/app/pdm/pdm-model.service';

import { worstTopValidator } from './../../validators/worst-top.validator';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const max_param_count = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.MAX_PARAM_COUNT, 
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                let maxParamCount = cloneWidgetModel.properties['maxParamCount'];
                console.log('maxParamCount', maxParamCount);
                if (maxParamCount) {
                    formConfigType.config.value = maxParamCount;
                }

                formConfigType.config.setItem = ({ key, item }) => {
                    cloneWidgetModel.properties[key] = item;
                };

                return Promise.resolve(formConfigType);
            }
        },
        component: TextboxForm,
        config: {
            title: Condic.Label.maxParamCount(),
            // unit: '%',
            style: 'threshold',
            placeholder: '',
            // value: specValue;
            validator: worstTopValidator
        }
    },
        newConfig);
};
