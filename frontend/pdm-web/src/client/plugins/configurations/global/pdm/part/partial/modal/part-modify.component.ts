//Angular
import { Component, Input, Output, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation, SimpleChanges, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

//MIP
import { ModalApplier } from '../../../../../../../common';
import { Translater, NotifyService } from '../../../../../../../sdk';
import { PdmConfigService } from './../../../model/pdm-config.service';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcNav from 'wijmo/wijmo.nav';
import * as wjcGrid from 'wijmo/wijmo.grid'
import * as wjcCore from 'wijmo/wijmo';

@Component({
    moduleId: module.id,
    selector: 'part-modify',
    templateUrl: 'part-modify.html',
    styleUrls: ['./part-modify.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class PartModifyComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() selectChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('bearing') bearing: ElementRef

    // registerForm: any;
    status: string;
    partData: any;
    bearingDatas: any;
    selectedBearing: any;
    isGridView: boolean = false;
    selectedParamName: any = {};

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    states;
    paramDatas: any;
    registerForm: FormGroup;

    constructor(
        private translater: Translater,
        private formBuilder: FormBuilder,
        private notify: NotifyService,
        private pdmConfigSetvice: PdmConfigService,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: any): void {
        if (changes && changes.data) {
            console.log('changes', changes);
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;
            this.paramDatas = this._selectedData.paramDatas;

            if (this.status === 'create') {
                this.partData = {
                    name: '',
                    ratio: '',
                    npar1: '',
                    npar2: null,
                    manufacture: null,
                    eqpId: this._selectedData.data.eqpId,
                    partTypeId: '',
                    speedParamId: '',
                    sortOrder: '',
                    modelNumber: null,
                    eqpName: this._selectedData.data.eqpName,
                    paramId: null,
                    paramName: null,
                };
            } else if (this.status === 'modify') {
                this.partData = JSON.parse(JSON.stringify(this._selectedData.data));
                this.partData.paramName = 'Moter Load Velocity';
                this.selectChange.emit({
                    value: true
                });
            }

            console.log('partData', this.partData);
            this._buildForm();
            this._waitApply();
        }
    }

    _buildForm(): void {
        let index;
        for (let i = 0; i < this.paramDatas.length; i++) {
            if(this.paramDatas[i].paramName === this.partData.paramName) {
                index = i;
            }
        }

        this.registerForm = this.formBuilder.group({
            eqpName: new FormControl({ value: this.partData.eqpName, disabled: true }),
            param: new FormControl(this.paramDatas[index]),
            bearing: new FormControl(this.partData.bearing),
            name: new FormControl(this.partData.name, [Validators.required]),
            ratio: new FormControl(this.partData.ratio, [Validators.required]),
            npar1: new FormControl(this.partData.npar1, [Validators.required]),
            npar2: new FormControl(this.partData.npar2),
            sortOrder: new FormControl(this.partData.sortOrder, [Validators.required])
        });
    
        this.registerForm.patchValue({ param: this.paramDatas[index].paramName });
        this.isformValidStatus();
    }

    _getBearings(): void {
        this.pdmConfigSetvice.getBearings(this._selectedData.fabId)
            .then((bearings: any) => {
                this.bearingDatas = bearings;
            }).catch((error: any) => {

            });
    }

    _waitApply(): void {
        console.log('_waitApply', this._applier);
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                   this._saveBearingData();
                }
            });
    }

    _saveBearingData(): void {
        console.log('this.registerForm', this.registerForm);
        // let params = [];
        // if (this.status === 'create') {
        //     params = _.extend(this.registerForm.value);

        // } else if (this.status === 'modify') {
        //     params = _.extend(this.registerForm.value, { eqpId: eqpId }, { paramId: this.paramData.paramId })
        // }

        // this._saveBearingData(partData)


        // this.pdmConfigSetvice.updatePart(this._selectedData.fabId, this._selectedData.data.eqpId, partData)
        //     .then((res: any) => {
        //         this._applier.appliedSuccess();
        //     }).catch((error: any) => {
        //         this._applier.appliedFailed();
        //     });
    }

    selectedRow(grid: wjcGrid.FlexGrid, event: CellRangeEventArgs): void {
        this.selectedBearing = grid.selectedItems[0];
        const bearingStr = `${this.selectedBearing.modelNumber}(${this.selectedBearing.manufacture})`;
        this.registerForm.patchValue({ bearing: bearingStr });
        // this.bearing.nativeElement.value = `${this.selectedBearing.modelNumber}(${this.selectedBearing.manufacture})`;
    }

    compareWithParam(a, b) {
        return a === b;
    }

    searchBearing(): void {
        if (!this.bearingDatas) {
            this._getBearings();
        }
    }

    clearSearch(): void {
        this.registerForm.patchValue({ bearing: null });
        // this.bearing.nativeElement.value = '';
        // this.renderer.setAttribute(this.bearing.nativeElement, 'value', null);
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