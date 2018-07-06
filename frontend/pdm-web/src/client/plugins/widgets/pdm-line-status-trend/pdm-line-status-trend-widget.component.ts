import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';
import { Util } from './../../../sdk/utils/utils.module';

import * as IDataType from './model/data-type.interface';

import { LineStatusTrendComponent } from './components/line-status-trend.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-line-status-trend-widget',
    templateUrl: './pdm-line-status-trend-widget.html',
    styleUrls: ['./pdm-line-status-trend-widget.css']
})
export class PdmLineStatusTrendWidgetComponent extends WidgetApi implements OnInit, OnDestroy, OnSetup {
    @ViewChild('container') container: ElementRef;
    @ViewChild('lineStatusTrendComp') lineStatusTrendComp: LineStatusTrendComponent;

    condition: IDataType.ContitionType;
    viewTimePriod: ITimePeriod = {
        fromDate: 0,
        toDate: 0
    };

    targetName: string;
    startOfDay: number;
    isShowNoData: boolean = false;

    private readonly DEFAULT_PERIOD: number = 7;
    private readonly DEFAULT_TARGET_NAME: string = 'All Lines';

    private _props: any;
    private _currentEl: ElementRef['nativeElement'] = undefined;
    private resizeCallback: Function = this.onResize.bind(this);

    constructor() {
        super();
    }

    ngOnSetup() {
        if(this.isConfigurationWidget) {
            return;
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
            this.lineStatusTrendComp.onChartResize();
        }
    }

    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        this._props = data;

        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) {

        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            console.log('LINE STATUS SYNC', data);
        }

        this.setCondition(data, type);
    }

    setCondition(props: any, refreshType?: string) {
        this.condition = {
            fab: props[CD.PLANT],
            area: props[CD.AREA],
            timePeriod: {
                from: props[CD.TIME_PERIOD][CD.FROM],
                to: this.startOfDay
            }
        };

        this.setViewCondition(refreshType, this.condition);
    }

    setViewCondition(refreshType: string, condition: IDataType.ContitionType): void {
        if (refreshType === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            this.targetName = condition.area.areaName;
        } else {
            this.targetName = this.DEFAULT_TARGET_NAME;
        }

        this.viewTimePriod.fromDate = condition.timePeriod.from;
        this.viewTimePriod.toDate = this.startOfDay;
    }

    endChartLoad(ev: any) {
        if (ev) {
            if (this.isShowNoData) {
                this.isShowNoData = false;
            }
            this.hideSpinner();
        } else if (!ev) {
            this.isShowNoData = true;
        }
    }

    setStartOfDay(): void {
        let now: Date = new Date();
        const startOfDay: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.startOfDay = startOfDay.getTime(); // today 00:00:00
    }

    private _init(): void {
        this.showSpinner();
        this.setStartOfDay();
        this.setProps();
        this.setCondition(this.getProperties());
    }

    private setProps(): void {
        this.setProp(CD.DAY_PERIOD, this.DEFAULT_PERIOD); //set default previous day
        this.setProp(CD.TIME_PERIOD, { //set previous default timePeriod
            [CD.FROM]: Util.Date.getFrom(this.DEFAULT_PERIOD, this.startOfDay),
            [CD.TO]: this.startOfDay
        });
    }

    ngOnDestroy(): void {
        if (this._currentEl !== undefined) {
            this._currentEl.removeEventListener('transitionend', this.resizeCallback);
        }
    }
}