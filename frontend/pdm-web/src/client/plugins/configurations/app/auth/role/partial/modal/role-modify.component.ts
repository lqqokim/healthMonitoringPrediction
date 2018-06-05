import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserModelService, ModalApplier } from '../../../../../../../common';
import { OrderBy } from '../../../component/common/orderby.component';

@Component({
    moduleId: module.id,
    selector: 'role-modify',
    templateUrl: 'role-modify.html',
    styleUrls: ['role-modify.css'],
    providers: [UserModelService]
})
export class RoleModifyComponent implements OnChanges {
    @Input() data: any;

    status: string;
    dataRole: any;
    roles: any[] = [];
    roleIdList: any[] = [];
    childRoleIdList: any[] = [];
    selectedRoleData: string;
    selectedChildRoleData: string;

    private _subscription: Subscription;
    private _selectedData: any;
    private _applier: ModalApplier;
    private isRoleIdValid: boolean = true;
    private isPermissionValid: boolean = false;
    private isSameRoleId: boolean = false;

    constructor(private userService: UserModelService) { }

    ngOnChanges(changes): void {
        this.isRoleIdValid = true;
        this.isPermissionValid = true;
        this.selectedRoleData = null;
        this.isSameRoleId = false;

        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue;

            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;
            this.roles = this._selectedData.listData;
            this.dataRole = this._selectedData.dataRole;
            this.childRoleIdList = this.dataRole.childRole;

            if (this.status === 'create') {
                this.dataRole = {
                    childRole: []
                };
                this.childRoleIdList = [];
            }

            this._setCondition();
            this._waitApply();
        }
    }

    _setCondition() {// RoleID List filtering
        let uniqRoleId = _.uniq(_.pluck(this.roles, 'roleId'));
        this.roleIdList = _.without(uniqRoleId, 'ADMIN');

        if (this.status === 'modify' && this.dataRole !== undefined) {
            let removeRole: any[] = [];
            removeRole.push(this.dataRole.roleId, this.dataRole.childRole);
            this.roleIdList = _.difference(this.roleIdList, _.flatten(removeRole));
        }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._saveRole();
                }
            });
    }

    _saveRole() {
        this.dataRole.roleId = this.dataRole.roleId.trim();
        this.isRoleIdValid = this.isValid(this.dataRole.roleId);
        this.isPermissionValid = this.isValid(this.dataRole.permission);

        if (this.status === 'create') {
            for (let i = 0; i < this.roles.length; i++) {
                if (this.dataRole.roleId === this.roles[i].roleId) {
                    this.isSameRoleId = true;
                    break;
                }
            }
        }

        if (!this.isRoleIdValid || !this.isPermissionValid || this.isSameRoleId) {
            return;
        }

        this.isPermissionValid = true;

        if (this.status === 'create') {
            this.userService.createRole([this.dataRole]).subscribe(
                (data) => this._applier.appliedSuccess(),
                (error) => this._applier.appliedFailed()
            );
        } else if (this.status === 'modify') {
            if (!this.dataRole.description) {
                this.dataRole.description = '';
            }

            this.userService.modifyRole(this.dataRole).subscribe(
                (data) => this._applier.appliedSuccess(),
                (error) => this._applier.appliedFailed()
            );
        }
    }

    selectRoleRow(data: any): void {
        this.selectedRoleData = data;
    }

    selectConditionRoleRow(data: any): void {
        this.selectedChildRoleData = data;
    }

    onClickLeft(): void {
        this.childRoleIdList.push(this.selectedRoleData);

        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].roleId == this.selectedRoleData.toString()) {
                this.roles.splice(i, 1);
                break;
            }
        }
        this.selectedRoleData = null;
    }

    onClickRight(): void {
        for (var i = 0; i < this.childRoleIdList.length; i++) {
            if (this.childRoleIdList[i] == this.selectedChildRoleData) {
                this.roles.push({ roleId: this.childRoleIdList[i] });
                this.childRoleIdList.splice(i, 1);
                break;
            }
        }
        this.selectedChildRoleData = null;
    }

    onSelectChange(event: any): void {
        this.dataRole.permission = [];
        this.isPermissionValid = true;
        for (var i = 0; i < event.value.length; i++) {
            this.dataRole.permission.push(event.value[i].objectOperationId);
        }
        if (this.dataRole.permission !== undefined || this.dataRole.permission.length > 0) {
            this.isPermissionValid = true;
        } else {
            this.isPermissionValid = false;
        }

    }

    roleIdKeyUp() {
        this.isRoleIdValid = true;
        this.isSameRoleId = false;
    }

    isValid(value: any): boolean {
        if (!value || !value.length) {
            return false;
        } else if (!Array.isArray(value) && value.trim() === "") {
            return false;
        } else {
            return true;
        }
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}