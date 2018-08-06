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
export const spectrum_count = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.SPECTRUM_COUNT, 
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                let spectrumCount = cloneWidgetModel.properties['spectrumCount'];
                console.log('spectrumCount', spectrumCount);
                if (spectrumCount) {
                    formConfigType.config.value = spectrumCount;
                }

                formConfigType.config.setItem = ({ key, item }) => {
                    cloneWidgetModel.properties[key] = item;
                };

                return Promise.resolve(formConfigType);
            }
        },
        component: TextboxForm,
        config: {
            title: Condic.Label.spectrumCount(),
            // unit: '%',
            style: 'threshold',
            placeholder: '',
            // value: specValue;
            validator: worstTopValidator
        }
    },
        newConfig);
};
