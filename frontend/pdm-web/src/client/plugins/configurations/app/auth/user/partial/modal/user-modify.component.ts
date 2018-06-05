import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { UserModelService, ModalApplier } from '../../../../../../../common';
import { Translater } from '../../../../../../../sdk';
import { Subscription } from 'rxjs/Subscription';
import { Util } from '../../../../../../../sdk/utils/utils.module';

@Component({
    moduleId: module.id,
    selector: 'user-modify',
    templateUrl: './user-modify.html',
    styleUrls: ['./user-modify.css'],
})
export class UserModifyComponent implements OnChanges, OnDestroy {
    @Input() data: any;

    groups: any[] = [];
    userData: any;
    status: string;
    isUserIdValid: boolean = true;
    isUserNameValid: boolean = true;
    isSameUserId: boolean = false;
    isEmailValid: boolean = true;
    isPhoneValid: boolean = true;
    isCompanyPhoneValid: boolean = true;

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private userService: UserModelService,
        private translater: Translater
    ) { }

    ngOnChanges(changes: any): void {
        this.isUserIdValid = true;
        this.isUserNameValid = true;
        this.isSameUserId = false;

        if (changes && changes.data) {
            // 전달된 data와 applier를 변수에 담음
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;

            if (this.status === 'create') {
                this.userData = {};
            } else if (this.status === 'modify') {
                this.userData = JSON.parse(JSON.stringify(this._selectedData.data));
            }

            this._setGroup();
            this._waitApply();
        }
    }

    _setGroup(): void {
        this.userService
            .getGroups()
            .subscribe((groups) => {
                // only when status is 'create'
                if (this.status === 'create') {
                    groups.forEach((group) => {
                        if (group.groupId === 'Guest') {
                            this.userData.groupId = group.groupId;
                        }
                    });
                }
                this.groups = groups;
            });
    }

    _waitApply(): void {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._saveUser();
                }
            });
    }

    _saveUser(): void {
        if (!this._isRequiredValid()) {
            return;
        }

        this._maxSizeUserData();

        if (this.status === 'create') {
            this.userData.password = '1';
            this.userService
                .createUser([this.userData])
                .subscribe(
                    (data: any) => {
                        this._applier.appliedSuccess();
                    },
                    (error: any) => {
                        this._applier.appliedFailed();
                    }
                );
        } else if (this.status === 'modify') {
            this.userService
                .modifyUser(this.userData)
                .subscribe(
                    (data: any) => {
                        this._applier.appliedSuccess();
                    },
                    (error: any) => {
                        this._applier.appliedFailed();
                    }
                );
        }
    }

    // TODO: maxsize directive사용해서 maxsize제어하지만 코보에서만 maxsize관련 에러가 나서 임의로 maxsize를 설정...
    // 자세한 테스트 필요....
    _maxSizeUserData() {
        if (!this.userData) {
            return null;
        }
        if (this.status === 'create') {
            this.userData.userId = Util.Unicode.unicode_substring(this.userData.userId, 50);
        }
        this.userData.name = Util.Unicode.unicode_substring(this.userData.name, 25);
        this.userData.description = Util.Unicode.unicode_substring(this.userData.description, 1000);
        this.userData.email = Util.Unicode.unicode_substring(this.userData.email, 50);
        this.userData.phone = Util.Unicode.unicode_substring(this.userData.phone, 20);
        this.userData.position = Util.Unicode.unicode_substring(this.userData.position, 50);
        this.userData.department = Util.Unicode.unicode_substring(this.userData.department, 50);
        this.userData.companyPhone = Util.Unicode.unicode_substring(this.userData.companyPhone, 20);
    }

    _isRequiredValid(): boolean {
        //
        this.userData.userId = Util.Data.whiteSpace2null(this.userData.userId);
        this.userData.name = Util.Data.whiteSpace2null(this.userData.name);

        if (this.isUserIdValid = this._isValid(this.userData.userId)) { // isUserIdValid true
            this.userData.userId = this.userData.userId.toUpperCase(); //uppercase userData Setting
            if (this.status === 'create') {
                for (let i = 0; i < this._selectedData.users.length; i++) {
                    if (this.userData.userId === this._selectedData.users[i].userId) {
                        this.isSameUserId = true;
                        break;
                    }
                }
            }
        }
        this.isUserNameValid = this._isValid(this.userData.name);

        if (!this.isUserIdValid || !this.isUserNameValid || !this.isPhoneValid || !this.isEmailValid || !this.isCompanyPhoneValid || this.isSameUserId) {
            return false;
        } else {
            return true;
        }
    }

    _isValid(isValid: any): boolean {
        return !isValid ? false : true;
    }

    formatCheck(event: any): void {
        let phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3,4})[-. ]?([0-9]{4})$/;
        let companyPhoneNum = /^\(?([0-9]{2,3})\)?[-. ]?([0-9]{3,4})[-. ]?([0-9]{4})$/;
        let email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (event.target['id'] === 'inputPhone') {
            if (phoneNum.test(event.target['value'])) {
                this.isPhoneValid = true;
            } else {
                this.isPhoneValid = false;
            }
        } else if (event.target['id'] === 'inputEmail') {
            if (email.test(event.target['value'])) {
                this.isEmailValid = true;
            } else {
                this.isEmailValid = false;
            }
        } else if (event.target['id'] === 'inputCompanyPhone') {
            if (companyPhoneNum.test(event.target['value'])) {
                this.isCompanyPhoneValid = true;
            } else {
                this.isCompanyPhoneValid = false;
            }
        }

        if (event.target['value'].length === 0) {
            if (event.target['id'] === 'inputPhone') {
                this.isPhoneValid = true;
            } else if (event.target['id'] === 'inputEmail') {
                this.isEmailValid = true;
            } else if (event.target['id'] === 'inputCompanyPhone') {
                this.isCompanyPhoneValid = true;
            }
        }
    }

    validationMessage(type: string) {
        let message = this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.INPUT_VALID', {field: type})['value'];
        return this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.INPUT_VALID', {field: type})['value'];
    }

    keyUp(event: any): void {
        if (event.target['id'] === 'inputUserID') {
            this.isUserIdValid = true;
            this.isSameUserId = false;
            // event.target.value = event.target.value.toLocaleUpperCase();
        } else if (event.target['id'] === 'inputName') {
            this.isUserNameValid = true;
        }
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
