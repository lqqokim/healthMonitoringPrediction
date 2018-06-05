import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy,ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    ToolModelService,
    ModalAction,
    ModalRequester,
    RequestType,
    WijmoApi
} from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';

import { ToolModelModalModule } from './modal/tool-model-modal.module';


@Component({
    moduleId:module.id,
    selector: 'tool-model-list',
    templateUrl: `tool-model-list.html`,
    styleUrls: [`tool-model-list.css`],
    providers: [ToolModelService]
})
export class ToolModelListComponent extends WijmoApi {

    // @ViewChild('toolModelModify')  toolModelModify;
    // @ViewChild('toolModelVerModify')  toolModelVerModify;
    // @Output() selectChange = new EventEmitter();

    datas: any[];
    verDatas: any[];

    selectedData: any;
    selectedVerData: any;
    status;
    title;
    showItem;

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
        this.getToolModels();
    }

    getToolModels() {
        this.selectedData = null;
        this.EqpService.getToolModels().subscribe((datas) => {
            this.datas = datas;
        });
    }

    selectedRow(obj,event) {
        this.selectedData =  obj.selectedItems[0];
        // this.selectChange.emit({
        //     value:this.selectedData
        // });
        this.getToolModelVersions();

    }

    getToolModelVersions() {
        this.selectedVerData = {};
        if (this.selectedData === null ||this.selectedData.toolModelId === undefined ) return;
        this.selectedVerData['toolModelId'] = this.selectedData.toolModelId;
        this.EqpService.getToolModelVersions(this.selectedData.toolModelId).subscribe((datas) => {
            this.verDatas = datas;
        });
    }
    // selectVerRow(data: any): void {
    //     this.selectedVerData = data;
    //     // this.selectChange.emit({
    //     //     value:this.selectedData
    //     // })
    // }
    selectedVerRow(obj,event) {
        this.selectedVerData =  obj.selectedItems[0];
        // console.log(this.selectedVerData);
        // this.selectChange.emit({
        //     value:this.selectedData
        // })
    }

    firstCharUpper(value) {
        if(value === undefined || value === '') return value;
        return value.substr(0,1).toUpperCase() + value.substr(1);
    }

    goLink(status: string) {
        this.showItem = 'Tool Model';
        if( status === 'delete') {
            this.modalAction.showConfirmDelete({
                info: {
                    title: this.selectedData.name,
                    // confirmMessage:`${this.selectedData.name}을 삭제하시겠습니까?`
                    confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.selectedData.name })['value']
                },
                requester: this.requester
            });
            this.requester.getObservable().subscribe((response: RequestType) => {
                if(response.type === 'OK' && response.data) {
                    this.status = status;
                    this.onDelete();
                }
            });
        } else {
            // let objId = '';
            this.status = status;
            // if (this.selectedData != null) {
            //     objId = this.selectedData.toolModelId;
            // }

            // this.title = this.firstCharUpper(status)+' ' + this.showItem;

            // let link = [];
            // if (status == 'create') {
            //     link = ['/tool-model-create/' + status];
            // } else {
            //     link = ['/tool-model-modify/' + status + '/' + objId + '/'];
            // }

            // this.router.navigate(link);
            // $('#myModal').modal('show');
            this.showModal();
        }
    }

    showModal() {
        // this.status = status;
        this.modalAction.showConfiguration({
            module: ToolModelModalModule,
            info: {
                title: this.firstCharUpper(status) + ' ' + this.showItem,
                status: this.status,
                showItem: this.showItem,
                datas: this.datas,
                selectedData: this.selectedData,
                selectedVerData: this.selectedVerData
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                // console.log('modal response data : ', response.data);
                this.getToolModels();
                // TODO: MESSAGE
                if (this.status === 'create') {
                    this.notify.success('MESSAGE.USER_CONFIG.CREATE_SUCCESS');
                } else {
                    this.notify.success('MESSAGE.USER_CONFIG.UPDATE_SUCCESS');
                }
            }
        });
    }

    goVerLink(status: string) {
        this.showItem = 'Tool Model Version';
        console.log(this.showItem);
        if( status === 'delete') {
            this.modalAction.showConfirmDelete({
                info: {
                    title: this.selectedVerData.version,
                    // confirmMessage:`${this.selectedVerData.version}을 삭제하시겠습니까?`
                    confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.selectedVerData.version })['value']
                },
                requester: this.requester
            });
            this.requester.getObservable().subscribe((response: RequestType) => {
                if(response.type === 'OK' && response.data) {
                    this.status = status;
                    this.onDelete();
                }
            });
        } else {
            this.status = status;
            // let objId = '';
            // if (this.selectedVerData !== null) {
            //     objId = this.selectedVerData.toolModelVerId;
            // }
            // let link = [];
            // if (status == 'create') {
            //     let toolModelId = this.selectedData.toolModelId;
            //     link = ['/tool-model-ver-create/' + status + '/' + toolModelId + '/'];
            // } else {
            //     link = ['/tool-model-ver-modify/' + status + '/' + objId + '/'];
            // }

            // this.router.navigate(link);
            // this.title = this.firstCharUpper(status)+' ' + this.showItem;
            // $('#myModal').modal('show');
            this.showModal();
        }

    }
    // onSave(){
    //     if(this.showItem=='Tool Model'){
    //         this.toolModelModify.onClickSave((data)=>{
    //             if(data=='success'){
    //                 $('#myModal').modal('hide');
    //                 this.getToolModels();
    //             }
    //         });
    //     }else if(this.showItem=='Tool Model Version'){
    //         this.toolModelVerModify.onClickSave((data)=>{
    //             if(data=='success'){
    //                 $('#myModal').modal('hide');
    //                 this.getToolModelVersions();
    //             }
    //         });
    //     }
    // }
    onDelete(): void {
        if (this.showItem === 'Tool Model') {
            // this.toolModelModify.onClickDelete((data) => {
            //     if(data === 'success'){
            //         this.getToolModels();
            //     }
            // });
            this.EqpService.deleteToolModel(this.selectedData.toolModelId).subscribe(
                (data) => {
                    // TODO: MASSAGE
                    this.notify.success('MESSAGE.USER_CONFIG.REMOVE_SUCCESS');
                    this.getToolModels();
                },
                (error) => {
                    this.notify.error('MESSAGE.GENERAL.ERROR');
                    console.error('Error HTTP DELETE Service', error);
                });
        } else {
            // this.toolModelVerModify.onClickDelete((data) => {
            //     if(data === 'success') {
            //         this.getToolModelVersions();
            //     }
            // });
            // let saveData = {toolModelVerId:this.selectedVerData.toolModelVerId,toolModelId:this.selectedVerData.toolModel.toolModelId,version:this.selectedVerData.version,description:this.selectedVerData.description};
            this.EqpService.deleteToolModelVer(this.selectedVerData.toolModelVerId).subscribe(
                (data) => {
                    // TODO: MASSAGE
                    this.notify.success('MESSAGE.USER_CONFIG.REMOVE_SUCCESS');
                    this.getToolModelVersions();
                },
                (error) => {
                    this.notify.error('MESSAGE.GENERAL.ERROR');
                    console.error('Error HTTP DELETE Service', error);
                });
        }
    }
}
