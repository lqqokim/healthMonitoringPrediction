import { Observable } from 'rxjs/Rx';
//Angaulr
import { Component, OnInit, OnChanges, Input, Output, ViewEncapsulation, ViewChild, EventEmitter, ElementRef } from '@angular/core';

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
    selector: 'part-list',
    templateUrl: './master-part-list.html',
    styleUrls: ['./master-part-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class MasterPartListComponent implements OnInit, OnChanges {
    @Input() datas: any[];
    @Input() eqpData: any;
    @Output() updateItem: EventEmitter<any> = new EventEmitter();
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('partModify') partModify: any;
    @ViewChild("partsForm") partsForm;

    partDatas: wjcCore.CollectionView;
    selectedName: string;
    selectedRowData: any;
    paramDatas: any;

    btnDisabled: boolean = false;
    status: string;
    partData: any;
    bearingDatas: any[];
    partTypes: any[];
    modalTitle: string;
    dataInfo: any = {
        eqpId: undefined,
        eqpName: undefined,
        fabId: undefined
    };
    defaults: any[] = [
        { value: 'Y', label: 'Y' },
        { value: 'N', label: 'N' }
    ];

    bearingInput: string;
    isGridView: boolean = false;

    constructor(
        private notify: NotifyService,
        private translater: Translater,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService
    ) { }

    ngOnInit(): void {
        $('#partModal').on('hidden.bs.modal', () => {
            this.partsForm.form.reset();
        })
    }

    ngOnChanges(changes: any) {
        if (changes.datas.currentValue) {
            let currentValue = changes.datas.currentValue;
            const partDatas = currentValue.parts;
            partDatas.map((part: any) => {
                if (!part.manufacture && !part.modelNumber) {
                    part.bearing = null;
                } else {
                    part.bearing = `${part.modelNumber}(${part.manufacture})`;
                }
            });

            this.partDatas = partDatas;
            this.dataInfo.eqpId = currentValue.eqpId;
            this.dataInfo.eqpName = currentValue.eqpName;
            this.dataInfo.fabId = currentValue.fabId;

            if (this.partDatas.length === 0) {
                this.btnDisabled = true;
            } else {
                this.btnDisabled = false;
                this._firstSelectedData();
            }

            this._getParams();
            this._getBearings();
            this._getPartTypes();
        }
    }

    _firstSelectedData() {
        setTimeout(() => {
            if (this.gridInstance.itemsSource && this.gridInstance.itemsSource.length > 0) {
                this.selectedRowData = this.gridInstance.itemsSource[0];
            }
        });
    }

    _getParams(): void {
        this.pdmConfigService.getParams(this.dataInfo.fabId, this.dataInfo.eqpId)
            .then((params: any) => {
                this.paramDatas = params;
            }).catch((error: any) => {

            });
    }

    _getBearings(): void {
        this.pdmConfigService.getBearings(this.dataInfo.fabId)
            .then((bearings: any) => {
                this.bearingDatas = bearings;
            }).catch((error: any) => {

            });
    }

    _getPartTypes() {
        this.pdmConfigService.getPartTypes(this.dataInfo.fabId, this.dataInfo.eqpId)
            .then((partTypes: any) => {
                this.partTypes = partTypes;
            }).catch((err: any) => {

            });
    }

    selectedRow(grid: wjcGrid.FlexGrid, event: CellRangeEventArgs): void {
        this.selectedRowData = grid.selectedItems[0];
    }

    deletePart(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.name,
                confirmMessage: this.translater.get("MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM", { itemName: this.selectedRowData.name })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deletePart();
            }
        });
    }

    showModal(status: string): void {
        this.status = status;
        let partData: any = {};

        if (status === 'create') {
            partData = {
                name: '',
                ratio: '',
                npar1: '',
                npar2: null,
                manufacture: null,
                eqpId: this.dataInfo.eqpId,
                partTypeId: '',
                speedParamId: '',
                sortOrder: '',
                modelNumber: null,
                eqpName: this.dataInfo.eqpName,
                paramId: null,
                paramName: null,
                rpm: null,
                base_ratio_yn: 'N'
            };
        } else if (status === 'modify') {
            partData = Object.assign({}, this.selectedRowData);

            if (!partData.modelNumber && !partData.manufacture) {
                this.bearingInput = '';
            } else {
                this.bearingInput = `${partData.modelNumber} / ${partData.manufacture}`;
            }
        }

        // this.partData = {
        //     part: partData,
        //     partTypes: this.partTypes,
        //     paramDatas: this.paramDatas,
        //     bearingDatas: this.bearingDatas
        // }
        this.partData = partData;
        this._showModal(true);
    }

    _deletePart(): void {
        this.pdmConfigService.getParams(this.dataInfo.fabId, this.dataInfo.eqpId)
            .then((params) => {
                let isExist: boolean = false;
                for (let i = 0; i < params.length; i++) {
                    if (params[i].parts_id === this.selectedRowData.partId) {
                        isExist = true;
                        break;
                    }
                }

                if (isExist) {
                    this.notify.warn("PDM.NOTIFY.REFER_PART");
                    return;
                } else {
                    this.pdmConfigService.deletePart(this.dataInfo.fabId, this.dataInfo.eqpId, this.selectedRowData.partId)
                        .then((res: any) => {
                            this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
                            this.updateItem.emit({
                                init: true
                            });
                        }, (err: any) => {
                            this._showModal(false);
                        });
                }
            });
    }

    clearSearch(val: string): void {
        let removeSpace: any = val.replace(/(\s*)/g, "");
        let splitVal: string[] = removeSpace.split('/');
        this.partData.modelNumber = splitVal[0];
        this.partData.manufacture = splitVal[1];
    }

    clickSearch(isView: boolean): void {
        if (isView) {
            this.isGridView = false;
        } else {
            this.isGridView = true;
        }
    }

    closeModal(isView: boolean): void {
        if (isView) {
            this.isGridView = false;
        }
    }

    saveData(isView: boolean, bearing: string): void {
        let partData: any = Object.assign({}, this.partData);

        if (this.status === 'create' || (this.status === 'modify' && this.selectedRowData.name !== partData.name)) {
            if (!this.checkUniqueData(partData)) {
                this.notify.warn("PDM.NOTIFY.DUPLICATE_PART");
                return;
            }
        }

        if (isView) {
            this.isGridView = false;
        }

        if (bearing) {
            let removeSpace: any = bearing.replace(/(\s*)/g, "");
            let splitVal: string[] = removeSpace.split('/');
            this.partData.modelNumber = splitVal[0];
            this.partData.manufacture = splitVal[1];
        } else {
            this.partData.modelNumber = null;
            this.partData.manufacture = null;
        }

        this._showModal(false);

        // let partData: any = this.partModify.getData();
        let request: any = {
            name: partData.name,
            ratio: partData.ratio,
            // npar1: partData.npar1,
            // npar2: partData.npar2,
            manufacture: partData.manufacture,
            eqpId: partData.eqpId,
            // sortOrder: partData.sortOrder,
            modelNumber: partData.modelNumber,
            eqpName: partData.eqpName,
            paramId: partData.paramId,
            paramName: partData.paramName,
            // partTypeId: partData.partTypeId,
            // speedParamId: 0
            // speedParamId: partData.speedParamId // TODO: No data
            base_ratio_yn: partData.base_ratio_yn,
            parts_type_cd: partData.parts_type_cd,
            bearing_id: partData.bearing_id,
            rpm: partData.rpm
        };

        if (this.status === 'modify') {
            request.partId = partData.partId;
        }

        this.updatePart(request);
    }

    checkUniqueData(data: any): boolean {
        let partDatas: any = this.partDatas;
        let length: number = partDatas.length;
        let result: boolean = true;

        for (let i = 0; i < length; i++) {
            if (partDatas[i].name === data.name) {
                result = false;
                break;
            }
        }
        return result;
    }

    updatePart(request: any): void {
        this.pdmConfigService.updatePart(this.dataInfo.fabId, this.dataInfo.eqpId, request)
            .then((res: any) => {
                // view init
                this._showModal(false);
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else if (this.status === 'modify') {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }

                this.updateItem.emit({
                    init: true
                });
            }, (err: any) => {
                this._showModal(false);
            });
    }

    nameKeypress(event: KeyboardEvent) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    private _showModal(isShow: boolean): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(this.status);
            $('#partModal').modal({
                backdrop: false,
                show: true
            });
        } else {
            $('#partModal').modal('hide');
        }
    }

    ratioKeypress(event: KeyboardEvent) {
        if (event.keyCode === 45 || event.keyCode === 43) {
            event.preventDefault();
        }
    }

    rpmKeypress(event: KeyboardEvent) {
        if (event.keyCode === 45 || event.keyCode === 43) {
            event.preventDefault();
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    selectedBearingRow(grid: wjcGrid.FlexGrid, event: CellRangeEventArgs): void {
        let selectedBearing: any = grid.selectedItems[0];
        this.partData.modelNumber = selectedBearing.modelNumber;
        this.partData.manufacture = selectedBearing.manufacture;
        this.partData.bearing_id = selectedBearing.bearing_id;
        this.bearingInput = `${selectedBearing.modelNumber} / ${selectedBearing.manufacture}`;
        // this.renderer.setAttribute(this.bearing.nativeElement, 'value', bearingStr);
    }
}
