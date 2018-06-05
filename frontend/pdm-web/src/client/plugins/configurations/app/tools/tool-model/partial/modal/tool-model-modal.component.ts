import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ModalModel, ModalApplier } from './../../../../../../../common';

@Component({
    moduleId: module.id,
    selector: 'tool-model-modal',
    templateUrl: './tool-model-modal.html'
})
export class ToolModelModalComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: any;

    title: string;
    selectedData: any;
    status: any;
    requester: any;
    showItem: any;
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
                    this.selectedData.requester.execute();
                    this.selectedData.requester.destroy();
                } else if (response.type === 'FAILED') {
                    //TODO: change alert and i18n
                    alert('Failed apply ToolModel modal');
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
        // console.log('ToolModelModalComponent : action--', model);
        this.selectedData = {
            title: model.info.title,
            status: model.info.status,
            requester: model.requester,
            applier: this.applier,
            showItem: model.info.showItem,
            datas: model.info.datas,
            data: model.info.selectedData,
            selectedVerData: model.info.selectedVerData
        };
        this.status = model.info.status;
        this.title = model.info.title;
        this.showItem = model.info.showItem;
    }

    firstCharUpper(value){
        if(value === undefined || value === '') return value;
        return value.substr(0,1).toUpperCase() + value.substr(1);
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
