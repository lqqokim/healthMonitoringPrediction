import { EqpListComponent } from './../../../eqp/partial/eqp-list.component';
//Angular
import { Component, OnInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

//MIP
import { ModalAction, ModalRequester, RequestType } from '../../../../../../../common';
import { NotifyService, Translater } from '../../../../../../../sdk';
import { PdmModelService } from './../../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../../../model/pdm-config.service';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcNav from 'wijmo/wijmo.nav';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';

//interface
import * as IEqp from './model/eqp-interface';

@Component({
    moduleId: module.id,
    selector: 'eqp-list',
    templateUrl: './master-eqp-list.html',
    styleUrls: ['./master-eqp-list.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class MasterEqpListComponent implements OnInit, OnChanges {
    @Input() datas: any[];
    @Output() updateItem: EventEmitter<any> = new EventEmitter();
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('eqpModify') eqpModify: any;
    @ViewChild('eqpCopy') eqpCopy: any;
    @ViewChild("fileInput") fileInput;
    @ViewChild("eqpForm") eqpForm;

    eqpDatas: wjcCore.CollectionView;
    eqpData: any;
    selectedRowData: any;
    btnDisabled: boolean = false;
    status: string;
    fabId: number;
    areaName: string;
    areaId: number;
    modalTitle: string;

    base64Image: any;
    changeImage: boolean;

    models: IEqp.Model[];
    isDirectInput: boolean = false;

    constructor(
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService,
        private domSanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        $('#eqpModal').on('hidden.bs.modal', () => {
            this.eqpForm.form.reset();
        });
    }

    ngOnChanges(changes: any) {
        console.log('test change', changes);
        if (changes.datas.currentValue) {
            let currentValue = changes.datas.currentValue;
            const eqpDatas = currentValue.eqps;
            eqpDatas.map((eqp) => {
                eqp.areaName = currentValue.areaName;
            });

            this.eqpDatas = eqpDatas;
            this.fabId = currentValue.fabId;
            this.areaId = currentValue.areaId;
            this.areaName = currentValue.areaName;
            this.getModels();

            if (!this.eqpDatas.length) {
                this.btnDisabled = true;
            } else {
                this.btnDisabled = false;
                this._firstSelectedData();
            }
        }
    }

    getModels(): void {
        this.pdmConfigService.getModels(this.fabId)
            .then((models: IEqp.Model[]) => {
                this.models = models;
            }).catch((err) => {

            });
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

    deleteEqp(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.eqpName,
                confirmMessage: this.translater.get("MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM", { itemName: this.selectedRowData.eqpName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteEqp();
            }
        });
    }

    _deleteEqp() {
        this.pdmConfigService.deleteEqp(this.fabId, this.areaId, this.selectedRowData.eqpId)
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
        let eqpData: any = {};
        this.status = status;
        // this.eqpForm.form.reset();

        if (status === 'create') {
            eqpData = {
                areaName: this.areaName,
                eqpName: '',
                model_name: '',
                description: '',
                image: '',
                dataType: '',
                offline_yn: false
            };
        } else if (status === 'modify' || status === 'copy') {
            eqpData = this.selectedRowData;

            if (eqpData.offline_yn === 'N') {
                eqpData.offline_yn = false;
            } else if (eqpData.offline_yn === 'Y') {
                eqpData.offline_yn = true;
            }

            eqpData.copyValue = "";
        }


        if (this.fileInput && this.fileInput.nativeElement.value !== "") {
            this.fileInput.nativeElement.value = "";
        }

        this.changeImage = false;

        // this.eqpData = { // Modify eqp data
        //     eqp: eqpData,
        //     status: status
        // };
        this.eqpData = Object.assign({}, eqpData);

        if (this.status === "modify") { //for show image 
            if (this.eqpData.image) {
                this.base64Image = this.domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${this.eqpData.image}`);
            } else {
                if (this.base64Image) {
                    this.base64Image = undefined;
                }
            }
        } else if (this.status === "create") {
            if (this.base64Image) {
                this.base64Image = undefined;
            }
        }

        this._showModal(true);
    }

    saveData(): any {
        let eqpData = Object.assign({}, this.eqpData);

        if (this.status === 'create' || (this.status === 'modify' && this.selectedRowData.eqpName !== eqpData.eqpName)) {
            if (!this.checkUniqueData(eqpData)) {
                this.notify.warn("PDM.NOTIFY.DUPLICATE_EQP");
                return;
            }
        }

        this._showModal(false);

        if (this.status === 'copy') {
            // let copyValue: any = this.eqpCopy.eqpCopyValue();
            let copyValue: any = eqpData.copyValue;
            let removeSpace = copyValue.replace(/(\s*)/g, "");
            let splitCopy = removeSpace.split(',');
            this._eqpCopy(splitCopy);
        } else {
            //let eqpData: any = this.eqpModify.getData();
            if (this.base64Image) {
                eqpData.image = this.splitImageData(this.base64Image);
            } else {
                eqpData.image = '';
            }


            if (eqpData.offline_yn === true) {
                eqpData.offline_yn = 'Y';
            } else if (eqpData.offline_yn === false) {
                eqpData.offline_yn = 'N';
            }


            let request: any = {
                description: eqpData.description,
                eqpName: eqpData.eqpName,
                model_name: eqpData.model_name,
                areaId: this.areaId,
                image: eqpData.image,
                // dataType: eqpData.dataType
                dataType: 'STD',
                offline_yn: eqpData.offline_yn
            };

            if (this.status === 'modify') {
                request.eqpId = this.selectedRowData.eqpId;
            }

            if (this.isDirectInput) {
                this.isDirectInput = false;
            }

            console.log('eqp req', request);
            this._updateEqp(request);
        }
    }

    changeDirectInput(isDirectInput: boolean, modelName: string): void {
        if (isDirectInput) {
            if (modelName.length) {
                this.eqpData.modelName = null;
            }
        }
    }

    checkUniqueData(data: any): boolean {
        let eqpDatas: any = this.eqpDatas;
        let length: number = eqpDatas.length;
        let result: boolean = true;

        for (let i = 0; i < length; i++) {
            if (eqpDatas[i].eqpName === data.eqpName) {
                result = false;
                break;
            }
        }
        return result;
    }

    _updateEqp(request: any): void {
        this.pdmConfigService.updateEqp(this.fabId, this.areaId, request)
            .then((res: any) => {
                console.log('update res', res);
                this._showModal(false);
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else if (this.status === 'modify') {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }

                this.updateItem.emit({
                    init: true,
                    request: request,
                    selectedRowData: this.selectedRowData
                });
            }, (err: any) => {
                this._showModal(false);
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    _eqpCopy(params: string[]): void {
        this.pdmConfigService.eqpCopy(this.fabId, this.areaId, this.selectedRowData.eqpId, params)
            .then((res) => {
                this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                this.updateItem.emit({
                    init: true,
                    request: params,
                    selectedRowData: this.selectedRowData
                });
            }).catch((err) => {
                this.notify.error("MESSAGE.GENERAL.ERROR");
                console.log('err', err);
            });
    }

    imageRegister(ev: any) {

    }

    _showModal(isShow: boolean): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(this.status);
            $('#eqpModal').modal({
                backdrop: false,
                show: true
            });
        } else {
            if (this.isDirectInput) {
                this.isDirectInput = false;
            }

            this.eqpForm.form.reset();

            $('#eqpModal').modal('hide');
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    splitImageData(base64Image): string {
        let eqpImage;

        if (this.status === "create") {
            eqpImage = base64Image.split(',')[1];
        } else if (this.status === "modify") {
            if (this.changeImage) {
                eqpImage = base64Image.split(',')[1];
            } else {
                eqpImage = base64Image.changingThisBreaksApplicationSecurity.split(',')[1];
            }
        }

        return eqpImage;
    }

    nameKeypress(event: KeyboardEvent) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    changeListener(ev: any): void {
        if (this.status === "modify") {
            if (ev) {
                this.changeImage = true;
            }
        }

        this.readThis(ev.target);
    }

    readThis(inputValue: any): void {
        if (inputValue.files && inputValue.files[0]) {
            let file: File = inputValue.files[0];
            let fileReader: FileReader = new FileReader();

            fileReader.onloadend = (e: any) => {
                this.base64Image = fileReader.result;
            }
            fileReader.readAsDataURL(file);
        }
    }

    removeImage(ev: any): void {
        if (this.fileInput.nativeElement.value) {
            this.fileInput.nativeElement.value = '';
        }

        if (this.base64Image) {
            this.base64Image = undefined;
        }
    }
}