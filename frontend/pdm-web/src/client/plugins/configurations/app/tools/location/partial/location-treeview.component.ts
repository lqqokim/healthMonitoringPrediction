import { Component, Input, Output, OnChanges, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToolModelService } from '../../../../../../common';

import * as wjGrid from 'wijmo/wijmo.angular2.grid';

import { TreeViewComponent } from '../../component/common/treeview.component';
// import { JTreeViewComponent } from '../../component/jtreeview.component';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'location-treeview',
    templateUrl: `location-treeview.html`,
    styleUrls: [`location-treeview.css`],
    providers: [ToolModelService]
})
export class LocationTreeviewComponent implements OnChanges {

    @Output() selectChange = new EventEmitter();
    @Input() 
    set selectedNode(n: any) {
        if (!n) {
            return;
        }
        this.externalSelected(n);
    }    

    treeData;
    selectedType;
    selectedItem: any = {};
    acitivationNode: any = {};
    isLastLocation = false;
    status: string;
    title;
    location: any;
    tool: any;
    module: any;

    currentAction = "";

    locationTypeMax;
    locationTypes;


    treeView: wjGrid.WjFlexGrid;

    lastLevelClicks = [];
    lastLevelCount = 0;

    options = {};

    expand: boolean = true;
    seachName: string = "";


    constructor(private eqpService: ToolModelService) { }


    ngOnInit() {
        // this.options['depthImageNames']=['img0','img1','img2','img3','img4','img5','img6'];
        this.getLocationData(false);
        this.getLocationType();
    }

    ngOnChanges() { }

    getLocationType() {
        let observable = this.eqpService.getLocationTypes().subscribe((locationTypes) => {
            this.locationTypes = locationTypes;
            this.locationTypeMax = locationTypes.reduce(function (previous, current) {
                return previous.locationLevel > current.locationLevel ? previous : current;
            });

        });
    }

    getNextLocationType(locationTypeId) {
        for (let i = 0; i < this.locationTypes.length; i++) {
            if (this.locationTypes[i].locationTypeId == locationTypeId) {
                return this.locationTypes[i + 1];
            }
        }
    }

    getLocationData(isRefresh) {
        this.eqpService.getLocations().subscribe((locations) => {

            this.treeData = [{ locationId: "-1", name: 'Root', locationTypeName: 'Root', childLocations: locations }];
            this.lastLevelCount = this.lastLevelClicks.length;
            this.lastLevelClicks.forEach(element => {
                this.getToolsByLocation(element);
            });

            if (isRefresh && (this.acitivationNode['locationId'] !== null || this.acitivationNode['name'] !== undefined)) {
                this.externalSelected(this.acitivationNode);
            } else {
                this.selectedRow(null, this.treeData[0]);
            }
        });
    }

    tempData;
    selectedRow(obj, event) {
        this.selectedItem['selectedNode'] = false;

        this.selectedItem = event;
        this.isLastLocation = false;
        this.treeView = obj;
        if (this.selectedItem.locationTypeId == this.locationTypeMax.locationTypeId) {
            this.isLastLocation = true;
            if (this.selectedItem['childLocations'] == undefined || this.selectedItem['childLocations'].length == 0) {
                this.lastLevelClicks.push(this.selectedItem);
                this.getToolsByLocation(this.selectedItem);
            }
        }
        this.selectedItem['expand'] = true;
        this.selectedItem['selectedNode'] = true;

        this.selectChange.emit(this.selectedItem);
    }

    getToolsByLocation(location) {
        this.eqpService.getLocationTools(location.locationId).subscribe((tools) => {

            let find = this.findData(this.treeData, location.name);
            if (find == null) return;
            var data = this.getReduceToolForTree(tools);
            find['childLocations'] = [];
            data.forEach(element => {
                find.childLocations.push(element);
            });
            this.lastLevelCount--;

            if (this.lastLevelCount <= 0) {
                this.lastLevelCount = 0;
                // setTimeout(() => {
                // this.treeData = this.tempData;
                // }, 1000);
            }
        });
    }

    findDataById(treeData, id) {
        if (treeData[0].locationId == id) return treeData;
        let find = this.findChildDataById(treeData[0].childLocations, id);
        return find;
    }

