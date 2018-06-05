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

import { InlineToolModalModule } from './modal/inline-tool-modal.module';

@Component({
    moduleId: module.id,
    selector: 'inline-tool-list',
    templateUrl: `inline-tool-list.html`,
    styleUrls: [`inline-tool-list.css`],
    providers: [ToolModelService]
})
export class InlineToolListComponent extends WijmoApi {
    @ViewChild('inlineToolModify') inlineToolModify;
    // @Output() selectChange = new EventEmitter();

    datas: any[];
    selectedData: any;
    status;

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
        this.getInlineTools();
    }

    getInlineTools() {
        this.EqpService.getInlineTools().subscribe((datas) => {
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
        // })
    }
    goLink(status: string) {
        if (status === 'delete') {
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
                    this.status = status;
                    this.onDelete();
                }
            });
        } else {
            this.status = status;
            // let objId='';
            // if(this.selectedData!=null){
            //     objId=this.selectedData.inlineToolId;
            // }
            this.showModal();
            // $('#myModal').modal('show');
        }

    }
    showModal() {
        // this.status = status;
        this.modalAction.showConfiguration({
            module: InlineToolModalModule,
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
                this.getInlineTools();
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
    //     this.inlineToolModify.onClickSave((data) => {
    //         if (data == "success") {
    //             $('#myModal').modal('hide');
    //             this.getInlineTools();
    //         }
    //     });
    // }
    onDelete(): void {
        // this.inlineToolModify.onClickDelete((data) => {
        //     if (data == 'success') {
        //         this.getInlineTools();
        //     }
        // });
        this.EqpService.deleteInlineTool(this.selectedData).subscribe(
            (data) => {
                // alert("Delete Success!");
                // this.goBack(callback);
                this.getInlineTools();
                // TODO: MASSAGE
                this.notify.success('MESSAGE.USER_CONFIG.REMOVE_SUCCESS');
            },
            (error) => {
                this.notify.info('MESSAGE.APP_CONFIG.TOOLS.REMOVE_VALID', { itemName: this.selectedData.name });
            },
            () => console.log("Job Done Get!")
        );
    }
}
