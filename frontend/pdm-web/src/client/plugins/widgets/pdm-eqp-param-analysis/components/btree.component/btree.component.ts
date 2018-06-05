// tslint:disable-next-line:max-line-length
import { Component, OnInit, Input, Output, ViewChild, ElementRef, OnChanges, EventEmitter, ViewEncapsulation, SimpleChanges } from '@angular/core';


declare var $: any;

//Wijmo
import * as wjcNav from 'wijmo/wijmo.nav';

@Component({
  moduleId: module.id,
  selector: 'btree',
  templateUrl: 'btree.component.html',
  styleUrls: ['btree.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BTreeComponent implements OnInit, OnChanges {
  @Output() nodeClick = new EventEmitter();
  @Input()
  set datas(value: any) {
    this._datas = value;
  }
  get datas() {
    return this._datas;
  }
  @Input()
  set selectNode(value: any) {
    this._selectNode = value;
  }
  get selectNode() {
    return this._selectNode;
  }

  @ViewChild('tree') tree: ElementRef;
  @ViewChild('tv') tv;

  selectedObj: any;
  _datas: any;
  _selectNode: any;

  // tslint:disable-next-line:no-empty
  constructor() {
  }

  // tslint:disable-next-line:no-empty
  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectNode'] && this._selectNode !== undefined && this._selectNode !== '') {
      if (this.tv.selectedNode) {
        this.tv.selectedNode.isCollapsed = true;
      }
      this.selectedObj = this.searchTree(this.datas[0], this._selectNode);
      setTimeout(() => {
        this.tv.collapseToLevel(0);
        this.tv.selectedItem = this.selectedObj; // selectedItem이 null이면 selectedNode는 undefined이기 때문에
        this.tv.selectedNode.isCollapsed = false;
        this.nodeClick.emit(this.tv.selectedNode);
      }, 500);
    }
  }

  // setSelectNode(nodeId) {
  //   this.selectedObj = this.searchTree(this.datas[0], this.selectNode);
  //   this.tv.selectedItem = this.selectedObj;
  //   this.nodeClick.emit(this.selectedObj);
  // }

  // Wijmo tree
  selectedNode(treeview: wjcNav.TreeView): void {
    this.selectedObj = treeview.selectedNode;
    this.nodeClick.emit(this.selectedObj);
  }

  searchTree(data, value) { // Search data about eqpId
    if (data.nodeId === value) {
      return data;
    }
    if (data.children && data.children.length > 0) {
      for (let i = 0; i < data.children.length; i++) {
        const node = this.searchTree(data.children[i], value);
        if (node !== null) {
          return node;
        }
      }
    }
    return null;
  }

}
