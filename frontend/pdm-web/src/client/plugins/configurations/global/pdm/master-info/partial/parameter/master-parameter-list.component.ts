//Angular
import { Component, OnInit, OnChanges, Input, Output, ViewEncapsulation, ViewChild, EventEmitter, ElementRef } from '@angular/core';

//MIP 
import { ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../../common';
import { NotifyService, Translater } from '../../../../../../../sdk';
import { PdmConfigService } from './../../../model/pdm-config.service';
import { PdmModelService } from './../../../../../../../common/model/app/pdm/pdm-model.service';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGrid from 'wijmo/wijmo.grid'
import * as wjcCore from 'wijmo/wijmo';
import * as wjcNav from 'wijmo/wijmo';

@Component({
    moduleId: module.id,
    selector: 'parameter-list',
    templateUrl: './master-parameter-list.html',
    styleUrls: ['./master-parameter-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class MasterParameterListComponent extends WijmoApi implements OnInit, OnChanges {
    @Input() datas: any[];
    @Input() partsDatas: any;
    @Output() updateItem: EventEmitter<any> = new EventEmitter();
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('paramModify') paramModify: any;
    @ViewChild('paramForm') paramForm: any;

    paramDatas: wjcCore.CollectionView;
    paramData: any;
    selectedRowData: any;
    btnDisabled: boolean = false;
    status: string;
    eqpId: number;
    fabId: number;
    eqpName: string;
    modalTitle: string;
    partsData: any;
    paramTypes: any;
    unitTypes: any;

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
        this._getCodes();
        $('#paramModal').on('hidden.bs.modal', () => {
            this.paramForm.form.reset();
        })

    }

    ngOnChanges(changes: any) {
        if (changes.datas != undefined && changes.datas.currentValue) {
            let currentValue = changes.datas.currentValue;
            this.paramDatas = currentValue.params;
            this.fabId = currentValue.fabId;
            this.eqpId = currentValue.eqpId;
            this.eqpName = currentValue.eqpName

            if (this.paramDatas.length === 0) {
                this.btnDisabled = true;
            } else {
                this.btnDisabled = false;
                this._firstSelectedData();
            }
        }

        // this.setFormValidator();
    }

    _firstSelectedData(): void {
        setTimeout(() => {
            if (this.gridInstance.itemsSource && this.gridInstance.itemsSource.length > 0) {
                this.selectedRowData = this.gridInstance.itemsSource[0];
            }
        });
    }

    selectedRow(grid: wjcGrid.FlexGrid, e: CellRangeEventArgs): void {
        this.selectedRowData = grid.selectedItems[0];
    }

    deleteParam(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.areaName,
                confirmMessage: this.translater.get("MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM", { itemName: this.selectedRowData.paramName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteParam();
            }
        });
    }

    _deleteParam() {
        this.pdmConfigService.deleteParam(this.fabId, this.eqpId, this.selectedRowData.paramId)
            .then((res: any) => {
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
                this.updateItem.emit({
                    init: true
                });
            }, (err: any) => {
                this._showModal(false);
            });
    }

    showModal(status: string): void {
        let paramData: any = {};
        this.status = status;
        if (status === 'create') {
            paramData = {
                eqpName: this.eqpName,
                paramName: '',
                paramType: '',
                eu: '',
                euType: '',
                // rpm: null,
                alarm: '',
                warning: '',
                description: '',
                parts_id: ''
            };
        } else if (status === 'modify') {
            paramData = Object.assign({}, this.selectedRowData);
        }

        this.paramData = paramData;
        this.paramData.partsDatas = this.partsDatas.parts;
        this.paramData.paramTypes = this.paramTypes;
        this.paramData.unitTypes = this.unitTypes;

        if (!this.paramData.partsDatas.length) {
            this.notify.info("PDM.NOTIFY.NOT_EXIST_PARTS");
            return;
        }

        this._showModal(true);
    }

    saveData() {
        let paramData: any = this.paramData; //this.paramModify.getData();
        const paramAlarm = paramData.alarm;
        const paramWarning = paramData.warning;
        // console.log('paramData', paramData);

        if(paramAlarm !== undefined && paramAlarm !== null && paramAlarm !== '') {
            if(paramWarning === undefined || paramWarning === null || paramWarning === '') {
                this.notify.info("PDM.NOTIFY.NOT_EXIST_WARNING");
                return;
            }
        }

        if(paramWarning !== undefined && paramWarning !== null && paramWarning !== '') {
            if(paramAlarm === undefined || paramAlarm === null || paramAlarm === '') {
                this.notify.info("PDM.NOTIFY.NOT_EXIST_ALARM");
                return;
            }
        }

        if (this.status === 'create' || (this.status === 'modify' && this.selectedRowData.paramName !== paramData.paramName)) {
            if (!this.checkUniqueData(paramData)) {
                this.notify.warn("PDM.NOTIFY.DUPLICATE_PARAMETER");
                return;
            }
        }

        this._showModal(false);
        let request: any = {
            description: paramData.description,
            // eu: paramData.eu,
            unit_cd: paramData.unit_cd,
            // rpm: paramData.rpm,
            eqpId: this.eqpId,
            // paramType: paramData.paramType,
            paramName: paramData.paramName,
            // euType: paramData.euType,
            eqpName: paramData.eqpName,
            alarm: paramData.alarm,
            warning: paramData.warning,
            param_type_cd: paramData.param_type_cd,
            parts_id: paramData.parts_id
        };

        if (this.status === 'modify') {
            request.paramId = this.selectedRowData.paramId;
        }

        this.updateParam(request);
    }

    checkUniqueData(data: any): boolean {
        let paramDatas: any = this.paramDatas;
        let length: number = paramDatas.length;
        let result: boolean = true;

        for (let i = 0; i < length; i++) {
            if (paramDatas[i].paramName === data.paramName) {
                result = false;
                break;
            }
        }
        return result;
    }

    nameKypress(event: KeyboardEvent) {
        if (event.keyCode === 32) {
            event.preventDefault();
            // setTimeout(() => {
            //     (<HTMLInputElement>event.target).value = "";
            // }, 100);
        }
    }

    alarmKeypress(event: KeyboardEvent) {
        if (event.keyCode === 45 || event.keyCode === 43) {
            event.preventDefault();
        }
    }

    warningKeypress(event: KeyboardEvent) {
        if (event.keyCode === 45 || event.keyCode === 43) {
            event.preventDefault();
        }
    }

    updateParam(request: any): void {
        // console.log('param request', request);
        this.pdmConfigService.updateParam(this.fabId, this.eqpId, request)
            .then((res: any) => {
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
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    _showModal(isShow): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(this.status);
            $('#paramModal').modal({
                backdrop: false,
                show: true
            });

            // setTimeout(() => {
            //     document.querySelector("#alarmInput").addEventListener("keypress", (evt: any) => {
            //         if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            //             evt.preventDefault();
            //         }
            //     });

            //     document.querySelector("#warningInput").addEventListener("keypress", (evt: any) => {
            //         if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            //             evt.preventDefault();
            //         }
            //     });
            // })
        } else {
            $('#paramModal').modal('hide');
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    private _getCodes(): void {
        this.pdmConfigService.getCodesByCategory(this.fabId, 'param_type')
            .then((result: any) => {
                this.paramTypes = result;
            }).catch((error: any) => {

            });
        this.pdmConfigService.getCodesByCategory(this.fabId, 'unit_type')
            .then((result: any) => {
                this.unitTypes = result;
            }).catch((error: any) => {

            });
    }
}





