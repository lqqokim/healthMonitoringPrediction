import { Component, Output, EventEmitter ,ViewChild} from '@angular/core';
import {
    ToolModelService,
    ModalAction,
    ModalRequester,
    RequestType,
    WijmoApi
} from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';

import { InlineGroupModalModule } from './modal/inline-group-modal.module';


@Component({
    moduleId:module.id,
    selector: 'inline-group-list',
    templateUrl: `inline-group-list.html`,
    styleUrls:[`inline-group-list.css`],
    providers: [ToolModelService]
})
export class InlineGroupListComponent extends WijmoApi {
    // @ViewChild("inlineToolGroupModify") inlineToolGroupModify;
    datas:any[];
    @Output() selectChange = new EventEmitter();
    selectedData : any;
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
       this.getInlineGroups();
    }

    getInlineGroups() {
        this.EqpService.getInlineGroups().subscribe((datas)=>{
            // this.groups = groups;
             this.datas =datas;
          }
        );
    }
    firstCharUpper(value){
        if(value==undefined || value=="") return value;
        return value.substr(0,1).toUpperCase() + value.substr(1);
    }
    // selectRow(data:any):void{

    //     this.selectedData = data;
    //     this.selectChange.emit({
    //         value:this.selectedData
    //     })
    // }
    selectedRow(obj,event) {
        this.selectedData =  obj.selectedItems[0];

        this.selectChange.emit({
            value:this.selectedData
        });
    }

    goLink(status:string) {
        if( status === 'delete') {
            this.modalAction.showConfirmDelete({
                info: {
                    title: this.selectedData.name,
                    confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.selectedData.name })['value'],
                },
                requester: this.requester
            });

            this.requester.getObservable().subscribe((response: RequestType) => {
                if(response.type === 'OK' && response.data){
                    this.status = status;
                    this.onDelete();
                }
            });
        } else {

            this.status = status;
            // let objId='';
            // if(this.selectedData!=null){
            //     objId=this.selectedData.inlineGroupId;
            // }
            // let link= [];
            // if(status=="create"){
            //     link = ['/inline-group-create/'+status ];
            // }else{
            //     link = ['/inline-group-modify/'+status +"/"+objId+"/"];
            // }

            // this.router.navigate(link);
            // $('#myModal').modal('show');
            this.showModal();
        }
    }
    showModal() {
        // this.status = status;
        this.modalAction.showConfiguration({
            module: InlineGroupModalModule,
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
                this.getInlineGroups();
                // TODO: MESSAGE
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }
            }
        });
    }
    // onSave(){
    //     this.inlineToolGroupModify.onClickSave((data)=>{
    //         if(data=="success"){
    //              $('#myModal').modal('hide');
    //              this.getInlineGroups();
    //         }
    //     });
    // }
    onDelete(): void {
        this.EqpService.deleteInlineGroup(this.selectedData).subscribe(
            (data) => {
                // alert("Delete Success!");
                // this.goBack(callback);
                 this.getInlineGroups();
                // TODO: MASSAGE
                this.notify.success('MESSAGE.USER_CONFIG.REMOVE_SUCCESS');
            },
            (error) => {
                console.error('Error HTTP DELETE Service', error);
                this.notify.error('MESSAGE.GENERAL.ERROR');
            });
    }
}
