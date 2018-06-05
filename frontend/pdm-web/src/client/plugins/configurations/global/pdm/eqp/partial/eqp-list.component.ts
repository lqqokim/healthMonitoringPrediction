//Angular
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

//MIP
import { ModalAction, ModalRequester, RequestType } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';
import { EqpModalModule } from './modal/eqp-modal.module';
import { PdmModelService } from './../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../../model/pdm-config.service';
import { AREA_TREE } from '../../model/pdm-mock-data';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcNav from 'wijmo/wijmo.nav';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';

@Component({
    moduleId: module.id,
    selector: 'eqp-list',
    templateUrl: 'eqp-list.html',
    styleUrls: ['eqp-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class EqpListComponent implements OnInit {
    @ViewChild("WijmoGridInstance") gridInstance: wjcGrid.FlexGrid;

    eqpDatas: wjcCore.CollectionView;
    // checkedItems: any[] = [];
    treeDatas: any[] = [];
    selectedRowData: any;
    areaName: string;
    areaId: number;
    pathStr: string;
    plants: any[];
    selectedFab: any;
    status: string;

    selectAll: boolean = false;
    isRowView: boolean = true;
    isDisable: boolean = true;
    btnDisabled: boolean;
    isActive: boolean;

    constructor(
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService) {
    }

    ngOnInit(): void {
        this._getFabDatas();
    }

    _getFabDatas(): void {
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.plants = plants;
                this.selectedFab = plants[0];
                this._getAreas();
            }).catch((error: any) => {

            });
    }

    _getAreas() {
        this.pdmConfigService.getAreas(this.selectedFab.fabId)
            .then((areas: any) => {
                this.treeDatas = areas;
            }).catch((error: any) => {

            });
    }

    changeSelectedFab(ev: any): void {
        this.selectedFab = ev;
        this.initConditions();
        this._getAreas();
    }

    selectedNode(treeview: wjcNav.TreeView): void {
        console.log('selectedNode', treeview.selectedNode);
        let selectedItem = treeview.selectedItem;
        this.areaId = selectedItem.areaId;
        this.areaName = selectedItem.areaName;
        let path = treeview.selectedPath;
        this.pathStr = path.join(' > ');
        this.isActive = treeview.selectedPath.length === 4 ? true : true; // EQP active on 4 depth
        this._getEqpDatas();
    }

    _getEqpDatas(): void {
        this.pdmConfigService.getEqps(this.selectedFab.fabId, this.areaId)
            .then((eqps: any) => {
                console.log('eqps', eqps);
                let eqpDatas = [];
                if (eqps && eqps.length > 0) {
                    this.btnDisabled = false;
                    eqps.forEach((val: any, index: number, arr: Array<any>) => { // Set eqpDatas
                        eqpDatas.push({
                            fabId: this.selectedFab.fabId,
                            areaName: this.areaName,
                            areaId: val.areaId,
                            eqpId: val.eqpId,
                            eqpName: val.eqpName,
                            description: val.description,
                            image: val.image
                        });
                    });

                    this.eqpDatas = new wjcCore.CollectionView(eqpDatas);
                    this.selectedRowData = this.eqpDatas.items[0]; // Select first row data
                    console.log('selectedRowData', this.selectedRowData);
                    // $('#img').attr('src',`data:image/png;base64, ${this.selectedRowData.image}`);
                    // document.getElementById('img').setAttribute('src', `data:image/png;base64, ${this.selectedRowData.image}`);
                } else {
                    this.btnDisabled = true;
                    this.eqpDatas = eqpDatas;
                    this.selectedRowData = {
                        fabId: this.selectedFab.fabId,
                        areaId: this.areaId,
                        areaName: this.areaName
                    };
                }
            }).catch((error: any) => {

            });
    }

    createEqp(status: string): void {
        this.status = status;
        this._controlEqp();
    }

    modifyEqp(status: string): void {
        this.status = status;
        this._controlEqp();
    }

    _controlEqp(): void {
        this.modalAction.showConfiguration({
            module: EqpModalModule,
            info: {
                title: this._firstCharUpper(this.status) + ' EQP',
                status: this.status,
                selectedRowData: this.selectedRowData,
                eqpDatas: this.eqpDatas
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getEqpDatas();

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

    deleteEqp(status: string): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.name,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.DELETE_SELECTED_USER', { user: this.selectedRowData.eqpName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteEqp();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            }
        });
    }

    _deleteEqp(): void {
        this.pdmConfigService.deleteEqp(this.selectedFab.fabId, this.areaId, this.selectedRowData.eqpId)
            .then((res: any) => {
                this._getEqpDatas();
            }).catch((error: any) => {
                console.log('Error HTTP DELETE Service');
            });
    }

    selectedRow(grid: wjcGrid.FlexGrid, event: CellRangeEventArgs): void {
        this.selectedRowData = grid.selectedItems[0];
    }

    private initConditions(): void {
        this.eqpDatas = undefined;
    }

    // gridSelectAllRows(isCheck: boolean): void {
    //     this.selectAll = isCheck;
    //     if (!this.selectAll) this.checkedItems = [];
    //     let selectYn = this.selectAll;

    //     this.eqpDatas.items.forEach((d: any, index: number, arr: Array<any>) => {
    //         if (d.isSelected !== selectYn) {
    //             if (selectYn && this.checkedItems.map((d) => { return d; }).indexOf(d.id) === -1) {
    //                 this.checkedItems.push(d.id);
    //             }

    //             this.gridInstance.setCellData(index, 'isSelected', this.selectAll);
    //         }
    //     });
    // }

    // gridSelectRow(item: any): void {
    //     console.log('gridSelectRow', item);

    //     if (item.isSelected) {
    //         this.checkedItems.push(item.id);
    //     } else {
    //         let index = this.checkedItems.map((d) => d).indexOf(item.id);
    //         if (index > -1) {
    //             this.checkedItems.splice(index, 1);
    //         }
    //     }

    //     this.selectAll = this._setSelectAll();
    //     this.eqpDatas.selectedCount = this.checkedItems.length;
    // }

    // _setSelectAll(): boolean {
    //     return this.eqpDatas.items.every((d: any, ind: number, arr: Array<any>) => {
    //         d.isSelected ? true : false;
    //     });
    // }
}

