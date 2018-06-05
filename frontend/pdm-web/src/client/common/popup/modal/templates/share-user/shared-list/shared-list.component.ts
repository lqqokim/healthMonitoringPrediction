import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SharedListService } from "./shared-list.service";

@Component({
    moduleId: module.id,
    selector: 'shared-list',
    templateUrl : 'shared-list.html',
    providers: [SharedListService]
})
export class SharedListComponent implements OnInit, OnDestroy {

    private _info: any;

    users: any;
    sharedMembers: any;
    sharedMembersFilter: any;
    selectedTab: string = 'all'; // all, group, user

    @Output() emitDetailCard = new EventEmitter<any>();
    @Output() emitDeleteCard = new EventEmitter<any>();

    constructor(
        private service: SharedListService
    ) {}

    ngOnInit() {
        console.log('SharedListComponent : ngOnInit');
    }

    ngOnDestroy() {

    }

    init(info: any = null) {
        if (info) this._info = info;
        this._getSharedMembers();
    }

    detailCard(data: any) {
        this.emitDetailCard.emit(data);
    }

    deleteCard(data: any) {
        this.emitDeleteCard.emit(data);
    }

    changeTab(value: string) {
        this.selectedTab = value;
        this.sharedMembersFilter = _.filter(this.sharedMembers, (d) => {
            return this.selectedTab === 'all' ? true : d.type === this.selectedTab;
        });
    }

    private _getSharedMembers() {
        this.service.getSharedMembers(this._info).then(
            (response: any) => {
                this.sharedMembers = response;
                this.sharedMembersFilter = _.clone(response);
            }, (response: any) => {

            }
        );
    }

    // TODO : 로그인 유저를 강제로 삭제해준다. api 수정 되면 삭제
    private _removeLoginUser(data) {
        return _.filter(data, (d) => {
            return d.type === this.selectedTab;
        });
    }

}
