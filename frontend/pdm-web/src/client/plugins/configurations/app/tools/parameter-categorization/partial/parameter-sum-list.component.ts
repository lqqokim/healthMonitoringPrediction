import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcFilter from 'wijmo/wijmo.grid.filter';

import {
    FdcModelService,
    ModalAction,
    ModalRequester,
    RequestType,
    WijmoApi
} from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';
import { ModuleTypeModalModule } from './modal/parameter-list-modal.module';

@Component({
    moduleId: module.id,
    selector: 'parameter-sum-list',
    templateUrl: `parameter-sum-list.html`,
    providers: [FdcModelService],
    host: {
        'class': 'height-full'
    }
})
export class ParameterSumListComponent extends WijmoApi {

    @ViewChild('WijmoGridInstance') gridInstance: any;

    @Input()
    set categories(data: any) {
        if (!data) return;
        if (!data.itemList) return;
        const itemList = data.itemList;
        const isResetParamSum = data.isResetParamSum;
        if (!itemList) return;
        // 'Uncategorized' 맨뒤로.....
        let uncategorizedIndex = 0;
        for (let i: number = 0; i < itemList.length; i++) {
            if (itemList[i]['code'] === 'Uncategorized') {
                uncategorizedIndex = i;
                break;
            }
        }
        this.itemMove(itemList, uncategorizedIndex, itemList.length - 1);
        // console.log('set reposition categories ==> ', target, uncategorizedIndex);
        // this._categories = itemList.filter((item: any) => {
        //     return item.used;
        // });
        if (this.gridData) {
            //MIDFD-1168
            if (isResetParamSum) {
                this._resetParameterSummary();
            }
        }
        this._categories = itemList;
        setTimeout(() => {
            this.listGridSetting(this._categories);
        });
        this._isHoldGridSelection = true;
        this.getParamCategorySum();
    }
    get categories() {
        return this._categories;
    }

    @Input() isEditModeByCategory: any;

    // @Output() dataLoadCompleted: EventEmitter<any> = new EventEmitter();
    // @Output() parameterListChange: EventEmitter<any> = new EventEmitter();
    @Output() configureChambers: EventEmitter<any> = new EventEmitter();

    selectAll: boolean = false;
    gridData: wjcCore.CollectionView = null;
    isWijmoFirstInit: boolean = false;
    // wijmoColumns: any;

    isLoading: boolean = false;

    isItemSourceChanged = false;

    private _categories: any;
    private selectedChamberIds: any = []; // selected moduleIds on config list
    private _paramCategorySumDatas: any;

    private _gridFilter: wjcFilter.FlexGridFilter;
    private _isHoldGridSelection = false;
    private _gridSelection = undefined;

    constructor(
        private FdcPlusService: FdcModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater
    ) {
        super();
    }

    ngOnInit() {
        this._resetGridOption();
    }



    getParamCategorySum() {
        this.FdcPlusService.getParamCategorySum().subscribe((data: any) => {
            this._paramCategorySumDatas = data;

            this.gridData = new wjcCore.CollectionView(this._setGridData(data));
            if (localStorage['sortDescriptions_property'] &&
                localStorage['sortDescriptions_ascending']) {
                this.gridData.sortDescriptions.push(new wjcCore.SortDescription(
                    localStorage['sortDescriptions_property'],
                    localStorage['sortDescriptions_ascending'] === 'true'));
            }
            this.gridData.sortDescriptions.collectionChanged.addHandler((s, e) => {
                if (s[0]) {
                    if ((s[0].property !== 'isSelected')) {
                        localStorage['sortDescriptions_property'] = s[0].property;
                        localStorage['sortDescriptions_ascending'] = s[0].ascending;
                    }
                } else {
                    // localStorage['sortDescriptions_property'] = undefined;
                    // localStorage['sortDescriptions_ascending'] = undefined;
                }
            });
            // this.gridData.sortDescriptions.push(new wjcCore.SortDescription('waferStartDtts', false));
        }, (err: Error) => {
            throw err;
        }, () => {
            // complete data loading.
            setTimeout(() => {
                if (localStorage['filter']) {
                    this._gridFilter.filterDefinition = localStorage['filter'];
                }
                // this.gridData.refresh();
                setTimeout(() => {
                    this.isLoading = false;
                }, 100);
            });
        });
    }


