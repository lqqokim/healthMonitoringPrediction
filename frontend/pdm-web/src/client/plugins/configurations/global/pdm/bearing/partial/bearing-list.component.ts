//Angular
import { Component, OnInit, Output, ViewEncapsulation, ViewChild, EventEmitter, ElementRef } from '@angular/core';

//MIP
import { ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';
import { BearingModalModule } from './modal/bearing-modal.module';
import { PdmConfigService } from './../../model/pdm-config.service';
import { PdmModelService } from './../../../../../../common/model/app/pdm/pdm-model.service';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid'

@Component({
    moduleId: module.id,
    selector: 'bearing-list',
    templateUrl: 'bearing-list.html',
    styleUrls: ['bearing-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class BearingListComponent implements OnInit {
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;

    bearingDatas: wjcCore.CollectionView;
    selectedRowData: any = {};
    status: string;
    selectedFab: any;
    plants: any[];
    fabId: number;
    fabName: string;

    constructor(
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService
    ) {

    }

    ngOnInit(): void {
        this._getFabDatas();
    }

    _getFabDatas(): void {
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.plants = plants;
                this.selectedFab = plants[0];
                this._getBearings();
            }).catch((error: any) => {

            });
    }

    _getBearings(): void {
        this.pdmConfigService.getBearings(this.selectedFab.fabId)
            .then((bearings: any) => {
                if (bearings && bearings.length > 0) {
                    this.bearingDatas = new wjcCore.CollectionView(bearings);
                    this.selectedRowData = this.bearingDatas.items[0]; // Select first row data
                } else {
                    this.bearingDatas = [];
                    this.selectedRowData = {};
                }
            }).catch((error: any) => {

            });
    }

    changeSelectedFab(ev: any): void {
        this.selectedFab = ev;
        this._getBearings();
    }

    selectedRow(grid: wjcGrid.FlexGrid, e: CellRangeEventArgs): void {
        this.selectedRowData = grid.selectedItems[0];
    }

    createBearing(status: string): void {
        this.status = status;
        this._controlBearing();
    }

    modifyBearing(status: string): void {
        this.status = status;
        this._controlBearing();
    }

    _controlBearing(): void {
        this.modalAction.showConfiguration({
            module: BearingModalModule,
            info: {
                title: this._firstCharUpper(this.status) + ' Bearing',
                status: this.status,
                selectedRowData: this.selectedRowData,
                bearingDatas: this.bearingDatas,
                fabId: this.selectedFab.fabId,
                fabName: this.selectedFab.fabName
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getBearings();
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }
            }
        });
    }

    _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    deleteBearing(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.menufacture,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.DELETE_SELECTED_USER', { user: this.selectedRowData.modelNumber })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteBearing();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            }
        });
    }

    _deleteBearing(): void {
        let fabId = this.selectedFab.fabId;
        let modelNumber = this.selectedRowData.modelNumber;
        let menufacture = this.selectedRowData.manufacture;
        this.pdmConfigService.deleteBearing(fabId, modelNumber, menufacture)
            .then((res: any) => {
                this._getBearings();
            }).catch((error: any) => {
                console.log('Error HTTP DELETE Service');
            });
    }
}