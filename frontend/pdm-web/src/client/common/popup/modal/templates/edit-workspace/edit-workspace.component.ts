import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { ModalDirective } from '../../../../../sdk';
import { ModalModel } from '../../../../app-state/modal/modal.type';

import { SharedBodyComponent } from '../share-user/shared-body/shared-body.component';

@Component({
    moduleId: module.id,
    selector: 'edit-workspace',
    templateUrl : 'edit-workspace.html',
})
export class EditWorkspaceComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: ModalDirective;
    @ViewChild('shareBody') shareBodyEl: SharedBodyComponent;

    info: any;
    editData: any;
    requester: any;
    slideOpen: boolean = false;

    constructor(private element: ElementRef) { }

    ngOnInit() {
        this.modal.show();
    }

    setAction(action: ModalModel) {
        // console.log('EditWorkspaceComponent : setAction', action);
        this.info = action.info;
        this.editData = action.info.data;
        this.requester = action.requester;
   }

    ok() {
        this.requester.execute();
        this.requester.destroy();
    }

    cancel() {
        this.requester.cancel();
        this.requester.destroy();
    }

    toggleCheck(d: any) {
        this.slideOpen = d;
        let shareInfo = {
            id: this.info.data.workspaceId,
            type: A3_CONFIG.MODAL.TYPE.SHARE_WORKSPACE
        };
        this.shareBodyEl.init(shareInfo);
    }

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }

        $(this.element.nativeElement).remove();
    }

}