    /**
     * Wijmo Function
     */
    
    gridSelectAllRows(value: any) {
        this.selectAll = value;
        if (!this.selectAll) this.selectedChamberIds = [];

        let selectYn = this.selectAll;

        this.gridData.items.forEach((d: any, ind: number, arr: Array<any>) => {
            if (d.isSelected !== selectYn) {
                if (selectYn && this.selectedChamberIds.map((d) => { return d; }).indexOf(d.moduleId) === -1) {
                    this.selectedChamberIds.push(d.moduleId);
                }
                this.gridInstance.setCellData(ind, 'isSelected', this.selectAll);
            }
        });

        if (localStorage['sortDescriptions_property'] &&
            localStorage['sortDescriptions_ascending']) {
            this.gridData.sortDescriptions.push(new wjcCore.SortDescription(
                localStorage['sortDescriptions_property'],
                localStorage['sortDescriptions_ascending'] === 'true'));
        }
    }

    gridSelectRow(item: any) {
        if (item.isSelected) {
            this.selectedChamberIds.push(item.moduleId);
        } else {
            let index = this.selectedChamberIds.map((d) => { return d; }).indexOf(item.moduleId);
            if (index > -1) {
                this.selectedChamberIds.splice(index, 1);
            }
        }

        this._setSelectAll();

        this.gridData.selectedCount = this.selectedChamberIds.length;
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
    }

    openConfig(data: any) {
        if (this.isEditModeByCategory) {
            return;
        }
        console.log('Click config - ', data);
        if (data) {
            const moduleId = data.item.moduleId;
            this._controlModuleType([moduleId]);
        } else {
            const moduleIds = this.selectedChamberIds;
            this._controlModuleType(moduleIds);
        }
    }

    _controlModuleType(moduleIds: any) {
        this.modalAction.showConfiguration({
            module: ModuleTypeModalModule,
            info: {
                title: 'Parameter List',
                // selectedData: data,
                moduleIds: moduleIds,
                categories: this.categories
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this.isLoading = true;
                // this._resetParameterSummary();
                this._isHoldGridSelection = true;
                this.getParamCategorySum();
            }
        });
    }

    isDisableColumn(category: any) {
        if (category.used) {
            return '';
        } else {
            return 'disabled';
        }
    }

    columnStyle(colDef) {
        const getColor = colDef.codeProperties.find((item: any) => {
            return item.propertyName === 'COLOR';
        }).propertyValue;
        let style = {
            'background-color': getColor
        };
        return style;
    }

    selectionChanging(ev: any) {
        console.log('selectionChanging : ', ev);
        if(!this._isHoldGridSelection) {
            this._gridSelection = Object.assign({}, ev.range);
        }

        if(this.isItemSourceChanged) {
            this.isItemSourceChanged = false;
            this._isHoldGridSelection = false;
        }
    }

    itemsSourceChanged(ev: any) {
        console.log('itemsSourceChanged : ', ev);
        setTimeout(() => {
            if(this._gridSelection) {
                this.isItemSourceChanged = true;
                const row = this._gridSelection._row;
                const row2 = this._gridSelection._row2;
                this.gridInstance.select(new wjcGrid.CellRange(row, 0, row2, 0), true);
            }else{
                this._isHoldGridSelection = false;
            }
        });
    }


    private _resetGridOption() {
        localStorage.removeItem('sortDescriptions_property');
        localStorage.removeItem('sortDescriptions_ascending');
        localStorage.removeItem('filter');
    }

    private itemMove(array: Array<any>, oldIndex: number, newIndex: number) {
        if (newIndex >= array.length) {
            newIndex = array.length - 1;
        }
        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
        return array;
    }

