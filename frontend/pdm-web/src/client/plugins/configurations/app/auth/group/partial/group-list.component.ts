import { Component, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';

import { UserModelService, ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';

import { GroupModalModule } from './modal/group-modal.module';

@Component({
    moduleId: module.id,
    selector: 'group-list',
    templateUrl: 'group-list.html',
    styleUrls: ['group-list.css']
})
export class GroupListComponent extends WijmoApi implements OnInit {
    @ViewChild('groupModify') groupModify;
    @ViewChild('flex') grid: any;
    @Output() selectChange = new EventEmitter();
    groups: any[];
    selectedData: any;
    status;

    constructor(
        private userService: UserModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater
    ) {
        super();
    }

    ngOnInit() {
        this._getGroups();
    }

    selectedRow(obj, event) {
        this.selectedData = obj.selectedItems[0];
        this.selectChange.emit({
            value: this.selectedData
        });
    }

    _getGroups() {
        this.userService.getGroups().subscribe((groups) => {
            let _groups = [];
            groups.map((obj: any) => {
                for (var i = 0; i < obj.role.length; i++) {
                    let group: any;
                    group = {};
                    group.groupId = obj.groupId;
                    group.condition = obj.role[i].condition;
                    group.roleId = obj.role[i].roleId;
                    group.roleDesc = obj.role[i].description;
                    group.description = obj.description;
                    obj.role[i].conditionRole = obj.role[i].condition + ':' + obj.role[i].roleId;
                    group.role = obj.role;
                    _groups.push(group);
                }
            });
            // 나중에 set하는게 성능상 이점이 있음
            this.groups = _groups;
            this._firstSelectedData();
        });
    }

    _firstSelectedData() {
        setTimeout(() => {
            if (this.grid.itemsSource && this.grid.itemsSource.length > 0) {
                this.selectedData = this.grid.itemsSource[0];
            }
        });
    }

    createGroup() {
        this._controlGroup('create');
    }

    updateGroup() {
        this._controlGroup('modify');
    }

    _controlGroup(status: string) {
        this.status = status;
        this.modalAction.showConfiguration({
            module: GroupModalModule,
            info: {
                title: this._firstCharUpper(status) + ' Group',
                status: this.status,
                selectedData: this.selectedData,
                groups: this.groups
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getGroups();
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }
            }
        });
    }

    deleteGroup() {
        this.status = undefined;
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedData.groupId,
                // confirmMessage: `${this.selectedData.groupId}를 삭제하시겠습니까?`,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.selectedData.groupId })['value'],
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteGroup();
            }
        });
    }

    _deleteGroup() {
        this.userService
            .deleteGroup([this.selectedData.groupId])
            .subscribe(
            (data) => {
                if (!data[0].resultFlag) {
                    this.notify.error(data[0].resultMessage);
                } else {
                    this._getGroups();
                    this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
                }
            },
            (error) => {
                // alert(error.message);
                console.error('delete group list error : ', error);
            });
    }

    _firstCharUpper(value) {
        if (value === undefined || value === '') return value;
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }
}
