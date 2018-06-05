import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { UserModelService, ModalApplier } from '../../../../../../../common';
import { Subscription } from 'rxjs/Subscription';
import { Util } from '../../../../../../../sdk/utils/utils.module';

@Component({
    moduleId: module.id,
    selector: 'group-modify',
    templateUrl: 'group-modify.html',
    styleUrls: ['group-modify.css'],
    providers: [UserModelService]
})
export class GroupModifyComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    groupData: any;
    status: string;
    roles: any[] = [];
    selectedRoleData: string;
    selectedConditionRoleData: string;
    selectCondition: string;
    conditions: string[] = ['ALL', 'AREA=PHOTO', 'AREA=ETCH'];

    defaultRole: any = {
        condition: 'ALL',
        conditionRole: 'ALL:USER',
        roleId: 'USER'
    };

    isGroupIdValid: boolean = true;
    isRoleValid: boolean = true;
    isSameGroupId: boolean = false;

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(private userService: UserModelService) { }

    ngOnChanges(changes) {
        this.isGroupIdValid = true;
        this.isRoleValid = true;
        this.isSameGroupId = false;

        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;

            if (this.status === 'create') {
                this.groupData = {
                    role: []
                };
            } else if (this.status === 'modify') {
                this.groupData = this._selectedData.data;
                this.selectCondition = this.groupData['condition'];
            }

            this._setCondition();
            this._waitApply();
        }
    }

    _setCondition() {
        this.userService
            .getRoles()
            .subscribe((roles) => {
                this.roles = roles;
                if (this.status === 'modify') {
                    // this.userService.getGroup(this._selectedData.data.groupId).subscribe((datas) => {
                    let roleKeyVal = {};
                    // this.groupData = datas;
                    if (this.groupData.role) {
                        this.groupData.role.forEach((role) => {
                            role['conditionRole'] = role.condition + ':' + role.roleId;
                            roleKeyVal[role.roleId] = role.roleId;
                        });
                        let roleCount = this.roles.length - 1;
                        for (let i = roleCount; i === 0; i--) {
                            if (roleKeyVal[this.roles[i].roleId] !== undefined) {
                                this.roles.splice(i, 1);
                            }
                        }
                    }
                    // });
                }

                //for default setting conditions
                if (!this.selectCondition) {
                    this.conditions.forEach((condition) => {
                        if (condition === 'ALL') {
                            this.selectCondition = condition;
                            return;
                        }
                    });

                }

                this.roles.forEach((role, idx) => {
                    if (role.roleId === 'ADMIN') {
                        this.roles.splice(idx, 1);
                        return;
                    }
                });
            });
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._saveGroup();
                }
            });
    }

    selectRoleRow(data: any) {
        this.selectedRoleData = data;
    }

    selectConditionRoleRow(data: any) {
        this.selectedConditionRoleData = data;

    }

    onClickLeft() {
        // if(this.selectedRoleData === 'ADMIN'){
        //     this.selectedRoleData = null;
        // }
        if (this.selectCondition !== null) {
            var role = {};
            role['roleId'] = this.selectedRoleData;
            role['condition'] = this.selectCondition;
            role['conditionRole'] = this.selectCondition + ':' + this.selectedRoleData;

            for (let i = 0; i < this.groupData.role.length; i++) {
                if (this.groupData.role[i].conditionRole === role['conditionRole']) {
                    alert('Already exist item!');
                    return;
                }
            }
            this.groupData.role.push(role);
            this.selectedRoleData = null;

            if (this.groupData.role.length !== undefined || this.groupData.role.length > 0) {
                this.isRoleValid = true;
            }
        }
    }

    onClickRight() {
        for (var i = 0; i < this.groupData.role.length; i++) { // left condition sizs
            if ((this.groupData.role[i].condition + ':' + this.groupData.role[i].roleId) === this.selectedConditionRoleData) {
                this.groupData.role.splice(i, 1);
                break;
            }
        }
        this.selectedConditionRoleData = null;
    }

    _saveGroup() {
        this.groupData.groupId = Util.Data.whiteSpace2null(this.groupData.groupId);
        this.groupData.description = Util.Data.whiteSpace2null(this.groupData.description);

        this.isGroupIdValid = this.isValid(this.groupData.groupId);
        // this.isRoleValid = this.isValid(this.groupData.role.length);
        if (this.status === 'create') {
            for (let i = 0; i < this._selectedData.groups.length; i++) {
                if (this.groupData.groupId === this._selectedData.groups[i].groupId) {
                    this.isSameGroupId = true;
                    break;
                }
            }
        }
        if (!this.isGroupIdValid || !this.isRoleValid || this.isSameGroupId) {
            return;
        }

        this._maxSizeUserData();

        if (this.status === 'create') {
            if (this.selectCondition !== null) {
                this.defaultRole.condition = this.selectCondition;
                this.defaultRole.conditionRole = this.selectCondition + ':' + this.defaultRole.roleId;
            }

            // TODO: this.groupData['role'] group저장을 여러번 시도할경우 role이 초기화 되지 않아서 PK오류남..
            this.groupData['role'] = [];
            this.groupData['role'].push(this.defaultRole);
            this.userService
                .createGroup([this.groupData])
                .subscribe(
                    (data) => this._applier.appliedSuccess(),
                    (error) => {
                        console.error('user create error: ', error);
                        this._applier.appliedFailed();
                    }
                );
        } else if (this.status === 'modify') {
            if (this.groupData.description === null || this.groupData.description === undefined) {
                this.groupData.description = '';
            }
            let roleData = this.groupData['role'][0];
            if(this.selectCondition !== null) {
                roleData.condition = this.selectCondition;
                roleData.conditionRole = this.selectCondition + ':' + this.defaultRole.roleId;
                this.groupData['role'][0] = roleData;
            }

            this.userService
                .modifyGroup(this.groupData)
                .subscribe(
                    (data) => this._applier.appliedSuccess(),
                    (error) => {
                        console.error('user modify error: ', error);
                        this._applier.appliedFailed();
                    }
                );
        }
    }

    _maxSizeUserData() {
        if (!this.groupData) {
            return null;
        }
        if (this.status === 'create') {
            this.groupData.groupId = Util.Unicode.unicode_substring(this.groupData.groupId, 50);
        }
        this.groupData.description = Util.Unicode.unicode_substring(this.groupData.description, 1000);
    }

    groupKeyUp(object) {
        this.isGroupIdValid = true;
        this.isSameGroupId = false;
        // this.groupData.groupId = Util.Data.replaceRegexp(this.groupData.groupId, /[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s)]/g);
    }

    isValid(isValid) {
        if (isValid === undefined || isValid === null || isValid === 0 || isValid === '') {
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

