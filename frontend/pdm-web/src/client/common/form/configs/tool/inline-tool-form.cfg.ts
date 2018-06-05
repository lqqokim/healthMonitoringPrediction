import { FormConfigType, MultiSelectorForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { AppModelService } from '../../../model/app/common/app-model.service';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const inline_tool = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.INLINE_TOOL,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                const appModel = InjectorUtil.getService(AppModelService);
                return appModel.getInlineTools().then((items) => {
                    if (!formConfigType) {
                        console.log('We must set FormConfigType arguments');
                    }
                    
                    formConfigType.config.initValue = items;
                    formConfigType.config.setItem = ({key, item}) => {
                        cloneWidgetModel.properties[key] = item;
                    }
                    return formConfigType;
                });
            }
        },
        component: MultiSelectorForm,
        config: {
            title: Condic.Label.cluster(),
            initValue: [],
            idField: 'inlineToolId',
            labelField: 'name',
            isMultiple: false,
            isShowSelectedList: false,
            outsideClassToClose: '.a3-configuration-wrapper'

            // sample data  
            // initValue: [
            //     { inlineToolId: 2, name: 'Immersion' },
            //     { inlineToolId: 22, name: '193nm_IMMERSION' },
            //     { inlineToolId: 23, name: '193nm_WET_DRY' }
            // ],
            // selectedValue: [
            //     { inlineToolId: 22, name: '193nm_IMMERSION' },
            //     { inlineToolId: 23, name: '193nm_WET_DRY' }
            // ]
        }
    },
    newConfig);
}