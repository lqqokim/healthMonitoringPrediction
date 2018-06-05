import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild
} from '@angular/core';
import { SharedListComponent } from "../shared-list/shared-list.component";
import { SharedGroupDetailComponent } from "../shared-group-detail/shared-group-detail.component";
import { SharedUserDetailComponent } from "../shared-user-detail/shared-user-detail.component";
import { SharedBodyService } from "./shared-body.service";

@Component({
    moduleId: module.id,
    selector: 'shared-body',
    templateUrl : 'shared-body.html',
    providers: [SharedBodyService]
})
export class SharedBodyComponent implements OnInit, OnDestroy {

    @ViewChild('sharedList') sharedListEl: SharedListComponent;
    @ViewChild('sharedGroupDetail') sharedGroupDetailEl: SharedGroupDetailComponent;
    @ViewChild('sharedUserDetail') sharedUserDetailEl: SharedUserDetailComponent;

    private _info: any;

    members: any;
    selectedMember: any;

    constructor(
        private service: SharedBodyService
    ) {}

    ngOnInit() {
        console.log('SharedBodyComponent : ngOnInit');
    }

    ngOnDestroy() {

    }

    init(info: any) {
        this._info = info;
        this._getMembers();
        this.sharedListEl.init(info);
    }

    private _getMembers() {
        this.service.getMembers().then(
            (response: any) => {
                this.members = response;
                // console.log(response);
            }, (response: any) => {

            }
        );
    }

    detailCard(data: any) {
        if (data.type === 'group') {
            this.sharedGroupDetailEl.init(data);
        } else {
            this.sharedUserDetailEl.init(data);
        }
        console.log('detailCard',data)
    }

    saveMembers(data: any) {
        let params = {
            id: this._info.id,
            type: this._info.type
        };
        let request = [_.findWhere(this.members, {id: this.selectedMember})];
        this.service.saveMembers(params, request).then(
            (response: any) => {
                this.sharedListEl.init();
                this.selectedMember = null;
                console.log('this.service.saveMembers success');
            }
        );
    }

    deleteCard(data: any) {
        let params = {
            id: this._info.id,
            type: this._info.type
        };
        let request = [data];
        this.service.deleteMembers(params, request).then(
            (response: any) => {
                this.sharedListEl.init();
                this.selectedMember = null;
                console.log('this.service.deleteMembers success');
            }
        );
    }

}
