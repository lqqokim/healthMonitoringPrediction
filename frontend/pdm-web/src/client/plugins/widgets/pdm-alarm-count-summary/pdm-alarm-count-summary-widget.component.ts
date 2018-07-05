import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

import * as IDataType from './model/data-type.interface';

import { AlarmCountSummaryComponent } from './components/alarm-count-summary.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-alarm-count-summary-widget',
    templateUrl: './pdm-alarm-count-summary-widget.html',
    styleUrls: ['./pdm-alarm-count-summary-widget.css']
})
export class PdmAlarmCountSummaryWidgetComponent extends WidgetApi implements OnInit {
    @ViewChild('container') container: ElementRef;
    @ViewChild('alarmCountSummaryComp') alarmCountSummaryComp: AlarmCountSummaryComponent;

    viewTimePriod: ITimePeriod = {
        fromDate: 0,
        toDate: 0
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
            this.alarmCountSummaryComp.onChartResize();                
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

    onSync(item: any): void {
        let outCd = this.getOutCondition('config');
        const plant: any = this._props[CD.PLANT];
        const area: any = item.area;
        const timePeriod: any = this._props[CD.TIME_PERIOD];

        outCd[CD.PLANT] = plant;
        outCd[CD.AREA] = area;
        outCd[CD.TIME_PERIOD] = timePeriod;
        // console.log('outCd => ', outCd);

        this.syncOutCondition(outCd);
    }

    private _init(): void {
        this.showSpinner();
        // this.setGlobalLabel();
        this._props = this.getProperties();
        this._setConfigInfo(this._props);
    }
}
