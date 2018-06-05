import { Component, DoCheck, ElementRef, Input, Output, ViewChild } from '@angular/core';
import {OnChanges,EventEmitter,ChangeDetectionStrategy } from '@angular/core';
import { TreeNodeComponent } from './treeview.node.component';



@Component ({
    moduleId:module.id,
    selector: 'tree-view',
    templateUrl: `treeview.component.html`,
    styleUrls:[`treeview.component.css`]
})
export class TreeViewComponent implements DoCheck, OnChanges{
   @Input() treeData: any[];
   @Input() options: any;
   @Output() clickNode = new EventEmitter(); 

   
   
   ngOnInit(){

   }
   ngOnChanges(changes): void {
       if(changes.treeData!=undefined && changes.treeData.currentValue!=undefined){
           this.setExpand(changes.treeData.currentValue);
       }
   }

   ngDoCheck(){
       if(this.treeData!=undefined ){
           this.setExpand(this.treeData);
       }
   }
   onSelectionChange(event){
       this.initSelected(this.treeData,event);
    //    this.selectionChange.emit(this.treeData);
       this.clickNode.emit(event);
   }

//    nodeClick(node){
//        this.initSelected(this.treeData,node);
//        this.selectionChange.emit(this.treeData);
//    }
   initSelected(datas,selectedNode){
       for(let i=0;i<datas.length;i++){
           let element = datas[i];
           if(element==selectedNode){
                element['selectedNode'] = true;    
           }else{
                element['selectedNode'] = false;    
           }

           this.initSelected(element.childLocations,selectedNode);
       }
       
   }
   setExpand(data){
       for(var i=0;i<data.length;i++){
            if(data[i]['childLocations']!=undefined && data[i]['childLocations'].length>0){
                if(data[i]['expand']==undefined){
                    data[i]['expand'] = true;
                }
                data[i]['hasChild'] = true;
                this.setExpand(data[i].childLocations);
            }else{
                data[i]['expand'] = false;
                data[i]['hasChild'] = false;
            }
       }
   }
   clickIcon(obj){
        obj.expand =!obj.expand; 
   }
}