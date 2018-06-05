import { FormConfigType, SelectorForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const analysis_spec_visible = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.ANALYSIS_SPEC_VISIBLE,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                const value = cloneWidgetModel.properties[CD.ANALYSIS_SPEC_VISIBLE];
                const options = [{ data: true, label: 'true' }, { data: false, label: 'false' }]
                console.log('analysis_spec_visible value', value);

                if (value === undefined) {
                    formConfigType.config.value = {
                        selected: options[1].data,
                        options: options
                    }
                } else if (value !== undefined) {
                    formConfigType.config.value = {
                        selected: value,
                        options: options
                    }
                }

                // if (value) {
                //     formConfigType.config.value = {
                //         selected: value,
                //         options: options
                //     }
                // } else {
                //     formConfigType.config.value = {
                //         selected: _.first(options).data,
                //         options: options
                //     }
                // }

                formConfigType.config.setItem = ({ key, item }) => {
                    cloneWidgetModel.properties[key] = item;
                }

                return Promise.resolve(formConfigType);
            }
        },
        component: SelectorForm,
        config: {
            title: 'Analysis Spec Visible',
        }
    },
        newConfig);
};
