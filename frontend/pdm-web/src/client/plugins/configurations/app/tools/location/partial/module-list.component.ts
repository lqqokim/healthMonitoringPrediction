import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    ToolModelService,
    ModalAction,
    ModalRequester,
    RequestType,
    WijmoApi
} from '../../../../../../common';
import { NotifyService } from '../../../../../../sdk';

import { ModuleOrderModalModule } from './modal/module-order-modal.module';

import * as wjGrid from 'wijmo/wijmo.angular2.grid';


@Component({
    moduleId: module.id,
    selector: 'module-list',
    templateUrl: `module-list.html`,
    providers: [ToolModelService]
})
export class ModuleListComponent extends WijmoApi implements OnInit, OnChanges {
    // @Input() parentId;
    // @Input() toolId;
    @Output() selectChange = new EventEmitter();
    @ViewChild('flexModule') flexModule;
    @Input() toolModuleItem: any;

    selectedData: any;
    selectedOrderData: any;
    moduleList: Array<any> = [];
    btnDisabled: boolean;
    modules: Array<any> = [];

    constructor(
        private eqpService: ToolModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService
    ) {
        super();
    }

    ngOnInit() { }

    ngOnChanges(changes) {
        if (changes) {
            this.moduleList = [];
            let childLocations = changes.toolModuleItem.currentValue.childLocations;

            for (let val of childLocations) {
                this.moduleList.push(val.object);
            }
            this._btnDisabledCheck(this.moduleList);
        }
        this.moduleList = _.sortBy(this.moduleList, 'moduleOrder');

        // let currentValue = changes.toolModuleItem.currentValue;
        // if (currentValue.locationTypeName === "EQP") {
        //     this.eqpService.getTool(currentValue.object.toolId).subscribe((datas) => {
        //         this.moduleList = datas[0].modules;
        //         this._btnDisabledCheck(this.moduleList);
        //     });
        // } else if (currentValue.locationTypeName === "MODULE") {
        //     this.eqpService.getModulesByParentId(currentValue.object.moduleId).subscribe((datas) => {
        //         this.moduleList = datas;
        //         this._btnDisabledCheck(this.moduleList);
        //     });
        // }



        // if (this.parentId) { //Select Module : Sub Module List
        //     this.eqpService.getModulesByParentId(this.parentId).subscribe((datas) => {
        //         this.moduleData = datas;
        //         this._btnDisabledCheck(this.moduleData);
        //     });
        // } else if (this.toolId) { //Select EQP : Module List
        //     this.eqpService.getTool(this.toolId).subscribe((datas) => {
        //         this.moduleData = datas[0].modules;
        //         this._btnDisabledCheck(this.moduleData);
        //     });
        // }
    }

    _btnDisabledCheck(data): boolean {
        return this.btnDisabled = data.length > 1 ? false : true;
    }

    firstCharUpper(value) {
        if (value === undefined || value === '') {
            return value;
        }
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    selectedRow(obj, event) {
        this.selectedData = obj.selectedItems[0];
        this.selectChange.emit({
            value: this.selectedData
        });
    }

    selectedOrderRow(obj, event) {
        this.selectedOrderData = obj.selectedItems[0];
    }

    onSave(moduleOrderList) {
        this.modules = [];
        for (let val of moduleOrderList) {
            let obj = {
                "moduleId": val.moduleId,
                "name": val.name,
                "alias": val.alias,
                "toolId": val.toolId,
                "moduleTypeId": val.moduleTypeId,
                "parentId": val.parentId,
                "moduleOrder": val.moduleOrder
            };
            this.modules.push(obj);
        }

        this.eqpService.modifyModules(this.modules).subscribe(
            (data) => {
                this.notify.success('MESSAGE.USER_CONFIG.UPDATE_SUCCESS');
            }, (error) => {
                console.log("Error HTTP GET Service");
            }, () => console.log("Job Done Get !")
        );

        this.flexModule.refresh();
        this.moduleList = _.sortBy(this.moduleList, 'moduleOrder');
    }

    moduleOrderModal() {
        this.modalAction.showConfiguration({
            module: ModuleOrderModalModule,
            info: {
                data: this.moduleList
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                console.log('module order modal ok', response.data);
                this.onSave(response.data.data);
            }
        });
    }
}
