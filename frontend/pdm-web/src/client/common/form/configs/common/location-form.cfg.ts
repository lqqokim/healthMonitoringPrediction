import { FormConfigType, SelectorGroupForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel, ConditionConstant } from '../../../../common';
import { ConfigModelService } from '../../../model/platform/config-model.service';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const location = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.LOCATION,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                const configAppModel = InjectorUtil.getService(ConfigModelService);
                let key = this.key;

                return configAppModel.getLocationTypes().then((locationTypes) => {
                    if (!formConfigType) {
                        console.log('We must set FormConfigType arguments');
                    }
                    
                    formConfigType.config.conditionConstant = ConditionConstant;
                    formConfigType.config.initValue = locationTypes;
                    formConfigType.config.selectedValue = {
                        [CD.LOCATION]: cloneWidgetModel.properties[CD.LOCATION],
                    };
                    // set locatoin function based on AJAX
                    formConfigType.config.setItem = ({key, item}) => {
                        cloneWidgetModel.properties[key] = item;
                    }
                    return formConfigType;
                });
            }
        },
        component: SelectorGroupForm,
        config: {
            title: 'empty',
            isToolModelEnable: false,
            isToolsEnable: false,
            isExcludeParamsEnable: false,
            outsideClassToClose: '.a3-configuration-wrapper'
        }
    },
    newConfig);
}

// export interface SelectorGroupConfigType {
//     key: string;
//     title?: any;

//     // locationTypes 
//     initValue: any;
    
//     isToolModelEnable: boolean;
//     isToolsEnable: boolean;
//     isExcludeParamsEnable: boolean;
    
//     setItem: any;
//     selectedValue?: any;
//     transformItem?: any;
// }