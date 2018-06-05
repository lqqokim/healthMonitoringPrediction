import { FormConfigType, SelectorForm, Util } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';

/**
 * key: internal usage key. condition key
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다.
 * component: component class
 * config: 컴포넌트에서 사용하는 환경 설정 값
 */
export const date_type = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.DATE_TYPE,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                if (!formConfigType) {
                    console.log('We must set FormConfigType arguments');
                }

                const value = cloneWidgetModel.properties[CD.DATE_TYPE];
                if (value) {
                    formConfigType.config.value = {
                        selected: value,
                        options: A3_CODE.DFD.PERIOD_TYPE
                    }
                } else {
                    formConfigType.config.value = {
                        selected: _.first(A3_CODE.DFD.PERIOD_TYPE).data,
                        options: A3_CODE.DFD.PERIOD_TYPE
                    }
                }

                formConfigType.config.setItem = ({key, item}) => {
                    cloneWidgetModel.properties[key] = item;
                }

                return Promise.resolve(formConfigType);
            }
        },
        component: SelectorForm,
        config: {
            title: 'Default x-axis'
        }
    },
    newConfig);
}
