import { Component, Output, OnInit, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ToolModelService, ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';

import { ModuleTypeModalModule } from './modal/module-type-modal.module';

@Component({
    moduleId: module.id,
    selector: 'module-type-list',
    templateUrl: `module-type-list.html`,
    styleUrls: [`module-type-list.css`],
    providers: [ToolModelService]
})
export class ModuleTypeListComponent extends WijmoApi implements OnInit {
    @ViewChild('toolModuleTypeModify') toolModuleTypeModify: any;
    @ViewChild('flex') grid: any;
    // @Output() selectChange: any = new EventEmitter();

    datas: any[];
    selectedData: any;
    status: string;

    constructor(
        private EqpService: ToolModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater
    ) {
        super();
    }

    ngOnInit() {
        this._getModuleTypes();
    }

    _getModuleTypes() {
        this.EqpService
            .getModuleTypes()
            .subscribe((datas) => {
                this.datas = datas;
                this._firstSelectedData();
            });
    }

    _firstSelectedData() {
        setTimeout(() => {
            if (this.grid.itemsSource && this.grid.itemsSource.length > 0) {
                this.selectedData = this.grid.itemsSource[0];
            }
        });
    }

    selectedRow(obj, event) {
        this.selectedData = obj.selectedItems[0];

        // this.selectChange.emit({
        //     value: this.selectedData
        // })
    }

    createModuleType() {
        this._controlModuleType('create');
    }

    updateModuleType() {
        this._controlModuleType('modify');
    }

    _controlModuleType(status) {
        this.status = status;
        this.modalAction.showConfiguration({
            module: ModuleTypeModalModule,
            info: {
                title: this._firstCharUpper(status) + ' Module Type',
                status: this.status,
                selectedData: this.selectedData,
                datas: this.datas
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getModuleTypes();
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }
            }
        });
    }

    deleteModuleType() {
        this.status = undefined;
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedData.name,
                // confirmMessage: `${this.selectedData.name}를 삭제하시겠습니까?`,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.selectedData.name })['value'],
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteModuleType();
            }
        });
    }

    _deleteModuleType() {
        this.EqpService
            .deleteModuleType(this.selectedData.moduleTypeId)
            .subscribe(
            (data) => {
                this._getModuleTypes();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            },
            (error) => {
                this.notify.info("MESSAGE.APP_CONFIG.TOOLS.REMOVE_VALID", { itemName: this.selectedData.name });
            },
            () => console.log('Job Done Get !')
            );
    }

    _firstCharUpper(value) {
        if (value === undefined || value === '') return value;
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }



    // goLink(status: string) {
    //     if (status === 'delete') {
    //         this.modalAction.showConfirmDelete({
    //             info: {
    //                 title: this.selectedData.name,
    //                 confirmMessage: `${this.selectedData.name}를 삭제하시겠습니까?`,
    //             },
    //             requester: this.requester
    //         });

    //         this.requester.getObservable().subscribe((response: RequestType) => {
    //             if (response.type === 'OK' && response.data) {
    //                 this.status = status;
    //                 this.onDelete();
    //             }
    //         });
    //     } else {
    //         this.status = status;
    //         let objId = '';
    //         if (this.selectedData != null) {
    //             objId = this.selectedData.moduleGroupId;
    //         }
    //         $('#myModal').modal('show');
    //     }
    // }

}
