import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';

import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { Translater, NotifyService, SessionStore} from '../../../sdk';
import { PdmReportService, REPORT_STATUS, REPORT_STATUS_NAME } from './pdm-report.service';

import * as wjcCore from 'wijmo/wijmo';
import * as wjGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.input';

import { PdmCommonService } from '../../../common/service/pdm-common.service';

@Component({
    moduleId: module.id,
    selector: 'pdm-report',
    templateUrl: 'pdm-report.html',
    styleUrls: ['pdm-report.css'],
    providers: [PdmReportService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmReportComponent extends WidgetApi implements OnSetup, OnDestroy {

    data: wjcCore.CollectionView;
    editContent: string;
    selectedReport: any;
    selectAll: boolean = false;

    @ViewChild('reportGrid') reportGrid: wjGrid.FlexGrid;
    @ViewChild('commentPopup') commentPopup: wjcInput.Popup;

    private _props: any;
    private _plantId: any;

    constructor(private dataSvc: PdmReportService,
                private _pdmSvc: PdmCommonService,
                private translater: Translater,
                private elementref: ElementRef,
                private _chRef: ChangeDetectorRef,
                private notify: NotifyService,
                private sessionStore: SessionStore) {
        super();
        this.dataSvc = dataSvc;
    }

    gridInit(flex: wjGrid.FlexGrid, e: wjcCore.EventArgs) {
        flex.formatItem.addHandler((s, e: any) => {
            if (e.panel === flex.columnHeaders) {
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                if (e.col !== 0) {
                    wjcCore.setCss(e.cell, {
                        display: 'table',
                        tableLayout: 'fixed'
                    });
                }

                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                });

                if (e.col === 0) {
                    let col = flex.columns[e.col];

                    // prevent sorting on click
                    col.allowSorting = false;

                    // count true values to initialize checkbox
                    let cnt = 0;
                    let tempData = null;
                    for (let i = 0; i < flex.rows.length; i++) {
                        tempData = flex.getCellData(i, e.col, true);
                        if (tempData === 'true' || tempData === true) {
                            cnt++;
                        }
                    }

                    // create and initialize checkbox
                    e.cell.innerHTML = '<input type="checkbox">' + e.cell.innerHTML;
                    let cb = e.cell.firstChild;
                    cb.checked = cnt > 0;
                    cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

                    // apply checkbox value to cells
                    cb.addEventListener('click', event => {
                        // this.selectAll = !this.selectAll;
                        flex.beginUpdate();
                        for (let i = 0; i < flex.rows.length; i++) {
                            if ( +flex.rows[i].dataItem.stateCd === +REPORT_STATUS.CREATED) {
                                flex.setCellData(i, e.col, cb.checked);
                            }
                        }
                        flex.endUpdate();
                    });
                }
            } else if (e.panel.cellType === wjGrid.CellType.Cell && e.col === 0) {
                // if ( +this.data.items[e.row].stateCd >= +REPORT_STATUS.REQUESTED) {
                //     $(e.cell).find('input[type="checkbox"]').attr('disabled', true);
                // } else {
                //     $(e.cell).find('input[type="checkbox"]').attr('disabled', false);
                // }
                if ( +this.data.items[e.row].stateCd === +REPORT_STATUS.CONFIRMED) {
                    $(e.cell).find('input[type="checkbox"]').attr('disabled', false);
                } else {
                    $(e.cell).find('input[type="checkbox"]').attr('disabled', true);
                }
            }
        });
    }

    ngOnSetup() {
        this.showSpinner();
        this._init();
    }

    /**
     * TODO
     * refresh 3가지 타입에 따라서 data를 통해 적용한다.
     *  justRefresh, applyConfig, syncInCondition
     */
    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
            this._props = data;
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            this._props[CD.PLANT] = data[CD.PLANT];
            this._props[CD.TIME_PERIOD] = data[CD.TIME_PERIOD];
        } else {
            this._props = this.getProperties();
        }

        this._plantId = this._props[CD.PLANT][CD.PLANT_ID];
        this._getData();
    }

    ngAfterViewInit() {
        //this.hideSpinner()
    }

    ngOnDestroy() {
        this.destroy();
    }

    showComment(row, e) {
        // let row = this.data.currentItem;

        // const outCd = this.getOutCondition('config');
        // outCd[CD.PLANT_ID] = this._plantId;
        // outCd[CD.SHOP_ID] = row[CD.SHOP_ID];
        // outCd[CD.EQP_ID] = row[CD.EQP_ID];

        if (this.commentPopup) {
            this.selectedReport = row;
            this.editContent = row.comment;
            this.commentPopup.modal = true;
            this.commentPopup.hideTrigger = wjcInput.PopupTrigger.Blur;
            this.commentPopup.show();
        }

        // TODO: show popup

        //this.syncOutCondition(outCd);
    }

    convertDate(time) {
        if (time) {
            // return moment(time).format('L');
            return moment(time).format('YYYY/MM/DD');
        }
        return '';
    }

    closePopup() {
        if (this.commentPopup) {
            this.selectedReport = null;
            this.commentPopup.hide();
        }
    }

    sendRequest(ev) {
        let rows = this.data.items.filter(row => {
            return row.checked;
        });

        if (!rows.length) return;

        let userInfo = this.sessionStore.getSignInfo();
        let userName = userInfo.name;
        let now = Date.now();
        rows.forEach(row => {
            row.requestUserId = userName;
            row.requestDtts = now;
            row.stateCd = REPORT_STATUS.REQUESTED;
            row.stateName = REPORT_STATUS_NAME.REQUESTED;
            let sendReport = {
                eqpId: row.eqpId,
                occurDtts: row.occurDtts,
                requestUserId: userName,
                requestDtts: now,
                stateCd: REPORT_STATUS.REQUESTED
            };
            this.dataSvc.updateReport(this.plantId, sendReport).then(() => {
                if (row.content) {
                    this._getPpt(row);
                }
            }).catch(err => {
                row.requestUserId = null;
                row.requestDtts = null;
                this.reportGrid.refresh(false);
                this.error(err);
                this.notify.error('MESSAGE.GENERAL.SAVE_ERROR');
            });
        });

        this.reportGrid.refresh(false);
    }

    completReport(report) {
        this.closePopup();
        this._getData();
        this.reportGrid.refresh(false);
    }

    refreshReport() {
        this.reportGrid.refresh(false);
    }

    toFixed(num, position=2, exStr='-') {
        return _.isNumber(num) && !isNaN(num) ? num.toFixed(position) * 1 : exStr;
    }

    get plantId() {
        return this._plantId;
    }

    private _init() {
        // [EX]
        //  widget properties는 primitive가 아니라 Object를 사용한다
        this._props = this.getProperties();
        this._plantId = this._props[CD.PLANT][CD.PLANT_ID];

        this._getData();
    }

    private _getData() {
        // tslint:disable-next-line:max-line-length
        return this.dataSvc.getReports(this._plantId, this._props[CD.TIME_PERIOD][CD.FROM], this._props[CD.TIME_PERIOD][CD.TO]).then(data => {
            data = data.map(item => {
                item.checked = false;
                if (item.causeUpdate === null) {
                    item.causeUpdate = [item.cause1, item.cause2, item.cause3].join('\n');
                }
                return item;
            });
            this.data = new wjcCore.CollectionView(data);
            this.hideSpinner();
        }).catch(e => {
            console.log(e);
            this.hideSpinner();
        });
    }

    private _getPpt(row) {
        this.dataSvc.getEqpInfo(this._plantId, row.eqpId).then(eqpInfo => {
            let fileName = eqpInfo.shopFullName.replace(/>/g, '_');
            fileName += `_${eqpInfo.eqpName}.ppt`;

            this.dataSvc.savePpt(row.content, fileName);
        });
    }

}
