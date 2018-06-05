import { Component, Input, Output, OnChanges, OnDestroy, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ToolModelService, ModalApplier } from '../../../../../../common';
// import { SelectListComponent } from '../common/select.list.component';
import { Subscription } from 'rxjs/Subscription';

import { Translater } from '../../../../../../sdk';


@Component({
    moduleId: module.id,
    selector: 'inline-tool-modify',
    templateUrl: `inline-tool-modify.html`,
    styleUrls: [`inline-tool-modify.css`],
    providers: [ToolModelService]
})
export class InlineToolModifyComponent implements OnChanges, OnDestroy {
    @Output() actionChange = new EventEmitter();
    @Input() data: any;
    @Input() status: string;
    @Input() datas: any[];
    @ViewChild("selectList") selectList;


    selectedToolsHeader = [{ column: 'name', display: 'Name' }, { column: 'alias', display: 'Alias' }];
    selectedTools;
    _selectedData: any;

    toolsHeader = [{ column: 'name', display: 'Name' }, { column: 'alias', display: 'Alias' }];
    tools;
    myData;
    validMsg: string;
    listName: string;

    isNameValid: boolean = true;
    isSameName: boolean = false;

    private _applier: ModalApplier;
    private _subscription: Subscription;


    constructor(
        private eqpService: ToolModelService,
        private translater: Translater
    ) { }


    ngOnInit() {
        this.listName = 'toolList';
        this.validMsg = 'toolMsg';
        //  this.status =this.route.snapshot.params['status'];
        //  let passData = this.route.snapshot.params['data'];
        //  if(this.data == undefined && this.status=='create'){
        //      this.data = new Tool();
        //  }else{
        //      this.eqpService.getInlineTool(passData).subscribe((datas)=>{
        //          this.data = datas[0];
        //          this.selectedTools = datas[0].tools;
        //      })
        //  }
        this.eqpService.getTools().subscribe((datas) => {
            this.tools = datas;
        });

    }
    ngOnChanges(changes): void {
        this.isNameValid = true;
        this.isSameName = false;
        this.myData = {};
        this.eqpService.getTools().subscribe((datas) => {
            this.tools = datas;
        });

        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue.data;
            this._applier = changes.data.currentValue.applier;
            this.status = changes.data.currentValue.status;
            if (this.status === 'create') {
                this.myData = {};
                this.selectedTools = [];
            } else {
                // if (this.data === null || this.data.inlineToolId === undefined) return;
                if (this._selectedData === null || this._selectedData.inlineToolId === undefined) return;
                this.eqpService.getInlineTool(this._selectedData.inlineToolId).subscribe((datas) => {
                    this.myData = datas[0];
                    this.selectedTools = datas[0].tools;
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

    onSelectionChange(event) {
        this.myData.tools = event;
    }

    goBack(callback): void {
        if (callback != undefined)
            callback("success");
    }

    onClickSave() {

        let isSelectedValid = this.selectList.isValid();
        this.isNameValid = this.isValid(this.myData.name);

        if (this.status === "create") {
            for (let i = 0; i < this.datas.length; i++) {
                if (this.myData.name === this.datas[i].name) {
                    this.isSameName = true;
                    break;
                }
            }
        }
        if (!this.isNameValid || !isSelectedValid || this.isSameName) {
            return;
        }

        if (this.status == "create") {
            this.eqpService.createInlineTool(this.myData).subscribe(
                (data) => {
                    // alert("Create Success!");
                    // this.goBack(callback);
                    this._applier.appliedSuccess();
                }

                , // put the data returned from the server in our variable
                error => {
                    console.log("Error HTTP GET Service");

                }, // in case of failure show this message
                () => console.log("Job Done Get !")//run this code in all cases
            );
        } else if (this.status == "modify") {

            this.eqpService.modifyInlineTool(this.myData).subscribe(
                (data) => {
                    // alert("Modify Success!");
                    // this.goBack(callback);
                    this._applier.appliedSuccess();
                }

                , // put the data returned from the server in our variable
                error => {
                    console.log("Error HTTP GET Service");

                }, // in case of failure show this message
                () => console.log("Job Done Get !")//run this code in all cases
            );
        }
    }

    onClickDelete(callback) {
        this.eqpService.deleteInlineTool(this.data).subscribe(
            (data) => {
                // alert("Delete Success!");
                // this.goBack(callback);
            },
            error => console.log("Error HTTP GET Service"),
            () => console.log("Job Done Get!")
        );
    }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', {field: type})['value'];
    }

    input() {
        this.isNameValid = true;
        this.isSameName = false;
    }

    isValid(isValid) {
        if (isValid === undefined || isValid === null || isValid === "") {
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
