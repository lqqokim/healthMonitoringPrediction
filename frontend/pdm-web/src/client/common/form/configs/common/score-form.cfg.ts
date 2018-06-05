import { FormConfigType, TextboxForm, Util } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const score = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.SCORE,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                if (!formConfigType) {
                    console.log('We must set FormConfigType arguments');
                }
                
                const value = cloneWidgetModel.properties[CD.SCORE];
                if (value) {
                    formConfigType.config.value = value;
                } else {
                    cloneWidgetModel.properties[CD.SCORE] = 0.7;
                    formConfigType.config.value = 0.7;
                }
                formConfigType.config.setItem = ({key, item}) => {
                    if (!isNaN(item)) {
                        cloneWidgetModel.properties[key] = item;
                    }
                }
                return Promise.resolve(formConfigType);
            }
        },
        component: TextboxForm,
        config: {
            title: 'Score >',
            unit: '',
            style: 'threshold',
            placeholder: ''
        }
    },
    newConfig);
}