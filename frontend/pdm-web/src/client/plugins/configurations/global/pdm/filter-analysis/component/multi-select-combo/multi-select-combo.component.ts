
import { SearchComboPipe } from '../pipes/search.pipe';
import { Component,ViewChild,ElementRef,OnInit,EventEmitter,Output, Input, OnChanges,DoCheck } from '@angular/core';
import { Observable }     from 'rxjs/Observable';

@Component({
  moduleId:module.id,
  selector: 'multi-select-combo',
  templateUrl: `multi-select-combo.component.html`,
  styleUrls: [`multi-select-combo.component.css`]
})
export class MultiSelectComboComponent implements OnInit, OnChanges,DoCheck{

    @ViewChild('dropdownToggleElem') dropdownElem: ElementRef;
    @ViewChild('searchTerm') searchTerm: ElementRef;
    // input 
    @Input() datas: Array<any>;
    @Input() displayName: string = '';
    // @Input() includeAll?: boolean;
    @Input() selectedItems:Array<any>;
    //output
    @Output() changeData: EventEmitter<any> = new EventEmitter();
    @Output() dropdownOpen: EventEmitter<any> = new EventEmitter(); 

    // class private value
    private selectDatas: string ='';
    private selectedDataLength: number = 0;
    
    private searchPipe = new SearchComboPipe();
    private filterdDatas: Array<any>;
    private allCheckStatus: boolean = false;
    private selectedOriginalData: Array<any[]> = [];
    private selectedOriginalDataString:String;
    constructor(){}

    ngOnInit(){ 
        $(this.dropdownElem.nativeElement).on('hide.bs.dropdown', ()=>{
            if(this.selectedOriginalDataString!=this.selectDatas||this.selectDatas.length==0){
                // this.changeData.emit(this.selectedOriginalData);
                // this.selectedOriginalDataString = this.selectDatas;
                this.dropdownClose();
            }
        });
    }

    ngOnChanges() {
        
        this.selectDatas = ''; // for remove displayed data in combo box
        this.selectecItemAction();
        this.filterdDatas = this.datas;
        this.dropdownClose();
        // this.changeData.emit(this.selectedOriginalData);
        if(this.selectedOriginalData.length==0){
            this.allCheckStatus = false;
            this.searchTerm.nativeElement.value="";
        }
    }
    ngDoCheck(){
    //    this.selectecItemAction();
//        console.log(this.displayName+":"+this.selectedItems.length);
    }
    selectecItemAction(){
        if(this.selectedItems != null){
            if(this.datas !=null){
                let orgData = {};
                for(let i=0;i<this.datas.length;i++){
                  orgData[this.datas[i][this.displayName]] = this.datas[i];
                }

                for(let i=0;i<this.selectedItems.length;i++){
                  let dName = this.selectedItems[i][this.displayName];
                  if(orgData[dName]!=undefined){
                    orgData[dName]['checked'] = true;
                  }
                }
                this.updateCheckedProcess("",false);  //all인경우 나중에 
            }
		    // this.selectedDataLength = this.selectedItems.length;
        }else{
            this.selectedOriginalData =[];
            this.selectedOriginalDataString="";
            this.selectedDataLength =0;
        }

    }
    updateChecked(selectObject,event){
        selectObject.checked = event.target.checked;
        this.selectDatas='';
        this.allCheckStatus = this._allcheckToggleStatus(this.filterdDatas);
        this.updateCheckedProcess(selectObject[this.displayName],selectObject.checked);
    }

    updateCheckedToggle(event: any) : void {
        this.allCheckStatus = this._allcheckToggleStatus(this.filterdDatas);
        // allCheckStatus false -> all datas checked true setting
        // allCheckStatus true -> all datas checked false setting
        for(let i=0; i<this.filterdDatas.length; i++) {
            this.filterdDatas[i].checked = !this.allCheckStatus;
            this.updateCheckedProcess(this.filterdDatas[i].displayName, this.filterdDatas[i].checked );
        }
        this.allCheckStatus = !this.allCheckStatus;
    }

    updateCheckedToggle_allBtn(e): void {
        e.stopPropagation();
        if( e.target.tagName.toLowerCase() != 'button' ){ return; }

        this.updateCheckedToggle(e);
        $(e.target).attr('chkbox', (this.allCheckStatus ? 'checked': '') );
    }

    updateCheckedProcess(displayName,selectedObjectChecked){
        this.selectedOriginalData = [];
        this.selectDatas='';
        for(let i=0;i<this.datas.length;i++){
            if(this.datas[i].checked){
                this.selectDatas+=','+ this.datas[i][this.displayName];
                this.selectedOriginalData.push(this.datas[i]);
            }
        }
        
        if(this.selectDatas.length>0) {
          this.selectDatas = this.selectDatas.substr(1);
        }

        this.selectedDataLength = this.selectedOriginalData.length;
        
    }

    dropdownClose(){
        if(this.selectDatas != this.selectedOriginalDataString){
            this.changeData.emit(this.selectedOriginalData);
            this.selectedOriginalDataString = this.selectDatas;
        }
        
        
    }
    dropdownToggle(): void {
        // dropdown not opened class = "dropdown" , dropdown opened class = "dropdown open" 
        let dropdownStatus = this.dropdownElem.nativeElement.className;
        if (dropdownStatus.indexOf('open') === -1 ) {
            // emit open event
            this.dropdownOpen.emit();    
        }
    }

    searchTermEvent(term: string): void {
        this.filterdDatas = this.searchPipe.transform(this.datas, {term: term,naming:this.displayName});
        this.allCheckStatus = this._allcheckToggleStatus(this.filterdDatas);
    }

    private _allcheckToggleStatus(datas: Array<any>): boolean {
        if (datas.length === 0) {
            return false;
        }
        for(let i=0; i<datas.length; i++) {
            // something not checked
            if(datas[i].checked === undefined || datas[i].checked === false) {
                return false;
            }
        }
        // all checked
        return true;
    }
}
