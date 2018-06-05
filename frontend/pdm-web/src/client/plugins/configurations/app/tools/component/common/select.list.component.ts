import { Component, Input,Output,OnChanges,EventEmitter,ChangeDetectionStrategy } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { OrderBy } from '../../../auth/component/common/orderby.component';

import { Translater } from '../../../../../../sdk';

// import { ArrayCompareFilterPipe } from './array.compare.filter';

@Component({
    moduleId: module.id,
    selector: 'select-list',
    templateUrl: `select.list.component.html`
})
export class SelectListComponent  implements OnChanges {

    @Input() leftHeader: any;
    @Input() leftData: any;
    @Input() rightHeader: string[];
    @Input() rightData: any;
    @Input() key: any;
    @Input() leftValidMsg: string;
    @Input() listName: string;
    @Output() selectionChange = new EventEmitter();

    // selectedLeftRow;
    // selectedRightRow;
    private _selectedLeftData = null;
    private _selectedRightData = null;
    private _isSelectedValid : boolean = true;

    constructor(
        private translater: Translater
    ) { }

    ngOnInit() {}

    ngOnChanges(changes): void {
        this._isSelectedValid = true;

        if(this.leftData === undefined) this.leftData = [];
        if(this.leftData !== undefined && this.rightData !== undefined && this.key !== undefined){
            let keyData = {};
            for(let i = 0; i < this.rightData.length; i++){
                keyData[this.rightData[i][this.key]] = i;
            }
            for(let i = 0; i < this.leftData.length; i++){
                let data = keyData[this.leftData[i][this.key]];
                if(data !== undefined){
                    this.rightData.splice(data, 1);
                }
            }
        }
    }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', {field: type})['value'];
    }

    private _selectLeftRow(data:any): void{
        this._selectedLeftData = data;
    }

    private _selectRightRow(data:any): void{
        this._selectedRightData = data;
    }

    private _onClickLeft(){
        this.leftData.push(this._selectedRightData);

        for(let i = 0; i < this.rightData.length; i++){
            if(this.rightData[i][this.key] === this._selectedRightData[this.key]){
                this.rightData.splice(i, 1);
                break;
            }
        }

        if(this.leftData.length > 0){
            this._isSelectedValid = true;
        }
        this._selectedRightData = null;
        this.selectionChange.emit(this.leftData);
    }

    private _onClickRight(){
        for(let i = 0; i < this.leftData.length; i++){
            if(this.leftData[i][this.key] === this._selectedLeftData[this.key]){
                this.leftData.splice(i, 1);
                this.rightData.push(this._selectedLeftData);
                break;
            }
        }
        this._selectedLeftData = null;
        this.selectionChange.emit(this.leftData);
    }

    isValid(){
        if(this.leftData.length === 0){
            this._isSelectedValid = false;
            return false;
        }else{
            this._isSelectedValid = true;
            return true;
        }
    }

//    onClickCacel(){
//         this.goGroupList();
//    }
//    goGroupList(){
//         let link = ['/user-group-list'];
//         this.router.navigate(link);
//    }
//    onClickSave(){

//         if(this.status=="create"){
//             this.userService.createGroup([this.data]).subscribe(
//                     (data) =>{
//                         alert("Create Success!");
//                         this.goGroupList();
//                     }

//                     , // put the data returned from the server in our variable
//                     error =>{
//                         console.log("Error HTTP GET Service");

//                     }, // in case of failure show this message
//                     () => console.log("Job Done Get !")//run this code in all cases
//                 );
//         }else if(this.status=="modify"){

//             this.userService.modifyGroup(this.data).subscribe(
//                     (data) =>{
//                          alert("Modify Success!");
//                         this.goGroupList();
//                     }

//                     , // put the data returned from the server in our variable
//                     error =>{
//                         console.log("Error HTTP GET Service");

//                     }, // in case of failure show this message
//                     () => console.log("Job Done Get !")//run this code in all cases
//                 );
//         }else if(this.status=="delete"){

//             this.userService.deleteGroup([this.data.groupId]).subscribe(
//                     (data) =>{
//                          alert("Delete Success!");
//                         this.goGroupList();
//                     }

//                     , // put the data returned from the server in our variable
//                     error => console.log("Error HTTP GET Service"), // in case of failure show this message
//                     () => console.log("Job Done Get !")//run this code in all cases
//                 );

//         }
//    }
}
