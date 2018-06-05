//Angular
import { Component, OnInit, Output, ViewEncapsulation, ViewChild, EventEmitter, ElementRef } from '@angular/core';

//MIP 
import { ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';
import { ParameterModalModule } from './modal/parameter-modal.module';
import { PdmConfigService } from './../../model/pdm-config.service';
import { PdmModelService } from './../../../../../../common/model/app/pdm/pdm-model.service';
import { AREA_TREE } from '../../model/pdm-mock-data';
import { MultiSelectorConfigType } from '../../../../../../sdk';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
// import { WjComboBox } from 'wijmo/wijmo.angular2.input';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGrid from 'wijmo/wijmo.grid'
import * as wjcCore from 'wijmo/wijmo';
import * as wjcNav from 'wijmo/wijmo';

import { PARAMETER_LIST } from './../../model/pdm-mock-data';

@Component({
    moduleId: module.id,
    selector: 'parameter-list',
    templateUrl: 'parameter-list.html',
    styleUrls: ['parameter-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class ParameterListComponent extends WijmoApi implements OnInit {
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;

    paramDatas: wjcCore.CollectionView;
    selectedRowData: any;
    checkedItems: Array<any>;
    status: string;
    selectAll: boolean = false;
    selectedItem: any;
    treeDatas: any;
    fabId: number;
    selectedPath: Array<string>;
    pathStr: string;
    eqpId: number;
    btnDisabled: boolean;
    isShowMsg: boolean = true;

    selectedFab: any;
    selectedEqp: any;
    plants: any[];
    eqps: any[];
    areaId: number;

    constructor(
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private pdmConfigService: PdmConfigService,
        private pdmModelService: PdmModelService
    ) {
        super();
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

    _getAreas(): void {
        this.pdmConfigService.getAreas(this.selectedFab.fabId)
            .then((areas: any) => { // Tree info
                this.treeDatas = areas;
            }).catch((error: any) => {

            });
    }

    selectedNode(treeview: wjcNav.TreeView): void {
        console.log('selectedItems: ', treeview.selectedItem);
        this.selectedItem = treeview.selectedItem;
        this.selectedPath = treeview.selectedPath;
        this.areaId = this.selectedItem.areaId;
        this.isShowMsg = false;
        this._getEqpDatas();
    }

    _getEqpDatas(): void {
        this.pdmConfigService.getEqps(this.selectedFab.fabId, this.areaId)
            .then((eqps: any) => {
                console.log('eqps', eqps);
                if (eqps && eqps.length > 0) {
                    this.eqps = eqps;
                    this.selectedEqp = eqps[0];
                    this._setSelectionPath();
                    this._getParams();
                } else {
                    this.eqps = null;
                    this.paramDatas = null;
                    this.pathStr = this.selectedPath.join(' > ');
                }
            }).catch((error: any) => {

            });
    }

    _setSelectionPath() {
        let pathArr = this.selectedPath.concat(this.selectedEqp.eqpName);
        this.pathStr = pathArr.join(' > ');
    }

    _getParams(): void {
        this.pdmConfigService.getParams(this.selectedFab.fabId, this.selectedEqp.eqpId)
            .then((params: any) => {
                console.log('params', params);
                this.paramDatas = new wjcCore.CollectionView(params);
                if (params && params.length > 0) {
                    this.selectedRowData = params[0];
                    this.btnDisabled = false;
                } else {
                    this.btnDisabled = true;
                    this.selectedRowData = {
                        eqpId: this.selectedEqp.eqpId,
                        eqpName: this.selectedEqp.eqpName
                    };
                }
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
        this._getParams();
    }

    selectedRow(grid: wjcGrid.FlexGrid, e: CellRangeEventArgs): void {
        console.log('selectedRow', grid);
        this.selectedRowData = grid.selectedItems[0];
    }

    /**
     * Create, Modify, Delete functions
     */
    createParameter(status: string): void {
        this.status = status;
        this._controlParameter();
    }

    modifyParameter(status: string): void {
        this.status = status;
        this._controlParameter();
    }

    _controlParameter(): void {
        this.modalAction.showConfiguration({
            module: ParameterModalModule,
            info: {
                title: this._firstCharUpper(this.status) + ' Parameter',
                status: this.status,
                selectedRowData: this.selectedRowData,
                paramDatas: this.paramDatas,
                fabId: this.selectedFab.fabId
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getParams();
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

    deleteParameter(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.paramName,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.DELETE_SELECTED_USER', { user: this.selectedRowData.paramName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteParameter();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            }
        });
    }

    _deleteParameter(): void {
        let paramId = this.selectedRowData.paramId;
        this.pdmConfigService.deleteParam(this.selectedFab.fabId, this.selectedEqp.eqpId, paramId)
            .then((res: any) => {
                this._getParams();
            }).catch((error: any) => {
                console.log('Error HTTP DELETE Service');
            });
    }

    private initConditions(): void {
        this.eqps = undefined;
        this.paramDatas = undefined;
    }
}





