import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ModalModel, ModalApplier } from './../../../../../../../common';

@Component({
    moduleId: module.id,
    selector: 'menu-function-modal',
    templateUrl: 'menu-function-modal.component.html'
})
export class MenuFunctionModalComponent implements OnInit, OnDestroy {
    @ViewChild('mfModal') modal : any;
    title: string;
    selectedData: any;
    private _subscription: Subscription;

    constructor(
        private modalApplier: ModalApplier,
        private element: ElementRef
    ) { }

    ngOnInit() {
        this.modal.show();
        this._listenApplied();
    }
    _listenApplied() {
        this._subscription = this.modalApplier
            .listenApplySuccess()
            .subscribe((response) => {
                if (response.type === 'APPLIED') {
                    this.selectedData.requester.execute();
                    this.selectedData.requester.destroy();
                } else if (response.type === 'FAILED') {
                    //TODO: change alert and i18n
                    alert('Failed apply MenuFunction info');
                }
            },
            (err) => {
                console.log('Apply exception', err.getMessage());
            });
    }

    setAction(model: ModalModel): void {
        this.title = model.info.title;
        this.selectedData = {
            status: model.info.status,
            requester: model.requester,
            applier: this.modalApplier,
            data: model.info.selectedData,
            kinds: model.info.kinds
        };
    }

    apply(): void {
        this.modalApplier.requestApply();
    }

    close(): void {
        this.selectedData.requester.cancel();
        this.selectedData.requester.destroy();
    }
    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }

        $(this.element.nativeElement).remove();

        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

}
