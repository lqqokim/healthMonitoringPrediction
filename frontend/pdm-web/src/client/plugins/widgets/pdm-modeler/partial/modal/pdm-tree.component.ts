import * as wjcNav from 'wijmo/wijmo.nav';

import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalModel } from '../../../../../common';

@Component({
    moduleId: module.id,
    selector: 'pdm-tree',
    templateUrl: './pdm-tree.component.html',
    styleUrls: ['./pdm-tree.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmTreeComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: any;
    title: string;
    treeData: any;
    selectedItem: any;
    selectedPath: Array<string | any>;
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
        this.treeData = {
            requester: model.requester,
            applier: model.info.applier,
            data: model.info.treeData,
        };
    }

    itemClick(treeView: wjcNav.TreeView) {
        if (treeView.selectedItem.type === 'eqp') {
            this.isApply = true;
            this.selectedPath = treeView.selectedPath;
            this.selectedItem = treeView.selectedItem;
        } else {
            this.isApply = false;
        }

    }

    /**
     *  적용해 달라고 요청함
     */
    apply() {
        // this.applier.requestApply();
        const selectedTree = {
            selectedItem: this.selectedItem,
            selectedPath: this.selectedPath
        };

        this.treeData.applier.appliedSuccess(selectedTree);
    }

    close() {
        this.treeData.requester.cancel();
        this.treeData.requester.destroy();
    }

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }

        $(this.element.nativeElement).remove();
    }
}
