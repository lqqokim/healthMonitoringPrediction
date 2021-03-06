import { Renderer } from '@angular/core';
//Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';

//MIimport
import { WidgetRefreshType, WidgetApi, ContextMenuTemplateInfo, OnSetup } from '../../../common';
import { Translater, ContextMenuType, SpinnerComponent } from '../../../sdk';

import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { PdmRadarService } from './model/pdm-radar.service';
import * as pdmRadarI from './model/pdm-radar.interface';

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

    condition: pdmRadarI.RadarWidgetConfigType;

    fabName: string;
    fromDate: any;
    toDate: any;

    alarmCount: number;
    warningCount: number;

    private _areaId: any = 3;
    private _plant: any;
    private _props: any;
    private _timePeriod: any;

    isFull = false;

    constructor(
        private renderer: Renderer
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
        let condition: pdmRadarI.RadarWidgetConfigType = {
            fabId: undefined,
            timePeriod: undefined
        };

        condition = {
            fabId: this._props[CD.PLANT]['fabId'],
            timePeriod: this._props[CD.TIME_PERIOD]
        };

        this.fabName = this._props[CD.PLANT]['fabName'];
        this.fromDate = this.covertDateFormatter(this._props[CD.TIME_PERIOD]['from']);
        this.toDate = this.covertDateFormatter(this._props[CD.TIME_PERIOD]['to']);
        this.condition = condition;
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

    bindOnScroll(): void {
        document.getElementById('onscroll').addEventListener('scroll', (ev: any) => {
            console.log('scroll');
            let drilldownMenu: any = $('.a3p-popover-drilldown-menu');

            if (drilldownMenu.length === 1) {
                let contextId: any = drilldownMenu[0].id;
                $(`#${contextId}`).remove();
            }
        });

        window.addEventListener('scroll', function (evt) { console.log('window scroll', evt) });
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
            // console.log('showParamContext item', item);
            let dsCd: any = this.getViewData('paramDisplayContext');
            dsCd[LB.PARAM_NAME] = item.paramData.data.paramName; //view config에서 설정필요
            this._areaId = item.selectedItem.areaId;
            let outCd = this.getOutCondition('config');

            outCd[CD.PLANT] = this._props[CD.PLANT];
            outCd[CD.AREA_ID] = this._areaId;
            outCd[CD.EQP_ID] = item.eqpId;
            outCd[CD.EQP_NAME] = item.eqpName;
            outCd[CD.PARAM_ID] = item.paramData.data.paramId;

            let context: ContextMenuType = {
                tooltip: {
                    event: item.event
                },
                template: {
                    title: '상세분석',
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
                        labelI18n: 'Trend chart 보기',
                        data: item,
                        callback: (item: any) => {
                            this.AWVComponent.showTrendChartAtContext(item.type, item.eqpName, item.eqpId, item.paramData, item.index, item.flag);
                        }
                    },
                    {
                        labelI18n: '분석',
                        data: { eqpId: item.eqpId, paramId: item.paramData.data.paramId, event: item.event },
                        callback: (data: any) => {
                            this._syncMultiVariant(data.eqpId, data.paramId);
                        }
                    }
                ];
            } else {
                context.template.action = [
                    {
                        labelI18n: '분석',
                        data: { eqpId: item.eqpId, paramId: item.paramData.data.paramId, event: item.event },
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
        this._props = this.getProperties();
        this._setConfigInfo();
    }

    ngOnDestroy() {
        this.destroy();
    }
}

