import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.input';

import { Observable } from 'rxjs/Observable';

import { AcubedMapGridService } from './acubed-map-grid.service';
import { SidebarService } from '../../sidebar.service';
import { RouterService } from '../../../router/router.service';

import {
    // Formatter,
    NotifyService,
    SpinnerComponent
} from '../../../../sdk';

import {
    RequestType,
    ModalAction,
    // ModalModel,
    ModalRequester
} from '../../../../common';

@Component({
    moduleId: module.id,
    selector: 'a3p-acubed-map-grid',
    templateUrl: 'acubed-map-grid.html',
    styleUrls: ['acubed-map-grid.css'],
    providers: [AcubedMapGridService],
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        'class': 'height-full'
    }
})
export class AcubedMapGridComponent implements OnInit, OnDestroy {
    @ViewChild('workspacesGrid') workspacesGrid: wjcGrid.FlexGrid;
    @ViewChild('gridSpinner') gridSpinner: SpinnerComponent;
    @Output() changeAcubedMapData = new EventEmitter<any>();


    gridData: wjcCore.CollectionView;
    isOpen: boolean = false;
    isAllChecked: boolean;

    private _cellToBeEdited: any;
    private data: any;
    private pageComboEl: wjcInput.ComboBox;
    private pageSizeList: Array<number>;

    //wijmo grid filter
    private _filter: string = '';
    private _toFilter: any;

    get gridFilter(): string {
        return this._filter;
    }

    set gridFilter(value: string) {
        if (this._filter !== value) {
            this._filter = value;
            if (this._toFilter) {
                clearTimeout(this._toFilter);
            }
            let self = this;
            this._toFilter = setTimeout( () => {
                self.gridData.refresh();
            }, 500);
        }
    }

    constructor(
        private service: AcubedMapGridService,
        private sidebar: SidebarService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
        private notify: NotifyService,
        private router: RouterService,
        private cookieService: CookieService,
    ) {}

    ngOnInit() {
        // this._getData();
    }

    init() {
        this.isOpen = true;
        this._getData();
        setTimeout(() => {
            this.workspacesGrid.refresh();
        }, 400);
    }

    _getData() {
        this.gridSpinner.showSpinner();
        return this.service.getMyWorkspaces().then(
            (response: any) => {
                this.data = response;
                this._getGrid();
                this.gridSpinner.hideSpinner();
            }, (error: any) => {
                this.gridSpinner.showError();
                console.log('Managing Workspace exception: ', error);
            });
    }

    _getEditedData(data: any) {
        return this.service.getMyWorkspace(data.workspaceId).then(
            (response: any) => {
                let cell = this._cellToBeEdited;
                this.workspacesGrid.setCellData(cell.row.index, 3, response.title);
                this.workspacesGrid.setCellData(cell.row.index, 4, response.description);
                this.workspacesGrid.setCellData(cell.row.index, 8, response.updateDtts);
                setTimeout(() => {
                    this.gridSpinner.hideSpinner();
                }, 100);
            }, (error: any) => {
                this.gridSpinner.showError();
                console.log('Managing Workspace exception: ', error);
            });
    }

    _getGrid() {
        this._getGridData();
        this._getPaging();
        this._gridTooltip();
        this.workspacesGrid.itemFormatter =  this.setItemFormatter();
    }

    setItemFormatter() {
        return (panel: any, r: any, c: any, cell: any) => {
            if (panel.cellType === wjcGrid.CellType.Cell && c === 0) {
                cell.style.borderLeft = '1px solid #ddd';
            }
            if (panel.cellType === wjcGrid.CellType.ColumnHeader && c === 0) {
                cell.style.borderLeft = '1px solid #ddd';
            }
        };
    }

    _getGridData() {
        this.gridData = new wjcCore.CollectionView(this.data);
        this.gridData.filter = this._filterFunction.bind(this);
    }

    _getPaging() {
        let tmpList:Array<number> = [];
        let pageLength = this.gridData.sourceCollection.length / 10;
        for ( let i = 0; i < pageLength; i++ ) {
            tmpList.push((i + 1) * 10);
        };

        this.pageSizeList = tmpList;

        if (!this.pageComboEl) {
            this._getPageCombo();
            this.gridData.pageSize = 10;
        } else {
            this.gridData.pageSize = this.pageComboEl.selectedValue;
        }
    }

