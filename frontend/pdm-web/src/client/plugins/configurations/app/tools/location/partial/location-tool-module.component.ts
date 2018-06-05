import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
    ToolModelService,
    ModalAction,
    ModalRequester,
    RequestType
} from '../../../../../../common';
import { NotifyService } from '../../../../../../sdk';

import { LocationTreeviewComponent } from './location-treeview.component';
import { ToolModifyComponent } from '../partial/modify/tool/tool-modify.component';
import { ModuleModifyComponent } from '../partial/modify/module/module-modify.component';
import { LocationModifyComponent } from '../partial/modify/location/location-modify.component';
import { LocationModalModule } from './modal/location-modal.module';

import * as wjGrid from 'wijmo/wijmo.angular2.grid';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'location',
    templateUrl: `location-tool-module.html`,
    styleUrls: [`location-tool-module.css`],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [ToolModelService]
})
export class LocationToolModuleComponent implements OnChanges {
    @ViewChild('locationTreeView') childcmp: LocationTreeviewComponent;
    @ViewChild('locationModify') locationModify: LocationModifyComponent;
    @ViewChild('toolModify') toolModify: ToolModifyComponent;
    @ViewChild('moduleModify') moduleModify: ModuleModifyComponent;

    treeData;
    selectedType: any = null;
    selectedItem;
    acitivationNode: any = null;
    tempData;
    locationTypeMax;
    locationTypes;
    title;
    status: string;
    location: any;
    tool: any;
    module: any;
    lastLevelClicks = [];
    lastLevelCount = 0;
    currentAction = '';
    isLastLocation = false;
    isReadOnly: boolean = true;
    btnChange: boolean = false;
    rightView: boolean = false;
    isRoot: boolean = true;
    validityState: boolean = false;
    modalInfo: any = {
                title: null,
                status: null,
                currentAction: null,
                isReadOnly: false,
                location: {},
                module: null,
                tool: null,
                selectedItem: null
            }            

    constructor(
        private eqpService: ToolModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService
    ) { }

    ngOnInit() {
        this.getLocationType();
    }

    ngOnChanges() { }

    firstCharUpper(value) {
        if (value === undefined || value === '') return value;
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

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

    showModal(status: string) {
        this.modalInfo.status = status;
        this.modalAction.showConfiguration({
            module: LocationModalModule,
            info: this.modalInfo,
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                // console.log('modal response data : ', response.data);
                this.selectedItem.locationId = null;
                this.selectedItem.name = response.data.name;
                this.treeRefresh();
                // TODO: MESSAGE (Tools Location)
                this.notify.success('MESSAGE.USER_CONFIG.CREATE_SUCCESS');
            }
        });
    }

    goLink(status) {
        this.currentAction = 'LOCATION';

        let location: any = {};
        location.locationId = this.selectedItem.locationId;
        location.locationTypeId = this.selectedItem.locationTypeId;
        location.name = this.selectedItem.name;
        location.parentId = this.selectedItem.parentId;        
        
        if (status === 'create') {
            this.rightView = (this.selectedItem.locationId > -1) ? true : false; // if root
            this.modalInfo.currentAction = this.currentAction;
            this.modalInfo.selectedItem = this.selectedItem;       

            let locationType = this.getNextLocationType(this.selectedItem.locationTypeId);// this.location.locationTypeId);
            if (locationType !== undefined) {
                location.locationTypeId = locationType.locationTypeId;
            }
            location.parentId = this.selectedItem.locationId;//this.location.locationId;
            location.name = '';

            this.modalInfo.location = location;
            let titleName = '';

            if (this.isLastLocation) { //마지막 location이면 장비를 생성
                this.modalInfo.currentAction = 'EQP';
                this.modalInfo.tool = {};
                this.modalInfo.tool.locationId = this.selectedItem.locationId;
                titleName = 'EQP';
                //this.tool.locationId = this.selectedItem.object.parentId;
                //this.tool.locationId = this.selectedItem.parentId;
            } else if (this.selectedType === 'EQP') {
                this.modalInfo.currentAction = 'MODULE';
                this.modalInfo.module = {};
                this.modalInfo.module.toolId = this.selectedItem.object.toolId;
                this.modalInfo.module.toolName = this.selectedItem.object.name;
                titleName = 'MODULE';
            } else if (this.selectedType === 'MODULE') {
                this.modalInfo.currentAction = 'MODULE';
                this.modalInfo.module = {};
                this.modalInfo.module.toolId = this.selectedItem.object.toolId;;
                this.modalInfo.module.toolName = this.selectedItem.object.toolName;
                this.modalInfo.module.parentId = this.selectedItem.object.moduleId;
                this.modalInfo.module.parentName = this.selectedItem.object.name;
                titleName = 'MODULE';
            } else {
                if (locationType === undefined) {
                    titleName = 'Site';
                } else {
                    titleName = locationType.name;
                }
            }
            this.modalInfo.title = 'Create ' + titleName;
            this.showModal('create');

        } else {
            this.status = status;           
            this.location = location;

            if (status === 'cancel') {     
                this.btnChange = false;
                this.rightView = true;
                this.isReadOnly = true;

            } else if (status === 'delete') {
                this.rightView = true;
                this.toolModuleSetting();
                this.onSave(status);
            } else {
                this.isReadOnly = false;
                this.btnChange = true;
                this.toolModuleSetting();
            }
        }
    }

