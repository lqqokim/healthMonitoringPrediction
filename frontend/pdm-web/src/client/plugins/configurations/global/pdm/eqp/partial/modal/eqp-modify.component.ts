//Angular
import { Component, Input, Output, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation, SimpleChanges, DoCheck, Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

//MIP
import { ModalApplier } from '../../../../../../../common';
import { Translater, NotifyService } from '../../../../../../../sdk';
import { PdmConfigService } from './../../../model/pdm-config.service';

@Component({
    moduleId: module.id,
    selector: 'eqp-modify',
    templateUrl: 'eqp-modify.html',
    styleUrls: ['./eqp-modify.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]

})
export class EqpModifyComponent implements OnInit, OnChanges {
    @ViewChild("fileInput") file;
    @Input() data: any;
    @Output() selectChange: EventEmitter<any> = new EventEmitter();

    registerForm: FormGroup;
    status: string = '';
    eqpData: any = {};
    eqpDatas: Array<string> = [];
    plantId: number;

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

            if (this.status === 'create') {
                this.eqpData = {
                    areaName: this._selectedData.data.areaName,
                    eqpName: '',
                    description: '',
                    image: null
                };
            } else if (this.status === 'modify') {
                this.eqpData = JSON.parse(JSON.stringify(this._selectedData.data));
                this.selectChange.emit({
                    value: true
                });
            }

            this._buildForm();
            this._waitApply();
        }
    }

    _buildForm(): void {
        this.registerForm = new FormGroup({
            areaName: new FormControl({ value: this.eqpData.areaName, disabled: true }),
            eqpName: new FormControl(this.eqpData.eqpName, [Validators.required]),
            description: new FormControl(this.eqpData.description),
            image: new FormControl(this.eqpData.image)
        });

        this.isformValidStatus();
    }

    _waitApply(): void {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._saveEqpData();
                }
            });
    }

    _saveEqpData(): void {
        const fabId: number = this._selectedData.data.fabId;
        const areaId: number = this._selectedData.data.areaId;
        let params: any;

        if (this.status === 'create') {
            params = {
                description: this.registerForm.value.description,
                eqpName: this.registerForm.value.eqpName,
                areaId: areaId,
                image: "AAAAAAAABAAAAAUAAAA"
            };

        } else if (this.status === 'modify') {
            params = {
                eqpId: this._selectedData.data.eqpId,
                description: this.registerForm.value.description,
                eqpName: this.registerForm.value.eqpName,
                areaId: areaId,
                image: this.registerForm.value.eqpName
            };
        }

        this._updateEqp(fabId, areaId, params);
    }

    _updateEqp(fabId: number, areaId: number, params: any) {
        this.pdmConfigService.updateEqp(fabId, areaId, params)
            .then((data: any) => {
                this._applier.appliedSuccess();
            }).catch((error: any) => {
                this._applier.appliedFailed();
            });
    }

    fileChangeEvent(fileInput: any) {
        console.log('fileChangeEvent', fileInput);
        if (fileInput.target.files && fileInput.target.files[0]) {
            let reader = new FileReader();
            let imageStr = '';
            let imagePath = fileInput.target.value;
            console.log('imagePath', imagePath);

            reader.onload = (e: any) => {
                imageStr = e.target.result;
                 console.log('imageStr', imageStr);
                $('#preview').attr('src', imageStr);
            }

            reader.readAsDataURL(fileInput.target.files[0]);

            setTimeout(() => {
                this.eqpData.image = imageStr;
            });
        }
    }

    _saveImage(): void {
        this._selectedData.data.image = this.file.nativeElement.value;
        console.log('_saveImage _selectedData: ', this._selectedData); // Grid row object
        this._applier.appliedSuccess();
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