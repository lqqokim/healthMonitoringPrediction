import { Component, OnInit, OnChanges } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

import * as IDataType from './model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'pdm-alarm-count-summary-widget',
    templateUrl: './pdm-alarm-count-summary-widget.html',
    styleUrls: ['./pdm-alarm-count-summary-widget.css']
})
export class PdmAlarmCountSummaryWidgetComponent extends WidgetApi implements OnInit {

    viewTimePriod: any = {
        fromDate: 0,
        toDate: 0
    };

    condition: IDataType.ContitionType;
    private _props: any;

    constructor() {
        super();
    }

    ngOnSetup() {
        this._init();
    }

    ngOnInit() {

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

        this.viewTimePriod.fromDate = this.covertDateFormatter(props[CD.TIME_PERIOD]['from']);
        this.viewTimePriod.toDate = this.covertDateFormatter(to);
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