    onSave(status: string) {
        if (this.location && this.currentAction === 'LOCATION') {
            this.locationModify.onClickSave(status, (data) => {
                if (data === 'success') {
                    if (status === 'delete') {
                        let pathArr = this.selectedItem.path.split('/');
                        if (pathArr.length > 1 && pathArr.length-2 > 0) {
                            this.selectedItem = {
                                'locationId' : null,
                                'name' : pathArr[pathArr.length-2]
                            }
                        } else {
                            this.selectedItem = {
                                'locationId' : -1,
                                'name' : ''
                            }
                        }
                    }
                    this.treeRefresh();
                }
            });
        } else if (this.tool && this.currentAction === 'EQP') {
            // this.toolModify.onClickSave(status);
            this.toolModify.onClickSave(status, (data) => {
                if (data === 'success') {
                    this.treeRefresh();
                }
            });
        } else if (this.module && this.currentAction === 'MODULE') {
            this.moduleModify.onClickSave(status, (data) => {
                if (data === 'success') {
                    this.treeRefresh();
                }
            });
        }
        this.isReadOnly = true;
        this.btnChange = false;
        //this.currentAction = ''; // 오른쪽 view를 초기화해서 modify가 적용
        //  this.selectedType = '';
    }

    actionChange(event) {
        if (event.value !== 'cancel') {
            this.treeRefresh();
        }
    }

    validityStateChange(state) {
        this.validityState = state;
    }

    treeRefresh() {
        this.childcmp.refresh(this.selectedItem);
    }

    onClickNode(node) {
        this.status = '';
        this.currentAction = 'LOCATION';
        this.isReadOnly = true;
        this.rightView = true;
        this.btnChange = false;
        this.selectedItem = node;
        this.isLastLocation = false;
        this.selectedType = this.selectedItem.locationTypeName;
        this.location = {};

        if (this.selectedType === 'Root') { // Root
            this.currentAction = '';
            this.isRoot = true;
        } else if (this.selectedType !== 'Root' && this.selectedType !== 'EQP' && this.selectedType !== 'MODULE') { // Site, Fab, Line, Area
            this.isRoot = false;           
            this.location.locationId = this.selectedItem.locationId;
            this.location.locationTypeId = this.selectedItem.locationTypeId;
            this.location.name = this.selectedItem.name;
            this.location.parentId = this.selectedItem.parentId; 
        }

        if (this.selectedItem.locationTypeId === this.locationTypeMax.locationTypeId) {// Area
            this.isLastLocation = true;
            // if(this.selectedItem['childLocations']==undefined || this.selectedItem['childLocations'].length==0){
            //     this.lastLevelClicks.push(this.selectedItem);
            //     this.getToolsByLocation(this.selectedItem);
            // }
        }
        this.toolModuleSetting();
    }

    toolModuleSetting() {
        if (this.selectedType === 'EQP') {
            this.currentAction = 'EQP';
            this.tool = this.selectedItem.object;
            this.tool['used_TF'] = (this.tool.used === 'Y') ? true : false;
            this.tool['batchEqp_TF'] = (this.tool.batchEqp === 'Y') ? true : false;
        } else if (this.selectedType === 'MODULE') {
            this.module = this.selectedItem.object;
            this.module['name'] = this.selectedItem.name;
            this.currentAction = 'MODULE';
        }
    }

}
