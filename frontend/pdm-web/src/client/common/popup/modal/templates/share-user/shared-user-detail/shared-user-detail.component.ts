import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedUserDetailService } from "./shared-user-detail.service";

@Component({
    moduleId: module.id,
    selector: 'shared-user-detail, div[shared-user-detail]',
    templateUrl : 'shared-user-detail.html',
    providers: [SharedUserDetailService]
})
export class SharedUserDetailComponent implements OnInit, OnDestroy {

    private _info: any;

    isOpen: boolean;
    userInfo: any = {};

    constructor(
        private service: SharedUserDetailService
    ) {}


    ngOnInit() {

    }

    ngOnDestroy() {

    }

    init(data: any) {
        this._info = data;
        this.isOpen = true;
        this._getData();
    }

    private _getData() {
        this.service.getUserDetail(this._info.id).then(
            (response: any) => {
                this.userInfo = response;
                console.log(response);
            }, (response: any) => {

            }
        );
    }

    close() {
        this.isOpen = false;
        this.userInfo = {};
        this._info = {};
    }

}
