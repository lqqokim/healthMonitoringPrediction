
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { WjTreeComponent } from './tree/wj-tree.component';

import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../model/pdm-config.service';
import { SpinnerComponent } from './../../../../../sdk';

import * as IEqp from './partial/eqp/model/eqp-interface';

@Component({
    moduleId: module.id,
    selector: 'master-info',
    templateUrl: './master-info.html',
    styleUrls: ['./master-info.css'],
    providers: [PdmModelService, PdmConfigService]
})
export class MasterInfoComponent implements OnInit, AfterViewInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('tv') tv;

    selectedFab: any;
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

    areaList: any[];
    isLoading: boolean = false;
    isShowArea: boolean = true;
    parentNode;

    readonly TYPES: any = { FAB: 'fab', AREA: 'area', EQP: 'eqp', PARAMETER: 'parameter', PART: 'part' };

    constructor(
        private pdmConfigService: PdmConfigService,
        private pdmModelService: PdmModelService
    ) {

    }

    ngOnInit() {
        this._getPlants();
    }

    ngAfterViewInit() {
        this.isLoading = true;
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
        this.isLoading = true;
        this.selectedFab = ev;
        this._initConditions();
        this._getInitTree();
    }

    _getInitTree() {
        this.initialTreeDatas = [];
        this.pdmConfigService.getAreas(this.selectedFab.fabId)
            .then((areas: any) => {
                this.areaList = areas;
                this.nodeType = this.TYPES.AREA;
                this.setTreeDatas(areas, this.nodeType);
                this.areasTree = areas;

                let tempTree = JSON.parse(JSON.stringify(this.areasTree)); // deep copy
                // this.setTreeDepth(tempTree);
                // this.initialTreeDatas = tempTree;
                let eqpDatas;
                this.pdmConfigService.getEqps(this.selectedFab.fabId, areas[0].areaId)
                    .then((eqps: any) => {
                        if (eqps.length > 0) {
                            eqps.map((node: any) => {
                                node.nodeName = node.eqpName;
                                node.name = node.eqpName;
                                node.nodeId = node.eqpId;
                                node.nodeType = this.TYPES.EQP;
                                node.iconClass = this._getImagePath(node.nodeType);
                                node.children = [];
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

                        this.initialTreeDatas[0].isOpen = true;
                    });

                this.isLoading = false;
            }).catch((error: any) => {
                this.isLoading = false;
            });
    }

    selectNode(ev: any): void {
        try {
            console.log('selectNode', ev);
            const nodeType = ev.treeview.nodeType;

            if (nodeType === this.TYPES.AREA || nodeType === this.TYPES.EQP) {
                if (!this.isShowArea) {
                    this.isShowArea = true;
                }

                this.selectedItem = ev.treeview;
                this.selectedItem.isOpen = true;
                this.selectedEv = ev;
                this.isLoading = true;

                const children: any[] = this.selectedItem.children;

                if (nodeType === this.TYPES.AREA && this.selectedItem.parentId !== 0) {
                    let parentNode = this.searchTree('nodeId', this.initialTreeDatas[0], this.selectedItem.parentId);
                    this.parentNode = parentNode;

                    if (parentNode && parentNode.nodeType === this.TYPES.AREA && parentNode.parentId !== 0) {
                        this.isShowArea = false;
                    }
                }

                if ((!children.length || this.selectedItem.isChildLoaded === undefined || this.selectedItem.isChildLoaded === false) && this.selectedItem.parentId !== 0) { // api call
                    this.selectedItem.isChildLoaded = true;
                    this._getChildByType();
                } else if (children.length > 0 || this.selectedItem.parentId === 0) { // exist data
                    if (nodeType === this.TYPES.AREA) {
                        this.nodeType = this.TYPES.AREA;
                        let areas = [];
                        let eqps = [];

                        for (let i = 0; i < children.length; i++) {
                            if (children[i].nodeType === this.TYPES.AREA) {
                                areas.push(children[i]);
                            } else if (children[i].nodeType === this.TYPES.EQP) {
                                eqps.push(children[i]);
                            }
                        }

                        if (this.isShowArea) {
                            this.areaData = {
                                areas: areas,
                                areaList: this.areaList,
                                fabId: this.selectedFab.fabId,
                                areaId: this.selectedItem.areaId
                            };
                        }

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
                            if (children[i].nodeType === this.TYPES.PARAMETER) {
                                params.push(children[i]);
                            } else if (children[i].nodeType === this.TYPES.PART) {
                                parts.push(children[i]);
                            }
                        }

                        this.partData = {
                            parts: parts,
                            fabId: this.selectedFab.fabId,
                            eqpId: this.selectedItem.eqpId,
                            eqpName: this.selectedItem.eqpName,
                        };
                        this.paramData = {
                            params: params,
                            fabId: this.selectedFab.fabId,
                            eqpId: this.selectedItem.eqpId,
                            eqpName: this.selectedItem.eqpName,
                        };
                    }

                    this.isLoading = false;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    _getChildByType(): void {
        if (this.selectedItem.nodeType === this.TYPES.AREA) {
            if (!this.isShowArea) { //for Area 3depth
                this.areaData = undefined;
                this._getEqps();
            } else {
                this._getAreas();
            }
        } else if (this.selectedItem.nodeType === this.TYPES.EQP) {
            this._getParams();
        }
    }

    _getAreas(): void {
        const nodeChildren: any[] = this.selectedItem.children;

        for (let i = 0; i < nodeChildren.length; i++) {
            if (nodeChildren[i].children !== undefined && nodeChildren[i].children.length > 0) {
                nodeChildren[i].children = [];
            }
        }

        this.areaData = {
            areas: nodeChildren,
            areaList: this.areaList,
            fabId: this.selectedFab.fabId,
            areaId: this.selectedItem.areaId
        };

        this._getEqps(nodeChildren);
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

    // setTreeDepth(areasTree): void {
    //     for (let i = 0; i < areasTree.length; i++) {
    //         if (areasTree[i].children !== undefined && areasTree[i].children.length > 0) {
    //             for (let j = 0; j < areasTree[i].children.length; j++) {
    //                 if (areasTree[i].children[j].children !== undefined && areasTree[i].children[j].children.length > 0) {
    //                     areasTree[i].children[j].children = [];
    //                 }
    //             }
    //         }
    //     }
    // }
    setTreeDepth(areasTree): void {
        for (let i = 0; i < areasTree.length; i++) {
            if (areasTree[i].children !== undefined && areasTree[i].children.length > 0) {
                areasTree[i].isOpen = true;
                this.setTreeDepth(areasTree[i].children);
            }
        }
    }
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
                        }

                        this.setTreeDatas(tree[i].children, this.nodeType);
                    }
                }
            }
        }
    }

    _getEqps(areas?): void {
        this.pdmConfigService.getEqps(this.selectedFab.fabId, this.selectedItem.areaId)
            .then((eqps: any) => {
                eqps.map((node: any) => {
                    node.nodeName = node.eqpName;
                    node.nodeId = node.eqpId;
                    node.nodeType = this.TYPES.EQP;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.children = [];
                    node.name = node.eqpName;
                    node.isChecked = false;
                });

                this.nodeType = this.TYPES.AREA;
                this.eqpData = {
                    eqps: eqps,
                    fabId: this.selectedFab.fabId,
                    areaId: this.selectedItem.areaId,
                    areaName: this.selectedItem.areaName,
                };

                if (areas) {
                    this.childDatas = areas.concat(eqps);
                    this.selectedItem.children = areas.concat(eqps);
                } else {
                    this.childDatas = eqps;
                    this.selectedItem.children = eqps;
                }

                this.isLoading = false;
            }).catch((error: any) => {
                this.isLoading = false;
            });
    }

    _getParams(): void {
        this.pdmConfigService.getParams(this.selectedFab.fabId, this.selectedItem.eqpId)
            .then((params: any) => {
                params.map((node: any) => {
                    node.nodeName = node.paramName;
                    node.nodeId = node.paramId;
                    node.nodeType = this.TYPES.PARAMETER;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.name = node.paramName;
                    node.isChecked = false;
                });

                this.nodeType = this.TYPES.EQP;
                this.paramData = {
                    params: params,
                    fabId: this.selectedFab.fabId,
                    eqpId: this.selectedItem.eqpId,
                    eqpName: this.selectedItem.eqpName
                };

                this._getParts(params);
            }).catch((error: any) => {

            });
    }

    _getParts(params?): void {
        this.pdmConfigService.getParts(this.selectedFab.fabId, this.selectedItem.eqpId)
            .then((parts: any[]) => {
                parts.map((node: any) => {
                    node.nodeName = node.name;
                    node.nodeId = node.partId;
                    node.nodeType = this.TYPES.PART;
                    node.iconClass = this._getImagePath(node.nodeType);
                    node.name = node.name;
                    node.isChecked = false;
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
                this.isLoading = false;

                // this._getSpeedParam();
            }).catch((error: any) => {
                this.isLoading = false;
            });
    }

    _getSpeedParam(): void {
        this.pdmConfigService.getSpeedParam(this.selectedFab.fabId, this.selectedItem.eqpId)
            .then((speedParam: any) => {

            }).catch((err: any) => {

            });
    }

    initWjTree(ev: any): void {
        if (this.selectedItem.nodeType === this.TYPES.AREA) {
            this._initConditions();
            this._getInitTree();
        } else {
            this.selectedEv.treeview.isChildLoaded = false;
            this.selectedEv.treeview.children = [];
            this.selectNode(this.selectedEv);
        }
    }

    private _getImagePath(type: string): string {
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

        this.selectedItem = undefined;
        this.selectedEv = undefined;
        this.selectedNode = undefined;
    }
}