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
    eqpData: IEqp.FormData;
    selectedRowData: IEqp.Row;
    btnDisabled: boolean = false;
    status: string;
    fabId: number;
    areaName: string;
    areaId: number;
    modalTitle: string;

    base64Image: any;
    changeImage: boolean;

    models: IEqp.Model[];
    isSelectModel: boolean;

    readonly STATUS: IEqp.Status = {
        CREATE: 'CREATE',
        MODIFY: 'MODIFY',
        DELETE: 'DELETE',
        COPY: 'COPY',
        OK: 'OK'
    };

    readonly NOTIFY: IEqp.NOTIFY = {
        CREATE_SUCCESS: "MESSAGE.USER_CONFIG.CREATE_SUCCESS",
        UPDATE_SUCCESS: "MESSAGE.USER_CONFIG.UPDATE_SUCCESS",
        REMOVE_SUCCESS: "MESSAGE.USER_CONFIG.REMOVE_SUCCESS",
        REMOVE_ITEM: "MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM",
        ERROR: "MESSAGE.GENERAL.ERROR",
        DUPLICATE_EQP: "PDM.NOTIFY.WARN.DUPLICATE_EQP"
    };

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
                confirmMessage: this.translater.get(this.NOTIFY.REMOVE_ITEM, { itemName: this.selectedRowData.eqpName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === this.STATUS.OK && response.data) {
                this._deleteEqp();
            }
        });
    }

    _deleteEqp() {
        this.pdmConfigService.deleteEqp(this.fabId, this.areaId, this.selectedRowData.eqpId)
            .then((res: any) => {
                this.notify.success(this.NOTIFY.REMOVE_SUCCESS);
                this.updateItem.emit({
                    init: true
                });
            }, (err: any) => {
                this._showModal(false);
            });
    }


    showModal(status: string): void {
        this.status = status;
        let eqpData: IEqp.FormData;

        if (status === this.STATUS.CREATE) {
            eqpData = {
                areaName: this.areaName,
                eqpName: '',
                model_name: '',
                description: '',
                image: '',
                dataType: '',
                offline_yn: false
            };
        } else if (status === this.STATUS.MODIFY || status === this.STATUS.COPY) {
            const row = this.selectedRowData;
            eqpData = {
                areaName: row.areaName,
                eqpName: row.eqpName,
                model_name: row.model_name,
                description: row.description,
                image: row.image,
                dataType: row.dataType,
                offline_yn: row.offline_yn === "Y" ? true : false
            }

            eqpData['copyValue'] = "";
        }


        if (this.fileInput && this.fileInput.nativeElement.value !== "") {
            this.fileInput.nativeElement.value = "";
        }

        this.changeImage = false;
        this.isSelectModel = true;
        this.eqpData = eqpData;
        
        this.showEqpImage();
        this._showModal(true);
    }

    showEqpImage(): void {
        if (this.status === this.STATUS.CREATE) {
            if (this.base64Image) {
                this.base64Image = undefined;
            }
        } else if (this.status === this.STATUS.MODIFY) { //for show image 
            if (this.eqpData.image) {
                this.base64Image = this.domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64, ${this.eqpData.image}`);
            } else {
                if (this.base64Image) {
                    this.base64Image = undefined;
                }
            }
        }
    }

    saveData(): void {
        let eqpData = this.eqpData

        if (this.status === this.STATUS.CREATE || (this.status === this.STATUS.MODIFY && this.selectedRowData.eqpName !== eqpData.eqpName)) {
            if (!this.uniqueValidator(eqpData)) {
                this.notify.warn(this.NOTIFY.DUPLICATE_EQP);
                return;
            }
        }

        if (this.status === this.STATUS.COPY) {
            let copyValue: string = eqpData.copyValue;
            let removeSpace: string = copyValue.replace(/(\s*)/g, "");
            let splitCopy: string[] = removeSpace.split(',');

            this._eqpCopy(splitCopy);
        } else {
            const base64Image = this.base64Image;
            if (base64Image) {
                eqpData.image = this.splitImageData(base64Image);
            } else {
                eqpData.image = '';
            }

            let request: IEqp.EqpRequest = {
                eqpId: this.status === this.STATUS.CREATE ? null : this.selectedRowData.eqpId,
                description: eqpData.description,
                eqpName: eqpData.eqpName,
                model_name: eqpData.model_name,
                areaId: this.areaId,
                image: eqpData.image,
                dataType: 'STD',
                offline_yn: eqpData.offline_yn === true ? 'Y' : 'N'
            };

            if (!this.isSelectModel) {
                this.isSelectModel = true;
            }

            console.log('Eqp Request => ', request);
            this._updateEqp(request);
        }
    }

    private _updateEqp(request: IEqp.EqpRequest): void {
        this.pdmConfigService.updateEqp(this.fabId, this.areaId, request)
            .then((res: any) => {
                this._showModal(false);
                if (this.status === this.STATUS.CREATE) {
                    this.notify.success(this.NOTIFY.CREATE_SUCCESS);
                } else if (this.status === this.STATUS.MODIFY) {
                    this.notify.success(this.NOTIFY.UPDATE_SUCCESS);
                }

                this.emitItem(request);
            }, (err: any) => {
                this._showModal(false);
                this.notify.error(this.NOTIFY.ERROR);
                console.log('err', err);
            });
    }

    private _eqpCopy(request: string[]): void {
        this.pdmConfigService.eqpCopy(this.fabId, this.areaId, this.selectedRowData.eqpId, request)
            .then((res) => {
                this.notify.success(this.NOTIFY.CREATE_SUCCESS);
                this.emitItem(request);
            }).catch((err) => {
                this.notify.error(this.NOTIFY.ERROR);
                console.log('err', err);
            });
    }

    changeIsSelectModel(): void {
        if (!this.isSelectModel) {
            this.isSelectModel = true;

            if (this.status === this.STATUS.MODIFY) {
                this.eqpData.model_name = this.selectedRowData.model_name;
            }
        } else if(this.isSelectModel){
            this.isSelectModel = false;

            if (this.eqpData.model_name !== null || this.eqpData.model_name !== '') {
                this.eqpData.model_name = null;
            }
        }
    }

    uniqueValidator(data: any): boolean {
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

    emitItem(request): void {
        this.updateItem.emit({
            init: true,
            request: request,
            selectedRowData: this.selectedRowData
        });
    }

    _showModal(isShow: boolean): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(this.status);
            $('#eqpModal').modal({
                backdrop: false,
                show: true
            });
        } else {
            if (!this.isSelectModel) {
                this.isSelectModel = true;
            }

            this.eqpForm.form.reset();
            $('#eqpModal').modal('hide');
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    splitImageData(base64Image: any): string {
        let eqpImage: string;

        if (this.status === this.STATUS.CREATE) {
            eqpImage = base64Image.split(',')[1];
        } else if (this.status === this.STATUS.MODIFY) {
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
        if (this.status === this.STATUS.MODIFY) {
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