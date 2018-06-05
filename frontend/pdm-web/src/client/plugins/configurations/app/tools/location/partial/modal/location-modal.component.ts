import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ModalModel, ModalApplier } from './../../../../../../../common';

@Component({
    moduleId: module.id,
    selector: 'location-modal',
    templateUrl: './location-modal.html'
})
export class LocationModalComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: any;
    title: string;
    selectedData: any;
    status: any;
    requester: any;
    location: any;
    currentAction: any;
    module: any;
    tool: any;
    isReadOnly: boolean;
    validityState: boolean;

    private _subscription: Subscription;

    constructor(
        private element: ElementRef,
        private applier: ModalApplier
    ) { }

    ngOnInit() {
        this.modal.show();
        this._listenApplied();
    }

    /**
     *  성공인지를 기다림
     */
    _listenApplied() {
        this._subscription = this.applier
            .listenApplySuccess()
            .subscribe((response) => {
                if (response.type === 'APPLIED') {
                    this.selectedData.requester.update(response.data);
                    this.selectedData.requester.destroy();
                } else if (response.type === 'FAILED') {
                    //TODO: change alert and i18n
                    alert('Failed apply location modal');
                }
            },
            (err) => {
                console.log('Apply exception', err.getMessage());
            });
    }

    /**
     * common modal를 호출하면 자동으로 호출됨
     * user-modify.component에 넘겨줄 값을 설정한다.
     */
    setAction(model: ModalModel) {
        console.log('LocationModalComponent : action--', model);
        this.title = model.info.title;
        this.selectedData = {
            status: model.info.status,
            requester: model.requester,
            applier: this.applier,
            location: model.info.location,
            currentAction: model.info.currentAction,
            module: model.info.module,
            tool: model.info.tool
        };
        this.status = model.info.status;
        // this.requester = model.requester;
        // this.applier = this.applier;
        this.isReadOnly = model.info.isReadOnly;
        this.location = model.info.location;
        this.currentAction = model.info.currentAction;
        this.module = model.info.module;
        this.tool = model.info.tool;

    }

    actionChange(event) {
        // $('#myModal').modal('hide');
        this.close();
        if (event.value != "cancel") {
            //this.getLocationData();
            // this.childcmp.refresh();
        }
    }

    validityStateChange(state: boolean) {
        this.validityState = state;
    }

    /**
     *  적용해 달라고 요청함
     */
    apply() {
        this.applier.requestApply();
    }

    close() {
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
