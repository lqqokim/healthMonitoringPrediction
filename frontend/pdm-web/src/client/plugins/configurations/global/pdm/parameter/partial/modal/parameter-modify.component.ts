//Angular
import { Component, Input, Output, OnInit, OnChanges, OnDestroy, ViewEncapsulation, SimpleChanges, DoCheck, Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

//MIP
import { ModalApplier } from '../../../../../../../common';
import { Translater, NotifyService } from '../../../../../../../sdk';
import { PdmConfigService } from './../../../model/pdm-config.service';

@Component({
    moduleId: module.id,
    selector: 'parameter-modify',
    templateUrl: 'parameter-modify.html',
    styleUrls: ['parameter-modify.css'],
    providers: [PdmConfigService],
    encapsulation: ViewEncapsulation.None
})
export class ParameterModifyComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() selectChange: EventEmitter<any> = new EventEmitter();

    registerForm: FormGroup;
    eqpDatas: Array<string> = [];
    status: string;
    paramData: any;

    eqpId: number;
    fabId: number;

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private translater: Translater,
        private formBuilder: FormBuilder,
        private notify: NotifyService,
        private pdmConfigService: PdmConfigService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: any): void {
        console.log('changes', changes);
        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;
            this.eqpId = this._selectedData.data.eqpId;
            this.fabId = this._selectedData.fabId;

            if (this.status === 'create') {
                this.paramData = {
                    description: null,
                    eu: '',
                    rpm: null,
                    eqpId: this._selectedData.data.eqpId,
                    paramType: '',
                    paramName: '',
                    euType: '',
                    eqpName: this._selectedData.data.eqpName,
                };
            } else if (this.status === 'modify') {
                this.paramData = JSON.parse(JSON.stringify(this._selectedData.data));
                this.selectChange.emit({
                    value: true
                });
            }

            console.log('pramaData', this.paramData);
            this._waitApply();
            this._buildForm();
        }
    }

    _buildForm(): void {
        this.registerForm = new FormGroup({
            eqpName: new FormControl({ value: this.paramData.eqpName, disabled: true }),
            paramName: new FormControl(this.paramData.paramName, [Validators.required]),
            paramType: new FormControl(this.paramData.paramType, [Validators.required]),
            eu: new FormControl(this.paramData.eu, [Validators.required]),
            euType: new FormControl(this.paramData.euType, [Validators.required]),
            rpm: new FormControl(this.paramData.rpm),
            description: new FormControl(this.paramData.description)
        });

        setTimeout(() => {
            this.isformValidStatus();
        }, 100);
    }

    _waitApply(): void {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._saveParameterData();
                }
            });
    }

    _saveParameterData(): void {
        let params = [];
        console.log('_saveParameterData', this.registerForm);

        if (this.status === 'create') {
            params = _.extend(this.registerForm.value, { eqpId: this.eqpId });
        } else if (this.status === 'modify') {
            params = _.extend(this.registerForm.value, { eqpId: this.eqpId }, { paramId: this.paramData.paramId })
        }

        this.pdmConfigService.updateParam(this.fabId, this.eqpId, params)
            .then((res: any) => {
                this._applier.appliedSuccess();
            }).catch((error: any) => {
                this._applier.appliedFailed();
            });
    }

    private nameValidator(control: FormControl): any {

    }

    private parameterTypeValidator(control: FormControl): any {

    }

    private isformValidStatus(): void {
        this.registerForm.statusChanges.subscribe((form: string) => {
            let isRequired;
            if (form === 'VALID') {
                isRequired = true;
            } else if (form === 'INVALID') {
                isRequired = false;;
            }

            this.selectChange.emit({
                value: isRequired
            });
        });
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}