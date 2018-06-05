import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    ToolModelService,
    ModalAction,
    ModalRequester,
    RequestType,
    WijmoApi
} from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';
import { ModuleGroupModalModule } from './modal/module-group-modal.module';


@Component({
    moduleId: module.id,
    selector: 'module-group-list',
    templateUrl: `module-group-list.html`,
    styleUrls: [`module-group-list.css`],
    providers: [ToolModelService]
})
export class ModuleGroupListComponent extends WijmoApi {
    // @ViewChild('toolModuleGroupModify') toolModuleGroupModify;
    // @Output() selectChange = new EventEmitter();

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
        this.getModuleGroups();
    }

    getModuleGroups() {
        this.EqpService.getModuleGroups().subscribe((datas) => {
            // this.groups = groups;
            this.datas = datas;
        }
        );
    }

    firstCharUpper(value) {
        if (value === undefined || value === '') return value;
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }
    // selectRow(data:any):void{
    //     this.selectedData = data;
    //     this.selectChange.emit({
    //         value:this.selectedData
    //     })
    // }
    selectedRow(obj, event) {
        this.selectedData = obj.selectedItems[0];

        // this.selectChange.emit({
        //     value: this.selectedData
        // });
    }

    goLink(status: string) {
        if (status === 'delete') {
            this.modalAction.showConfirmDelete({
                info: {
                    title: this.selectedData.name,
                    // confirmMessage: `${this.selectedData.name}를 삭제하시겠습니까?`,
                    confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.selectedData.name })['value']
                },
                requester: this.requester
            });

            this.requester.getObservable().subscribe((response: RequestType) => {
                if (response.type === 'OK' && response.data) {
                    this.status = status;
                    this.onDelete();
                }
            });
        } else {
            this.status = status;
            // let objId = '';
            // if (this.selectedData != null) {
            //     objId = this.selectedData.moduleGroupId;
            // }
            // $('#myModal').modal('show');
            this.showModal();
        }
    }
    showModal() {
        // this.status = status;
        this.modalAction.showConfiguration({
            module: ModuleGroupModalModule,
            info: {
                status: this.status,
                data: this.selectedData,
                datas: this.datas
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                // console.log('modal response data : ', response.data);
                this.getModuleGroups();
                // TODO: MESSAGE
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }
            }
        });
    }

    // onSave() {
    //     this.toolModuleGroupModify.onClickSave((data) => {
    //         if (data == "success") {
    //             $('#myModal').modal('hide');
    //             this.getModuleGroups();
    //         }
    //     });
    // }
    onDelete(): void {
        // this.toolModuleGroupModify.onClickDelete((data) => {
        //     if (data == 'success') {
        //         this.getModuleGroups();
        //     }
        // });
        this.EqpService.deleteModuleGroup(this.selectedData).subscribe(
            (data) => {
                this.getModuleGroups();
                // TODO: MASSAGE
                this.notify.success('MESSAGE.USER_CONFIG.REMOVE_SUCCESS');
            },
            (error) => {
                console.error('Error HTTP DELETE Service', error);
                this.notify.error('MESSAGE.GENERAL.ERROR');
            });
    }
}
