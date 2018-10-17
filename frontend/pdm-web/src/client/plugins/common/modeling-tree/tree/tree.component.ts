import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, ViewEncapsulation } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'tree',
    templateUrl: './tree.html',
    styleUrls: ['./tree.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements OnInit, OnChanges {
    @Input() datas: any[];
    // @Input() childDatas: any[];
    @Output() clickNode: EventEmitter<any> = new EventEmitter();
    // @Output() startLoading: EventEmitter<any> = new EventEmitter();
    // @Output() endLoading: EventEmitter<any> = new EventEmitter();
    @ViewChild('treeview') treeview: any;

    treeDatas: any[];
    lazyLoadFunction: Function;

    treeConfig = {};
selectedNode = null;

    constructor() {
        // this.lazyLoadFunction = this._lazyLoadFunction.bind(this); // wijmo tree lazy load
        this.treeConfig = {
            onClick: (node) => {
                if (this.selectedNode != null) {
                    this.selectedNode.isChecked = false;
                }

                node.isChecked = true;
                this.selectedNode = node;
                this.clickNode.emit({
                    treeview: node
                });
            },
            onFold: (node) => {
                if (this.selectedNode != null) {
                    this.selectedNode.isChecked = false;
                }

                node.isChecked = true;
                this.selectedNode = node;

                if (node.isOpen == undefined || node.isOpen == false) {
                    this.clickNode.emit({
                        treeview: node
                    });
                } else {
                    node.isOpen = !node.isOpen;
                }




            }
        };

    }
    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        // if (changes && !changes.childDatas) {
        //     this.treeDatas = this.datas;
        // } else if (changes && changes.childDatas) {
        //     this.childDatas = changes.childDatas.currentValue;
        // }
        if (changes && changes.datas && changes.datas.currentValue) {
            this.treeDatas = changes.datas.currentValue;
        }
    }

    // nodeClicked(tv: wjcNav.TreeView): void {
    //     this.clickNode.emit({
    //         treeview: tv
    //     });
    // }

    // itemsSourceChanged(tv: wjcNav.TreeView): void {
    //     console.log('itemsSourceChanged', tv);
    // }

    // onItemsSourceChanged(ev) {
    //     console.log('onItemsSourceChanged', ev);
    // }

    // selectedItemChanged(ev) {
    //     console.log('selectedItemChanged', ev);
    // }

    // private _lazyLoadFunction(node: wjcNav.TreeNode, callback: Function): void {
    //     this._setNodeDisabled(true);
    //     this.startLoading.emit({
    //         start: true
    //     });

    //     setTimeout(() => {
    //         this._setNodeDisabled(false);
    //         this.endLoading.emit({
    //             end: true
    //         });
    //         callback(this.childDatas); // child data
    //     }, 2500);
    // }

    // private _setNodeDisabled(isDisabled: boolean): void {
    //     for (let treeNode = this.treeview.getFirstNode(); treeNode; treeNode = treeNode.next()) {
    //         treeNode.isDisabled = isDisabled;
    //     }
    // }
}
