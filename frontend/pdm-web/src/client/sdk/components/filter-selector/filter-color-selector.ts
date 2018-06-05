import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatchNamePipe } from '../../pipes/match-name.pipe';
import { FilterSelect } from './filter-selector';
import { FormValueChangeType } from '../../core/form.type';

@Component({
    selector: 'a3s-filter-color-select',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix none-border" (offClick)="outsideClick()" scrollable>
            <span class="a3-category-name" *ngIf="label">{{label}} :</span>
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
                                <span class="custom-control-indicator" [ngStyle]="{'background-color': item[colorField]}"></span>
                                <span aria-hidden="true" class="fa" [ngClass]="{'fa-check': item.selected}"></span>
                                <span class="custom-control-description">{{item.label}}</span>
                            </a>
                        </li>
                    </ul>
                    <li class="divider"></li>
                    <li class="a3-categorization-confirm">
                        <div class="a3-categorization-btn">
                            <a class="btn btn-default btn-sm" (click)="$event.preventDefault(); $event.stopPropagation(); closeClick()">Close</a>
                            <a class="btn btn-primary btn-sm" (click)="$event.preventDefault(); $event.stopPropagation(); applyClick()"
                               [ngClass]="{'disabled': selectedItems?.length === 0}">Apply</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    `,
    providers: [
        MatchNamePipe
    ],
    encapsulation: ViewEncapsulation.None,
})
export class FilterColorSelect extends FilterSelect {
    @Input() colorField: string = 'color';
    @Output() apply: EventEmitter<FormValueChangeType> = new EventEmitter<FormValueChangeType>();

    constructor(private matchNamePipe: MatchNamePipe) {
        super(matchNamePipe);
    }

    initComponent() {
        super.initComponent();
    }

    applyClick() {
        this._emitApply();
        this.close();
    }

    closeClick() {
        this.value = _.pluck(this.oldSelectedItems, this.dataField);
        this.close();
    }

    outsideClick() {
        if (this.isOpen) {
            this.closeClick();
        }
    }

    _emitApply() {
        const data: FormValueChangeType = {
            valueItems: this.selectedItems
        };
        this.apply.emit(data);
    }
}
