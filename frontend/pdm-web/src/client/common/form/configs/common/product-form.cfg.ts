import { FormConfigType, MultiSelectorForm, Util, InjectorUtil } from '../../../../sdk';
import { Condic, WidgetModel } from '../../../../common';
import { WqpModelService } from '../../../model/app/fdc/wqp-model.service';

/**
 * key: internal usage key. condition key 
 * proxy: init, select 일 경우 data를 설정한다. 초기값을 하드코딩하거나 ajax호출하여 설정한다. 
 * component: component class 
 * config: 컴포넌트에서 사용하는 환경 설정 값 
 */
export const product = (newConfig: FormConfigType = {}): FormConfigType => {
    return Util.Data.mergeDeep({
        key: CD.PRODUCTS,
        proxy: {
            initValuePromise: (formConfigType: FormConfigType, cloneWidgetModel: WidgetModel): Promise<any> => {
                const appModel = InjectorUtil.getService(WqpModelService);
                let key = this.key;
                return appModel.getProducts().then((items) => {
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
            title: 'Products',
            initValue: [],
            idField: 'productId',
            labelField: 'productName',
            isMultiple: true,
            isShowSelectedList: true,
            outsideClassToClose: '.a3-configuration-wrapper'
        }
    },
    newConfig);
}