import { Component, Input,Output,OnChanges,EventEmitter,ChangeDetectionStrategy } from '@angular/core';
import { ToolModelService, ModalApplier } from '../../../../../../../../common';
import { Translater } from '../../../../../../../../sdk';
import { Subscription } from 'rxjs/Subscription';

@Component({
    moduleId:module.id,
    selector: 'tool-model-version-modify',
    templateUrl: `tool-model-ver-modify.html`,
    styleUrls:[`tool-model-ver-modify.css`],
    providers: [ToolModelService]
})
export class ToolModelVersionModifyComponent  implements OnChanges {

    @Output() actionChange = new EventEmitter();
    @Input() data:any;
    @Input() status:string;

    myData;
    _selectedData: any;

    isVersionValid : boolean = true;

    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private eqpService:ToolModelService,
        private translater: Translater
    ) { }

    ngOnInit(){ }

    ngOnChanges(changes): void {
        console.log(changes);
        this.isVersionValid = true;
        this.myData = null;
        // if(this.data==undefined || this.data==null) return;
    //    if(this.status!= undefined && this.status=='create'){
    //         this.eqpService.getToolModel(this.data.toolModelId).subscribe((datas)=>{
    //             this.myData = {};
    //             this.myData.toolModel = datas[0];
    //         })
    //     }else{
    //         if(this.data.toolModelVerId==undefined) return;
    //         this.eqpService.getToolModelVersion(this.data.toolModelVerId).subscribe((datas)=>{
    //             if(datas.length==0) return;
    //             this.myData = datas[0];
    //             if(this.myData.toolModels!=undefined && this.myData.toolModels.length>0){
    //                 this.myData.toolModel=this.myData.toolModels[0];
    //             }

    //         })
    //     }
        if (changes && changes.data) {
            // console.log('tool groups changes : ', changes);
            this._selectedData = changes.data.currentValue.selectedVerData;
            this._applier = changes.data.currentValue.applier;
            this.status = changes.data.currentValue.status;

            if(this._selectedData === undefined || this._selectedData === null) return;

           if (this.status !== undefined && this.status === 'create') {
                this.eqpService.getToolModel(this._selectedData.toolModelId).subscribe((datas)=>{
                    this.myData = {};
                    this.myData.toolModel = datas[0];
                });
           } else {
                if(this._selectedData.toolModelVerId === undefined) return;
                this.eqpService
                    .getToolModelVersion(this._selectedData.toolModelVerId)
                    .subscribe((datas) => {
                        if(datas.length === 0) return;
                        this.myData = datas[0];
                        if(this.myData.toolModels!== undefined && this.myData.toolModels.length>0) {
                            this.myData.toolModel=this.myData.toolModels[0];
                        }
                    });
            }
            this._waitApply();
        }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this.onClickSave();
                }
            });
    }

    // goBack(callback): void {
    //     if(callback!=undefined)
    //         callback("success");
    // }

   onClickSave() {
        if (this.myData.version === undefined || this.myData.version === null || this.myData.version === '') {
            this.isVersionValid = false;
        }
        if (!this.isVersionValid) {
            return;
        }

        let saveData = {
            toolModelVerId: this.myData.toolModelVerId,
            toolModelId: this.myData.toolModel.toolModelId,
            version: this.myData.version,
            description: this.myData.description
        };
        if (this.status === "create") {
            this.eqpService.createToolModelVer(saveData).subscribe(
                    (data) => {
                        // alert("Create Success!");
                        // this.goBack(callback);
                        this._applier.appliedSuccess();
                    },
                    error => {
                        this._applier.appliedFailed();
                        console.log("Error HTTP GET Service");

                    }, // in case of failure show this message
                    () => console.log("Job Done Get !")//run this code in all cases
                );
        } else {
            this.eqpService.modifyToolModelVer(saveData).subscribe(
                    (data) => {
                        // alert("Modify Success!");
                        // this.goBack(callback);
                        this._applier.appliedSuccess();
                    },
                    error => {
                        this._applier.appliedFailed();
                        console.log("Error HTTP GET Service");

                    }, // in case of failure show this message
                    () => console.log("Job Done Get !")//run this code in all cases
                );
        }
        // else if(this.status=="delete"){
        //     this.eqpService.deleteToolModelVer(saveData.toolModelVerId).subscribe(
        //             (data) =>{
        //                 alert("Delete Success!");
        //                 this.goBack(callback);
        //             }

        //             , // put the data returned from the server in our variable
        //             error => console.log("Error HTTP GET Service"), // in case of failure show this message
        //             () => console.log("Job Done Get !")//run this code in all cases
        //         );

        // }
   }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', {field: type})['value'];
    }

//     onClickDelete(callback){
//         let saveData ={toolModelVerId:this.myData.toolModelVerId,toolModelId:this.myData.toolModel.toolModelId,version:this.myData.version,description:this.myData.description};
//         this.eqpService.deleteToolModelVer(saveData.toolModelVerId).subscribe(
//             (data) => {
//                 alert("Delete Success!");
//                 this.goBack(callback);
//             },
//             error => console.log("Error HTTP GET Service"), // in case of failure show this message
//             () => console.log("Job Done Get !")//run this code in all cases
//         );
//    }

   input() {
       this.isVersionValid = true;
   }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
