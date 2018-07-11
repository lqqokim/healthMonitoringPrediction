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
export const worst_top = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.WORST_TOP,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                let worstTop = cloneWidgetModel.properties[CD.WORST_TOP];

                if (worstTop) {
                    formConfigType.config.value = worstTop;
                } else {
                    formConfigType.config.value = 12;
                }

                formConfigType.config.setItem = ({ key, item }) => {
                    cloneWidgetModel.properties[key] = item;
                };

                return Promise.resolve(formConfigType);
            }
        },
        component: TextboxForm,
        config: {
            title: "Worst Top",
            // unit: '%',
            style: 'threshold',
            placeholder: '',
            // value: specValue;
            validator: worstTopValidator
        }
    },
        newConfig);
};
