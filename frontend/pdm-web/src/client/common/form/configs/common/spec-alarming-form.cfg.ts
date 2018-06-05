import { FormConfigType, SpecAlarmingForm, Util } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { specAlarmingValidator } from '../../validators/spec-alarming.validator';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값
 */
export const spec_alarming = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.SPEC,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                if (!formConfigType) {
                    console.log('We must set FormConfigType arguments');
                }
                const spec = cloneWidgetModel.properties[CD.SPEC];
                if (spec) {
                    formConfigType.config.spec = spec;
                } else {
                    cloneWidgetModel.properties[CD.SPEC] = { ucl: 0.4, usl: 0.7 };
                    formConfigType.config.spec = { ucl: 0.4, usl: 0.7 };
                }
                formConfigType.config.setItem = ({key, item}) => {
                    cloneWidgetModel.properties[key] = item;
                };
                return Promise.resolve(formConfigType);
            }
        },
        component: SpecAlarmingForm,
        config: {
            title: 'Alarming',
            validator: specAlarmingValidator
        }
    },
    newConfig);
}