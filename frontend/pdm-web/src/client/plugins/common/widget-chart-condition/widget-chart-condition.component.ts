import { Component, Input } from '@angular/core';

export interface ITimePeriod {
    fromDate: number;
    toDate: number;
};

@Component({
    moduleId: module.id,
    selector: 'widget-chart-condition',
    templateUrl: './widget-chart-condition.html',
})

export class WidgetChartConditionComponent {

    @Input() target: string;
    @Input() timePeriod: ITimePeriod;

    constructor(){
    }

}