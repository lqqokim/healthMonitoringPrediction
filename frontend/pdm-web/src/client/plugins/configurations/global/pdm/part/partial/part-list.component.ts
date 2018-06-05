//Angaulr
import { Component, OnInit, Output, ViewEncapsulation, ViewChild, EventEmitter, ElementRef } from '@angular/core';

//MIP
import { ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';
import { PartModalModule } from './modal/part-modal.module';
import { PdmModelService } from './../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../../model/pdm-config.service';
import { AREA_TREE } from '../../model/pdm-mock-data';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcNav from 'wijmo/wijmo.nav';
import * as wjcGrid from 'wijmo/wijmo.grid'
import * as wjcCore from 'wijmo/wijmo';

@Component({
    moduleId: module.id,
    selector: 'part-list',
    templateUrl: 'part-list.html',
    styleUrls: ['part-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class PartListComponent {
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;

    fabDatas: any;
    treeDatas: any[]
    partDatas: wjcCore.CollectionView;
    selectedName: string;
    selectedRowData: any;
    selectedPath: Array<string>;
    selectedItem: any;
    areaId: number;
    eqpName: string;
    paramDatas: any;

    selectedFab: any;
    selectedEqp: any;
    plants: any[];
    eqps: any[];
    isActive: boolean;
    pathStr: string;
    status: string;

    constructor(
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService
    ) { }

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

    _getAreas(): void {
        this.pdmConfigService.getAreas(this.selectedFab.fabId)
            .then((areas: any) => {
                console.log('areas', areas);
                this.treeDatas = areas;
            }).catch((error: any) => {

            });
    }

    selectedNode(treeview: wjcNav.TreeView): void {
        this.selectedItem = treeview.selectedItem;
        this.selectedPath = treeview.selectedPath;
        this.areaId = this.selectedItem.areaId;
        this._getEqpDatas();
    }

    _getEqpDatas(): void {
        this.pdmConfigService.getEqps(this.selectedFab.fabId, this.areaId)
            .then((eqps: any[]) => {
                if (eqps && eqps.length > 0) {
                    this.eqps = eqps;
                    this.selectedEqp = eqps[0];
                    this.isActive = true;
                    this._setSelectionPath();
                    this._getParts();
                    this._getParams();
                } else {
                    this.isActive = false;
                    this.pathStr = this.selectedPath.join(' > ');
                }
            }).catch((error: any) => {

            });
    }

    _setSelectionPath() {
        let pathArr = this.selectedPath.concat(this.selectedEqp.eqpName);
        this.pathStr = pathArr.join(' > ');
    }

    _getParts(): void {
        this.pdmConfigService.getParts(this.selectedFab.fabId, this.selectedEqp.eqpId)
            .then((parts: any[]) => {
                console.log('parts', parts);
                let partDatas = parts;
                if (parts && parts.length > 0) {
                    // for (let i = 0; i < parts.length; i++) {
                    //     let part = parts[i];
                    //     partDatas[i].push({
                    //         bearing: `${part.modelNumber}(${part.manufacture})`,
                    //     });
                    // }

                    this.partDatas = new wjcCore.CollectionView(partDatas);
                    this.selectedRowData = this.partDatas.items[0];
                    // let paramDatas = parts;

                    // for (let i = 0; i < 1000; i++) {
                    //     paramDatas.push(parts[0]);
                    // }

                    // this.partDatas = paramDatas;
                    console.log('partDatas', this.partDatas);
                }
            }).catch((error: any) => {

            });
    }

    _getParams(): void {
        this.pdmConfigService.getParams(this.selectedFab.fabId, this.selectedEqp.eqpId)
            .then((params: any) => {
                this.paramDatas = params;
            }).catch((error: any) => {

            });
    }

    changeSelectedFab(item: any): void {
        this.selectedFab = item;
        this.initConditions();
        this._getAreas();
    }


    changeSelectedEqp(item: any): void {
        this.selectedEqp = item;
        this._setSelectionPath();
        this._getParts();
    }

    selectedRow(grid: wjcGrid.FlexGrid, event: CellRangeEventArgs): void {
        console.log('selectedRow', grid);
        this.selectedRowData = grid.selectedItems[0];
    }

    createPart(status: string): void {
        this.status = status;
        this._controlPart();
    }

    modifyPart(status: string): void {
        this.status = status;
        this._controlPart();
    }

    _controlPart(): void {
        this.modalAction.showConfiguration({
            module: PartModalModule,
            info: {
                title: this._firstCharUpper(this.status) + ' Part',
                status: this.status,
                selectedRowData: this.selectedRowData,
                partDatas: this.partDatas,
                paramDatas: this.paramDatas,
                fabId: this.selectedFab.fabId,
                eqpId: this.selectedEqp.eqpId
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getAreas();
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

    deletePart(status: string): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.name,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.DELETE_SELECTED_USER', { user: this.selectedRowData.paramName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deletePart();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            }
        });
    }

    _deletePart(): void {
        let partId = this.selectedRowData.partId;
        this.pdmConfigService.deletePart(this.selectedFab.fabId, this.selectedEqp.eqpId, partId)
            .then((res: any) => {
                this._getParts();
            }).catch((error: any) => {
                console.log('Error HTTP DELETE Service');
            });
    }

    private initConditions(): void {
        this.eqps = undefined;
        this.partDatas = undefined;
    }
}