    //grid 의 columnHeader 병합 / 셀 설정.
    private listGridSetting(categoriesData: any) {
        let disableCellIdx = [];
        this.gridInstance.allowMerging = wjcGrid.AllowMerging.ColumnHeaders;

        if (this.gridInstance.columnHeaders.rows.length === 1) {
            let hr = new wjcGrid.Row();
            this.gridInstance.columnHeaders.rows.push(hr);
            this.gridInstance.columnHeaders.rows[0].allowMerging = true;
        }

        for (let j = 0; j < this.gridInstance.columns.length; j++) {
            let data = this.gridInstance._cols[j]._hdr,
                key = (this.gridInstance._cols[j]._binding) ? this.gridInstance._cols[j]._binding._key : undefined;

            if (key) {
                const isCategoryMenu = categoriesData.find((item) => item.code === key)
                    || key.indexOf('totalCount') > -1 || key.indexOf(A3_CODE.DFD.PARAMETER_NONE_PRIORITY.code) > -1;
                if (isCategoryMenu) {
                    data = 'Parameter';
                    if (isCategoryMenu.used !== undefined && !isCategoryMenu.used) {
                        disableCellIdx.push(j);
                    }
                    if (isCategoryMenu.code === A3_CODE.DFD.PARAMETER_NONE_PRIORITY.code) {
                        disableCellIdx.push(j);
                    }
                }
            }
            this.gridInstance.columns[j].allowDragging = false;
            this.gridInstance.columns[j].allowMerging = true;
            this.gridInstance.columnHeaders.setCellData(0, j, data);
        }

        this._gridCellDisabled(disableCellIdx);

        // return;
        if (!this.isWijmoFirstInit) {
            this.isWijmoFirstInit = true;

            // filter
            if (!this._gridFilter) {
                this._gridFilter = new wjcFilter.FlexGridFilter(this.gridInstance);
                this._gridFilter.filterColumns = ['toolAlias', 'moduleAlias'];
                this._gridFilter.filterChanged.addHandler((s: any, e: any) => {
                    localStorage['filter'] = s.filterDefinition;
                });
            }

            //Header Sorting event
            this.gridInstance.hostElement.addEventListener('click', (e: any) => {
                let hitTestInfo = this.gridInstance.hitTest(e);
                //check if clicked cell is column header and first row
                if (hitTestInfo.cellType === wjcGrid.CellType.ColumnHeader && hitTestInfo.row === 0) {
                    if (hitTestInfo.col > 2) return;
                    //get the binding to sort
                    var colName = this.gridInstance.columns[hitTestInfo.col].binding;
                    var ascending = false;

                    if (colName === 'isSelected') return;

                    //store the sort order
                    if (this.gridData.sortDescriptions.length !== 0
                        && this.gridData.sortDescriptions[0].property === colName) ascending = this.gridData.sortDescriptions[0].ascending;
                    // remove current sort (if any)
                    this.gridData.sortDescriptions.clear();

                    this.gridData.col = colName;
                    this.gridData.dir = (ascending) ? 'a' : 'd';
                    //apply the sort manually
                    this.gridData.sortDescriptions.push(new wjcCore.SortDescription(colName, !ascending));
                }
            });
        }
    }

