import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';

import { WidgetRefreshType, WidgetApi, OnSetup,ContextMenuTemplateInfo} from '../../../common';
import { Translater, NotifyService, SessionStore,ContextMenuType} from '../../../sdk';
import { PdmModelingStatusService } from './pdm-modeling-status.service';

import * as wjcCore from 'wijmo/wijmo';
import * as wjGrid from 'wijmo/wijmo.grid';

import { PdmCommonService } from '../../../common/service/pdm-common.service';


@Component({
    moduleId: module.id,
    selector: 'pdm-modeling-status',
    templateUrl: 'pdm-modeling-status.html',
    styleUrls: ['pdm-modeling-status.css'],
    providers: [PdmModelingStatusService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmModelingStatusComponent extends WidgetApi implements OnSetup, OnDestroy {

    areaColumn: string;
    data: wjcCore.CollectionView;
    @ViewChild('modelListGrid') modelListGrid: wjGrid.FlexGrid;

    private _props: any;
    private _plantId: any;

    constructor(private dataSvc: PdmModelingStatusService,
                private _pdmSvc: PdmCommonService,
                private translater: Translater,
                private elementref: ElementRef,
                private _chRef: ChangeDetectorRef,
                private notify: NotifyService,
                private sessionStore: SessionStore) {
        super();
        this.dataSvc = dataSvc;
        this.areaColumn = this.translater.instant('LABEL.PDM.AREA');
    }

    gridInit(flex: wjGrid.FlexGrid, e: wjcCore.EventArgs) {
        flex.formatItem.addHandler(function (s, e: any) {
            if (e.panel === flex.columnHeaders) {
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                wjcCore.setCss(e.cell, {
                    display: 'table',
                    tableLayout: 'fixed'
                });
                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                });
            }
        });
    }

    ngOnSetup() {
        this.showSpinner();
        this._init().then(() => {
            this.hideSpinner();
        });
        // this.hideSpinner();
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

    convertDate(time) {
        if (time) {
            return moment(time).format('L');
        }
        return '';
    }

    // onSelectRow(ev) {
    //     let ht = this.modelListGrid.hitTest(window.event);
    //     if (ht.panel === this.modelListGrid.columnHeaders) {
    //         return;
    //     }
    //     setTimeout(() => {
    //         let row = this.data.items[ev.row];
    //         let shopName = escape(row.shopName);
    //         let eqpName = escape(row.eqpName);
    //         let userInfo = this.sessionStore.getSignInfo();
    //         let userName = escape(userInfo.name);
    //         // tslint:disable-next-line:max-line-length
    //         let url = `http://10.59.180.61:9090/?plantId=${escape(this._plantId)}&shopName=${shopName}&eqpId=${row.eqpId}&eqpName=${eqpName}&userName=${userName}`;
    //         window.open(url,'PdmModelingStatusWin','');
    //     }, 200);
    // }

    convertCreateType(exist, createType) {
        switch(createType) {
            case 'A':
                return 'Auto';
            case 'M':
                return exist === 'O' ? 'Manual' : '';
            default:
                return '';
        }
    }
    createfeature() {
        this.dataSvc.createFeature('2016-11-09', 2);
    }

    //selectModeller(row, ev) {
    selectModeller(row,ev) {

        let dsCd: any = this.getViewData('displayContext');
        dsCd[LB.EQP_NAME] = row.eqpName;

        let outCd = this.getOutCondition('config');

        outCd[CD.PLANT] = outCd.plantId;
        outCd[CD.AREA_ID] = row.shopName;
        outCd[CD.EQP_ID] = row.eqpId;
        outCd[CD.EQP_NAME] = row.eqpName;

        let context: ContextMenuType = {
            tooltip: {
                event: ev
            },
            template: {
                title: '모델링',
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action: [{
                    labelI18n: '모델러',
                    data: { eqpId: row.eqpId, event: ev },
                    callback: (data:any) => {
                        this._syncModeller(data.eqpId);
                    }
                }]
            },
            contextMenuAction : {
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };
        // show context menu
        this.showContextMenu(context);
    }
    private _syncModeller(eqpId) {
        let outCd = this.getOutCondition('config');

        // outCd[CD.PLANT] = this._plant;
        // outCd[CD.AREA_ID] = this._areaId;
        outCd[CD.EQP_ID] = eqpId;
        // outCd[CD.TIME_PERIOD] = this._timePeriod;

        this.syncOutCondition(outCd);
    }

    private _init() {
        // [EX]
        //  widget properties는 primitive가 아니라 Object를 사용한다
        this._props = this.getProperties();
        this._plantId = this._props[CD.PLANT][CD.PLANT_ID];

        return this._getData();
    }

    private _getData() {
        return this.dataSvc.getModels(this._plantId).then(data => {
            data = data.map(item => {
                item.existName = item.exist === 'O' ? 'YES' : 'NO';
                return item;
            });
            this.data = new wjcCore.CollectionView(data);
            this.hideSpinner();
        }).catch(e => {
            console.log(e);
            this.notify.error('There is a problem for getting models from the server.');
            this.hideSpinner();
        });
    }
}
