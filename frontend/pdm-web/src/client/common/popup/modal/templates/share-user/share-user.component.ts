import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalDirective } from '../../../../../sdk';
import { ModalModel } from '../../../../app-state/modal/modal.type';
import { SharedBodyComponent } from "./shared-body/shared-body.component";

@Component({
    moduleId: module.id,
    selector: 'modal-share-user',
    templateUrl : 'share-user.html'
})
export class ShareUserComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('smModal') modal: ModalDirective;
    @ViewChild('shareBody') shareBodyEl: SharedBodyComponent;

    info: any;
    requester: any;

    constructor(private element: ElementRef) { }

    ngOnInit() {
        console.log('ShareUserComponent : ngOnInit');
        this.modal.show();
    }

    ngAfterViewInit() {
        console.log('ShareUserComponent : ngAfterViewInit');
    }

    setAction(action: ModalModel) {
        console.log('ShareUserComponent : setAction', action);
        this.info = action.info;
        this.requester = action.requester;
        this.shareBodyEl.init(this.info);
    }

    ok() {
        this.requester.execute();
        this.requester.destroy();
    }

    cancel() {
        this.requester.cancel();
        this.requester.destroy();
    }

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }
        $(this.element.nativeElement).remove();
    }

}
