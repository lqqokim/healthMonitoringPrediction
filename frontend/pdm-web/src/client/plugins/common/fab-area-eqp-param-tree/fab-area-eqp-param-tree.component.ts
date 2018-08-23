
import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import { CheckTreeComponent } from './check-tree/check-tree.component';

import { PdmModelService } from './../../../common/model/app/pdm/pdm-model.service';
import { FabAreaEqpParamTreeService } from './fab-area-eqp-param-tree.service';
import { SpinnerComponent } from './../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'fab-area-eqp-param-tree',
    templateUrl: './fab-area-eqp-param-tree.html',
    styleUrls: ['./fab-area-eqp-param-tree.css'],
    providers: [PdmModelService, FabAreaEqpParamTreeService]
})
export class FabAreaEqpParamTreeComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('tv') tv;
    @Input() singleSelect = false;
    @Output() nodeClick: EventEmitter<any> = new EventEmitter();
    @Output() changeParamSelection: EventEmitter<any> = new EventEmitter();
    @Input() fab: any;

    public selectedFab: any;
    selectedPath: any;
    selectedItem: any;
    selectedNode: any;
    selectedEv: any;

    nodeType: string;
    initialTreeDatas: any;
    childDatas: any;

    tempTree: any;
    areasTree: any;
    areaData: any;
    eqpData: any;
    paramData: any;
    partData: any;
    plants: any;
    isChildLoaded: boolean = false;

    autoscroll = false;

    readonly TYPES: any = { FAB: 'fab', AREA: 'area', EQP: 'eqp', PARAMETER: 'parameter', PART: 'part' };

    constructor(
        private pdmConfigService: FabAreaEqpParamTreeService,
        private pdmModelService: PdmModelService
    ) {

    }

    ngOnInit() {
        this._getPlants();
    }
    ngAfterViewInit() {
    }
    ngOnChanges(changes: any) {
        if (changes && changes.fab && changes.fab.currentValue) {
            this.selectedFab = changes.fab.currentValue;
        }
    }
    public getSelectedNodes(){

        return this.getSelectedNodeList( this.initialTreeDatas[0]);

    }
    private getSelectedNodeList(node){
        let selectedItems = [];
        if(node.children==null){
            return selectedItems;
        }
        for(let i=0;i<node.children.length;i++){
            if(node.children[i].isChecked){
                selectedItems.push(node.children[i]);
            }
            let retval = this.getSelectedNodeList(node.children[i]);
            if(retval.length>0){
                selectedItems = selectedItems.concat(retval);
            }
        }
        return selectedItems;
    }
    public setSelectNode(areaId, eqpId, paramId) {
        this.autoscroll = true;
        let areaNode: any;
        if (this.initialTreeDatas) {
            areaNode = this.findNode(this.initialTreeDatas[0], areaId);
        }

        if (areaNode != null) {
            if (areaNode.children && areaNode.children.length > 0) {
                let eqpNode = this.findNode(areaNode, eqpId);
                if(eqpNode==null){
                    this.selectNode({ treeview: areaNode }).then(()=>{
                        this.setSelectNode(areaId,eqpId,paramId);
                    });
                    return 
                }
                if (paramId != '' && paramId != null) {
                    if (eqpNode.children && eqpNode.children.length > 0) {
                        let paramNode = this.findNode(eqpNode, paramId);
                        if (paramNode != null) {
                            this.selectNode({ treeview: paramNode });
                            // paramNode.isChecked = true;
                        }
                    } else {
                        this.selectNode({ treeview: eqpNode }).then(() => {
                            let paramNode = this.findNode(eqpNode, paramId);
                            if (paramNode != null) {
                                this.selectNode({ treeview: paramNode });
                                // paramNode.isChecked = true;
                            }
                        })
                    }
                } else {
                    if (eqpNode != null) {
                        this.selectNode({ treeview: eqpNode });
                        // eqpNode.isChecked = true;
                    }
                }
            } else {
                this.selectNode({ treeview: areaNode }).then(() => {
                    let eqpNode = this.findNode(areaNode, eqpId);
                    if (paramId != '' && paramId != null) {
                        if (eqpNode.children && eqpNode.children.length > 0) {
                            let paramNode = this.findNode(eqpNode, paramId);
                            if (paramNode != null) {
                                this.selectNode({ treeview: paramNode });
                                // paramNode.isChecked = true;
                            }
                        } else {
                            this.selectNode({ treeview: eqpNode }).then(() => {
                                let paramNode = this.findNode(eqpNode, paramId);
                                if (paramNode != null) {
                                    this.selectNode({ treeview: paramNode });
                                    // paramNode.isChecked = true;
                                }
                            })
                        }
                    } else {
                        if (eqpNode != null) {
                            this.selectNode({ treeview: eqpNode });
                            // eqpNode.isChecked = true;
                        }
                    }
                })
            }
        }
    }
    findNode(node, value) {
        if (node.children == undefined) {
            return null;
        }
        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].nodeId == value) {
                return node.children[i];
            } else {
                let result = this.findNode(node.children[i], value);
                if (result != null) {
                    return result;
                }
            }
        }
        return null;
    }
    _getPlants(): void {
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.plants = plants;
                this.selectedFab = this.plants[0];
                this._getInitTree();
            }).catch((error: any) => {

            });
    }

    changeSelectedFab(ev: any): void {
        this.selectedFab = ev;
        this._initConditions();
        this._getInitTree();
    }

    _getInitTree() {
        this.pdmConfigService.getAreas(this.selectedFab.fabId)
            .then((areas: any) => {
                this.nodeType = this.TYPES.AREA;
                this.setTreeDatas(areas, this.nodeType);
                this.areasTree = areas;

                // let tempTree = JSON.parse(JSON.stringify(this.areasTree)); // deep copy
                let tempTree = this.areasTree.slice(0);
                // this.setTreeDepth(tempTree);
                // this.initialTreeDatas = tempTree;
                let eqpDatas;
                this.pdmConfigService.getEqps(this.selectedFab.fabId, areas[0].areaId)
                    .then((eqps: any) => {
                        if (eqps.length > 0) {
                            eqps.map((node: any) => {
                                node.nodeName = node.eqpName;
                                node.nodeId = node.eqpId;
                                node.id =areas[0].areaId+":"+ node.eqpId;
                                node.nodeType = this.TYPES.EQP;
                                node.iconClass = this._getImagePath(node.nodeType);
                                node.children = [];
                                node.name = node.eqpName;
                                node.value = node.eqpName;
                                node.parentnode = tempTree[0];
                            });

                            return eqps;
                        } else {
                            return null;
                        }
                    }).then((eqps) => {
                        if (eqps !== null) {
                            tempTree[0].children = tempTree[0].children.concat(eqps);
                            tempTree[0].isOpen = true;
                            this.initialTreeDatas = tempTree;
                        } else {
                            this.initialTreeDatas = tempTree;
                        }
                    });
            }).catch((error: any) => {

            });
    }
    autoScroll(){
        if(this.autoscroll){
            try{
                
                setTimeout(() => {
                    let itemTop = $('.ngtree_node_name:contains("'+this.selectedItem.eqpName+'")').offset().top;
                    console.log('********************'+itemTop);
                    $('tree .container').animate({ scrollTop: $('tree .container').scrollTop()+itemTop -300 }, 500);
                    this.autoscroll = false;
                    this.autoScroll();
                }, 1000);
    
            }catch(err){
                console.log(err);
            }
    
        }

    }
    clearCheck(node,excludeId){
        node.isChecked = false;
        if(node.children==null) return;
        for(let i=0;i<node.children.length;i++){
            if(node.children[i].id!=excludeId){
                node.children[i].isChecked = false;
                this.clearCheck(node.children[i],excludeId);
            }
        }
    }
    changeChecked(node,isChecked){
        if(node.children==null) return;
        for(let i=0;i<node.children.length;i++){
            node.children[i].isChecked = isChecked;
            this.changeChecked(node.children[i],isChecked);
        }
    }
    selectNode(ev: any): Promise<any> {
        // if (this.selectedItem != null) {
        //     this.selectedItem.isChecked = false;
        // }
        this.selectedItem = ev.treeview;
        this.selectedItem.isOpen = true;
        this.selectedEv = ev;
        if(ev.type=="node"){
            if(this.selectedItem.nodeType=="eqp" || this.selectedItem.nodeType=="parameter"){
                this.selectedItem.isChecked = !this.selectedItem.isChecked;
                if(this.selectedItem.isChecked){
                    if(this.selectedItem.nodeType=="parameter" && !this.singleSelect){
                        this.clearCheck(this.tv.getRootNode(),this.selectedItem.parentnode.id);
                    }else{
                        this.clearCheck(this.tv.getRootNode(),this.selectedItem.id);
                    }
                    
                }
                this.changeChecked(this.selectedItem,this.selectedItem.isChecked);
            }
            this.changeParamSelection.emit([this.selectedItem]);
        }
       
        // this.selectedNode = ev.treeview.selectedNode;
        this.nodeClick.emit(ev);
        

        this.autoScroll();

        if (this.selectedItem.nodeType === this.TYPES.AREA || this.selectedItem.nodeType === this.TYPES.EQP) {
            // this.isChildLoaded = true;
            // this.selectedPath = ev.treeview.selectedPath.join(' > ');
            // let treeData = ev.treeview.itemsSource;
            // let node = this.searchTree('nodeId', treeData[0], this.selectedItem.nodeId);
            // const children = node.children;
            const children = this.selectedItem.children;

            if (!children.length || this.selectedItem.isChildLoaded == undefined || this.selectedItem.isChildLoaded == false) { // api call
                this.selectedItem.isChildLoaded = true;
                return this._getChildByType(this.selectedItem.isChecked);
            } else { // exist data
                if (this.selectedItem.nodeType === this.TYPES.AREA) {
                    this.nodeType = this.TYPES.AREA;
                    let areas = [];
                    let eqps = [];

                    for (let i = 0; i < children.length; i++) {
                        if (children[i].nodeType === 'area') {
                            areas.push(children[i]);
                        } else if (children[i].nodeType === 'eqp') {
                            eqps.push(children[i]);
                        }
                    }

                    this.areaData = {
                        areas: areas,
                        fabId: this.selectedFab.fabId,
                        areaId: this.selectedItem.areaId
                    };

                    this.eqpData = {
                        eqps: eqps,
                        fabId: this.selectedFab.fabId,
                        areaId: this.selectedItem.areaId,
                        areaName: this.selectedItem.areaName
                    };
                } else if (this.selectedItem.nodeType === this.TYPES.EQP) {
                    this.nodeType = this.TYPES.EQP;
                    let params = [];
                    let parts = [];

                    for (let i = 0; i < children.length; i++) {
                        if (children[i].nodeType === "parameter") {
                            params.push(children[i]);
                        }
                        // else if (children[i].nodeType === "part") {
                        //     parts.push(children[i]);
                        // }
                    }


                    // this.partData = {
                    //     parts: parts,
                    //     fabId: this.selectedFab.fabId,
                    //     eqpId: this.selectedItem.eqpId,
                    //     eqpName: this.selectedItem.eqpName,
                    // };
                    this.paramData = {
                        params: params,
                        fabId: this.selectedFab.fabId,
                        eqpId: this.selectedItem.eqpId,
                        eqpName: this.selectedItem.eqpName,
                    };
                }
            }
        }
        return Promise.resolve('');
    }

    _getChildByType(isChecked): Promise<any> {
        if (this.selectedItem.nodeType === this.TYPES.AREA) {
            // if (this.selectedNode.level === 3) {
            this.areaData = undefined;
            return this._getAreas(isChecked);
            // this._getEqps();
            // } else {
            //     this._getAreas();
            // }
        } else if (this.selectedItem.nodeType === this.TYPES.EQP) {
            return this._getParams(isChecked);
        }
        return Promise.resolve('');
    }

    _getAreas(isChecked): Promise<any> {
        // const selectedNodeId: number = this.selectedItem.nodeId;
        // const selectedNode: any = this.searchTree('nodeId', this.areasTree[0], selectedNodeId);
        // const selectedChildren = selectedNode.children;
        // const nodeChildren = JSON.parse(JSON.stringify(selectedChildren));
        const nodeChildren = this.selectedItem.children;

        for (let i = 0; i < nodeChildren.length; i++) {
            if (nodeChildren[i].children !== undefined && nodeChildren[i].children.length > 0) {
                nodeChildren[i].children = [];
            }
        }

        this.areaData = {
            areas: nodeChildren,
            fabId: this.selectedFab.fabId,
            areaId: this.selectedItem.areaId
        };

        return this._getEqps(isChecked,nodeChildren);
    }

    searchTree(field, data, value): any { // Search data about nodeId
        if (data[field] === value) {
            return data;
        }
        if (data.children && data.children.length > 0) {
            for (let i = 0; i < data.children.length; i++) {
                const node = this.searchTree(field, data.children[i], value);
                if (node !== null) {
                    return node;
                }
            }
        }
        return null;
    }

    setTreeDepth(areasTree): void {
        for (let i = 0; i < areasTree.length; i++) {
            if (areasTree[i].children !== undefined && areasTree[i].children.length > 0) {
                areasTree[i].isOpen = true;
                for (let j = 0; j < areasTree[i].children.length; j++) {
                    if (areasTree[i].children[j].children !== undefined && areasTree[i].children[j].children.length > 0) {
                        areasTree[i].children[j].children = [];
                    }
                }
            }
        }
    }
    // setTreeDepth(areasTree): void {
    //     for (let i = 0; i < areasTree.length; i++) {
    //         if (areasTree[i].children !== undefined && areasTree[i].children.length > 0) {
    //             areasTree[i].isOpen = true;
    //             this.setTreeDepth(areasTree[i].children);
    //         }
    //     }
    // }
    setTreeDatas(tree: any, type?: string, datas?: any): void {
        if (tree.length > 0) {
            if (this.nodeType === this.TYPES.AREA) { // area
                for (let i = 0; i < tree.length; i++) {
                    tree[i].nodeName = tree[i].areaName;
                    tree[i].nodeId = tree[i].areaId;
                    tree[i].id = tree[i].areaId;
                    tree[i].nodeType = this.nodeType;
                    tree[i].name = tree[i].areaName;
                    tree[i].value = tree[i].areaName;
                    tree[i].isChecked = false;

                    if (tree[i].parentId === 0) {
                        tree[i].iconClass = this._getImagePath(this.TYPES.FAB);
                    } else {
                        tree[i].iconClass = this._getImagePath(tree[i].nodeType);
                    }

                    if (tree[i].children !== undefined && tree[i].children.length > 0) {
                        for (let j = 0; j < tree[i].children.length; j++) {
                            tree[i].children[j].nodeName = tree[i].children[j].areaName;
                            tree[i].children[j].nodeId = tree[i].children[j].areaId;
                            tree[i].children[j].id = tree[i].children[j].areaId;
                            tree[i].children[j].nodeType = this.nodeType;
                            tree[i].children[j].iconClass = this._getImagePath(tree[i].children[j].nodeType);
                            tree[i].children[j].name = tree[i].children[j].areaName;
                            tree[i].children[j].value = tree[i].children[j].areaName;
                            tree[i].children[j].isChecked = false;
                            tree[i].children[j].parentnode = tree[i];
                        }

                        this.setTreeDatas(tree[i].children, this.nodeType);
                    }
                }
            }
            // else if (this.nodeType === this.TYPES.EQP) { // eqp
            //     for (let i = 0; i < tree.length; i++) {
            //         if (tree[i].nodeId === this.selectedItem.nodeId) {
            //             for (let j = 0; j < datas.length; j++) {
            //                 tree[i].children.push(datas[j]);
            //             }
            //             break;
            //         }
            //         this.setTreeDatas(tree[i].children, this.nodeType, datas);
            //     }
            // } else {
            //     for (let i = 0; i < tree.length; i++) {
            //         tree[i].nodeName = tree[i].areaName;
            //         tree[i].nodeId = tree[i].areaId;
            //         tree[i].nodeType = this.nodeType;
            //         tree[i].iconClass = this._getImagePath(tree[i].nodeType);
            //         if (tree[i].children !== undefined && tree[i].children.length > 0) {
            //             for (let j = 0; j < tree[i].children.length; j++) {
            //                 tree[i].children[j].nodeName = tree[i].children[j].areaName;
            //                 tree[i].children[j].nodeId = tree[i].children[j].areaId;
            //                 tree[i].children[j].nodeType = this.nodeType;
            //                 tree[i].children[j].iconClass = this._getImagePath(tree[i].children[j].nodeType);
            //             }

            //             this.setTreeDatas(tree[i].children, this.nodeType);
            //         }
            //     }
            // }
        }
    }

    _getEqps(isChecked,areas?): Promise<any> {
        return this.pdmConfigService.getEqps(this.selectedFab.fabId, this.selectedItem.areaId)
            .then((eqps: any) => {
                eqps.map((node: any) => {
                    node.nodeName = node.eqpName;
                    node.nodeId = node.eqpId;
                    node.id = this.selectedItem.areaId+":"+node.eqpId;
                    node.nodeType = this.TYPES.EQP;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.children = [];
                    node.name = node.eqpName;
                    node.value = node.eqpName;
                    node.isChecked = isChecked;
                    node.parentnode = this.selectedItem;
                });

                this.nodeType = this.TYPES.AREA;
                this.eqpData = {
                    eqps: eqps,
                    fabId: this.selectedFab.fabId,
                    areaId: this.selectedItem.areaId,
                    areaName: this.selectedItem.areaName
                };

                if (areas) {
                    this.childDatas = areas.concat(eqps);
                    this.selectedItem.children = areas.concat(eqps);
                } else {
                    this.childDatas = eqps;
                    this.selectedItem.children = eqps;
                }
                return Promise.resolve('');
            }).catch((error: any) => {
                return Promise.reject(error);
            });
    }

    _getParams(isChecked): Promise<any> {
        return this.pdmConfigService.getParams(this.selectedFab.fabId, this.selectedItem.eqpId)
            .then((params: any) => {
                params.map((node: any) => {
                    node.nodeName = node.paramName;
                    node.nodeId = node.paramId;
                    node.id = this.selectedItem.id +":"+  node.paramId;
                    node.nodeType = this.TYPES.PARAMETER;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.name = node.paramName;
                    node.value = node.paramName;
                    node.isChecked = isChecked;
                    node.parentnode = this.selectedItem;
                });

                this.nodeType = this.TYPES.EQP;
                this.paramData = {
                    params: params,
                    fabId: this.selectedFab.fabId,
                    eqpId: this.selectedItem.eqpId,
                    eqpName: this.selectedItem.eqpName
                };

                // this._getParts(params);
                this.selectedItem.children = params;

                this.changeParamSelection.emit(params);
            }).catch((error: any) => {

            });
    }

    _getParts(params?): void {
        this.pdmConfigService.getParts(this.selectedFab.fabId, this.selectedItem.eqpId)
            .then((parts: any[]) => {
                parts.map((node: any) => {
                    node.nodeName = node.name;
                    node.nodeId = node.partId;
                    node.id = this.selectedItem.id+":"+ node.partId;
                    node.nodeType = this.TYPES.PART;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.name = node.name;
                    node.value = node.name;
                    node.isChecked = false;
                    node.parentnode = this.selectedItem;
                });

                this.nodeType = this.TYPES.EQP;
                this.partData = {
                    parts: parts,
                    fabId: this.selectedFab.fabId,
                    eqpId: this.selectedItem.eqpId,
                    eqpName: this.selectedItem.eqpName
                };

                this.childDatas = params.concat(parts);
                this.selectedItem.children = params.concat(parts);
                // this._getSpeedParam();
            }).catch((error: any) => {

            });
    }

    _getSpeedParam(): void {
        this.pdmConfigService.getSpeedParam(this.selectedFab.fabId, this.selectedItem.eqpId)
            .then((speedParam: any) => {

            }).catch((err: any) => {

            });
    }

    initWjTree(ev: any): void {
        this.autoscroll = false;
        // this.selectedItem = undefined;
        // this._getInitTree();
        // this.selectedEv.treeview.children=[];
        this.selectedEv.treeview.isChildLoaded = false;
        this.selectNode(this.selectedEv);
    }

    startLoading(ev: any): void {
        if (ev.start) {
            this.isChildLoaded = true;
            this.componentSpinner.showSpinner();
        }
    }

    endLoading(ev: any): void {
        if (ev.end) {
            this.isChildLoaded = true;
            this.componentSpinner.hideSpinner();
        }
    }

    private _getImagePath(type: string): string {
        //return `assets/images/pdm-master-${type}.png`;
        return `${type}_icon`;
    }

    private _initConditions(): void {
        this.selectedPath = undefined;
        this.selectedItem = undefined;
        this.selectedNode = undefined;
        this.areaData = undefined;
        this.eqpData = undefined;
        this.paramData = undefined;
        this.partData = undefined;
    }
}