    findChildDataById(childData, id) {
        if (childData == undefined) return null;
        for (let i = 0; i < childData.length; i++) {
            if (childData[i].locationId == id) return childData[i];
            let find = this.findChildDataById(childData[i].childLocations, id);
            if (find != null) return find;
        }
        return null;
    }

    findData(treeData, name) {
        if (treeData[0].name == name) return treeData;
        let find = this.findChildData(treeData[0].childLocations, name);
        return find;
    }

    findChildData(childData, name) {
        if (childData == undefined) return null;
        for (let i = 0; i < childData.length; i++) {
            if (childData[i].name == name) return childData[i];
            let find = this.findChildData(childData[i].childLocations, name);
            if (find != null) return find;
        }
        return null;
    }

    getReduceToolForTree(tools) {
        if (tools == undefined) return null;
        let treeTools = [];
        for (let i = 0; i < tools.length; i++) {
            treeTools.push({ name: tools[i].name, locationTypeName: 'EQP', childLocations: this.getReduceModule(tools[i].modules), object: tools[i] });
        }
        return treeTools;
    }

    getReduceModule(modules) {
        if (modules == undefined) return null;
        let treeModules = [];
        for (let i = 0; i < modules.length; i++) {
            treeModules.push({ name: modules[i].name, locationTypeName: 'MODULE', childLocations: this.getReduceModule(modules[i].childModules), object: modules[i] })
        }
        return treeModules;
    }

    toggleExpand() {
        this.expand = !this.expand;
        this.setToggleExpand(this.treeData, this.expand);
    }

    externalSelected(node: any) {
        let data: any = null;
        let targetData: any = {};

        if (node.locationId == null) {
            data = this.findData(this.treeData, node.name);
        } else {
            data = this.findDataById(this.treeData, node.locationId);
        }
        
        if (data !== null) {
            if (data instanceof Array) {
                data = data[0];
            }

            if (data['path'] !== undefined) {
                let dataPath = data.path.substring(1).split('/');
                for (let i=0; i<=dataPath.length-1; i++) {
                    targetData = this.findData(this.treeData, dataPath[i]);
                    targetData.expand = true;
                }
            }
            this.treeData[0].expand = true;
            this.selectedRow(null, data);
        }
    }  

    setToggleDepthExpand(data: any, expand: boolean, depth: number) {
        this.findData(this.treeData, data.name);
        //this.data.expand = !this.expand;
        this.setToggleExpand(this.treeData, this.expand);
    }    

    setToggleExpand(data: any, expand: boolean) {
        if (data instanceof Array) {
            for (let i=0; i<=data.length; i++) {
                if (data[i]) {
                    data[i].expand = expand;
                    if (data[i].childLocations.length > 0) {
                        this.setToggleExpand(data[i].childLocations, expand);
                    }
                }
            }
        } else {
            data.expand = expand;
            if (data.childLocations.length > 0) {
                this.setToggleExpand(data.childLocations, expand);
            }            
        }
    }  

   
    // actionChange(event){
    //     $('#myModalModify').modal('hide');
    //     if(event.value!="cancel"){
    //        this.getLocationData();
    //     }
    // }
    // onClickNode(node){
    //      this.selectedItem =  node;
    //     this.isLastLocation = false;
    //     this.selectedType =this.selectedItem.locationTypeName;
    //     this.location = new Location();
    //     if( this.selectedItem.locationId!='Root'){
    //         this.location.locationId =  this.selectedItem.locationId;
    //         this.location.locationTypeId =  this.selectedItem.locationTypeId;
    //         this.location.name = this.selectedItem.name;
    //     }
    //     this.location.parentId =  this.selectedItem.parentId;
    //     if(this.selectedItem.locationTypeId == this.locationTypeMax.locationTypeId){
    //         this.isLastLocation = true;
    //         if(this.selectedItem['childLocations']==undefined || this.selectedItem['childLocations'].length==0){
    //             this.lastLevelClicks.push(this.selectedItem);
    //             this.getToolsByLocation(this.selectedItem);
    //         }

    //     }
    //     if(this.selectedItem.locationTypeName=="EQP"){
    //         this.tool = this.selectedItem;
    //     }

    // }

    refresh(node: any) {
        this.acitivationNode = node;
        this.getLocationData(true);
    }
}
