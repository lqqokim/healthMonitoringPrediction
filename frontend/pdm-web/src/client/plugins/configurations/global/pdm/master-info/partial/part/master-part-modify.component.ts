//Angular
import { Component, Input, OnInit, OnChanges, ViewChild, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';

//MIP
import { ModalApplier } from '../../../../../../../common';
import { PdmConfigService } from './../../../model/pdm-config.service';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcGrid from 'wijmo/wijmo.grid'

@Component({
    moduleId: module.id,
    selector: 'part-modify',
    templateUrl: 'master-part-modify.html',
    styleUrls: ['./master-part-modify.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class MasterPartModifyComponent implements OnInit, OnChanges {
    @Input() data: any;
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('bearing') bearing: ElementRef;

    partData: any;
    bearingDatas: any[];
    paramDatas: any[];
    partTypeDatas: any[];
    isGridView: boolean = false;
    bearingInput;


    defaults: any[] = [
        { value: 'Y', label: 'Y' },
        { value: 'N', label: 'N' }
    ];

    constructor(
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: any): void {
        if (changes.data.currentValue) {
            let currentValue = changes.data.currentValue;
            this.partData = currentValue.part;
            this.partTypeDatas = currentValue.partTypes;
            this.paramDatas = currentValue.paramDatas;
            this.bearingDatas = currentValue.bearingDatas;
            this.bearingInput = this.partData.bearing;

            if (this.isGridView === true) {
                this.isGridView = false;
            }
        }
    }

    getData(): any {
        this.setPartData();
        return this.partData;
    }

    setPartData(): void {
        this.partData.bearing = this.bearingInput;
        this.paramDatas.map((param: any) => {
            if (param.paramId === this.partData.paramId) {
                this.partData.paramName = param.paramName;
            }
        });
    }

    selectedRow(grid: wjcGrid.FlexGrid, event: CellRangeEventArgs): void {
        let selectedBearing: any = grid.selectedItems[0];
        this.partData.modelNumber = selectedBearing.modelNumber;
        this.partData.manufacture = selectedBearing.manufacture;
        this.partData.bearing_id = selectedBearing.bearing_id;
        this.bearingInput = `${selectedBearing.modelNumber}(${selectedBearing.manufacture})`;
        // this.renderer.setAttribute(this.bearing.nativeElement, 'value', bearingStr);
    }

    searchBearing(): void {
        // this.isGridView = false ? true : false;
    }

    clearSearch(): void {
        this.bearing.nativeElement.value = '';
        this.renderer.setAttribute(this.bearing.nativeElement, 'value', null);
    }
}
