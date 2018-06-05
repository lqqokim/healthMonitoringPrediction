import { Component, Input,Output,OnChanges,EventEmitter,ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { ToolModelService, ModalApplier } from '../../../../../../common';
import { Translater } from '../../../../../../sdk';

// import { SelectListComponent } from '../../common/select.list.component';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId:module.id,
    selector: 'module-group-modify',
    templateUrl: `module-group-modify.html`,
    styleUrls:[`module-group-modify.css`],
    providers: [ToolModelService]
})
export class ModuleGroupModifyComponent  implements OnChanges {
    @Output() actionChange = new EventEmitter();
    @Input() data:any;
    @Input() status:string;
    @Input() moduleDatas: any[];
    @ViewChild('selectList') selectList;

    myData;
    _selectedData: any;

    selectedDatasHeader = [{column:'name',display:'Name'},{column:'alias',display:'Alias'}];
    selectedDatas;

    datasHeader = [{column:'name',display:'Name'},{column:'alias',display:'Alias'}];
    datas: any[];
    validMsg: string;
    listName: string;

    isNameValid: boolean = true;
    isModuleGroupOrderValid: boolean = true;
    isSameName: boolean = false;

    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private eqpService:ToolModelService,
        private translater: Translater
    ) { }


    ngOnInit() {
        this.listName = 'moduleList';
        this.validMsg = 'moduleMsg';
        this.eqpService.getModules().subscribe((datas) => {
            this.datas = datas;
        });

    }
    ngOnChanges(changes): void {

        this.isNameValid = true;
        this.isModuleGroupOrderValid = true;
        this.isSameName = false;

        this.eqpService.getModules().subscribe((datas)=>{
            this.datas = datas;
        });
        this.myData = {};
        this.selectedDatas=[];
        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue.data;
            this._applier = changes.data.currentValue.applier;
            this.status = changes.data.currentValue.status;
            if (this.status === 'create') {
                 this.myData = {};
                this.selectedDatas = [];
             } else {
                 if(this._selectedData === null || this._selectedData.moduleGroupId === undefined) return;
                 this.eqpService.getModuleGroup(this._selectedData.moduleGroupId).subscribe((datas)=> {
                     this.myData = datas[0];
                     this.selectedDatas = datas[0].modules;
                 });
             }
        }
        this._waitApply();

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
        this.myData.modules = event;
    }

    // goBack(callback): void {
    //     if(callback!=undefined)
    //         callback('success');
    // }

    onClickSave() {
        let isSelectedValid = this.selectList.isValid();
        this.isModuleGroupOrderValid = this.isValid(this.myData.moduleGroupOrder);
        this.isNameValid = this.isValid(this.myData.name);

        if (this.status === 'create') {
             for (let i = 0; i < this.moduleDatas.length; i++) {
                if (this.myData.name === this.moduleDatas[i].name) {
                    this.isSameName = true;
                    break;
                }
            }
        }

        if (!this.isNameValid || !this.isModuleGroupOrderValid || !isSelectedValid || this.isSameName){
           return;
        }

        if (this.status === 'create') {
            this.eqpService
                .createModuleGroup(this.myData)
                .subscribe(
                    (data) => {
                        this._applier.appliedSuccess();
                    },
                    error => {
                        console.error('Error HTTP GET Service');
                    });
        } else if(this.status === 'modify') {
            this.eqpService
                .modifyModuleGroup(this.myData)
                .subscribe(
                    (data) => {
                        this._applier.appliedSuccess();
                    },
                    error => {
                        console.error('Error HTTP GET Service');

                    });
        }
    }
    onClickDelete(callback) {
        // this.eqpService.deleteModuleGroup(this.data).subscribe(
        //     (data) =>{
        //         alert('Delete Success!');
        //         this.goBack(callback);
        //     },
        //     error => console.log('Error HTTP GET Service'),
        //     () => console.log('Job Done Get!')
        // );
    }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', { field: type })['value'];
    }

    input(object) {
        if(object.target.id === 'inputName') {
            this.isNameValid = true;
        } else if(object.target.id === 'inputOrder') {
            this.isModuleGroupOrderValid = true;
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

    onkeypress(event) {
        if(!(event.charCode >= 48 && event.charCode <= 57) && event.charCode !== 13 ){
            event.preventDefault();
            alert('Please input only positive numbers');
        }
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
