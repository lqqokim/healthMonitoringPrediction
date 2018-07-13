import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

import * as IDataType from './model/data-type.interface';
import { AlarmCountSummaryComponent } from './components/alarm-count-summary.component';
import { ITimePeriod, WidgetChartConditionComponent } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-alarm-count-summary-widget',
    templateUrl: './pdm-alarm-count-summary-widget.html',
    styleUrls: ['./pdm-alarm-count-summary-widget.css']
})
export class PdmAlarmCountSummaryWidgetComponent extends WidgetApi implements OnInit, OnSetup {
    @ViewChild('container') container: ElementRef;
    @ViewChild('alarmCountSummaryComp') alarmCountSummaryComp: AlarmCountSummaryComponent;
    @ViewChild('widgetCondition') widgetCondition: WidgetChartConditionComponent;

    condition: IDataType.ContitionType = {
        fab: {
            fabId: undefined,
            fabName: undefined
        },
        timePeriod: {
            fromDate: undefined,
            toDate: undefined
        }
    };
    
    private readonly DEFAULT_PERIOD: number = 1;
    private readonly DEFAULT_TARGET_NAME: string = 'All Lines';

    targetName: string = this.DEFAULT_TARGET_NAME;
    isShowNoData: boolean = false;

    private _props: any;
    private _currentEl: ElementRef['nativeElement'] = undefined;
    private resizeCallback: Function = this.onResize.bind(this);

    constructor() {
        super();
    }

    ngOnSetup() {
        if (this.isConfigurationWidget) {
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
            this.alarmCountSummaryComp.onChartResize();
        }
    }

    refresh({ type, data }: WidgetRefreshType): void {
        this.showSpinner();
        this._props = data;

        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) {

        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }

        this.setCondition(data);
    }

    setCondition(props: any): void {
        this.condition = {
            fab: props[CD.PLANT],
            timePeriod: this.getTimePeriod(props[CD.TIME_PERIOD][CD.FROM], props[CD.TIME_PERIOD][CD.TO])
        };

        this.widgetCondition.timeConvert(this.condition.timePeriod);
    }

    getTimePeriod(fromDate: number, toDate: number): { fromDate: number, toDate: number } {
        if (this.getProp(CD.CUTOFF_TYPE) === 'DAY') {
            const startOfTo: number = new Date(toDate).setHours(0, 0, 0, 0);
            const startOfFrom: number = startOfTo - 1000 * 60 * 60 * 24 * this.getProp(CD.DAY_PERIOD);

            return { fromDate: startOfFrom, toDate: startOfTo };
        } else if (this.getProp(CD.CUTOFF_TYPE) === 'DATE') {
            return { fromDate: fromDate, toDate: toDate };
        }

        return null;
    }

    onSync(item: any): void {
        let outCd = this.getOutCondition('config');
        const plant: any = this.condition.fab;
        const area: any = item.area;
        const timePeriod: any = this.condition.timePeriod;

        outCd[CD.PLANT] = plant;
        outCd[CD.AREA] = area;
        outCd[CD.TIME_PERIOD] = {from: timePeriod.fromDate, to: timePeriod.toDate};

        // console.log('out => ', JSON.stringify(outCd));

        this.syncOutCondition(outCd);
    }

    endChartLoad(ev: any): void {
        if (ev.isLoad) {
            if (this.isShowNoData) {
                this.isShowNoData = false;
            }
            this.hideSpinner();
        } else if (!ev.isLoad) {
            this.isShowNoData = true;
        }
    }

    private _init(): void {
        this.showSpinner();
        this.setProps();
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