    private _gridCellDisabled(disableCellIdx) {
        // header set css
        this.gridInstance.formatItem.addHandler((s, e) => {
            if (e.cell.className.indexOf('wj-header') > -1) {
                // if (e.cell.innerHTML.indexOf('checkbox') === -1 && e.cell.innerHTML.indexOf('button') === -1) {
                //     //Parameter Columns..
                //     const isParameterMenu = this.categories.find((category: any) => {
                //         let retVal = false;
                //         //col 세번째부터 체크.
                //         if (e.col > 2) {
                //             //정렬되어있지 않는 상태일 경우, code 명으로 출력됨. ( 226줄 참조 )
                //             if (e.cell.innerHTML === category.code) {
                //                 retVal = true;
                //             } else {
                //                 //정렬상태일 경우, code 명과 함께 html 테그가 포함되어지므로
                //                 //앞뒤 공백제거한 innerText 을 기준으로 체크함.
                //                 const innerText = e.cell.innerText.replace(/(^\s*)|(\s*$)/g, '');
                //                 if (innerText === category.code) {
                //                     retVal = true;
                //                 }
                //             }
                //         }
                //         return retVal;
                //     });

                //     if (isParameterMenu) {
                //         const getColorCode = isParameterMenu.codeProperties.find((item: any) => {
                //             return item.propertyName === 'COLOR';
                //         });

                //         if (getColorCode) {
                //             const template = '<div class="text-ellipsis" title="' + isParameterMenu.name + '">'
                //                 + isParameterMenu.name + '</div>';
                //             if (isParameterMenu.code === 'Z') {
                //                 //code 가 Z 인것은 name 이 uncategorized 으로 나옴.
                //                 // const newHTML = '<div><div class="parameter-color" style="background-color:'
                //                 //     + getColorCode.propertyValue + ';"></div>' + template + '</div>';
                //                 const newHTML = '<div><div class="parameter-color" style="background-color:'
                //                     + getColorCode.propertyValue + ';"></div>' + template + '</div>';
                //                 e.cell.innerHTML = newHTML;
                //             } else {
                //                 const newHTML = '<div><div class="parameter-color" style="background-color:'
                //                     + getColorCode.propertyValue + ';"></div><div class="text-ellipsis" title="' + isParameterMenu.name + '">' + e.cell.innerHTML + '</div></div>';
                //                 e.cell.innerHTML = newHTML;
                //             }
                //         } else {
                //             // e.cell.innerHTML = '<div>' + isParameterMenu.name + '</div>';
                //             e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                //         }
                //     } else {
                //         e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                //     }
                // }
                wjcCore.setCss(e.cell, {
                    display: 'table',
                    tableLayout: 'fixed',
                    textAlign: 'center'
                });
                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                });
            }
        });

        this.gridInstance.formatItem.addHandler((s, e) => {
            if (e.cell.className.indexOf('wj-header') === -1) {
                const isDisabledColumn = disableCellIdx.find((idx: any) => {
                    return idx === e.col;
                });

                if (isDisabledColumn) {
                    wjcCore.addClass(e.cell, 'disabled');
                } else {
                    wjcCore.removeClass(e.cell, 'disabled');
                }
            }
        });
    }

    private _resetParameterSummary() {
        this.gridSelectAllRows(false);
    }

    private _setGridData(data: any): wjcCore.ObservableArray {
        let gridData = new wjcCore.ObservableArray();
        let column = data.columns;

        const idxList = {
            toolName: column.findIndex((item: any) => item === 'toolName'),
            toolAlias: column.findIndex((item: any) => item === 'toolAlias'),
            moduleName: column.findIndex((item: any) => item === 'moduleName'),
            moduleAlias: column.findIndex((item: any) => item === 'moduleAlias')
        };

        data.rows.forEach((item, ind) => {
            if (item[idxList['toolAlias']] === null) {
                item[idxList['toolAlias']] = item[idxList['toolName']];
            }
            if (item[idxList['moduleAlias']] === null) {
                item[idxList['moduleAlias']] = item[idxList['moduleName']];
            }
            const newData = _.object(column, item);

            // Category 신규, 수정, 삭제시에도, select items 을 유지하고 싶을 경우, 아래 주석 해제.
            if (this.gridData) {
                // const findOriData = _.where(this.gridData.items, { toolId: newData.toolId, moduleId: newData.moduleId });
                const findOriData = _.where(this.gridData.sourceCollection, { toolId: newData.toolId, moduleId: newData.moduleId });
                if (findOriData && findOriData.length > 0) {
                    gridData.push(Object.assign({ isSelected: findOriData[0].isSelected }, newData));
                } else {
                    gridData.push(Object.assign({ isSelected: false }, newData));
                }
            } else {
                gridData.push(Object.assign({ isSelected: false }, newData));
            }
        });

        return gridData;
    }
}
