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
    selector: 'bearing-modify',
    templateUrl: 'bearing-modify.html',
    styleUrls: ['./bearing-modify.css'],
    providers: [PdmConfigService],
    encapsulation: ViewEncapsulation.None
})
export class BearingModifyComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() selectChange: EventEmitter<any> = new EventEmitter();

    registerForm: FormGroup;
    status: string;
    bearingData: any;
    fabId: number;
    fabName: string;
    isModify: boolean;

    bearingDatas: any[];
    selectedRow: any;

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private translater: Translater,
        private formBuilder: FormBuilder,
        private notify: NotifyService,
        private pdmConfigService: PdmConfigService
    ) { }

    ngOnInit(): void {
        this.setFormValueChanges();
    }

    ngOnChanges(changes: any): void {
        // console.log('changes', changes);
        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;
            this.fabId = this._selectedData.fabId;
            this.fabName = this._selectedData.fabName;
            this.bearingDatas = this._selectedData.bearingDatas.items;
            this.selectedRow = this._selectedData.data;

            if (this.status === 'create') {
                this.isModify = false;
                this.bearingData = {
                    fabName: this.fabName,
                    modelNumber: '',
                    manufacture: '',
                    bpfo: '',
                    bpfi: '',
                    bsf: '',
                    ftf: '',
                    description: null,
                };
            } else if (this.status === 'modify') {
                this.isModify = true;
                this.bearingData = JSON.parse(JSON.stringify(this._selectedData.data));
                this.selectChange.emit({
                    value: true
                });
            }
            // console.log('bearingData', this.bearingData);
            this._buildForm();
            this._waitApply();
        }
    }

    _buildForm(): void {
        this.registerForm = new FormGroup({
            fabName: new FormControl({ value: this.fabName, disabled: true }),
            modelNumber: new FormControl({ value: this.bearingData.modelNumber, disabled: this.isModify }, Validators.required),
            manufacture: new FormControl({ value: this.bearingData.manufacture, disabled: this.isModify }, Validators.required),
            bpfo: new FormControl(this.bearingData.bpfo, [Validators.required]),
            bpfi: new FormControl(this.bearingData.bpfi, [Validators.required]),
            bsf: new FormControl(this.bearingData.bsf, [Validators.required]),
            ftf: new FormControl(this.bearingData.ftf, [Validators.required]),
            description: new FormControl(this.bearingData.description)
        });

        this.isformValidStatus();
    }

    _waitApply(): void {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    if (this.status === 'create') {
                        if (this._checkUniqueData()) {
                            this._saveBearingData();
                        } else {
                            this.notify.warn("PDM.NOTIFY.DUPLICATE_BEARING");
                            return;
                        }
                    } else if (this.status === 'modify') {
                        if (!this._checkUniqueData()) {// exist
                            if (this.selectedRow.manufacture === this.registerForm.controls['manufacture'].value && this.selectedRow.modelNumber === this.registerForm.controls['modelNumber'].value) {
                                this._saveBearingData();
                            }
                        } else {
                            this.notify.warn("PDM.NOTIFY.DUPLICATE_BEARING");
                            return;
                        }
                    }
                }
            });
    }

    _checkUniqueData(): boolean {
        let isUnique: boolean = true;

        for (let i = 0; i < this.bearingDatas.length; i++) {
            if (this.bearingDatas[i].manufacture === this.registerForm.controls['manufacture'].value && this.bearingDatas[i].modelNumber === this.registerForm.controls['modelNumber'].value) {
                isUnique = false;
                break;
            }
        }

        return isUnique;
    }

    _saveBearingData(): void {
        let request = {
            modelNumber: this.registerForm.controls['modelNumber'].value,
            manufacture: this.registerForm.controls['manufacture'].value,
            bpfo: Number(this.registerForm.controls['bpfo'].value),
            bpfi: Number(this.registerForm.controls['bpfi'].value),
            bsf: Number(this.registerForm.controls['bsf'].value),
            ftf: Number(this.registerForm.controls['ftf'].value),
            description: this.registerForm.controls['description'].value
        };

        console.log('req', request);

        this.pdmConfigService.updateBearing(this.fabId, request)
            .then((res: any) => {
                this._applier.appliedSuccess();
            }).catch((error: any) => {

            });
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

    setFormValueChanges(): void {
        this.registerForm.get('modelNumber').valueChanges.subscribe((value: string) => {
            if (value) {
                if (value.split("").includes(" ")) {//blank
                    let arr = value.split("");
                    delete arr[arr.indexOf(" ")];
                    let input = arr.join("");
                    this.registerForm.get('modelNumber').patchValue(input, { emitEvent: false });
                    // this.registerForm.get('manufacture').patchValue(value.replace(/^\s*/, ""), { emitEvent: false });
                }
            }
        });

        this.registerForm.get('manufacture').valueChanges.subscribe((value: string) => {
            if (value) {
                if (value.split("").includes(" ")) {//blank
                    let arr = value.split("");
                    delete arr[arr.indexOf(" ")];
                    let input = arr.join("");
                    this.registerForm.get('manufacture').patchValue(input, { emitEvent: false });
                }
            }
        });

        this.registerForm.get('bpfo').valueChanges.subscribe((value: string) => {
            if (value) {
                if (!RegExp('([0-9]|\\.)$').test(value) || RegExp('\\.\\.$').test(value) || value.split('.').length === 3) {
                    let replace = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
                    let input = replace.substr(0, value.length - 1)
                    this.registerForm.get('bpfo').patchValue(input, { emitEvent: false });
                } else if (value.split("").includes(" ")) {
                    let arr = value.split("");
                    delete arr[arr.indexOf(" ")];
                    let input = arr.join("");
                    this.registerForm.get('bpfo').patchValue(input, { emitEvent: false });
                }
            }
        });

        this.registerForm.get('bpfi').valueChanges.subscribe((value: string) => {
            if (value) {
                if (!RegExp('([0-9]|\\.)$').test(value) || RegExp('\\.\\.$').test(value) || value.split('.').length === 3) {
                    let replace = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
                    let input = replace.substr(0, value.length - 1)
                    this.registerForm.get('bpfi').patchValue(input, { emitEvent: false });
                } else if (value.split("").includes(" ")) {
                    let arr = value.split("");
                    delete arr[arr.indexOf(" ")];
                    let input = arr.join("");
                    this.registerForm.get('bpfi').patchValue(input, { emitEvent: false });
                }
            }
        });

        this.registerForm.get('bsf').valueChanges.subscribe((value: string) => {
            if (value) {
                if (!RegExp('([0-9]|\\.)$').test(value) || RegExp('\\.\\.$').test(value) || value.split('.').length === 3) {
                    let replace = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
                    let input = replace.substr(0, value.length - 1)
                    this.registerForm.get('bsf').patchValue(input, { emitEvent: false });
                } else if (value.split("").includes(" ")) {
                    let arr = value.split("");
                    delete arr[arr.indexOf(" ")];
                    let input = arr.join("");
                    this.registerForm.get('bsf').patchValue(input, { emitEvent: false });
                }
            }
        });

        this.registerForm.get('ftf').valueChanges.subscribe((value: string) => {
            if (value) {
                if (!RegExp('([0-9]|\\.)$').test(value) || RegExp('\\.\\.$').test(value) || value.split('.').length === 3) {
                    let replace = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
                    let input = replace.substr(0, value.length - 1)
                    this.registerForm.get('ftf').patchValue(input, { emitEvent: false });
                } else if (value.split("").includes(" ")) {
                    let arr = value.split("");
                    delete arr[arr.indexOf(" ")];
                    let input = arr.join("");
                    this.registerForm.get('ftf').patchValue(input, { emitEvent: false });
                }
            }
        });
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}