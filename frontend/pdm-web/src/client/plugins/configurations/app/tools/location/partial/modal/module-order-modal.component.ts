import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ModalModel, ModalApplier } from './../../../../../../../common';

import * as wjcGrid from 'wijmo/wijmo.grid';

@Component({
    moduleId: module.id,
    selector: 'module-order-modal',
    templateUrl: './module-order-modal.html'
})
export class ModuleOrderModalComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: any;
    @ViewChild('flexModuleOrder') flexModuleOrder: wjcGrid.FlexGrid;

    fieldNames: Array<string> = ['Name', 'Alias', 'Module Order'];
    selectedData;

    selectedOrderData;
    moduleOrderList: Array<any> = [];
    upDisabled: boolean = true;
    downDisabled: boolean = false;

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
                    alert('Failed apply module order');
                }
            },
            (err) => {
                console.log('Apply exception', err.getMessage());
            });
    }

    /**
     * common modal를 호출하면 자동으로 호출
     * tool, module의 modify component로 넘겨줄 값을 설정
     */
    setAction(model: ModalModel) {
        this.selectedData = {
            requester: model.requester,
            applier: this.applier,
            data: model.info.data
        };

        this.moduleOrderList = model.info.data;
        this.selectedOrderData = this.moduleOrderList[0];

        // setTimeout(() => {
        //     for (let i = 0; i < this.moduleOrderList.length; i++) {
        //         this.moduleOrderList[i].moduleOrder = i + 1;
        //     }
        //     this.flexModuleOrder.collectionView.refresh();
        // });
    }

    selectedOrderRow(obj, event): void {
        this.selectedOrderData = obj.selectedItems[0];
        this.upDisabled = this._btnDisabledCheck('up');
        this.downDisabled = this._btnDisabledCheck('down');
    }

    onClickUp(up: string): void {
        let selectedIndex = this.moduleOrderList.indexOf(this.selectedOrderData);

        // Row switching
        let temp = this.moduleOrderList[selectedIndex];
        this.moduleOrderList[selectedIndex] = this.moduleOrderList[selectedIndex - 1];
        this.moduleOrderList[selectedIndex - 1] = temp;

        // Reset module order
        for (let i = 0; i < this.moduleOrderList.length; i++) {
            this.moduleOrderList[i].moduleOrder = i + 1;
        }

        // Wijmo refresh
        this.flexModuleOrder.collectionView.refresh();

        setTimeout(() => {
            this.flexModuleOrder.selection = new wjcGrid.CellRange(selectedIndex - 1, 0, selectedIndex, 2);
        });
    }

    onClickDown(down: String): void {
        let selectedIndex = this.moduleOrderList.indexOf(this.selectedOrderData); // selectedOrderData index

        // Row switching
        let temp = this.moduleOrderList[selectedIndex];
        this.moduleOrderList[selectedIndex] = this.moduleOrderList[selectedIndex + 1];
        this.moduleOrderList[selectedIndex + 1] = temp;

        // Reset module order
        for (let i = 0; i < this.moduleOrderList.length; i++) {
            this.moduleOrderList[i].moduleOrder = i + 1;
        }

        // Wijmo refresh
        this.flexModuleOrder.collectionView.refresh();

        setTimeout(() => {
            this.flexModuleOrder.selection = new wjcGrid.CellRange(selectedIndex + 1, 0, selectedIndex, 2);
        });
    }

    _btnDisabledCheck(direction: string): any {
        if (direction === 'up') {
            if (this.moduleOrderList.indexOf(this.selectedOrderData) === 0) {
                return true;
            } else {
                return false;
            }
        } else if (direction === 'down') {
            if (this.moduleOrderList.indexOf(this.selectedOrderData) === this.moduleOrderList.length - 1) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     *  적용해 달라고 요청함
     */
    apply() {
        this.applier.requestApply();
    }

    ok() {
        this.selectedData.data = this.moduleOrderList;
        this.selectedData.requester.execute();
        this.selectedData.requester.destroy();
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
