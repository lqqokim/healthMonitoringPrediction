
import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import { PdmModelService } from './../../../common/model/app/pdm/pdm-model.service';
import { ModelingTreeService } from './modeling-tree.service';
import { SpinnerComponent } from './../../../sdk';

import * as IMaster from './../../configurations/global/pdm/master-info/model/master-interface';

@Component({
    moduleId: module.id,
    selector: 'modeling-tree',
    templateUrl: './modeling-tree.html',
    styleUrls: ['./modeling-tree.css'],
    providers: [PdmModelService, ModelingTreeService]
})
export class ModelingTreeComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('tv') tv;
    @Output() nodeClick: EventEmitter<any> = new EventEmitter();
    @Output() nodeDataRes: EventEmitter<any> = new EventEmitter();
    @Input() fabId: IMaster.Fab['fabId'];

    selectedFabId: IMaster.Fab;
    selectedItem: IMaster.TreeEvent['treeview'];
    selectedEv: IMaster.TreeEvent;

    nodeType: string;
    initialTreeDatas: any;

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
        private pdmConfigService: ModelingTreeService,
        private pdmModelService: PdmModelService
    ) { }

    ngOnInit() {
        this._getPlants();
    }

    ngAfterViewInit() {

    }

    ngOnChanges(changes: any) {
        if (changes && changes.fabId && changes.fabId.currentValue) {
            this.selectedFabId = changes.fabId.currentValue;
            this._getInitTree();
        }
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
                if (eqpNode == null) {
                    this.selectNode({ treeview: areaNode }).then(() => {
                        this.setSelectNode(areaId, eqpId, paramId);
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
                this.selectedFabId = this.plants[0].fabId;
                this._getInitTree();
            }).catch((error: any) => {

            });
    }

    changeSelectedFab(ev: any): void {
        this.selectedFabId = ev;
        this._initConditions();
        this._getInitTree();
    }

    _getInitTree() {
        this.initialTreeDatas = [];
        this.pdmConfigService.getAreas(this.selectedFabId)
            .then((areas: any) => {
                this.nodeType = this.TYPES.AREA;
                this.setTreeDatas(areas, this.nodeType);
                this.areasTree = areas;

                // let tempTree = JSON.parse(JSON.stringify(this.areasTree)); // deep copy
                let tempTree = this.areasTree.slice(0);
                // this.setTreeDepth(tempTree);
                // this.initialTreeDatas = tempTree;
                let eqpDatas;
                this.pdmConfigService.getEqps(this.selectedFabId, areas[0].areaId)
                    .then((eqps: any) => {
                        if (eqps.length > 0) {
                            eqps.map((node: any) => {
                                node.nodeName = node.eqpName;
                                node.nodeId = node.eqpId;
                                node.nodeType = this.TYPES.EQP;
                                node.iconClass = this._getImagePath(node.nodeType);
                                node.children = [];
                                node.name = node.eqpName;
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

                        this.initialTreeDatas[0]['isOpen'] = true;
                        this.nodeDataRes.emit();
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

    selectNode(ev: IMaster.TreeEvent): Promise<any> {
        console.log('selectedItem => ', ev.treeview);
        // console.log('this item', this.selectedItem);
        if (this.selectedItem != null) {
            this.selectedItem.isChecked = false;
        }

        this.selectedItem = ev.treeview;
        this.selectedItem.isOpen = true;
        this.selectedEv = ev;
        this.selectedItem.isChecked = true;
        this.nodeClick.emit(ev);

        this.autoScroll();

        if (this.selectedItem.nodeType === this.TYPES.AREA || this.selectedItem.nodeType === this.TYPES.EQP) {
            // this.isChildLoaded = true;
            // this.selectedPath = ev.treeview.selectedPath.join(' > ');
            // let treeData = ev.treeview.itemsSource;
            // let node = this.searchTree('nodeId', treeData[0], this.selectedItem.nodeId);
            // const children = node.children;
            const children = this.selectedItem.children;

            if ((!children.length || this.selectedItem.isChildLoaded === undefined || this.selectedItem.isChildLoaded === false) && this.selectedItem.parentId !== 0) { // api call
                this.selectedItem.isChildLoaded = true;
                return this._getChildByType();
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
                        fabId: this.selectedFabId,
                        areaId: this.selectedItem.areaId
                    };

                    this.eqpData = {
                        eqps: eqps,
                        fabId: this.selectedFabId,
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
                        fabId: this.selectedFabId,
                        eqpId: this.selectedItem.eqpId,
                        eqpName: this.selectedItem.eqpName,
                    };
                }
            }
        }
        return Promise.resolve('');
    }

    _getChildByType(): Promise<any> {
        if (this.selectedItem.nodeType === this.TYPES.AREA) {
            return this._getAreas();
        } else if (this.selectedItem.nodeType === this.TYPES.EQP) {
            return this._getParams();
        }
        return Promise.resolve('');
    }

    _getAreas(): Promise<any> {
        const selectedNode: IMaster.Treeview = this.selectedItem;
        const nodeId: number = selectedNode.nodeId;
        const node: IMaster.Treeview = this.searchTree('nodeId', this.areasTree[0], nodeId);
        const nodeChildren: IMaster.Treeview[] = node.children.length > 0 ? node.children : [];

        this.areaData = {
            areas: nodeChildren,
            fabId: this.selectedFabId,
            areaId: this.selectedItem.areaId
        };

        return this._getEqps(nodeChildren);
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
                    tree[i].nodeType = this.nodeType;
                    tree[i].name = tree[i].areaName;
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
                            tree[i].children[j].nodeType = this.nodeType;
                            tree[i].children[j].iconClass = this._getImagePath(tree[i].children[j].nodeType);
                            tree[i].children[j].name = tree[i].children[j].areaName;
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

    _getEqps(areas?): Promise<any> {
        return this.pdmConfigService.getEqps(this.selectedFabId, this.selectedItem.areaId)
            .then((eqps: any) => {
                eqps.map((node: any) => {
                    node.nodeName = node.eqpName;
                    node.nodeId = node.eqpId;
                    node.nodeType = this.TYPES.EQP;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.children = [];
                    node.name = node.eqpName;
                    node.isChecked = false;
                    node.parentnode = this.selectedItem;
                });

                this.nodeType = this.TYPES.AREA;
                this.eqpData = {
                    eqps: eqps,
                    fabId: this.selectedFabId,
                    areaId: this.selectedItem.areaId,
                    areaName: this.selectedItem.areaName
                };

                if (areas) {
                    this.selectedItem.children = areas.concat(eqps);
                } else {
                    this.selectedItem.children = eqps;
                }
                return Promise.resolve('');
            }).catch((error: any) => {
                return Promise.reject(error);
            });
    }

    _getParams(): Promise<any> {
        return this.pdmConfigService.getParams(this.selectedFabId, this.selectedItem.eqpId)
            .then((params: any) => {
                params.map((node: any) => {
                    node.nodeName = node.paramName;
                    node.nodeId = node.paramId;
                    node.nodeType = this.TYPES.PARAMETER;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.name = node.paramName;
                    node.isChecked = false;
                    node.parentnode = this.selectedItem;
                });

                this.nodeType = this.TYPES.EQP;
                this.paramData = {
                    params: params,
                    fabId: this.selectedFabId,
                    eqpId: this.selectedItem.eqpId,
                    eqpName: this.selectedItem.eqpName
                };

                // this._getParts(params);
                this.selectedItem.children = params;
            }).catch((error: any) => {

            });
    }

    _getParts(params?): void {
        this.pdmConfigService.getParts(this.selectedFabId, this.selectedItem.eqpId)
            .then((parts: any[]) => {
                parts.map((node: any) => {
                    node.nodeName = node.name;
                    node.nodeId = node.partId;
                    node.nodeType = this.TYPES.PART;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.name = node.name;
                    node.isChecked = false;
                    node.parentnode = this.selectedItem;
                });

                this.nodeType = this.TYPES.EQP;
                this.partData = {
                    parts: parts,
                    fabId: this.selectedFabId,
                    eqpId: this.selectedItem.eqpId,
                    eqpName: this.selectedItem.eqpName
                };

                this.selectedItem.children = params.concat(parts);
            }).catch((error: any) => {

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
        this.selectedItem = undefined;
        this.areaData = undefined;
        this.eqpData = undefined;
        this.paramData = undefined;
        this.partData = undefined;
    }
}