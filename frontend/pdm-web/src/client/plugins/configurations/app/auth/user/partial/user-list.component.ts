import { Component, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';

import { UserModelService, ModalAction, ModalRequester, RequestType, WijmoApi } from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';

import { UserModalModule } from './modal/user-modal.module';

@Component({
    moduleId: module.id,
    selector: 'user-list',
    templateUrl: 'user-list.html',
    styleUrls: ['user-list.css'],
    providers: [UserModelService]
})
export class UserListComponent extends WijmoApi implements OnInit {
    @ViewChild('userModify') userModify: any;
    @ViewChild('flex') grid: any;
    @Output() selectChange: any = new EventEmitter();

    users: any[];
    selectedData: any;
    status: string;

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
        this._getUsers();
    }

    _getUsers() {
        this.userService
            .getUsers()
            .subscribe((users) => {
                this.users = users;
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

    selectedRow(obj, event) {
        this.selectedData = obj.selectedItems[0];
        this.selectChange.emit({
            value: this.selectedData
        });
    }

    createUser() {
        this._controlUser('create');
    }

    updateUser() {
        this._controlUser('modify');
    }

    _controlUser(status) {
        this.status = status;
        this.modalAction.showConfiguration({
            module: UserModalModule,
            info: {
                title: this._firstCharUpper(status) + ' User',
                status: this.status,
                selectedData: this.selectedData,
                users: this.users
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._getUsers();
                if (this.status === 'create') {
                    this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                } else {
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                }
            }
        });
    }

    _firstCharUpper(value) {
        if (value === undefined || value === '') return value;
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    deleteUser() {
        this.status = undefined;
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedData.userId,
                // confirmMessage: `${this.selectedData.userId}를 삭제하시겠습니까?`,
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.AUTHORITY.DELETE_SELECTED_USER', { user: this.selectedData.userId })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteUser();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            }
        });
    }

    _deleteUser() {
        this.userService
            .deleteUser([this.selectedData.userId])
            .subscribe(
            (data) => {
                this._getUsers();
            },
            error => console.log('Error HTTP GET Service'),
            () => console.log('Job Done Get !')
            );
    }
}
