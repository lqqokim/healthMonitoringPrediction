import { Component, Input,Output,OnChanges,OnDestroy, EventEmitter,ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { ToolModelService, ModalApplier } from '../../../../../../common';
// import { SelectListComponent } from '../common/select.list.component';
import { Subscription } from 'rxjs/Subscription';

import { Translater } from '../../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'tool-group-modify',
    templateUrl: `tool-group-modify.html`,
    providers: [ToolModelService]
})
export class ToolGroupModifyComponent  implements OnChanges, OnDestroy {
    @Output() actionChange = new EventEmitter();
    @Input() data: any;
    // @Input() status: string;
    @Input() groups: any[];
    @ViewChild('selectList') selectList;

    _myData: any;
    status: string;
    _selectedToolsHeader = [{column: 'name', display: 'Name'}, {column: 'alias', display: 'Alias'}];
    _selectedTools;
    _toolsHeader = [{column: 'name', display: 'Name'}, {column: 'alias', display: 'Alias'}];
    _tools;
    _isNameValid : boolean = true;
    _isSameName: boolean = false;

    validMsg: string;
    listName: string;

    _selectedData: any;

    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private eqpService: ToolModelService,
        private translater: Translater
    ) { }

    ngOnInit() {
        this.validMsg = 'toolMsg';
        this.listName = 'toolList';
        //  this.status =this.route.snapshot.params['status'];
        //  let passData = this.route.snapshot.params['data'];
        //  if(this.data == undefined && this.status=='create'){
        //      this.data = new Tool();
        //  }else{
        //      this.eqpService.getToolGroup(passData).subscribe((datas)=>{
        //          this.data = datas[0];
        //          this.selectedTools = datas[0].tools;
        //      })
        //  }
        this.eqpService.getTools().subscribe((datas) => {
            this._tools = datas;
        });
    }

    ngOnChanges(changes): void {
        this._isNameValid = true;
        this._isSameName = false;
        this.eqpService.getTools().subscribe((datas) => {
            this._tools = datas;
        });

        if (changes && changes.data) {
            // console.log('tool groups changes : ', changes);
            this._selectedData = changes.data.currentValue.data;
            this._applier = changes.data.currentValue.applier;
            this.status = changes.data.currentValue.status;

           if (this.status !== undefined && this.status === 'create') {
               this._myData = {};
               this._selectedTools = [];
           } else if(this.status === 'modify' && this._selectedData !== undefined) {
                 this.eqpService.getToolGroup(this._selectedData.toolGroupId).subscribe((datas) => {
                     this._myData = datas[0];
                     this._selectedTools = datas[0].tools;
                 });
               //    this.myData = Object.assign({},this.data);
            }
        //    if(changes.data!=undefined && changes.data.currentValue!=undefined && changes.data.currentValue.toolModelId!=undefined){
        //        this.changeToolModelId(changes.data.currentValue.toolModelId);
        //    }
            // setTimeout(() => {
            //     this._waitApply();

            // });
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

    onSelectionChange(event){
        this._myData.tools = event;
    }

    goBack(callback): void {
    if(callback!=undefined)
        callback('success');
   }

    onClickSave() {
        let isSelectValid = this.selectList.isValid();
        this._isNameValid = this.isValid(this._myData.name);

        if (this.status === 'create') {
            for (let i = 0; i < this.groups.length; i++) {
                if(this._myData.name === this.groups[i].name) {
                    this._isSameName = true;
                    break;
                }
            };
        }
        if (!this._isNameValid || !isSelectValid || this._isSameName) {
            return;
        }
        if (this.status === 'create') {
            this.eqpService.createToolGroup(this._myData).subscribe(
                    (data) => {
                    // console.log('save create data :', this._myData);
                        // alert('Create Success!');
                        // this.goBack(callback);
                        this._applier.appliedSuccess();
                    },
                    // put the data returned from the server in our variable
                    error => {
                        this._applier.appliedFailed();
                        console.log('Error HTTP GET Service');
                    },
                    // in case of failure show this message
                    () => console.log('Job Done Get !') //run this code in all cases
            );
        } else if (this.status === 'modify') {
            this.eqpService.modifyToolGroup(this._myData).subscribe(
                    (data) => {
                    // console.log('save modify data :', this._myData);
                        // alert('Modify Success!');
                        // this.goBack(callback);
                        this._applier.appliedSuccess();
                    },
                    // put the data returned from the server in our variable
                    error => {
                        this._applier.appliedFailed();
                        console.log('Error HTTP GET Service');
                    },
                    // in case of failure show this message
                    () => console.log('Job Done Get !')//run this code in all cases
                );
        }
    }

    onClickDelete(callback) {
        this.eqpService.deleteToolGroup(this._selectedData).subscribe(
            (data) => {
                alert('Delete Success!');
                this.goBack(callback);
            },
            error => console.log('Error HTTP GET Service'),
            () => console.log('Job Done Get!')
        );
    }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', {field: type})['value'];
    }

    input() {
        this._isNameValid = true;
        this._isSameName = false;
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
