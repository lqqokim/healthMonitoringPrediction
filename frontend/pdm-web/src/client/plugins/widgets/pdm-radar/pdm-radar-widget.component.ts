//Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';

//MIimport
import { WidgetRefreshType, WidgetApi, ContextMenuTemplateInfo, OnSetup } from '../../../common';
import { Translater, ContextMenuType, SpinnerComponent } from '../../../sdk';

import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { PdmRadarService } from './model/pdm-radar.service';
import * as IRadar from './model/pdm-radar.interface';

@Component({
    moduleId: module.id,
    selector: 'pdm-radar-widget',
    templateUrl: 'pdm-radar-widget.html',
    styleUrls: ['pdm-radar-widget.css'],
    providers: [PdmRadarService],
    encapsulation: ViewEncapsulation.None
})
export class PdmRadarWidgetComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('AWVComponent') AWVComponent: any;

    condition: IRadar.Condition;

    fabName: string;
    fromDate: string;
    toDate: string;
    viewTimePeriod: string = '';

    alarmCount: number;
    warningCount: number;

    detailsAnalysisLabel: string;
    analysisLabel: string;
    viewTrendChartLabel: string;

    private _areaId: any = 3;
    private _plant: any;
    private _props: any;
    private _timePeriod: any;

    isFull = false;

    constructor(
        private translater: Translater
        // private _pdmRadarService: PdmRadarService
    ) {
        super();
    }

    ngOnSetup() {
        // const radarTypeDatas: any[] = this._pdmRadarService.getRadarTypeInfo();
        // this.setProp(CD.RADAR_TYPE, radarTypeDatas[0]); // type preInit
        this._init();
    }

    ngAfterViewInit() {

    }

    refresh({ type, data }: WidgetRefreshType) {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === A3_WIDGET.JUST_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo();
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }
    }

    _setConfigInfo(): void {
        let condition: IRadar.Condition = {
            fabId: this._props[CD.PLANT]['fabId'],
            timePeriod: {
                from: this._props[CD.TIME_PERIOD][CD.FROM],
                to: new Date(this._props[CD.TIME_PERIOD].to).setHours(0, 0, 0, 0)
            },
            maxParamCount: this._props[CD.MAX_PARAM_COUNT]
        };

        this.condition = condition;
        this.fabName = this._props[CD.PLANT]['fabName'];
        this.viewTimePeriod = this.covertDateFormatter(condition.timePeriod);
    }

    onScroll(ev: any): void {
        setTimeout(() => {
            let drilldownMenu: any = $('.a3p-popover-drilldown-menu');
            if (drilldownMenu.length === 1) {
                let contextId: any = drilldownMenu[0].id;
                $(`#${contextId}`).remove();
            }
        });
    }

    covertDateFormatter(timestamp): string {
        // const date = new Date(timestamp);
        // return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        return moment(timestamp.from).format('YYYY-MM-DD HH:mm') + ' ~ ' +
            moment(timestamp.to).format('YYYY-MM-DD HH:mm');
    }

    showEqpContext(emitItem: IRadar.EqpContext): void {
        let item = emitItem.selectedItem;
        let event = emitItem.event;
        let dsCd: any = this.getViewData('displayContext');
        dsCd[LB.EQP_NAME] = item.name; //view config에서 설정필요
        this._areaId = item.areaId;

        let outCd = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.AREA_ID] = item.areaId;
        outCd[CD.EQP_ID] = item.id;
        outCd[CD.EQP_NAME] = item.name;

        let context: ContextMenuType = {
            tooltip: {
                event: event
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
                        data: { eqpId: item.id, event: event, type: "eqp" },
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

    }

    showParamContext(emitItem: IRadar.ParamContext): void {
        let item = emitItem.selectedItem;
        let event = emitItem.event;
        let paramData = emitItem.paramData.data;

        let dsCd: any = this.getViewData('paramDisplayContext');
        dsCd[LB.PARAM_NAME] = emitItem.paramData.data.paramName; //view config에서 설정필요
        this._areaId = item.areaId;

        let outCd = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.AREA_ID] = item.areaId
        outCd[CD.EQP_ID] = item.id;
        outCd[CD.EQP_NAME] = item.name;
        outCd[CD.PARAM_ID] = emitItem.paramData.data.paramName;

        let context: ContextMenuType = {
            tooltip: {
                event: event
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

        if (emitItem.flag) {
            context.template.action = [
                {
                    labelI18n: this.viewTrendChartLabel,
                    data: emitItem,
                    callback: (emitItem: IRadar.ParamContext) => {
                        this.AWVComponent.showTrendChartAtContext(emitItem);
                    }
                },
                {
                    labelI18n: this.analysisLabel,
                    data: { eqpId: item.id, paramId: paramData.paramId, event: event },
                    callback: (data: any) => {
                        this._syncMultiVariant(data.eqpId, data.paramId);
                    }
                }
            ];
        } else {
            context.template.action = [
                {
                    labelI18n: this.analysisLabel,
                    data: { eqpId: item.id, paramId: paramData.paramId, event: event },
                    callback: (data: any) => {
                        this._syncMultiVariant(data.eqpId, data.paramId);
                    }
                }
            ];
        }

        // show context menu
        this.showContextMenu(context);

    }

    endLoading(ev: any): void {
        if (ev) {
            this.hideSpinner();
        }
    }

    countAlarmWarning(ev: any): void {
        this.alarmCount = ev.alarmCount;
        this.warningCount = ev.warningCount;
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
        this._setConfigInfo();
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

