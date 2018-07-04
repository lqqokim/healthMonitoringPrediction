import { Component, ViewEncapsulation, Input } from '@angular/core';

export interface ITimePeriod {
    fromDate: number;
    toDate: number;
};

@Component({
    moduleId: module.id,
    selector: 'widget-chart-condition',
    templateUrl: './widget-chart-condition.html',
    // styleUrls: ['./widget-chart-condition.css'],
    encapsulation: ViewEncapsulation.None
})

export class WidgetChartConditionComponent {

    @Input() target: string;
    @Input() timePeriod: ITimePeriod;

    constructor() {}

    viewTimeperiod(): string {
        return (
            moment(this.timePeriod.fromDate).add(-1, 'months').format('YYYY-MM-DD HH:mm') +' ~ '+
            moment(this.timePeriod.toDate).add(-1, 'months').format('YYYY-MM-DD HH:mm')
        );
    }
}