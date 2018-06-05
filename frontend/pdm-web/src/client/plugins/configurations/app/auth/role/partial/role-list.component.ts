import { Component, OnInit, ViewChild } from '@angular/core';
import { UserModelService, ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService } from '../../../../../../sdk';

import { RoleModalModule } from './modal/role-modal.module';

@Component({
    moduleId: module.id,
    selector: 'role-list',
    templateUrl: 'role-list.html',
    styleUrls: ['role-list.css'],
    providers: [UserModelService]
})
export class RoleListComponent extends WijmoApi implements OnInit {
    @ViewChild('flex') grid: any;
    roles: any[];
    selectedData = null;
    status;
    statusDisabled: boolean = false;
    roleData: any;
    adminCheck: string;

    constructor(
        private userService: UserModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService
    ) {
        super();
    }

    ngOnInit() {
        this._getRoles();
    }

    _getRoles() {
        this.userService.getRoles().subscribe((roles) => {
            let _roles = [];
            for (let iRole = 0; iRole < roles.length; iRole++) {
                let obj = roles[iRole];
                if (obj.childRole.length > 0) {
                    for (var i = 0; i < obj.childRole.length; i++) {
                        let role: any;
                        role = {};
                        role.roleId = obj.roleId;
                        role.description = obj.description;
                        role.childRoleId = obj.childRole[i].roleId;
                        role.childRoleDesc = obj.childRole[i].description;
                        role.childRole = obj.childRole;
                        _roles.push(role);
                    }
                } else {
                    _roles.push(obj);
                }
            }
            this.roles = _roles;
            this._firstSelectedData();

        });
    }

    _firstSelectedData() {
        setTimeout(() => {
            if (this.grid.itemsSource && this.grid.itemsSource.length > 0) {
                this.selectedData = this.grid.itemsSource[0];
                if (!this.selectedData) {
                    this.statusDisabled = true;
                }
                this._getRole();
            }
        });
    }

    _getRole() {
        this.userService.getRole(this.selectedData.roleId).subscribe((role) => {
            this.roleData = role;
            if (this.roleData !== undefined) {
                this.statusDisabled = false;
            }
        });
    }

    selectedRow(obj, event) {
        this.statusDisabled = true;
        this.selectedData = obj.selectedItems[0];
        this.adminCheck = this.selectedData.roleId;
        this._getRole();
    }

    createRole() {
        this._controlRole('create');
    }

    updateRole() {
        this._controlRole('modify');
    }

    _controlRole(status: string) {
        this.status = status;
        this.modalAction.showConfiguration({
            module: RoleModalModule,
            info: {
                title: this._firstCharUpper(status) + 'Role',
                status: this.status,
                selectedData: this.selectedData,
                listData: this.roles,
                roleData: this.roleData
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getRoles();
            }
        });
    }

    deleteRole() {
        this.status = undefined;
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedData.roleId,
                confirmMessage: `${this.selectedData.roleId}를 삭제하시겠습니까?`,
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteRole();
            }
        });
    }

    _deleteRole() {
        this.userService.deleteRole([this.selectedData.roleId]).subscribe(
            (data) => {
                if (!data[0].resultFlag) {
                    alert(data[0].resultMessage);
                } else {
                    this._getRoles();
                }
            },
            (error) => {
                this.notify.info("MESSAGE.APP_CONFIG.AUTHORITY.ROLE_REMOVE_VALID");
            }
        );
    }

    itemsourceChanged(ev: any) {
        console.log(ev);
    }

    _firstCharUpper(value) {
        if (value === undefined || value === '') return value;
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }
}