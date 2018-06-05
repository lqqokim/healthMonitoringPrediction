import { Component, Input, Output, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { ToolModelService, ModalApplier } from '../../../../../../../common';
import { Subscription } from 'rxjs/Subscription';

import { Translater } from '../../../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'module-type-modify',
    templateUrl: `./module-type-modify.html`,
    styleUrls: [`./module-type-modify.css`],
})
export class ModuleTypeModifyComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    @Output() actionChanges = new EventEmitter();

    myData: any;
    selectedDatas;
    status: string;
    isSameName: boolean = false;
    isNameValid: boolean = true;

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private eqpService: ToolModelService,
        private translater: Translater
    ) { }

    ngOnChanges(changes: any): void {
        this.isSameName = false;
        this.isNameValid = true;

        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;

            if (this.status === 'create') {
                this.myData = {};
            } else if (this.status === 'modify') {
                this.myData = JSON.parse(JSON.stringify(this._selectedData.data));
            }

            this._waitApply();
        }

        // if (this.status === 'create') {
        //     this.myData = {};
        //     // this.myData.name = '';
        //     // this.selectedDatas = [];
        // }
        // else {
        //     if (this.data == null || this.data.moduleTypeId == undefined) {
        //         return;
        //     }
        //     this.eqpService.getModuleType(this.data.moduleTypeId).subscribe((datas) => {
        //         this.myData = datas[0];
        //         // this.selectedDatas = datas[0].modules;
        //     });
        // }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._saveModuleType();
                }
            });
    }


    _saveModuleType() {
        this.isNameValid = this.isValid(this.myData.name);

        if (this.status === 'create') {
            for (let i = 0; i < this._selectedData.moduleDatas.length; i++) {
                // if (this._selectedData.moduleDatas[i].name) {
                if (this.myData.name === this._selectedData.moduleDatas[i].name) {
                    this.isSameName = true;
                    break;
                }

            }
        }

        if (!this.isNameValid || this.isSameName) {
            return;
        }

        if (this.status === 'create') {
            this.myData.password = '1';
            this.eqpService
                .createModuleType(this.myData)
                .subscribe(
                (data) => this._applier.appliedSuccess(),
                (error) => this._applier.appliedFailed()
                );
        } else if (this.status === 'modify') {
            this.eqpService
                .modifyModuleType(this.myData)
                .subscribe(
                (data) => this._applier.appliedSuccess(),
                (error) => this._applier.appliedFailed()
                );
        }
    }

    onSelectionChange(event) {
        this.myData.modules = event;
    }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', {field: type})['value'];
    }

    input() {
        this.isNameValid = true;
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


    // onClickSave(callback) {

    //     this.isNameValid = this.isValid(this.myData.name);

    //     // if (this.status === "create") {
    //     //     for (let i = 0; i < this.moduleDatas.length; i++) {
    //     //         if (this.myData.name === this.moduleDatas[i].name) {
    //     //             this.isSameName = true;
    //     //             break;
    //     //         }
    //     //     }
    //     // }

    //     if (!this.isNameValid || this.isSameName) {
    //         return;
    //     }


    //     if (this.status == "create") {
    //         this.eqpService.createModuleType(this.myData).subscribe(
    //             (data) => {
    //                 alert("Create Success!");
    //                 this.goBack(callback);
    //             }

    //             , // put the data returned from the server in our variable
    //             error => {
    //                 console.log("Error HTTP GET Service");

    //             }, // in case of failure show this message
    //             () => console.log("Job Done Get !")//run this code in all cases
    //         );
    //     } else if (this.status == "modify") {

    //         this.eqpService.modifyModuleType(this.myData).subscribe(
    //             (data) => {
    //                 alert("Modify Success!");
    //                 this.goBack(callback);
    //             }

    //             , // put the data returned from the server in our variable
    //             error => {
    //                 console.log("Error HTTP GET Service");

    //             }, // in case of failure show this message
    //             () => console.log("Job Done Get !")//run this code in all cases
    //         );
    //     }
    // }
    // onClickDelete(callback) {
    //     this.eqpService.deleteModuleType(this.data.moduleTypeId).subscribe(
    //         (data) => {
    //             alert("Delete Success!");
    //             this.goBack(callback);
    //         },
    //         error => console.log("Error HTTP Delete Service"),
    //         () => console.log("Job Done Delete!")
    //     );
    // }

    // goBack(callback): void {
    //     if (callback != undefined)
    //         callback("success");
    // }



}