    _getPageCombo() {
        // create ComboBox(page list)
        this.pageComboEl = new wjcInput.ComboBox('#pageCombo');
        let cmb = this.pageComboEl;
        // populate the list
        cmb.itemsSource = this.pageSizeList;
        cmb.addEventListener(cmb.hostElement, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        cmb.selectedIndexChanged.addHandler( (sender, e) => {
            this.gridData.pageSize = sender.selectedValue;
        });
    }

    _filterFunction(item: any) {
        //for select filter
        if (!this.gridFilter) return true;
        let filter = this.gridFilter.toLowerCase();
        let val: string = item['workspaceId'].toString();
        let val2: string = item['title'];
        if (val.toLowerCase().indexOf(filter) >= 0 || val2.toLowerCase().indexOf(filter) >= 0) {
            return true;
        }
        return false;
    }

    _gridTooltip() {
        const wjTip = new wjcCore.Tooltip();
        let rng: wjcGrid.CellRange = null;
        this.workspacesGrid.hostElement.addEventListener('mousemove', (evt: MouseEvent) => {
            let ht = this.workspacesGrid.hitTest(evt);
            // new cell selected, show tooltip
            if (ht.cellType === wjcGrid.CellType.Cell) {
                if (ht.col === 4 || ht.col === 6) { // description and sharedWith columns
                    rng = ht.range;
                    let cellElement = document.elementFromPoint(evt.clientX, evt.clientY);
                    let cellBounds = wjcCore.Rect.fromBoundingRect(cellElement.getBoundingClientRect());
                    let data = this.workspacesGrid.getCellData(rng.row, rng.col, true);
                    let font = $('.wj-flexgrid .wj-cell:eq(0)').css('font-size')
                                + ' ' + $('.wj-flexgrid .wj-cell:eq(0)').css('font-family');
                    let twidth = this._getTextWidth(data, font);
                    if (cellBounds.width < twidth) {
                        let tipContent = wjcCore.escapeHtml(data);
                        tipContent = tipContent.replace(/\n/g,'<br>');
                        tipContent = tipContent.replace(/ /g, '&nbsp;');
                        if (cellElement.className.indexOf('wj-cell') > -1) {
                            $('.wj-tooltip').css('word-break', 'break-all');
                            wjTip.show(this.workspacesGrid.hostElement, tipContent, cellBounds);
                        } else {
                            wjTip.hide(); // cell must be behind scroll bar…
                        }
                    }
                }
            }
        });
        this.workspacesGrid.hostElement.addEventListener('mouseout', () => {
            wjTip.hide();
            rng = null;
        });
    }

    _getTextWidth(text: string, font: any) {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.font = font;
        let metrics: TextMetrics = context.measureText(text);
        return metrics.width;
    };

    _deleteGridItem(item: any) {
        if (item.length) {
            for (let i = 0; i < item.length; i++) {
                this.gridData.remove(item[i]);
            };
        } else {
            this.gridData.remove(item);
        }
    }

    isAllCheck( isAll: boolean ) {
        this.isAllChecked = isAll;
        this.gridData.beginUpdate();
        this.gridData._src.forEach( ( d: any, i: number ) => {
            //selection setup
            d.selected = isAll;
        } );
        this.gridData.endUpdate();
        let flex = this.workspacesGrid;
        // get list of selected items
        for (let i = 0; i < flex.rows.length; i++) {
            flex.rows[i].isSelected = isAll;
        };
    }

    isRowSelect(cell: any, isCheck: boolean) {
        cell.item.selected = isCheck;
        cell.row.isSelected = isCheck;
    }

    showGridContext(cell: any) {
        // create menu
        let div = document.createElement('div');
        let menu = new wjcInput.Menu(div, {
            itemsSource: 'Edit, Delete'.split(','),
            itemClicked: (s: any, e: any) => {
                if (menu.selectedIndex === 0) {
                    this.editWorkspace(cell.item);
                    this._cellToBeEdited = cell;
                } else {
                    this.deleteWorkspace(cell.item.workspaceId, cell.item);
                }
            }
        });
        // use it as a context menu for one or more elements
        let contextEl = document.getElementById(cell.item.workspaceId);
        contextEl.addEventListener('click', (e: any) => {
            if (!wjcCore.closest(e.target, '[disabled]')) {
                let dropDown = menu.dropDown;
                menu.owner = contextEl;
                menu.selectedIndex = -1;
                if (menu.onIsDroppedDownChanging(new wjcCore.CancelEventArgs())) {
                    // make sure popup is visible
                    // let left = Math.max(0, Math.min(e.clientX, innerWidth));
                    let top = Math.max(0, Math.min(e.clientY, innerHeight));
                    // calculate popup position
                    let position = {
                        position: 'absolute',
                        left: e.clientX - 60,
                        top: top + 48,
                    };
                    // show the popup
                    wjcCore.showPopup(dropDown, position);
                    e.preventDefault();
                    menu.onIsDroppedDownChanged();
                    dropDown.focus();
                }
            }
        });
    }

    updateFavorite(cell: any, item: any) {
        let favorite: boolean = !item.favorite;
        let param = {
            favorite: favorite
        };
        this.service.updateWorkspaceFavorite(item.workspaceId, param).then(
            (response: any) => {
                this.workspacesGrid.setCellData(cell.row.index, cell.col.index, favorite);
            }, (error: Error) => {
                console.log('favorite update error', error);
            });
    }

    deleteSelectedRows() {
        let flex: any = this.workspacesGrid;
        let deleteList: Array<any> = [];
        let deleteGridList: Array<any> = [];
        // get list of selected items
        // let selectedItems = [];
        // for (let i = 0; i < flex.rows.length; i++) {
        //     // if (flex.rows[i].isSelected) {
        //     if (flex.rows[i]._data.selected) {
        //         selectedItems.push(flex.rows[i].dataItem);
        //     }
        // };
        // delete the selected items
        // for (let i = 0; i < selectedItems.length; i++) {
        //     deleteList.push({ workspaceId : selectedItems[i].workspaceId });
        //     deleteGridList.push(selectedItems[i]);
        // };
        Observable.from(flex.rows)
                .map( rows => {
                    let rowData = rows['dataItem'];
                    return rowData;
                })
                .filter(rowData => rowData['selected'])
                .subscribe(rowData => {
                    deleteList.push({ workspaceId : rowData.workspaceId });
                    deleteGridList.push(rowData);
                });
        if (!deleteGridList || deleteGridList.length === 0) {
            this._alert();
            return;
        }

        this.deleteWorkspace(deleteList, deleteGridList);
    }

    _alert() {
        this.modalAction.showAlert({
            info: {
                confirmMessage: 'MESSAGE.ACUBED_MAP.GRID.NO_SELECTED_WORKSPACE'
            },
            requester: this.modalRequester
        });
    }

    editWorkspace(selectedData: any) {
        this.modalAction.showEditWorkspace({
            info: {
                data: selectedData,
            },
            requester: this.modalRequester
        });
        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                console.log('editWorkspace ok', response.data);
                this.gridSpinner.showSpinner();
                this.service.updateWorkspace(response.data).then(
                    (response: any) => {
                        this._getEditedData(response);
                        this.goChangeAcubedMapData();
                        // this.notify.success("MESSAGE.ACUBED_MAP.GRID.MODIFIED_WORKSPACE");
                    }, (err: any) => {
                        // this.notify.error('MESSAGE.ACUBED_MAP.GRID.MODIFYING_ERROR_WORKSPACE');
                        this.gridSpinner.showError();
                        console.log('Error edit modal', err);
                    });
            }
        });
    }

    deleteWorkspace(workspaceId: any, deleteItem: any) {
        this.modalAction.showConfirmDelete({
            info: {
                confirmMessage: 'MESSAGE.ACUBED_MAP.GRID.REMOVE_SELECTED_WORKSPACE',
                workspaceId: workspaceId
            },
            requester: this.modalRequester
        });

        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            let promise: Promise<any>;
            if (response.type === 'OK' && response.data) {
                if (response.data.workspaceId) {
                    if (typeof response.data.workspaceId === 'object') {
                        promise = this.service.multiDeleteWorkspace(response.data.workspaceId);
                    } else {
                        promise = this.service.deleteWorkspace(response.data.workspaceId);
                    }
                    // this.gridSpinner.showSpinner();
                    promise.then((response: any) => {
                        this._deleteGridItem(deleteItem);
                        this.goChangeAcubedMapData();
                    });
                }
            }
        });
    }

    viewChange() {
        this.isOpen = false;
    }

    goChangeAcubedMapData() {
        this.changeAcubedMapData.emit();
    }

    goWorkspace(workspaceId: number){
        return this.service.getWorkspace(workspaceId);
    }

    // tslint:disable-next-line:no-empty
    ngOnDestroy() {
    }

}
