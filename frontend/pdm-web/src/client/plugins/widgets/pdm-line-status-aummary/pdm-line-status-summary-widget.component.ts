import { Component, OnInit, OnChanges, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';
import { LineStatusSummaryComponent } from './components/line-status-summary.component';


import * as IDataType from './model/data-type.interface';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-line-status-summary-widget',
    templateUrl: './pdm-line-status-summary-widget.html',
    styleUrls: ['./pdm-line-status-summary-widget.css']
})
export class PdmLineStatusSummaryWidgetComponent extends WidgetApi implements OnInit {
    @ViewChild('container') container: ElementRef;
    @ViewChild('statusSummary') statusSummary: LineStatusSummaryComponent;

    private viewTimePriod: ITimePeriod = {
        fromDate : 0,
        toDate : 0
    };

    private targetName: string = 'All Lines';

    condition: IDataType.ContitionType;
    changeSize: any;
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
            setTimeout(() => {
                this.statusSummary.onChartResize();                
            }, 500);
            // setTimeout(() => {
            //     let targetEl = $(e.target)[0];
            //     let chartEl = $(`#${this.chartId}`);
            //     console.log('chartEl', chartEl);
            //     console.log('height', targetEl.clientHeight, 'width', targetEl.clientWidth);
            //     this.chart.resize({ height: targetEl.clientHeight - 22, width: targetEl.clientWidth - 154})
            // }, 200);
        }
    }

    refresh({ type, data }: WidgetRefreshType) {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === A3_WIDGET.JUST_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo(this._props);
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }
    }

    _setConfigInfo(props: any) {
        let now: Date = new Date();
        const startOfDay: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const to: Date = startOfDay; // today 00:00:00

        this.condition = {
            fabId: props[CD.PLANT_ID],
            timePeriod: {
                from: props[CD.TIME_PERIOD]['from'],
                to: to
            }
        };

        // this.viewTimePriod.fromDate = this.covertDateFormatter(props[CD.TIME_PERIOD]['from']);
        // this.viewTimePriod.toDate = this.covertDateFormatter(to);
        this.viewTimePriod.fromDate = props[CD.TIME_PERIOD]['from'];
        this.viewTimePriod.toDate = to.getTime();
    }

    covertDateFormatter(timestamp: Date): string {
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