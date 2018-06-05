import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';

import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { Translater } from '../../../sdk';
import { PdmAreaStatusOverviewService } from './pdm-area-status-overview.service';

import * as wjcCore from 'wijmo/wijmo';
import * as wjGrid from 'wijmo/wijmo.grid';

import { PdmCommonService } from '../../../common/service/pdm-common.service';

@Component({
    moduleId: module.id,
    selector: 'pdm-area-status-overview',
    templateUrl: 'pdm-area-status-overview.html',
    styleUrls: ['pdm-area-status-overview.css'],
    providers: [PdmAreaStatusOverviewService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmAreaStatusOverviewComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {

    areaColumn: string;
    data: wjcCore.CollectionView;
    @ViewChild('shopGrid') shopGrid: wjGrid.FlexGrid;

    private _props: any;
    private _plant: any;
    private _timePeriod: any;
    private _selectedRow: number = -1;
    private _isPlantChanged: boolean = false;
    private _selectedObj: any;
    private _isDataLoading: boolean = false;

    // TODO: Contour chart disable

    constructor(private dataSvc: PdmAreaStatusOverviewService,
        private _pdmSvc: PdmCommonService,
        private translater: Translater,
        private elementref: ElementRef,
        private _chRef: ChangeDetectorRef) {
        super();
        this.dataSvc = dataSvc;
        this.areaColumn = this.translater.instant('LABEL.PDM.AREA');
    }

    gridInit(flex: wjGrid.FlexGrid, e: wjcCore.EventArgs) {
        console.log('gridInit : ', flex, e);
        // this._pdmSvc.bindColumnGroups(flex, this._columnGroups);
        // return;
        // merge headers
        let colHdrs = flex.columnHeaders;
        flex.allowMerging = wjGrid.AllowMerging.ColumnHeaders;

        let groupRow = new wjGrid.Row();
        colHdrs.rows.push(groupRow);

        // merge horizontally
        for (let r = 0; r < colHdrs.rows.length; r++) {
            colHdrs.rows[r].allowMerging = true;
        }

        // merge vertically
        for (let c = 0; c < colHdrs.columns.length; c++) {
            colHdrs.columns[c].allowMerging = true;
        }
        // for (let c = 0; c < this._columnGroupHeaders.length; c++) {
        //     let hdr = this._columnGroupHeaders[c];
        //     if (!hdr) {
        //         hdr = colHdrs.getCellData(1, c);
        //     }
        //     colHdrs.setCellData(0, c, hdr);
        // }

        // fill empty cells with content from cell above
        for (let c = 0; c < colHdrs.columns.length; c++) {
            for (let r = 1; r < colHdrs.rows.length; r++) {
                let hdr = colHdrs.getCellData(r, c, true);
                if (colHdrs.columns[c].name) {
                    hdr = colHdrs.columns[c].name;
                }
                colHdrs.setCellData(r-1, c, hdr);
            }
        }

        // handle top-left panel
        for (let c = 0; c < flex.topLeftCells.columns.length; c++) {
            flex.topLeftCells.columns[c].allowMerging = true;
        }

        flex.formatItem.addHandler( (s: any, e: any)=> {
            if (e.panel === flex.columnHeaders) {
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                if (e.row === 1) {
                    switch(e.col) {
                        case 1:
                            $(e.cell).addClass('dangerous');
                            break;
                        case 2:
                            $(e.cell).addClass('warning');
                            break;
                    }
                    if (e.cell.innerText.search('경고') > -1) {
                        $(e.cell).addClass('dangerous');
                    } else if (e.cell.innerText.search('주의') > -1) {
                        $(e.cell).addClass('warning');
                    } else if (e.cell.innerText.search('정상') > -1) {
                        $(e.cell).addClass('safe');
                    } else if (e.cell.innerText.search('비가동') > -1) {
                        $(e.cell).addClass('inactive');
                    }
                }
				wjcCore.setCss(e.cell, {
                	display: 'table',
                    tableLayout: 'fixed'
				});
                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                });
            }else if (e.panel.cellType === wjGrid.CellType.Cell && (e.col === 1 ||e.col===7)) {
                if(e.cell.innerText !== '0') {
                    $(e.cell).addClass('dangerous-font');
                }
            }else if (e.panel.cellType === wjGrid.CellType.Cell && (e.col === 2 ||e.col===8)) {
                if(e.cell.innerText !== '0') {
                    $(e.cell).addClass('warning-font');
                }
            }
        });

        // select column groups by clicking the merged headers
        flex.allowSorting = false;
        flex.allowDragging = wjGrid.AllowDragging.None;
        flex.addEventListener(flex.hostElement, 'click', e => {
            let ht = flex.hitTest(e);
            if (ht.panel === flex.columnHeaders) {
                // let rng = flex.getMergedRange(flex.columnHeaders, ht.row, ht.col, false) || ht.range;
                // flex.select(new wjGrid.CellRange(0, rng.col, flex.rows.length - 1, rng.col2));
                e.preventDefault();
            }
        });
    }

    itemsSourceChanged(event: any) {
        console.log('itemsSourceChanged : ', event);
        if (this._isDataLoading) {
            this._isDataLoading = false;
        }
    }

    ngOnSetup() {
        this.showSpinner();
        this._init();
        // this.hideSpinner();
    }

    /**
     * TODO
     * refresh 3가지 타입에 따라서 data를 통해 적용한다.
     *  justRefresh, applyConfig, syncInCondition
     */
    // tslint:disable-next-line:no-unused-variable
    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        // if (type === A3_WIDGET.JUST_REFRESH) {
        //     this._getData(this._props[CD.PLANT_ID]);
        // }
        // else if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        // }
        // else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        // }
        if (data[CD.PLANT][CD.PLANT_ID] !== this._plant[CD.PLANT_ID]) {
            this._isPlantChanged = true;
        }
        this._plant = data[CD.PLANT];
        this._timePeriod = data[CD.TIME_PERIOD];
        this._getData(this._plant[CD.PLANT_ID], this._timePeriod[CD.FROM], this._timePeriod[CD.TO]);
        this.onSelectRowProcess(this._selectedRow);
    }

    ngAfterViewInit() {
        // this.shopGrid.selectedItems.splice(0);
        // this.hideSpinner()
    }

    ngOnDestroy() {
        this.destroy();
    }

    onSelectRow(e: wjGrid.CellRangeEventArgs) {
        this.onSelectRowProcess(e.row);
    }
    onSelectRowProcess(row){
        if (this.isConfigurationWidget) return;

        if (this.shopGrid.selectedItems.length === 0 ) return;

        this._selectedObj = this.shopGrid.selectedItems[0];
        if (this._isDataLoading) {
            if (!this._isPlantChanged) {
                this.shopGrid.select(this._selectedRow, this._selectedRow);
            } else {
                this._isPlantChanged = false;
                this._selectedRow = row;
            }
        } else {
            this._selectedRow = row;
        }
        // this._selectedObj = this.shopGrid.selectedItems[0];
        // this._selectedRow = e.row;
        const outCd = this.getOutCondition('config');
        outCd[CD.PLANT] = this._plant;
        outCd[CD.AREA_ID] = this._selectedObj[CD.AREA_ID];
        outCd[CD.TIME_PERIOD] = this._timePeriod;
        this.syncOutCondition(outCd);
    }

    onSelectStart(ev): boolean {
        let returnValue: boolean = false;
        if (window && window.event && window.event.target) {
            let target = window.event.target;
            if ($(target).hasClass('wj-elem-collapse')) {
                ev.cancel = true;
                returnValue = false;
            } else {
                returnValue = true;
            }
        }
        return returnValue;
    }

    onLoaded(ev) {
        this.shopGrid.select(this._selectedRow, this._selectedRow);
    }

    private _init() {
        // [EX]
        //  widget properties는 primitive가 아니라 Object를 사용한다
        this._props = this.getProperties();
        this._plant = this._props[CD.PLANT];
        this._timePeriod = this._props[CD.TIME_PERIOD];
        this._selectedRow = 0;
        // this.shopGrid.hostElement.addEventListener('selectionChanged', this.onSelectRow, true);
        if (this._plant) {
            this._getData(this._plant[CD.PLANT_ID], this._timePeriod[CD.FROM], this._timePeriod[CD.TO]);
        }
    }

    private _getData(plantId, from, to) {
        // this._selectedRow = -1;
        return this.dataSvc.getAreaStatus(plantId, from, to).then(data => {
            this._isDataLoading = true;
            this.data = data;
            this.hideSpinner();
        }).catch(e => {
            console.log(e);
            this.hideSpinner();
        });
    }
}
