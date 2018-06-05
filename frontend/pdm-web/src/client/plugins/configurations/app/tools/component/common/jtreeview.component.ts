import {Component, Input,Output} from '@angular/core';
import {OnChanges,EventEmitter,ChangeDetectionStrategy } from '@angular/core';

declare var $:any;

@Component ({
 selector: 'jtree-view',
 template: `
    <div id='demo1_menu'></div>
`,
styles:[`
    li{
            list-style-type:none !important;
        }
    ul{
        padding-left:20px;
        }   
    .selectedNode{
        background: rgb(0, 104, 204);
        color: white;
    }
`]

})
export class JTreeViewComponent implements OnChanges{
   @Input() treeData: any[];
   @Output() clickNode = new EventEmitter(); 
   
   

   ngOnInit(){

 
        
   }
   ngOnChanges(changes): void {
       if(changes.treeData!=undefined && changes.treeData.currentValue!=undefined){
           this.setExpand(changes.treeData.currentValue);
           $('#demo1_menu').easytree({
                data:this.treeData,
                enableDnd: true,
                building: this.building,
                built: this.built,
                toggling: this.toggling,
                toggled: this.toggled,
                opening: this.opening,
                opened: this.opened,
                closing: this.closing,
                closed: this.closed,
                openLazyNode: this.openLazyNode,
                canDrop: this.canDrop,
                dropping:this. dropping,
                dropped: this.dropped,
                stateChanged: this.stateChanged
            });
       }
   }

    building(nodes) {
        console.log('Building Tree');
    }
     built(nodes) {
        console.log('Built Tree');
    }
     toggling(event, nodes, node) {
        console.log('Toggling ' + node.text + ' ' + (node.isExpanded ? 'is open' : 'is closed'));
    }
     toggled(event, nodes, node) {
        console.log('Toggled ' + node.text + ' ' + (node.isExpanded ? 'is now open' : 'is now closed'));
    }
     opening(event, nodes, node) {
        console.log('Opening ' + node.text);
    }
     opened(event, nodes, node) {
        console.log('Opened ' + node.text);
    }
     closing(event, nodes, node) {
        console.log('Closing ' + node.text);
    }
     closed(event, nodes, node) {
        console.log('Closed ' + node.text);
    }
     openLazyNode(event, nodes, node, hasChildren) {
        console.log('Opening Lazy Node ' + node.text);
    }
     canDrop(event, nodes, isSourceNode, source, isTargetNode, target) {
        console.log('CanDrop: ' + source.text + ' to ' + target.text);
    }
     dropping(event, _nodes, isSourceNode, source, isTargetNode, target, canDrop) {
        console.log('Dropping: ' + source.text);
    }
     dropped(event, nodes, isSourceNode, source, isTargetNode, target) {
        console.log('Dropped: ' + source.text + ' to ' + target.text);
    }
     stateChanged(nodes, nodesJson) {
        console.log('StateChanged');
        if(this.clickNode!=undefined)
            this.clickNode.emit(nodes);
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
           data[i]['text'] =data[i].name;
            if(data[i]['childLocations']!=undefined && data[i]['childLocations'].length>0){
                if(data[i]['expand']==undefined){
                    data[i]['expand'] = true;
                }
                data[i]['hasChild'] = true;
                data[i]['children'] = data[i]['childLocations'];
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