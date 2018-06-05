import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';

import {
    VisMapComponent,
    ContextMenuType,
    InjectorUtil
} from '../../../../sdk';

import {
    RequestType,
    ContextMenuModel,
    ContextMenuAction,
    ContextMenuRequester,
    ContextMenuTemplateInfo,
    ModalAction,
    ModalModel,
    ModalRequester,
    SessionService
} from '../../../../common';

import { AcubedMapSharedUserService } from "./acubed-map-shared-user.service";
import { SidebarService } from '../../sidebar.service';
import { RouterService } from '../../../router/router.service';

@Component({
    moduleId: module.id,
    selector: 'a3p-map-shared-user, div[a3p-map-shared-user]',
    templateUrl: 'acubed-map-shared-user.html',
    providers: [AcubedMapSharedUserService],
    host: {
        'class': 'height-full'
    }
})
export class AcubedMapSharedUserComponent implements OnInit, OnDestroy {
    @Output() emitChangeSharedUser = new EventEmitter<any>();
    @Output() emitChangeSharingUser = new EventEmitter<any>();
    @Output() emitMyWorkspace = new EventEmitter<any>();

    isOpen = false;
    users = [];
    sharedUsers = [];
    sharingUsers = [];
    selectedUserId = null;
    selectedTab = null;
    
    constructor(
        private session: SessionService,
        private service: AcubedMapSharedUserService
    ) {}

    ngOnInit() {
        this.selectedUserId = this.session.getUserId();
        this.selectedTab = 'shared';
    }

    init() {
        this.isOpen = true;
        this._getData();
    }

    private _getData() {
        this.service.getMapShareUsers().then(
            (response: any) => {
                this.sharedUsers = _.filter(response, (d) => {return d.shareType === 'shared'});
                this.sharingUsers = _.filter(response, (d) => {return d.shareType === 'sharing'});
            }, (response: any) => {
                this.sharedUsers = [];
                this.sharingUsers = [];
            }
        );
    }
    
    goMyworkspace() {
        this.selectedUserId = null;
        this.emitMyWorkspace.emit();
    }

    close() {
        this.isOpen = false;
        this.sharedUsers = [];
        this.sharingUsers = [];
    }

    sharedUserClick(user) {
        this.selectedUserId = user.userId;
        this.emitChangeSharedUser.emit(user);
        this.close();
    }

    sharingUserClick(user) {
        this.selectedUserId = user.userId;
        this.emitChangeSharingUser.emit(user);
        this.close();
    }

    destroy() {
        
    }

    ngOnDestroy() {
        this.destroy();
    }
}
