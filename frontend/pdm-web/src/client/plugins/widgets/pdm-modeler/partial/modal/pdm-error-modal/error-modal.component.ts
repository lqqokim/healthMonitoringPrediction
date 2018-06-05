import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalModel } from '../../../../../../common';

@Component({
    moduleId: module.id,
    selector: 'error-modal',
    templateUrl: 'error-modal.component.html'
})
export class ErrorModalComponent implements OnInit {
    @ViewChild('smModal') modal: any;
    title: string;
    errorData: any;
    isApply: boolean = false;


    constructor(
        private element: ElementRef,
    ) { }

    ngOnInit() {
        this.modal.show();
    }

    /**
     * common modal를 호출하면 자동으로 호출됨
     * user-modify.component에 넘겨줄 값을 설정한다.
     */
    setAction(model: ModalModel) {
        this.title = model.info.title;
        this.errorData = {
            requester: model.requester,
            applier: model.info.applier,
            data: model.info.errorData
        };
    }

    close() {
        this.errorData.applier.appliedSuccess({type: 'APPLIED'});
        this.errorData.requester.destroy();
    }

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }

        $(this.element.nativeElement).remove();
    }

}
