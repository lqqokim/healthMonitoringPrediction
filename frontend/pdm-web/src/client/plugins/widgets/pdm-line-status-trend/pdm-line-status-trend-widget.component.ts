import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

import * as IData from './model/data-type.interface';
import { LineStatusTrendComponent } from './components/line-status-trend.component';
import { ITimePeriod, WidgetChartConditionComponent } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-line-status-trend-widget',
    templateUrl: './pdm-line-status-trend-widget.html',
    styleUrls: ['./pdm-line-status-trend-widget.css']
})
export class PdmLineStatusTrendWidgetComponent extends WidgetApi implements OnInit, OnDestroy, OnSetup {
    @ViewChild('container') container: ElementRef;
    @ViewChild('chartBody') chartBody: ElementRef;
    @ViewChild('lineStatusTrendComp') lineStatusTrendComp: LineStatusTrendComponent;
    @ViewChild('widgetCondition') widgetCondition: WidgetChartConditionComponent;

    condition: IData.Contition = {
        fab: {
            fabId: undefined,
            fabName: undefined
        },
        area: {
            areaId: undefined,
            areaName: undefined
        },
        timePeriod: {
            fromDate: undefined,
            toDate: undefined
        }
    };

    readonly DEFAULT_TARGET_NAME: string = 'All Lines';
    private readonly DEFAULT_PERIOD: number = 7;

    targetName: string = this.DEFAULT_TARGET_NAME;
    isShowNoData: boolean = false;
    
    private _props: any;
    private _currentEl: ElementRef['nativeElement'] = undefined;
    private resizeCallback: Function = this.onResize.bind(this);

    constructor() {
        super();
    }

    ngOnSetup() {
        if(this.isConfigurationWidget) {
            this.setCondition(this.getProperties());
        } else {
            this._init();
        }
    }

    ngOnInit() {
        this._currentEl = $(this.container.nativeElement).parents('li.a3-widget-container')[0];

        if (this._currentEl !== undefined) {
            this._currentEl.addEventListener('transitionend', this.resizeCallback, false);
            this.onResize();
        }
    }

    onResize(e?: TransitionEvent): void {
        if ((e !== undefined && !e.isTrusted) || this._currentEl === undefined) { return; }
        if (e) {
            const chartBodyEl = $(this.chartBody.nativeElement);
            if(chartBodyEl) {
                this.lineStatusTrendComp.onChartResize({
                    width: chartBodyEl.width(),
                    height: chartBodyEl.height()
                });
            }
        }
    }

    refresh({ type, data }: WidgetRefreshType): void {
        this.showSpinner();
        this._props = data;

        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === A3_WIDGET.JUST_REFRESH) {
            if (this.targetName !== this.DEFAULT_TARGET_NAME) {
                this.targetName = this.DEFAULT_TARGET_NAME
            }
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            console.log('LINE STATUS SYNC', data);
            if (data[CD.AREA]) {
                this.targetName = data.area.areaName;
            }
        }

        this.setCondition(data, type);
    }

    setCondition(props: any, refreshType?: string): void {
        this.condition = {
            fab: props[CD.PLANT],
            area: props[CD.AREA],
            timePeriod: this.getTimePeriod(props[CD.TIME_PERIOD][CD.FROM], props[CD.TIME_PERIOD][CD.TO], refreshType)
        };

        this.widgetCondition.timeConvert(this.condition.timePeriod);
    }

    getTimePeriod(fromDate: number, toDate: number, refreshType?: string): { fromDate: number, toDate: number } {
        if (refreshType === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            return { fromDate: fromDate, toDate: toDate };
        } else {
            if (this.getProp(CD.CUTOFF_TYPE) === 'DAY') {
                const startOfTo: number = new Date(toDate).setHours(0, 0, 0, 0);
                const startOfFrom: number = startOfTo - 1000 * 60 * 60 * 24 * this.getProp(CD.DAY_PERIOD);

                return { fromDate: startOfFrom, toDate: startOfTo };
            } else if (this.getProp(CD.CUTOFF_TYPE) === 'DATE') {
                return { fromDate: fromDate, toDate: toDate };
            }

            return null;
        }
    }

    endChartLoad(ev: any): void {
        if (ev.isLoad) {

        } else if (!ev.isLoad) {

        }

        this.hideSpinner();
    }

    private _init(): void {
        this.showSpinner();
        // this.setProps();
        this._props = this.getProperties();
        this.setCondition(this._props);
    }

    private setProps(): void {
        this.setProp(CD.DAY_PERIOD, this.DEFAULT_PERIOD); //set default previous day
        this._props = this.getProperties();
    }

    ngOnDestroy(): void {
        if (this._currentEl !== undefined) {
            this._currentEl.removeEventListener('transitionend', this.resizeCallback);
        }
    }
}