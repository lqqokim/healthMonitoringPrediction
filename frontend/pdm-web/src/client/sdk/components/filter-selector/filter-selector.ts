import { Component, ViewEncapsulation } from '@angular/core';
import { MatchNamePipe } from '../../pipes/match-name.pipe';
import { FormComponent } from '../../core/form-component';
import { Util } from '../../utils/utils.module';

@Component({
    selector: 'a3s-filter-select',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix" scrollable (offClick)="outsideClick()">
            <div class="btn-group">
                <a class="btn btn-default btn-configuration" (click)="open()">
                    <span class="pull-left text-overflow">{{selectedItems.length}} of {{filterItems.length}} Selected</span>
                    <span class="caret pull-right caret-adjustment"></span>
                </a>
                <ul aria-labelledby="dropdownMenu" class="dropdown-menu configuration-multi-menu a3-categorization" style="display:block" *ngIf="isOpen">
                    <div>
                        <li class="configuration-search">
                            <input class="form-control input-sm ng-pristine ng-valid ng-touched" placeholder="Filter" type="text" [(ngModel)]="searchText">
                        </li>
                        <li>
                            <label class="configuration-checkbox checked" (click)="changeAllCheckbox()">
                                <input type="checkbox" class="ng-untouched ng-pristine ng-valid" [checked]="isCheckAll">
                                <label>Check All</label>
                            </label>
                        </li>
                        <li class="divider"></li>
                    </div>
                    <ul class="checkbox-list">
                        <li *ngFor="let item of filterItems | matchName : labelField : searchText">
                            <a class="custom-control custom-checkbox" (click)="itemClick(item)">
                                <input type="checkbox" class="custom-control-input">
                                <span class="custom-control-indicator" style="background-color:#555555"></span>
                                <span aria-hidden="true" class="fa" [ngClass]="{'fa-check': item.selected}"></span>
                                <span class="custom-control-description">{{item.label}}</span>
                            </a>
                        </li>
                    </ul>
                </ul>
            </div>
            
            <!--<a class="btn btn-secondary btn-configuration" (click)="open()">-->
                <!--<span class="pull-left">{{selectedItems.length}} of {{listData.length}} Selected</span>-->
                <!--<span class="pull-right">-->
                    <!--<i class="fa fa-caret-down" aria-hidden="true"></i>-->
                <!--</span>-->
            <!--</a>-->
            <!--<ul aria-labelledby="dropdownMenu" class="dropdown-menu configuration-multi-menu" style="display:block" *ngIf="isOpen">-->
                <!--<div>-->
                    <!--<li class="multi-menu-head">-->
                        <!--<input class="form-control form-control-sm ng-pristine ng-valid ng-touched" [(ngModel)]="searchText" placeholder="Filter" type="text">-->
                    <!--</li>-->
                    <!--<li class="multi-menu-head">-->
                        <!--<div class="form-check mb-0">-->
                            <!--<label class="configuration-checkbox form-check-label checked">-->
                                <!--<input class="form-check-input ng-untouched ng-pristine ng-valid" type="checkbox" [checked]="isCheckAll" (change)="changeAllCheckbox()">-->
                                <!--Check All-->
                            <!--</label>-->
                        <!--</div>-->
                    <!--</li>-->
                    <!--<div class="dropdown-divider"></div>-->
                <!--</div>-->
                <!--<li class="multi-menu-list-group" *ngFor="let item of filterItems | matchName : labelField : searchText">-->
                    <!--<a class="multi-menu-list" (click)="itemClick(item)">-->
                        <!--<span aria-hidden="true" class="fa fa-check" [ngClass]="{'hidden': !item.selected}"></span>-->
                        <!--{{item.label}}-->
                    <!--</a>-->
                <!--</li>-->
            <!--</ul>-->
            
            
        </div>
    `,
    providers: [
        MatchNamePipe
    ],
    encapsulation: ViewEncapsulation.None,
})
export class FilterSelect extends FormComponent {
    isOpen: boolean;
    isCheckAll: boolean;
    searchText: any;
    filterItems: any = [];
    selectedItems: any = [];
    oldSelectedItems: any = [];

    constructor(private _matchNamePipe: MatchNamePipe) {
        super();
    }

    open() {
        this.isOpen = !this.isOpen;
        this.searchText = null;
        this.oldSelectedItems = _.clone(this.selectedItems);
        this._checkAllItems();
    }

    close() {
        this.isOpen = false;
        this.searchText = null;
        this.filterItems = this.listData;
    }

    initComponent() {
        this.filterItems = this.listData || [];
        this.oldSelectedItems = _.clone(this.filterItems);
        this._applySelectedItem();
    }

    updateViewFromValue() {
        this._applySelectedItem();
    }

    _applySelectedItem() {
        const value: Array<any> = Util.Data.object2Array(this.value);
        const items: any = [];
        this.filterItems.forEach((d: any) => {
            d.selected = value.indexOf(d[this.dataField]) > -1;
            if (d.selected) {
                items.push(d);
            }
        });
        this.selectedItems = items;
    }

    itemClick(item: any) {
        item.selected = !item.selected;
        this._selectedItemPushSplice(item);
        this._checkAllItems();
        this._applyValue();
    }

    changeAllCheckbox(isForceAll?: boolean) {
        const checked = this.isCheckAll = isForceAll ? isForceAll : !this.isCheckAll;
        const list = this._matchNamePipe.transform(this.filterItems, this.labelField, this.searchText);
        list.forEach((d: any) => {
            d.selected = checked;
            this._selectedItemPushSplice(d, checked);
        });
        this._applyValue();
    }

    _applyValue() {
        const items = _.filter(this.filterItems, (d:any) => d.selected);
        const value = _.pluck(items, this.dataField);
        this.value = value;
    }

    _checkAllItems() {
        this.isCheckAll = this.selectedItems.length > 0 && this.filterItems.length === this.selectedItems.length;
    }

    _selectedItemPushSplice(item: any, must: any = null) {
        const index: number = Util.Data.findIndex(this.selectedItems, this.dataField, item[this.dataField]);
        const isPush: boolean = index === -1;
        if (must) {
            if (must === true && isPush) {
                this.selectedItems.push(item);
            } else if (must === false && !isPush) {
                this.selectedItems.splice(index, 1);
            }
        } else {
            if (isPush) {
                this.selectedItems.push(item);
            } else {
                this.selectedItems.splice(index, 1);
            }
        }
        // TODO : pipe 작용 때문에 reference를 갱신해주고 있음
        this.selectedItems = this.selectedItems.concat([]);
    }

    outsideClick() {
        if (this.isOpen) {
            this.close();
        }
    }
}
