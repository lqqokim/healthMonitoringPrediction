//Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';

//MIimport
import { WidgetRefreshType, WidgetApi, ContextMenuTemplateInfo, OnSetup } from '../../../common';
import { Translater, ContextMenuType, SpinnerComponent } from '../../../sdk';

import { PdmRadarService } from './model/pdm-radar.service';
import * as pdmRadarI from './model/pdm-radar.interface';

@Component({
    moduleId: module.id,
    selector: 'pdm-gauge-widget',
    templateUrl: 'pdm-gauge-widget.html',
    styleUrls: ['pdm-gauge-widget.css'],
    providers: [PdmRadarService],
    encapsulation: ViewEncapsulation.None
})
export class PdmGaugeWidgetComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('AWVComponent') AWVComponent: any;

    condition: pdmRadarI.RadarWidgetConfigType;

    fabName: string;
    fromDate: any;
    toDate: any;

    alarmCount: number;
    warningCount: number;

    detailsAnalysisLabel: string;
    analysisLabel: string;
    viewTrendChartLabel: string;

    private _areaId: any = 3;
    private _props: any;

    isFull = false;

    constructor(
        private translater: Translater
    ) {
        super();
    }

    ngOnSetup() {
        this._init();
    }

    ngAfterViewInit() {
        
    }

    refresh({ type, data }: WidgetRefreshType) {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === A3_WIDGET.JUST_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo(data);
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }
    }

    _setConfigInfo(props: any): void {
        let condition: pdmRadarI.RadarWidgetConfigType = {
            fabId: undefined,
            timePeriod: undefined
        };

        condition = {
            fabId: props[CD.PLANT]['fabId'],
            timePeriod: props[CD.TIME_PERIOD],
            worstTop: props[CD.WORST_TOP]
        };

        this.fabName = this._props[CD.PLANT]['fabName'];
        this.fromDate = this.covertDateFormatter(this._props[CD.TIME_PERIOD]['from']);
        this.toDate = this.covertDateFormatter(this._props[CD.TIME_PERIOD]['to']);
        this.condition = condition;
    }

    onScroll() {
        let drilldownMenu: any = $('.a3p-popover-drilldown-menu');
        if (drilldownMenu.length === 1) {
            let contextId: any = drilldownMenu[0].id;
            $(`#${contextId}`).remove();
        }
    }

    covertDateFormatter(timestamp): string {
        const date = new Date(timestamp);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }

    showContext(item: any): void {
        if (item) {
            let selectedItem = item.selectedItem;
            let dsCd: any = this.getViewData('displayContext');
            dsCd[LB.EQP_NAME] = selectedItem.name; //view config에서 설정필요
            this._areaId = selectedItem.areaId;
            let outCd = this.getOutCondition('config');
            outCd[CD.PLANT] = this._props[CD.PLANT];
            outCd[CD.AREA_ID] = this._areaId;
            outCd[CD.EQP_ID] = selectedItem.id;
            outCd[CD.EQP_NAME] = selectedItem.name;

            let context: ContextMenuType = {
                tooltip: {
                    event: item.event
                },
                template: {
                    title: this.detailsAnalysisLabel,
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
                            labelI18n: this.analysisLabel,
                            data: { eqpId: selectedItem.id, event: item.event, type: "eqp" },
                            callback: (data: any) => {
                                this._syncMultiVariant(data.eqpId, null, data.type);
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
            this.showContextMenu(context);
        } else {

        }
    }

    showParamContext(item: any): void {
        if (item) {
            let dsCd: any = this.getViewData('paramDisplayContext');
            dsCd[LB.PARAM_NAME] = item.paramName; //view config에서 설정필요
            this._areaId = item.selectedItem.areaId;
            let outCd = this.getOutCondition('config');

            outCd[CD.PLANT] = this._props[CD.PLANT];
            outCd[CD.AREA_ID] = this._areaId;
            outCd[CD.EQP_ID] = item.eqpId;
            outCd[CD.EQP_NAME] = item.eqpName;
            // outCd[CD.PARAM_ID] = item.paramData.data.paramId;
            outCd[CD.PARAM_ID] = item.paramId;

            let context: ContextMenuType = {
                tooltip: {
                    event: item.event
                },
                template: {
                    title: this.detailsAnalysisLabel,
                    type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                    data: dsCd,
                    action: []
                },
                contextMenuAction: {
                    invisible: true
                },
                outCondition: {
                    data: outCd
                }
            };

            if (item.flag) {
                context.template.action = [
                    {
                        labelI18n: this.viewTrendChartLabel,
                        data: item,
                        callback: (item: any) => {
                            this.AWVComponent.showTrendChartAtContext(item.type, item.eqpName, item.eqpId, item.paramData, item.index, item.flag);
                        }
                    },
                    {
                        labelI18n: this.analysisLabel,
                        data: { eqpId: item.eqpId, paramId: item.paramData.data.paramId, event: item.event },
                        callback: (data: any) => {
                            this._syncMultiVariant(data.eqpId, data.paramId);
                        }
                    }
                ];
            } else {
                context.template.action = [
                    {
                        labelI18n: this.analysisLabel,
                        data: { eqpId: item.eqpId, paramId: item.paramId, event: item.event },
                        callback: (data: any) => {
                            this._syncMultiVariant(data.eqpId, data.paramId);
                        }
                    }
                ];
            }

            // show context menu
            this.showContextMenu(context);
        } else {

        }
    }

    endLoading(ev: any): void {
        if (ev) {
            this.hideSpinner();
        }
    }

    countAlarmWarning(ev: any): void {
        if (ev) {
            this.alarmCount = ev.alarmCount;
            this.warningCount = ev.warningCount;
        }
    }

    onClickOutArea(): void {
        this.AWVComponent.initActive();

        const trendChartEl: any = this.AWVComponent.TrendChart.nativeElement;
        if (!trendChartEl.hidden) {
            trendChartEl.hidden = true
        }

        const backdropEl: any = this.AWVComponent.Backdrop.nativeElement;
        if (!backdropEl.hidden) {
            backdropEl.hidden = true
        }

        if (this.AWVComponent.isShowInfo) {
            this.AWVComponent.isShowInfo = false;
        }
    }

    private _syncMultiVariant(eqpId, paramId, type?): void {
        let outCd = this.getOutCondition('config');

        if (type === "eqp") {
            outCd[CD.PLANT] = this._props[CD.PLANT];
            outCd[CD.AREA_ID] = this._areaId;
            outCd[CD.EQP_ID] = eqpId;
            outCd[CD.TIME_PERIOD] = this._props[CD.TIME_PERIOD];
        } else {
            outCd[CD.PLANT] = this._props[CD.PLANT];
            outCd[CD.AREA_ID] = this._areaId;
            outCd[CD.EQP_ID] = eqpId;
            outCd[CD.PARAM_ID] = paramId;
            outCd[CD.TIME_PERIOD] = this._props[CD.TIME_PERIOD];
        }

        outCd[CD.CATEGORY] = 'radar';
        this.syncOutCondition(outCd);
    }

    private _init(): void {
        this.showSpinner();
        this.setGlobalLabel();
        this._props = this.getProperties();
        this._setConfigInfo(this._props);
    }

    private setGlobalLabel(): void {
        let translater = this.translater;
        this.detailsAnalysisLabel = translater.instant('PDM.LABEL.DETAILS_ANALYSIS');
        this.analysisLabel = translater.instant('PDM.LABEL.ANALYSIS');
        this.viewTrendChartLabel = translater.instant('PDM.LABEL.VIEW_TREND_CHART');
    }

    ngOnDestroy() {
        this.destroy();
    }
}

