import { Component, Input, Output, OnChanges, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    selector: 'location-modify',
    templateUrl: `location-modify.html`,
    styleUrls: [`location-modify.css`],
    providers: [ToolModelService]
})
export class LocationModifyComponent implements OnChanges, OnInit {
    @Output() actionChange = new EventEmitter();
    @Output() validityStateChange = new EventEmitter();
    @Input() status: string;
    @Input() isReadOnly: boolean;
    @Input() locationItem: any;
    @Input() 
    set data(d: any) {
        if (!d) {
            return;
        }

        this._selectedData = d;

        if (d.applier) {
            this._applier = d.applier;
            this._waitApply();
        }

        if (d.status === 'create') {
            this.myData.locationId = '';
            this.myData.locationTypeId = this._selectedData.location.locationTypeId;
            this.myData.parentId = (this._selectedData.location.parentId == -1) ? null : this._selectedData.location.parentId;
        } else {
            this.myData = this._selectedData;
        }
        
        this.getLocationName();
    }

    locationTypes;
    isNameValid: boolean = true;

    myData = {
        locationId: '',
        locationTypeId: '',
        name: '',
        parentId: ''
    };
    locationName;
    _selectedData: any;

    myForm: FormGroup;

    formErrors = {
        'name': '',
    };
    validationMessages = {
        'name': {
            // 'required': 'Name is required.',
            'required': this.translate.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', {field: 'name'})['value'],
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
        private translate: Translater
    ) { 
        this.eqpService.getLocationTypes().subscribe((locationTypes) => {
            this.locationTypes = locationTypes;
            this.getLocationName();  
        });
    }

    ngOnInit() {
        this.buildForm();
    }

    ngOnChanges(changes): void {}

    buildForm() {
        this.myForm = this.fb.group({
            'name': [this.myData.name, [Validators.required]],
            'locationName': [this.locationName]
        });
        const formValueChanges$ = this.myForm.valueChanges;
        this._formSubscription = formValueChanges$.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onValueChanged(data?: any) {
        if (!this.myForm) {
            return;
        }

        const form = this.myForm;
        this.validityStateChange.emit(form.invalid);

        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                // if (control && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    _waitApply() {
        this._subscription = this._applier.listenApplyRequest().subscribe((response) => {
            if (response.type === 'APPLY') {
                this.onClickSave('create');
            }
        });
    }

    getLocationName() {
        if (this.locationTypes === undefined || this.locationTypes.length < 1) {
            return;
        }

        this.locationName = undefined;
        for (let j = 0; j < this.locationTypes.length; j++) {
            if (this.locationTypes[j].locationTypeId === this.myData.locationTypeId) {
                this.locationName = this.locationTypes[j].name;
                break;
            }
        }

        if (this.locationName === undefined) {
            this.locationName = this.locationTypes[0].name;
            this.myData.locationTypeId = this.locationTypes[0].locationTypeId;
        }
    }

    onClickSave(status: string, callback?: any) {
        this.isNameValid = this.isValid(this.myData['name']);

        if (status !== 'delete') {
            if (!this.isNameValid) {
                return;
            }
        }

        this.status = status;

        if (this.status === 'create') {
            // console.log(this.myData);
            this.eqpService.createLocation(this.myData).subscribe(
                (data) => {
                    this._applier.appliedSuccess(this.myData);
                },
                error => {
                    console.log('Error HTTP POST Service', error);
                });
        } else if (this.status === 'modify') {
            this.eqpService.modifyLocation(this.myData).subscribe(
                (data) => {
                    if (callback !== undefined) {
                        callback('success');
                    }
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                },
                error => {
                    console.log('Error HTTP PUT Service', error);
                });
        } else if (this.status === 'delete') {
            this._deleteAction(callback);
        }
    }

    _deleteAction(callback) {
        // this.status = undefined;
        this.modalAction.showConfirmDelete({
            info: {
                title: this.myData.name,
                // confirmMessage: `${this.myData.name}를 삭제하시겠습니까?`,
                confirmMessage: this.translate.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.myData.name })['value'],
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                // this.onClickSave('delete');
                this._deleteSelectedLocation(callback);
            }
        });
    }

    _deleteSelectedLocation(callback) {
        this.eqpService.deleteLocation(this.myData.locationId).subscribe(
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

    input(event) {
        // console.log('input event', event);
        const targetId = event.target.id;
        if (targetId === 'inputName') {
            this.isNameValid = true;
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
        // console.log('-----location component destroy---');
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        if (this._formSubscription) {
            this._formSubscription.unsubscribe();
        }
    }
}

