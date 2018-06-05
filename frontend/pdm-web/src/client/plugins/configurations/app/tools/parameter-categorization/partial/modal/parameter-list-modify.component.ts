import { Component, Input, Output, OnChanges, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { FdcModelService, ModalApplier } from '../../../../../../../common';
import { Subscription } from 'rxjs/Subscription';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcFilter from 'wijmo/wijmo.grid.filter';

import { Translater } from '../../../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'parameter-list-modify',
    templateUrl: `./parameter-list-modify.html`,
    styleUrls: [`./parameter-list-modify.css`],
})
export class ParameterListModifyComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    @Output() actionChanges = new EventEmitter();

    @ViewChild('WijmoGridInstance') gridInstance: any;
    // @ViewChild('categoryMenu') categoryMenu: any;

    myData: any;
    selectedDatas;
    status: string;
    isSameName: boolean = false;
    isNameValid: boolean = true;

    gridData: any;
    selectAll: boolean = false;

    isLoading: boolean = true;
    isNoData: boolean = false;

    isShowColorMenu: boolean = false;
    isCategoryMenuOpen: boolean = false;

    categories: any;

    selectedItemCount: number = 0;
    totalItemCount: number = 0;

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    private _modifyItems:Array<any> = [];


    constructor(
        private FdcPlusService: FdcModelService,
        private translater: Translater
    ) { }

    ngOnChanges(changes: any): void {
        this.isSameName = false;
        this.isNameValid = true;

        if (changes && changes.data) {
            console.log(changes.data);
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            const reqData = this._selectedData.data;
            this.categories = this._selectedData.categories.map((item: any) => {
                const isPropColor = item.codeProperties.find((data: any) => {
                    return data.propertyName === 'COLOR';
                });

                if (isPropColor) {
                    item.colorCode = isPropColor.propertyValue;
                }

                return item;
            });

            this._loadData(reqData);
            this._waitApply();
        }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._updateParameterList();
                }
            });
    }


    _updateParameterList() {
        const reqDatas = this._modifyItems;
        this.FdcPlusService.updateParamCategories(reqDatas).subscribe((data: any) => {
            this._applier.appliedSuccess();
        }, (err: Error) => {
            this._applier.appliedFailed();
        }, () => {
            this._modifyItems = [];
            console.log('success : modify category...');
        });
    }

    _loadData(reqData: any) {
        this.FdcPlusService.getParamCategories(reqData).subscribe((data: any) => {
            this._setGridFilter();
            this.gridData = new wjcCore.CollectionView(this._setGridData(data));
            this.totalItemCount = this.gridData.totalItemCount;
            this.isLoading = false;
            if (data.rows.length === 0) {
                this.isNoData = true;
            }
        });
    }

    onSelectionChange(event) {
        this.myData.modules = event;
    }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', { field: type })['value'];
    }

    input() {
        this.isNameValid = true;
        this.isSameName = false;
    }

    isValid(isValid) {
        if (isValid === undefined || isValid === null || isValid === '') {
            return false;
        } else {
            return true;
        }
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    /**
     * Wijmo Function
     */
    gridSelectAllRows(value: any) {
        this.selectAll = value;

        let selectYn = this.selectAll;

        this.gridData.items.forEach((d: any, ind: number, arr: Array<any>) => {
            if (d.isSelected !== selectYn) {
                this.gridInstance.setCellData(ind, 'isSelected', this.selectAll);
            }
        });

        if (this.selectAll) {
            this.selectedItemCount = this.gridData.items.length;
            this.gridInstance.select(new wjcGrid.CellRange(0, 0, this.gridData.totalItemCount, 0), true);
        } else {
            this.selectedItemCount = 0;
            this.gridInstance.select(new wjcGrid.CellRange(-1, 0, -1, 0), true);
        }
    }

    gridSelectRow(item: any) {
        // setTimeout(() => {
            this._setSelectAll();
        // }, 100);
    }

    changed(ev: any) {
        setTimeout(() => {
            this.gridData.items.forEach((item: any) => {
                const isFindSelected = this.gridInstance.selectedItems.find((data: any) => {
                    return data.toolId === item.toolId && data.moduleId === item.moduleId && data.paramAlias === item.paramAlias;
                });
                if (isFindSelected) {
                    item.isSelected = true;
                } else {
                    item.isSelected = false;
                }
            });
            this.selectedItemCount = this.gridInstance.selectedItems.length;
        }, 150);
    }

    // mouseup(ev: any) {
    //     const selectedItems = this.gridInstance.selectedItems;
    //     if (selectedItems.length > 0) {
    //         this.isCategoryMenuOpen = true;
    //         console.log(ev.pageX, ev.pageY, " // ", ev.clientX, ev.clientY);

    //         this.categoryMenu.nativeElement.style.left = 370 + 'px';
    //         this.categoryMenu.nativeElement.style.top = (ev.pageY - 100) + 'px';
    //     }
    //     console.log(ev, this.gridInstance);
    // }

    modalOffClick(ev: any) {
        this.isCategoryMenuOpen = false;
    }

    modifyCategory(category: any) {
        this.isCategoryMenuOpen = false;
        const selectedItems = this.gridInstance.selectedItems;
        if (selectedItems.length > 0) {
            selectedItems.forEach((item: any) => {
                item.codeId = category.codeId;
                item.code = category.code;
                item.codeName = category.name;

                const findModifyItem = this._modifyItems.find((findItem:any) => {
                    return findItem.toolId === item.toolId
                        && findItem.moduleId === item.moduleId
                        && findItem.paramAlias === item.paramAlias;
                });

                if(findModifyItem) {
                    // findModifyItem.codeId = category.codeId;
                    // findModifyItem.code = category.code;
                    // findModifyItem.codeName = category.name;
                }else {
                    this._modifyItems.push(item);
                }
            });
            this.gridInstance.refresh();
        }
    }

    _setSelectAll() {
        let isAllUse = true;

        this.gridData.items.every((d, ind, arr) => {
            if (!d.isSelected) {
                isAllUse = false;
                return false;
            } else {
                return true;
            }
        });

        this.selectAll = isAllUse;

        this.selectedItemCount = this.gridData.items.filter((item: any) => {
            return item.isSelected;
        }).length;
    }

    private _setGridData(data: any): wjcCore.ObservableArray {
        let gridData = new wjcCore.ObservableArray();
        let column = data.columns;

        data.rows.forEach((item, ind) => {
            gridData.push(Object.assign({ isSelected: false }, _.object(column, item)));
        });

        return gridData;
    }

    private _setGridFilter() {
        let filter = new wjcFilter.FlexGridFilter(this.gridInstance);
        filter.filterColumns = ['paramAlias', 'codeName', 'toolAlias', 'moduleAlias'];
    }
}
