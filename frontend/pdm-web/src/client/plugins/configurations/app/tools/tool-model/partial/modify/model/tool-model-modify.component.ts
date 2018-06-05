import { Component, Input,Output,OnChanges,EventEmitter,ChangeDetectionStrategy } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { ToolModelService, ModalApplier } from '../../../../../../../../common';
import { Translater } from '../../../../../../../../sdk';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId:module.id,
    selector: 'tool-model-modify',
    templateUrl: `tool-model-modify.html`,
    styleUrls:[`tool-model-modify.css`],
    providers: [ToolModelService]
})
export class ToolModelModifyComponent  implements OnChanges {

    @Output() actionChange = new EventEmitter();
    @Input() data:any;
    @Input() status:string;
    @Input() datas: any[];

    myData;
    _selectedData: any;

    isNameValid : boolean = true;
    isMakerValid : boolean = true;
    isTypeValid : boolean = true;
    isSameName: boolean = false;

    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private eqpService:ToolModelService,
        private translater: Translater
    ) { }


    ngOnInit(){

        // this.status =this.route.snapshot.params['status'];
        // let passData = this.route.snapshot.params['data'];
        // if(this.data == undefined && this.status=='create'){
        //     this.data = {};

        // }else{
        //     this.eqpService.getToolModel(passData).subscribe((datas)=>{
        //         this.data = datas[0];
        //     })
        // }
    }

    ngOnChanges(changes): void {

        this.isNameValid = true;
        this.isMakerValid = true;
        this.isTypeValid = true;
        this.isSameName = false;

        // if(this.status!=undefined && this.status=='create'){
        //     this.myData = {};

        // }else if(this.data!=undefined){
        //     this.eqpService.getToolModel(this.data.toolModelId).subscribe((datas)=>{
        //         this.myData = datas[0];
        //     })
        // }
        if (changes && changes.data) {
            // console.log('tool groups changes : ', changes);
            this._selectedData = changes.data.currentValue.data;
            this._applier = changes.data.currentValue.applier;
            this.status = changes.data.currentValue.status;

            if (this.status !== undefined && this.status === 'create') {
                this.myData = {};
            } else if(this.status === 'modify' && this._selectedData !== undefined) {
                this.eqpService.getToolModel(this._selectedData.toolModelId).subscribe((datas) => {
                    this.myData = datas[0];
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

        this.isNameValid = this.isValid(this.myData.name);
        this.isMakerValid = this.isValid(this.myData.maker);
        this.isTypeValid = this.isValid(this.myData.type);

        if (this.status === "create") {
            for (let i = 0; i < this.datas.length; i++) {
                if (this.myData.name === this.datas[i].name) {
                    this.isSameName = true;
                    break;
                }
            }

        }
        if (!this.isNameValid || !this.isMakerValid || !this.isTypeValid || this.isSameName){
           return;
        }
        if (this.status === "create"){
            this.eqpService.createToolModel(this.myData).subscribe(
                    (data) => {
                        // alert("Create Success!");
                        // this.goBack(callback);
                        this._applier.appliedSuccess();
                    }

                    , // put the data returned from the server in our variable
                    error => {
                        this._applier.appliedFailed();
                        console.log("Error HTTP GET Service");

                    }, // in case of failure show this message
                    () => console.log("Job Done Get !")//run this code in all cases
                );
        } else {
            this.eqpService.modifyToolModel(this.myData).subscribe(
                    (data) => {
                        // alert("Modify Success!");
                        // this.goBack(callback);
                        this._applier.appliedSuccess();
                    }

                    , // put the data returned from the server in our variable
                    error => {
                        this._applier.appliedFailed();
                        console.log("Error HTTP GET Service");

                    }, // in case of failure show this message
                    () => console.log("Job Done Get !")//run this code in all cases
                );
        }
        // else if(this.status=="delete"){
        //     this.eqpService.deleteToolModel(this.myData.toolModelId).subscribe(
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

//    onClickDelete(callback){
//        this.eqpService.deleteToolModel(this.myData.toolModelId).subscribe(
//            (data) => {
//                alert("Delete Success!");
//                this.goBack(callback);
//            },
//             error => console.log("Error HTTP GET Service"), // in case of failure show this message
//             () => console.log("Job Done Get !")//run this code in all cases
//         );
//    }

    input(object) {
        if (object.target.id === "inputName") {
            this.isNameValid = true;
        } else if(object.target.id === "inputMaker") {
            this.isMakerValid = true;
        } else {
            this.isTypeValid = true;
        }
        this.isSameName = false;
    }

    isValid(isValid) {
        if (isValid === undefined || isValid === null || isValid === '') {
           return false;
        } else {
            return true;
        }
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
