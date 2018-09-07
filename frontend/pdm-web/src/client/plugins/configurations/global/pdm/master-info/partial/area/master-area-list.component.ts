//Angular
import { Component, ViewChild, OnInit, OnChanges, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';

//MIP
import { ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../../common';
import { NotifyService, Translater } from '../../../../../../../sdk';
import { PdmModelService } from './../../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../../../model/pdm-config.service';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcNav from 'wijmo/wijmo.nav';
import * as wjcGrid from 'wijmo/wijmo.grid'
import * as wjcCore from 'wijmo/wijmo';

@Component({
    moduleId: module.id,
    selector: 'area-list',
    templateUrl: './master-area-list.html',
    styleUrls: ['./master-area-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class MasterAreaListComponent implements OnInit, OnChanges {
    @Input() datas: any[];
    @Output() updateItem: EventEmitter<any> = new EventEmitter();
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('areaModify') areaModify: any;
    @ViewChild("areaForm") areaForm;
    areaDatas: any[];
    areaList: any[];

    areaName: string;
    pathStr: string;
    plants: any[];
    selectedFab: any;
    childData: any;
    selectedNodeData: any = {
        fabId: 0,
        areaId: 0,
        areaName: '',
        description: '',
        parentId: 0
    };

    fabId: number;
    areaId: number;
    status: string;
    areaData: any;
    selectedRowData: any;
    btnDisabled: boolean = false;
    modalTitle: string;

    constructor(
        private notify: NotifyService,
        private translater: Translater,
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService,
        private modalAction: ModalAction,
        private requester: ModalRequester
    ) {

    }

    ngOnInit(): void {
        $('#areaModal').on('hidden.bs.modal', () => {
            this.areaForm.form.reset();
        })
    }

    ngOnChanges(changes: any) {
        if (changes.datas.currentValue) {
            let currentValue = changes.datas.currentValue;
            this.areaDatas = currentValue.areas;
            this.fabId = currentValue.fabId;
            this.areaId = currentValue.areaId;
            this.areaList = currentValue.areaList;

            if (this.areaDatas.length === 0) {
                this.btnDisabled = true;
            } else {
                this.btnDisabled = false;
                this._firstSelectedData();
            }
        }
    }

    _firstSelectedData(): void {
        setTimeout(() => {
            if (this.gridInstance.itemsSource && this.gridInstance.itemsSource.length > 0) {
                this.selectedRowData = this.gridInstance.itemsSource[0];
            }
        });
    }

    selectedRow(grid: wjcGrid.FlexGrid, event: CellRangeEventArgs): void {
        this.selectedRowData = grid.selectedItems[0];
    }

    deleteArea(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.areaName,
                confirmMessage: this.translater.get("MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM", { itemName: this.selectedRowData.areaName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteArea();
            }
        });
    }

    _deleteArea() {
        this.pdmConfigService.deleteArea(this.fabId, this.selectedRowData.areaId)
            .then((res: any) => {
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
                this.updateItem.emit({
                    init: true,
                    type: 'area'
                });
            }, (err: any) => {
                this._showModal(false);
            });
    }

    showModal(status: string): void {
        this.status = status;
        let areaData: any = {};

        if (this.status === 'create') {
            areaData = {
                areaName: '',
                description: '',
            };
        } else if (this.status === 'modify') {
            areaData = {
                areaName: this.selectedRowData.areaName,
                description: this.selectedRowData.description
            };
        }

        this.areaData = areaData; // Modify area data
        this._showModal(true);
    }

    saveData() {
        let areaData: any = this.areaData;

        if (this.status === 'create' || (this.status === 'modify' && this.selectedRowData.areaName !== areaData.areaName)) {
            if (!this.checkUniqueData(areaData)) {
                this.notify.warn("PDM.NOTIFY.WARN.DUPLICATE_AREA");
                return;
            }
        }

        this._showModal(false);
        // let areaData: any = this.areaModify.getData();
        let request: any = {
            areaName: areaData.areaName,
            description: areaData.description,
            parentId: this.areaId
        };

        if (this.status === 'modify') {
            request.areaId = this.selectedRowData.areaId;
        }

        this.updateArea(request);
    }

    checkUniqueData(data): boolean {
        return !this.searchTree('areaName', this.areaList[0], data.areaName);;
    }

    searchTree(field, data, value): any { // Search data about nodeId
        if (data[field] === value) {
            return data;
        }
        if (data.children && data.children.length > 0) {
            for (let i = 0; i < data.children.length; i++) {
                const node = this.searchTree(field, data.children[i], value);
                if (node !== null) {
                    return node;
                }
            }
        }
        return null;
    }

    updateArea(request: any): void {
        console.log('area request', request);
        this.pdmConfigService.updateArea(this.fabId, request)
            .then((res: any) => {
                this._showModal(false);
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else if (this.status === 'modify') {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }

                this.updateItem.emit({
                    init: true,
                    type: 'area',
                    value: request
                });
            }, (err: any) => {
                this._showModal(false);
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    nameKeypress(event: KeyboardEvent) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    private _showModal(isShow): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(this.status);
            $('#areaModal').modal({
                backdrop: false,
                show: true
            });
        } else {
            $('#areaModal').modal('hide');
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }
}
