import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../model/pdm-config.service';
import { SpinnerComponent } from './../../../../../sdk';

import * as IRule from './partial/spec-rule/model/spec-rule-interface';
import * as IMaster from './model/master-interface';

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

    selectedFab: IMaster.Fab;
    selectedItem: IMaster.TreeEvent['treeview'];
    selectedEv: IMaster.TreeEvent;

    nodeType: string;
    initialTreeDatas: [IMaster.InitTree];
    tempInitTree: [IMaster.InitTree];

    areaList: [IMaster.MasterAreasResponse];
    areaData: IMaster.AreaList;
    eqpData: IMaster.EqpList;
    paramData: any;
    partData: any;
    plants: IMaster.Fab[];

    isLoading: boolean = false;
    isChildLoaded: boolean = false;

    eqpSpecCondition: IRule.SpecCondition;

    readonly TYPES: IMaster.type =
        {
            FAB: 'fab',
            AREA: 'area',
            EQP: 'eqp',
            PARAMETER: 'parameter',
            PART: 'part'
        };

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
            .then((plants: IMaster.Fab[]) => {
                this.plants = plants;
                this.selectedFab = this.plants[0];
                this._getInitTree();
            }).catch((error: any) => {
                console.log(error);
            });
    }

    changeSelectedFab(ev: IMaster.Fab): void {
        this.isLoading = true;
        this.selectedFab = ev;
        this._initConditions();
        this._getInitTree();
    }

    _getInitTree(): void {
        this.initialTreeDatas = [] as null;
        this.nodeType = this.TYPES.AREA;
        this.pdmConfigService.getAreas(this.selectedFab.fabId)
            .then((areas: [IMaster.MasterAreasResponse]) => {
                this.areaList = areas;
                this.setTreeDatas(areas, this.nodeType);
                areas[0]['isOpen'] = true;
                
                this.initialTreeDatas = JSON.parse(JSON.stringify(<[IMaster.InitTree]>areas));
                this.tempInitTree = JSON.parse(JSON.stringify(areas));

                console.log('initialTreeDatas => ', this.initialTreeDatas);
                console.log('tempInitTree => ', this.tempInitTree);
                this.isLoading = false;
            }).catch((error: any) => {
                this.isLoading = false;
                console.log(error);
            });
    }

    // _getInitTree() {
    //     this.nodeType = this.TYPES.AREA;

    //     this.pdmConfigService.getAreas(this.selectedFab.fabId)
    //         .then((areas: [IMaster.MasterAreasResponse]) => {
    //             this.areaList = areas;
    //             this.setTreeDatas(areas, this.nodeType);

    //             const tempTree: [IMaster.InitTree] = JSON.parse(JSON.stringify(areas)); // deep copy
    //             this.pdmConfigService.getEqps(this.selectedFab.fabId, areas[0].areaId)
    //                 .then((eqps: IMaster.MasterEqpResponse[]) => {
    //                     if (eqps.length > 0) {
    //                         eqps.map((node: IMaster.MasterEqpResponse) => {
    //                             node['nodeName'] = node.eqpName;
    //                             node['name'] = node.eqpName;
    //                             node['nodeId'] = node.eqpId;
    //                             node['nodeType'] = this.TYPES.EQP;
    //                             node['iconClass'] = this._getImagePath(node['nodeType']);
    //                             node['children'] = [];
    //                         });

    //                         return eqps;
    //                     } else {
    //                         return null;
    //                     }
    //                 }).then((eqps) => {
    //                     if (eqps !== null) {
    //                         tempTree[0].children = tempTree[0].children.concat(eqps);
    //                         tempTree[0].isOpen = true;
    //                         this.initialTreeDatas = tempTree;
    //                     } else {
    //                         this.initialTreeDatas = tempTree;
    //                     }

    //                     console.log('initTreeDatas => ', this.initialTreeDatas);
    //                     this.initialTreeDatas[0].isOpen = true;
    //                 });
    //             console.log('tv => ', this.tv);
    //             this.isLoading = false;
    //         }).catch((error: any) => {
    //             this.isLoading = false;
    //         });
    // }

    selectNode(ev: IMaster.TreeEvent): void {
        try {
            console.log('selectedItem', ev.treeview);
            const treeview: IMaster.TreeEvent['treeview'] = ev.treeview;
            const selectedNodeType: string = treeview.nodeType;

            if (selectedNodeType === this.TYPES.AREA || selectedNodeType === this.TYPES.EQP) {
                this.nodeType = selectedNodeType;
                this.selectedItem = ev.treeview;
                this.selectedItem.isOpen = true;
                this.selectedEv = ev;

                if (selectedNodeType === this.TYPES.EQP) {
                    this.eqpSpecCondition = { //Spec List Component Data  
                        fabId: this.selectedFab.fabId,
                        model: this.selectedItem.model_name,
                        eqp: {
                            eqpId: this.selectedItem.eqpId,
                            eqpName: this.selectedItem.eqpName
                        }
                    };
                }

                this.isLoading = true;
                const children: IMaster.Treeview[] = this.selectedItem.children;

                if ((!children.length || this.selectedItem.isChildLoaded === undefined || this.selectedItem.isChildLoaded === false) && this.selectedItem.parentId !== 0) { // api call
                    this.selectedItem.isChildLoaded = true;
                    this._getChildByType(selectedNodeType);
                } else if (children.length > 0 || this.selectedItem.parentId === 0) { // exist data
                    if (selectedNodeType === this.TYPES.AREA) {
                        const areas: IMaster.InitTree[] = [];
                        const eqps: IMaster.Treeview[] = [];

                        for (let i: number = 0; i < children.length; i++) {
                            if (children[i].nodeType === this.TYPES.AREA) {
                                areas.push(children[i]);
                            } else if (children[i].nodeType === this.TYPES.EQP) {
                                eqps.push(children[i]);
                            }
                        }

                        this.areaData = {
                            areas: areas,
                            areaList: this.areaList,
                            fabId: this.selectedFab.fabId,
                            areaId: this.selectedItem.areaId
                        };

                        this.eqpData = {
                            eqps: eqps,
                            fabId: this.selectedFab.fabId,
                            areaId: this.selectedItem.areaId,
                            areaName: this.selectedItem.areaName
                        };
                    } else if (selectedNodeType === this.TYPES.EQP) {
                        const params = [];
                        const parts = [];

                        for (let i: number = 0; i < children.length; i++) {
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

    _getChildByType(nodeType: string): void {
        if (nodeType === this.TYPES.AREA) {
            this.nodeType = nodeType;
            this._getAreas();
        } else if (nodeType === this.TYPES.EQP) {
            this.nodeType = nodeType;
            this._getParams();
        }
    }

    _getAreas(): void {
        const selectedNode: IMaster.Treeview = this.selectedItem;
        const nodeId: number = selectedNode.nodeId;
        const node: IMaster.Treeview = this.searchTree('nodeId', this.tempInitTree[0], nodeId);
        const nodeChildren: IMaster.Treeview[] = node.children.length > 0 ? node.children : [];
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

    setTreeDatas(tree: [IMaster.MasterAreasResponse], type: string, datas?: any): void {
        if (tree.length > 0) {
            for (let i: number = 0; i < tree.length; i++) {
                tree[i]['nodeName'] = tree[i].areaName;
                tree[i]['nodeId'] = tree[i].areaId;
                tree[i]['nodeType'] = type;
                tree[i]['name'] = tree[i].areaName;
                tree[i]['isChecked'] = false;

                if (tree[i].parentId === 0) {
                    tree[i]['iconClass'] = this._getImagePath(this.TYPES.FAB);
                } else {
                    tree[i]['iconClass'] = this._getImagePath(tree[i]['nodeType']);
                }

                if (tree[i].children !== undefined && tree[i].children.length > 0) {
                    for (let j = 0; j < tree[i].children.length; j++) {
                        tree[i].children[j]['nodeName'] = tree[i].children[j].areaName;
                        tree[i].children[j]['nodeId'] = tree[i].children[j].areaId;
                        tree[i].children[j]['nodeType'] = type;
                        tree[i].children[j]['iconClass'] = this._getImagePath(tree[i].children[j]['nodeType']);
                        tree[i].children[j]['name'] = tree[i].children[j].areaName;
                        tree[i].children[j]['isChecked'] = false;

                        this.setTreeDatas([tree[i].children[j]], type);
                    }
                }
            }
        }
    }

    _getEqps(areas?: IMaster.Treeview[]): void {
        this.pdmConfigService.getEqps(this.selectedFab.fabId, this.selectedItem.areaId)
            .then((eqpsResponse: IMaster.MasterEqpResponse[]) => {
                eqpsResponse.map((node: IMaster.MasterEqpResponse) => {
                    node['nodeName'] = node.eqpName;
                    node['nodeId'] = node.eqpId;
                    node['nodeType'] = this.TYPES.EQP;
                    node['iconClass'] = this._getImagePath(node['nodeType']);
                    node['children'] = [];
                    node['name'] = node.eqpName;
                    node['isChecked'] = false;
                });

                const eqps: IMaster.Treeview[] = <IMaster.Treeview[]>eqpsResponse;
                this.eqpData = {
                    eqps: eqps,
                    fabId: this.selectedFab.fabId,
                    areaId: this.selectedItem.areaId,
                    areaName: this.selectedItem.areaName,
                };

                if (areas) {
                    this.selectedItem.children = areas.concat(eqps);
                } else {
                    this.selectedItem.children = eqps;
                }

                this.isLoading = false;
            }).catch((error: any) => {
                this.isLoading = false;
                console.log(error);
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

                this.paramData = {
                    params: params,
                    fabId: this.selectedFab.fabId,
                    eqpId: this.selectedItem.eqpId,
                    eqpName: this.selectedItem.eqpName
                };

                this._getParts(params);
            }).catch((error: any) => {
                console.log(error)
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

                this.partData = {
                    parts: parts,
                    fabId: this.selectedFab.fabId,
                    eqpId: this.selectedItem.eqpId,
                    eqpName: this.selectedItem.eqpName
                };

                this.selectedItem.children = params.concat(parts);
                this.isLoading = false;
            }).catch((error: any) => {
                this.isLoading = false;
                console.log(error);
            });
    }

    initWjTree(ev: any): void {
        console.log('initWjTree => ', this.nodeType, this.selectedItem);
        if (this.nodeType === this.TYPES.AREA) {
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
        this.selectedItem = undefined;
        this.selectedEv = undefined;

        this.areaData = undefined;
        this.eqpData = undefined;
        this.paramData = undefined;
        this.partData = undefined;
        this.eqpSpecCondition = undefined;
    }
}