import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ModalDirective } from '../../../../../sdk';

import { ModalModel } from '../../../../app-state/modal/modal.type';
import { ModalRequester } from '../../modal-requester';

@Component({
    moduleId: module.id,
    selector: 'modal-confirm',
    templateUrl : 'confirm.html'
})
export class ConfirmComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: ModalDirective;
    title: any;
    confirmMessage: any;
    requester: any;

    constructor(private element: ElementRef) { }

    ngOnInit() {
        this.modal.show();
    }

    setAction(action: ModalModel) {
        this.title = action.info.title;
        this.confirmMessage = action.info.confirmMessage;
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

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }

        $(this.element.nativeElement).remove();
    }

}