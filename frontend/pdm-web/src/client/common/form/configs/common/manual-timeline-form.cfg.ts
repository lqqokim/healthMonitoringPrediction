import { FormConfigType, ManualTimelineForm, Util } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';

/**
 * key: internal usage key. condition key
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다.
 * component: component class
 * config: 컴포넌트에서 사용하는 환경 설정 값
 */
export const manual_timeline = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.MANUAL_TIMELINE,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                if (!formConfigType) {
                    console.log('We must set FormConfigType arguments');
                }

                const value = cloneWidgetModel.properties[CD.MANUAL_TIMELINE];
                formConfigType.config.value = value;
                /*
                if (value) {
                    formConfigType.config.value = {
                        selectedDate: value.selectedDate,
                        dateMode: value.dateMode || A3_CONFIG.WIDGET.TIME_LINE.NOW
                    }
                } else {
                    formConfigType.config.value = {
                        selectedDate: null,
                        dateMode: A3_CONFIG.WIDGET.TIME_LINE.NOW
                    }
                }
                */

                formConfigType.config.setItem = ({key, item}) => {
                    cloneWidgetModel.properties[key] = item;
                }

                return Promise.resolve(formConfigType);
            }
        },
        component: ManualTimelineForm,
        config: {
            title: 'Timeline',
        }
    },
    newConfig);
}
