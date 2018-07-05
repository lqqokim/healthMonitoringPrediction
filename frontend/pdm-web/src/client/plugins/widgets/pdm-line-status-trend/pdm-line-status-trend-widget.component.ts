import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

import * as IDataType from './model/data-type.interface';

import { LineStatusTrendComponent } from './components/line-status-trend.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-line-status-trend-widget',
    templateUrl: './pdm-line-status-trend-widget.html',
    styleUrls: ['./pdm-line-status-trend-widget.css']
})
export class PdmLineStatusTrendWidgetComponent extends WidgetApi implements OnInit {
    @ViewChild('container') container: ElementRef;
    @ViewChild('lineStatusTrendComp') lineStatusTrendComp: LineStatusTrendComponent;
    
    private viewTimePriod: ITimePeriod = {
        fromDate : 0,
        toDate : 0
    };

    private targetName: string = 'All Lines';

    condition: IDataType.ContitionType;

    private _props: any;
    private _currentEl: ElementRef['nativeElement'] = undefined;
    private resizeCallback: Function = this.onResize.bind(this);

    constructor() {
        super();
    }

    ngOnSetup() {
        this._init();
    }

    ngOnInit() {
        this._currentEl = $(this.container.nativeElement).parents('li.a3-widget-container')[0];
        this._currentEl.addEventListener('transitionend', this.resizeCallback, false);
        this.onResize();
    }
    
    onResize(e?: TransitionEvent): void {
        if ((e !== undefined && !e.isTrusted) || this._currentEl === undefined) { return; }
        if (e) {
            this.lineStatusTrendComp.onChartResize();                
        }
    }

    refresh({ type, data }: WidgetRefreshType) {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === A3_WIDGET.JUST_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo(this._props);
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo(this._props);
            console.log('LINE STATUS SYNC', data);
        }
    }

    _setConfigInfo(props: any) {
        let now: Date = new Date();
        const startOfDay: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const to: number = startOfDay.getTime(); // today 00:00:00

        this.condition = {
            fabId: props['plant']['fabId'],
            timePeriod: {
                from: props['timePeriod']['from'],
                to: to
            }
        };

        // this.viewTimePriod.fromDate = this.covertDateFormatter(props[CD.TIME_PERIOD]['from']);
        // this.viewTimePriod.toDate = this.covertDateFormatter(to);
        this.viewTimePriod.fromDate = props[CD.TIME_PERIOD]['from'];
        this.viewTimePriod.toDate = to;
    }

    covertDateFormatter(timestamp: number): string {
        const date = new Date(timestamp);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 00:00`;
    }

    endChartLoad(ev: any) {
        if (ev) {
            this.hideSpinner();
        }
    }

    private _init(): void {
        this.showSpinner();
        // this.setGlobalLabel();
        this._props = this.getProperties();
        this._setConfigInfo(this._props);
    }
}