import { FormConfigType, DateRangeForm, Util } from '../../../../sdk';
import { WidgetModel } from '../../../app-state/dashboard/dashboard.type';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const time_period = (newConfig: FormConfigType = {}): FormConfigType => {
    const returnValue = Util.Data.mergeDeep({
        key: CD.TIME_PERIOD,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                // 초기화 
                let cutoffType = cloneWidgetModel.properties.cutoffType;
                let dayPeriod = cloneWidgetModel.properties.dayPeriod;
                let timePeriod = cloneWidgetModel.properties.timePeriod;
                // 값이 없을 경우 
                if (!cutoffType) {
                    cutoffType = 'DAY';
                }
                if (!dayPeriod) {
                    dayPeriod = 1;
                }
                if (!timePeriod) {
                    timePeriod = {};
                    const now = Util.Date.now();
                    timePeriod.from = Util.Date.getFrom(cloneWidgetModel.properties.dayPeriod, now);
                    timePeriod.to = now;
                }
                // console.log('time_period cloneWidgetModel : ', cloneWidgetModel.properties);
                // v1 버전 호환성
                formConfigType.config.cutoffType = cutoffType;
                formConfigType.config.dayPeriod = dayPeriod;
                // v2 에서는 cutoffType, dayPeriod도 함께 담긴다. 
                formConfigType.config.timePeriod = timePeriod;
                // pdm 요청으로 인한 properties 추가
                // formConfigType.config.isTimePeriod = isTimePeriod;
                formConfigType.config.setItem = ({key, item}) => {
                    cloneWidgetModel.properties[key] = {
                        from: item[CD.TIME_PERIOD][CD.FROM],
                        to: item[CD.TIME_PERIOD][CD.TO]
                    };
                    cloneWidgetModel.properties[CD.CUTOFF_TYPE] = item[CD.CUTOFF_TYPE];
                    cloneWidgetModel.properties[CD.DAY_PERIOD] = item[CD.DAY_PERIOD];
                };
                return Promise.resolve(formConfigType);
            }
        },
        component: DateRangeForm,
        config: {
            cutoffType: undefined,
            dayPeriod: 1,
            timePeriod: undefined,
            isTimePeriod: true
        }
    },
    newConfig);
    return returnValue;
};
