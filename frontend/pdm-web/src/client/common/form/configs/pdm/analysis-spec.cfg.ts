import { FormConfigType, TextboxForm, Util, InjectorUtil, Translater } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { PdmModelService } from '../../../model/app/pdm/pdm-model.service';

import { analysisSpecValidator } from '../../validators/analysis-spec.validator';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const analysis_spec = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.ANALYSIS_SPEC,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                let analysisSpec = cloneWidgetModel.properties[CD.ANALYSIS_SPEC];

                if (analysisSpec) {
                    formConfigType.config.value = analysisSpec;
                } else {
                    formConfigType.config.value = 100;
                }

                formConfigType.config.setItem = ({ key, item }) => {
                    cloneWidgetModel.properties[key] = item;
                };

                return Promise.resolve(formConfigType);
            }
        },
        component: TextboxForm,
        config: {
            title: Condic.Label.analysisSpec(),
            unit: '%',
            style: 'threshold',
            placeholder: '',
            // value: specValue;
            validator: analysisSpecValidator
        }
    },
        newConfig);
};
