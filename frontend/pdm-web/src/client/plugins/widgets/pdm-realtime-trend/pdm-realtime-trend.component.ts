import { Subscription } from 'rxjs/Subscription';
import { RequestOptions, Headers } from '@angular/http';
import { Component, OnDestroy, ViewEncapsulation, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewInit, ContentChildren } from '@angular/core';
import { ModalAction, ModalApplier, ModalRequester, WidgetApi, WidgetRefreshType, OnSetup, ContextMenuTemplateInfo } from '../../../common';
import { NotifyService, Util, ContextMenuType } from '../../../sdk';

import { Observable } from 'rxjs/Observable';

import * as EqpTraceI from './../pdm-realtime-trend/model/realtime-trend.interface';

@Component({
    moduleId: module.id,
    selector: 'pdm-realtime-trend',
    templateUrl: './pdm-realtime-trend.html',
    styleUrls: ['./pdm-realtime-trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmRealTimeTrendComponent extends WidgetApi implements OnSetup, OnDestroy {

    condition: EqpTraceI.RealTimeConfigType;

    isRefresh: boolean = true;

    private _subscription: Subscription;
    private _props: any;

    constructor(
        private notify: NotifyService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
        private applier: ModalApplier
    ) {
        super();
    }

    ngOnSetup() {
        // this.hideSpinner();
        // this.disableConfigurationBtn(true);
        this._init();
    }

    refresh({ type, data }: WidgetRefreshType): void {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo(this._props);
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) { //Auto refresh
            if (this.isRefresh === true) {
                this.showSpinner();
                this._props = data;
                this._setConfigInfo(this._props);
            }
        }
    }

    _setConfigInfo(props: any): void {
        const from = moment().subtract(0, 'days').startOf('day').unix();
        const to = Date.now();
        let condition: EqpTraceI.RealTimeConfigType = {
            fabId: props[CD.PLANT]['fabId'],
            worstTop: props[CD.WORST_TOP],
            timePeriod: {
                from: from * 1000,
                to: to
            }
        };

        this.condition = condition;
        console.log('realtime condition', this.condition);
    }

    progress(ev: any): void {
        if (ev === true) {
            this.showSpinner();
        } else if (ev === false) {
            this.hideSpinner();
        }
    }

    changeRefresh(ev: any): void {
        if (ev === true) {
            this.isRefresh = true;
        } else {
            this.isRefresh = false;
        }
    }

    showContext(items: any): void {
        let item: EqpTraceI.AWTraceDataType | EqpTraceI.NWTraceDataType = items.selectedItem;
        let dsCd: any = this.getViewData('displayContext');
        dsCd[LB.EQP_NAME] = item.eqp.name; //view config에서 설정필요

        let outCd: any = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.AREA_ID] = item.eqp.area_id;
        outCd[CD.EQP_ID] = item.eqp.eqpId;
        outCd[CD.EQP_NAME] = item.eqp.name;
        outCd[CD.CATEGORY] = 'realtime';

        let context: ContextMenuType = {
            tooltip: {
                event: items.event
            },
            template: {
                title: '상세분석',
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action: [
                    // {
                    //     labelI18n: 'Contour 차트',
                    //     data: { eqpId: row.eqpId, event: ev },
                    //     callback: (data:any) => {
                    //         this.showContourChart(data.eqpId, data.event);
                    //     }
                    // },
                    {
                        labelI18n: '분석',
                        data: { areaId: item.eqp.area_id, eqpId: item.eqp.eqpId, event: items.event, type: "eqp" },
                        callback: (data: any) => {
                            this._syncMultiVariant(data.areaId, data.eqpId, null, data.type);
                        }
                    }]
            },
            contextMenuAction: {
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };
        // show context menu
        console.log('context', context);
        this.showContextMenu(context);
    }

    showParamContext(items: any) {
        console.log('showParamContext', items);
        let item: EqpTraceI.paramDatasType = items.selectedItem;
        let dsCd: any = this.getViewData('paramDisplayContext');
        dsCd[LB.PARAM_NAME] = item.paramName; //view config에서 설정필요

        let outCd: any = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.AREA_ID] = item.eqp.area_id;
        outCd[CD.EQP_ID] = item.eqp.eqpId;
        outCd[CD.EQP_NAME] = item.eqp.name;
        outCd[CD.CATEGORY] = 'realtime';

        let context: ContextMenuType = {
            tooltip: {
                event: items.event
            },
            template: {
                title: '상세분석',
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action: [
                    // {
                    //     labelI18n: 'Contour 차트',
                    //     data: { eqpId: row.eqpId, event: ev },
                    //     callback: (data:any) => {
                    //         this.showContourChart(data.eqpId, data.event);
                    //     }
                    // },
                    {
                        labelI18n: '분석',
                        data: { areaId: item.eqp.area_id, eqpId: item.eqp.eqpId, paramId: item.paramId, event: items.event, type: "param" },
                        callback: (data: any) => {
                            this._syncMultiVariant(data.areaId, data.eqpId, data.paramId, data.type);
                        }
                    }]
            },
            contextMenuAction: {
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };
        // show context menu
        console.log('context', context);
        this.showContextMenu(context);
    }

    private _syncMultiVariant(areaId: number, eqpId: number, paramId?: number, type?: string): void {
        let outCd: any = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.TIME_PERIOD] = this.condition.timePeriod;
        outCd[CD.AREA_ID] = areaId;
        outCd[CD.EQP_ID] = eqpId;
        outCd[CD.CATEGORY] = 'realtime';

        if (type === "param") {
            outCd[CD.PARAM_ID] = paramId;
        }

        this.syncOutCondition(outCd);
    }

    private _init(): void {
        this.showSpinner();
        this._props = this.getProperties();
        this._setConfigInfo(this._props);
    }

    ngOnDestroy(): void {
        this.destroy();
    }
}

