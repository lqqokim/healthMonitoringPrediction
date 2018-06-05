import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import * as wjcGrid from 'wijmo/wijmo.grid';

import {
    ToolModelService,
    ModalAction,
    ModalRequester,
    RequestType,
    WijmoApi
} from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';

import { ToolGroupModalModule } from './modal/tool-group-modal.module';

@Component({
    moduleId: module.id,
    selector: 'tool-group-list',
    templateUrl: `tool-group-list.html`,
    providers: [ToolModelService]
})
export class ToolGroupListComponent extends WijmoApi {
    // @ViewChild("toolGroupModify")  toolGroupModify;
    @ViewChild('flex') grid: wjcGrid.FlexGrid;
    // @Output() selectChange = new EventEmitter();

    groups: any[];
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
        this.getToolGroups();
    }

    getToolGroups() {
        this.EqpService
            .getToolGroups()
            .subscribe(
            (groups) => {
                this.groups = groups;
                setTimeout(() => {
                    this._firstSelectRow();
                });
            });
    }

    _firstSelectRow() {
        if (this.grid.itemsSource && this.grid.itemsSource.length) {
            this.selectedData = this.grid.itemsSource[0];
        }
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
        //     value:this.selectedData
        // });
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
            // let objId='';
            // this.status = status;
            // if (this.selectedData !== null) {
            //     objId = this.selectedData.toolGroupId;
            // }
            // $('#myModal').modal('show');
            this.showModal(status);
        }

    }

    showModal(status) {
        this.status = status;
        this.modalAction.showConfiguration({
            module: ToolGroupModalModule,
            info: {
                status: this.status,
                data: this.selectedData,
                groups: this.groups
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                // console.log('modal response data : ', response.data);
                this.getToolGroups();
                // TODO: MESSAGE
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }
            }
        });
    }

    onSave() {
        // this.toolGroupModify.onClickSave((data)=>{
        //     if(data=="success"){
        //          $('#myModal').modal('hide');
        //          this.getToolGroups();
        //     }
        // });
    }
    onDelete(): void {
        // this.toolGroupModify.onClickDelete((data)=>{
        //     if(data == 'success'){
        //         this.getToolGroups();
        //     }
        // });
        this.EqpService.deleteToolGroup(this.selectedData).subscribe(
            (data) => {
                // alert("Delete Success!");
                // this.goBack(callback);
                // TODO: MASSAGE
                this.notify.success('MESSAGE.USER_CONFIG.REMOVE_SUCCESS');
                this.getToolGroups();
            },
            (error) => {
                console.log('Error HTTP DELETE Service', error);
                this.notify.error('MESSAGE.GENERAL.ERROR');
            });

    }
}
