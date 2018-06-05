import { Component, Input, Output, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import {
    ToolModelService,
    ModalApplier,
    ModalAction,
    ModalRequester,
    RequestType
} from '../../../../../../../../common';
import { NotifyService, Translater } from '../../../../../../../../sdk';

import { Subscription } from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'module-modify',
    templateUrl: `module-modify.html`,
    providers: [ToolModelService]
})
export class ModuleModifyComponent implements OnChanges, OnInit {
    // @Output() actionChange = new EventEmitter();
    @Output() validityStateChange = new EventEmitter();
    @Input() data: any;
    @Input() status: string;
    @Input() isReadOnly: boolean;
    @Input() moduleItem: any;

    locationTypes;
    locations;
    toolModels;
    toolModelVersions;
    toolGroups;
    moduleGroups;
    moduleTypes;
    myData;
    _selectedData: any;
    moduleList: any;

    isNameValid: boolean = true;
    isTypeValid: boolean = true;
    isGroupValid: boolean = true;
    isSameName: boolean = false;

    myForm: FormGroup;
    formErrors = {
        'name': '',
        'moduleType': '',
        'moduleGroup': ''
    };
    validationMessages = {
        'name': {
            'required': this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', { field: 'name' })['value'],
            // TODO: MESAAGE i18n
            'invalidName': '동일한 name이 존재합니다.'
        },
        'moduleType': {
            'required': this.translater.get('MESSAGE.APP_CONFIG.TOOLS.SELECT_VALID', { type: 'Module Type' })['value']
        },
        'moduleGroup': {
            'required': this.translater.get('MESSAGE.APP_CONFIG.TOOLS.SELECT_VALID', { type: 'Module Group' })['value']
        }
    };

    private _applier: ModalApplier;
    private _subscription: Subscription;
    private _formSubscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private eqpService: ToolModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater
    ) { }

    ngOnInit() {

        this.buildForm();
    }

    ngOnChanges(changes): void {
        console.log('module changes', changes);

        if (this.locationTypes === undefined) {

            this.eqpService.getLocationTypes().subscribe((datas) => {
                this.locationTypes = datas;
            });

            this.eqpService.getLocationList().subscribe((locations) => {
                this.locations = locations;
            });

            this.eqpService.getToolModels().subscribe((datas) => {
                this.toolModels = datas;
            });

            this.eqpService.getToolGroups().subscribe((datas) => {
                this.toolGroups = datas;
            });

            this.eqpService.getModuleGroups().subscribe((datas) => {
                this.moduleGroups = datas;
            });

            this.eqpService.getModuleTypes().subscribe((datas) => {
                this.moduleTypes = datas;
            });
        }

        if (changes['data']) {
            if (this.data.applier) {
                this._applier = this.data.applier;
                this._waitApply();
            }
            if (this.data !== undefined && this.data !== null && this.status === 'create') {
                let inputData = this.data.module;
                this.myData = {};
                this.myData['toolId'] = inputData.toolId;
                this.myData['toolName'] = inputData.toolName;
                this.myData['parentId'] = inputData.parentId;
                this.myData['parentName'] = inputData.parentName;
            } else if (this.data !== undefined && this.data !== null) {
                this.myData = this.data;
            }
            this.buildForm();
            setTimeout(() => {
                this._fieldDisableSetting();
            });
        }
        if (changes['isReadOnly']) {
            this._fieldDisableSetting();
        }

    }

    _fieldDisableSetting() {
        if (this.myForm) {
            if (this.isReadOnly === true) {
                this.myForm.get('moduleType').disable();
                this.myForm.get('moduleGroup').disable();
            } else {
                this.myForm.get('moduleType').enable();
                this.myForm.get('moduleGroup').enable();
            }
        }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this.onClickSave('create');
                }
            });
    }

    buildForm() {
        this.myForm = this.fb.group({
            'name': [this.myData.name, [Validators.required]],
            'alias': [this.myData.alias],
            'toolName': [this.myData.toolName],
            'moduleType': [{ value: this.myData.moduleTypeId, disabled: false }, [Validators.required]],
            'parentName': [this.myData.parentName],
            'moduleGroup': [{ value: this.myData.moduleGroupId, disabled: false }, [Validators.required]]
        });
        const formValueChanges$ = this.myForm.valueChanges;
        this._formSubscription = formValueChanges$.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onValueChanged(data?: any) {
        if (!this.myForm) { return; }
        const form = this.myForm;
        this.validityStateChange.emit(form.invalid);

        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (field === 'name' && this.moduleList) {
                for (let i = 0; i < this.moduleList.length; i++) {
                    if (control.value === this.moduleList[i]['name']) {
                        form.controls['name'].setErrors({ invalidName: true });
                        break;
                    }
                }
            }

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onClickSave(status: string, callback?: any) {
        // TODO: Delete this variable and variables-related methods after validation testing
        this.isNameValid = this.isValid(this.myData['name']);
        this.isTypeValid = this.isValid(this.myData['moduleTypeId']);
        this.isGroupValid = this.isValid(this.myData['moduleGroupId']);

        if (status !== 'delete') {
            if (!this.isNameValid || !this.isTypeValid || !this.isGroupValid) {
                return;
            }
        }

        this.status = status;
        if (this.status === 'create') {
            this.eqpService.createModule(this.myData).subscribe(
                (data) => {
                    this._applier.appliedSuccess();
                },
                (error) => {
                    this._applier.appliedFailed();
                    console.log('Error HTTP POST Service', error);
                });
        } else if (this.status === 'modify') {
            this.eqpService.modifyModule(this.myData).subscribe(
                (data) => {
                    if (callback !== undefined) {
                        callback('success');
                    }
                    //TODO: MESSAGE
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                },
                (error) => {
                    console.log('Error HTTP PUT Service', error);
                });
        } else if (this.status === 'delete') {
            this._deleteAction(callback);
        }
    }

    _deleteAction(callback) {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.myData.name,
                // confirmMessage: `${this.myData.name}를 삭제하시겠습니까?`,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.myData.name })['value'],
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                // this.onClickSave('delete');
                this._deleteSelectedModule(callback);
            }
        });
    }

    _deleteSelectedModule(callback) {
        this.eqpService
            .deleteModule(this.myData)
            .subscribe(
            (data) => {
                if (callback !== undefined) {
                    callback('success');
                }
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            },
            (error) => {
                console.log('Error HTTP DELETE Service', error);
                this.notify.error('MESSAGE.GENERAL.ERROR');
            });
    }

    //TODO : Delete after validation testing
    input(event) {
        const targetId = event.target.id;
        if (targetId === 'inputName') {
            this.isNameValid = true;
        } else if (targetId === 'inputModuleType') {
            this.isTypeValid = true;
        } else if (targetId === 'inputModuleGroup') {
            this.isGroupValid = true;
        }
    }

    isValid(isValid) {
        if (isValid === undefined || isValid === null || isValid === '') {
            return false;
        } else {
            return true;
        }
    }

    ngOnDestroy() {
        console.log('---module modify component destroy---');
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        if (this._formSubscription) {
            this._formSubscription.unsubscribe();
        }
    }
}
