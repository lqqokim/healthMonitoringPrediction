import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FormControlBase } from './form-control-base';
import { FormConfigType } from './form.type';
import { Translater } from '../../i18n/translater';

@Injectable()
export class FormBuilderService {

    constructor(private translator: Translater) {}

    getFormLength(formConfigTypes: [FormConfigType]): number {
        return formConfigTypes.length;
    }

    /**
     * 초기값 설정은 Promise로 리턴되므로 Promise.all로 처리된다. 
     * FormConfigType array 
     * model is used into initValuePromise ex) WidgetModel
     * subModelName is used making initValue ex) properties of WidgetModel
     */
    buildForm(formConfigTypes: [FormConfigType], model: any, subModelName?: string): Promise<any> {
        if (!formConfigTypes || formConfigTypes.length === 0) { return Promise.resolve(false); }

        return this._buildFormControl(formConfigTypes, model, subModelName)
                    .then((formControls: FormControlBase<any>[]) => {
                        const formGroup = this._buildFormGroup(formControls);
                        return {
                            formGroup,
                            formControls
                        }
                    });
    }

    _buildFormGroup(properties: FormControlBase<any>[]) {
        let group: any = {};

        if (properties && properties.length > 0) {
            properties.forEach(form => {
                group[form.key] = form.config.validator ? 
                                        new FormControl(form.value || '', form.config.validator)
                                      : new FormControl(form.value || '');
                // group[form.key] = new FormControl(form.value || '');
            });
        }

        return new FormGroup(group);
    }

    _buildFormControl(formConfigTypes: [FormConfigType], model: any, subModelName?: string): Promise<any> {
        let promises: any = [];
        formConfigTypes.forEach((formConfigType: FormConfigType) => {
            if (formConfigType.config.title) {
                // translate title 
                if (typeof formConfigType.config.title === 'object') {
                    formConfigType.config.title = this._translate(formConfigType.config.title);
                }
            }
            // 초기값 설정, 리턴은 반드시 Promise객체이다. 
            // make initValue based on Promise 
            if (formConfigType.proxy && formConfigType.proxy.initValuePromise) {
                promises.push(formConfigType.proxy.initValuePromise(formConfigType, model));
            } else {
                promises.push(((): Promise<any> => {
                    return Promise.resolve(formConfigType);
                })());
            }
        });

        let formControls: FormControlBase<any>[] = [];
        return Promise.all(promises)
                .then((formTypes: any) => {
                    if (formTypes && formTypes.length > 0) {
                        formTypes.forEach((formType: FormConfigType) => {
                            formControls.push(this._createFormControl(formType, model, subModelName));
                        });
                    }
                    return formControls;
                });
    }

    _createFormControl(formConfigType: FormConfigType, model: any, subModelName?: string): FormControlBase<any> {
        // 컴포넌트에서 선택될 값은 key와 동일한 곳에 위치한다. 
        let selectedValue = formConfigType.config.selectedValue;
        if (!selectedValue) {
            if (model && !subModelName) {
                selectedValue = model[formConfigType.key];
            } else {
                selectedValue = model[subModelName][formConfigType.key];
            }
        }

        if (selectedValue) {
            // for MultiSelector Component 
            if (formConfigType.config && formConfigType.config.isMultiple) {
                if (_.isArray(selectedValue)) {
                    formConfigType.config.selectedValue = selectedValue;
                } else {
                    formConfigType.config.selectedValue = [selectedValue];
                }
            } else {
               formConfigType.config.selectedValue = selectedValue;
            }
        }

        const formControl: FormControlBase<any> = new formConfigType.component({
            key: formConfigType.key,
            config: formConfigType.config
        });

        return formControl;
    }

    _translate(key) {
        if (typeof key === 'object') {
            return this.translator.instant(key.i18n);
        } else {
            return key;
        }
    }

    _getTest() {
        // let properties: FormControlBase<any>[] = [
        //     new MultiSelectorForm({
        //         key: CD.INLINE_GROUP,
        //         config: {
        //             title: 'Cluster Group',
        //             initValue: [
        //                 { inlineGroupId: 2, name: 'Immersion' },
        //                 { inlineGroupId: 22, name: '193nm_IMMERSION' },
        //                 { inlineGroupId: 23, name: '193nm_WET_DRY' }
        //             ],
        //             selectedValue: [
        //                 { inlineGroupId: 22, name: '193nm_IMMERSION' },
        //                 { inlineGroupId: 23, name: '193nm_WET_DRY' }
        //             ],
        //             idField: 'inlineGroupId',
        //             labelField: 'name',
        //             isMultiple: true,
        //             isShowSelectedList: true,
        //             selectChange: function (obj: any) { console.table(obj.selectedList); }
        //         }
        //     }),

            //   new MultiSelectorForm({
            //       key: 'WidgetComms',
            //       config: {
            //           title: 'Sync With',
            //           isMultiple: true,
            //           isShowSelectedList: true,
            //           selectedList: [ 
            //               {widgetId: 22, title: '193nm_IMMERSION'}, 
            //               {widgetId: 23, title: '193nm_WET_DRY'} ],
            //           list: [ 
            //               {widgetId: 2, title: 'Immersion'}, 
            //               {widgetId: 22, title: '193nm_IMMERSION'}, 
            //               {widgetId: 23, title: '193nm_WET_DRY'} ],
            //           idField: 'widgetId',
            //           labelField: 'title',
            //           selectChange: function (obj: any) { console.table(obj.selectedList); }
            //       }
            //   }),

            //   new DropdownForm({
            //     key: 'brave',
            //     label: 'Bravery Rating',
            //     options: [
            //       {key: 'solid',  value: 'Solid'},
            //       {key: 'great',  value: 'Great'},
            //       {key: 'good',   value: 'Good'},
            //       {key: 'unproven', value: 'Unproven'}
            //     ],
            //     order: 3
            //   }),

            //   new TextboxForm({
            //     key: 'firstName',
            //     label: 'First name',
            //     value: 'Bombasto',
            //     required: true,
            //     order: 1
            //   }),

        // ];

        // return properties;
    }
}