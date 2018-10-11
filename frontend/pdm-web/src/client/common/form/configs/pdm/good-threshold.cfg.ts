import { FormConfigType, TextboxForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { PdmModelService } from '../../../model/app/pdm/pdm-model.service';

// import { worstTopValidator } from './../../validators/worst-top.validator';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const good_threshold = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.GOOD_THRESHOLD, 
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                let goodThreshold = cloneWidgetModel.properties['goodThreshold'];

                if (goodThreshold) {
                    formConfigType.config.value = goodThreshold;
                }

                formConfigType.config.setItem = ({ key, item }) => {
                    cloneWidgetModel.properties[key] = item;
                };

                return Promise.resolve(formConfigType);
            }
        },
        component: TextboxForm,
        config: {
            title: Condic.Label.goodThreshold(),
            // unit: '%',
            style: 'threshold',
            placeholder: '',
            // value: specValue;
            // validator: worstTopValidator
        }
    },
        newConfig);
};
