import { Component, OnInit, OnChanges, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';
import { Util } from './../../../sdk/utils/utils.module';

import { LineStatusSummaryComponent } from './components/line-status-summary.component';

import * as IDataType from './model/data-type.interface';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-line-status-summary-widget',
    templateUrl: './pdm-line-status-summary-widget.html',
    styleUrls: ['./pdm-line-status-summary-widget.css']
})
export class PdmLineStatusSummaryWidgetComponent extends WidgetApi implements OnInit, OnSetup {
    @ViewChild('container') container: ElementRef;
    @ViewChild('statusSummary') statusSummary: LineStatusSummaryComponent;

    condition: IDataType.ContitionType;
    viewTimePriod: ITimePeriod = {
        fromDate: 0,
        toDate: 0
    };

    targetName: string;
    startOfDay: number;
    isShowNoData: boolean = false;

    private readonly DEFAULT_PERIOD: number = 1;

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

        if (this._currentEl !== undefined) {
            this._currentEl.addEventListener('transitionend', this.resizeCallback, false);
            this.onResize();        
        }
    }

    onResize(e?: TransitionEvent): void {
        if ((e !== undefined && !e.isTrusted) || this._currentEl === undefined) { return; }
        if (e) {
            this.statusSummary.onChartResize();
        }
    }

    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        this._props = data;

        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) {

        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }

        this.setCondition(data);
    }

    setCondition(props: any) {
        this.condition = {
            fab: props[CD.PLANT],
            timePeriod: {
                from: props[CD.TIME_PERIOD][CD.FROM],
                to: this.startOfDay
            }
        };

        this.setViewCondition(this.condition);
    }

    setViewCondition(condition: IDataType.ContitionType): void {
        this.targetName = condition.fab.fabName;
        this.viewTimePriod.fromDate = condition.timePeriod.from;
        this.viewTimePriod.toDate = this.startOfDay;
    }

    endChartLoad(ev: any) {
        if (ev) {
            if(this.isShowNoData) {
                this.isShowNoData = false;
            }
            this.hideSpinner();
        } else if(!ev) {
            this.isShowNoData = true;
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

    setStartOfDay(): void {
        let now: Date = new Date();
        const startOfDay: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.startOfDay = startOfDay.getTime(); // today 00:00:00
    }

    private _init(): void {
        this.showSpinner();
        this.setStartOfDay();
        this.setProps();
        this._props = this.getProperties();
        this.setCondition(this._props);
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