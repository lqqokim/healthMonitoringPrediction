//Angular
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

//MIP
import { ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';
import { PdmModelService } from './../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../../model/pdm-config.service';
import { AREA_TREE } from '../../model/pdm-mock-data';

//Wijmo
import * as wjcNav from 'wijmo/wijmo.nav';

@Component({
    moduleId: module.id,
    selector: 'area-modify',
    templateUrl: 'area-modify.html',
    styleUrls: ['area-modify.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmConfigService]
})
export class AreaModifyComponent implements OnInit {
    isChildOpen: boolean = false;
    isBtnChange: boolean = false;
    isDisabled: boolean = true;
    isReadOnly: boolean = true;
    areaTreeDatas: any;
    nodeDepth: number;
    isInActive: boolean;
    areaName: string;
    pathStr: string;
    plants: any[];
    selectedFab: any;
    childData: any;
    selectedNodeData: any = {
        fabId: 0,
        areaId: 0,
        areaName: '',
        description: '',
        parentId: 0
    };

    constructor(
        private notify: NotifyService,
        private translater: Translater,
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService,
        private modalAction: ModalAction,
        private requester: ModalRequester
    ) {

    }

    ngOnInit(): void {
        this._getFabDatas();
    }

    _getFabDatas(): void {
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.plants = plants;
                this.selectedFab = plants[0];
                this._getAreas();
            }).catch((error: any) => {

            });
    }

    _getAreas(): void {
        this.pdmConfigService.getAreas(this.selectedFab.fabId)
            .then((areas: any) => {
                this.areaTreeDatas = areas;
            }).catch((error: any) => {

            });
    }

    changeSelectedFab(ev: any): void {
        this.selectedFab = ev;
        this.initConditions();
        this._getAreas();
    }

    selectedNode(treeview: wjcNav.TreeView): void {
        console.log('selectedNode treeview: ', treeview);
        let selectedItem = treeview.selectedItem;
        this.areaName = selectedItem.areaName;
        let path = treeview.selectedPath;
        this.pathStr = path.join(' > ');
        this.isInActive = treeview.selectedPath.length === 4 ? true : false;
        this.isChildOpen = false;

        this.selectedNodeData = {
            fabId: this.selectedFab.fabId,
            areaId: selectedItem.areaId,
            areaName: selectedItem.areaName,
            description: selectedItem.description,
            parentId: selectedItem.parentId
        };

        this.childData = {
            parentId: selectedItem.areaId,
            areaName: '',
            description: ''
        };
    }

    deleteParent(): void {
        this.modalAction.showConfirmDelete({
            info: {
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.DELETE_SELECTED_USER', { user: this.selectedNodeData.areaName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteArea();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            }
        });
    }

    _deleteArea(): void {
        const areaId = this.selectedNodeData.areaId;
        this.pdmConfigService.deleteArea(this.selectedFab.fabId, areaId)
            .then((res: any) => {
                this._getAreas();
                this.areaName = undefined;
            }).catch((error: any) => {

            });
    }

    modifyParent(): void {
        this.isBtnChange = true;
        this.isDisabled = true;
        this.isReadOnly = false;
    }

    saveParent(): void {
        this.isBtnChange = false;
        this.isReadOnly = true;
        const params = _.pick(this.selectedNodeData, 'areaId', 'areaName', 'description', 'parentId'); //Set request data
        console.log('params', params);
        this.pdmConfigService.updateArea(this.selectedFab.fabId,params )
            .then((res: any) => { // Modify parent area
                this._getAreas();
                this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
            }).catch((error: any) => {

            });
    }

    cancel(name: string): void {
        if (name === 'parent') {
            this.isBtnChange = false;
            this.isReadOnly = true;
        } else if (name === 'child') {
            this.isChildOpen = false;
        }
    }

    saveChild(child): void {
        console.log('child', child);
        let params = {
            parentId: this.selectedNodeData.areaId,
            areaName: child.areaName,
            description: child.description
        };

        this.pdmConfigService.updateArea(this.selectedFab.fabId,params )
            .then((res: any) => {
                this._getAreas();
                this.isChildOpen = false;
                this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
            }).catch((error: any) => {

            });
    }

    openChild(param): void {
        if (!this.isChildOpen) {
            this.isChildOpen = true;
        } else {
            this.isChildOpen = false;
        }
    }

    private initConditions(): void {
        this.areaName = undefined;
    }
}