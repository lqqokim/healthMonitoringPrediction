import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedGroupDetailService } from "./shared-group-detail.service";

@Component({
    moduleId: module.id,
    selector: 'shared-group-detail, div[shared-group-detail]',
    templateUrl : 'shared-group-detail.html',
    providers: [SharedGroupDetailService]
})
export class SharedGroupDetailComponent implements OnInit, OnDestroy {

    private _info: any;

    isOpen: boolean;
    groupInfo: any = {};
    users: any = [];

    constructor(
        private service: SharedGroupDetailService
    ) {}

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    init(data: any) {
        this.isOpen = true;
        this._info = data;
        this._getData();
    }

    private _getData() {
        this.service.getGroupDetail(this._info.id).then(
            (response: any) => {
                this.groupInfo = response;
                console.log(response);
            }, (response: any) => {

            }
        );
        this.service.getGroupUsers(this._info.id).then(
            (response: any) => {
                this.users = response;
                console.log(response);
            }, (response: any) => {

            }
        );
    }

    close() {
        this._info = {};
        this.groupInfo = {};
        this.users = [];
        this.isOpen = false;
    }

}
