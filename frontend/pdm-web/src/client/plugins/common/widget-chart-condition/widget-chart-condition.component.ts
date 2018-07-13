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
    
    time: string = undefined;

    constructor(){
    }

    // timePeriod 시간 출력용으로 변환
    public timeConvert(timePeriod: ITimePeriod): void {
        if( timePeriod === undefined ){ return; }
        this.time =
            moment(timePeriod.fromDate).format('YYYY-MM-DD HH:mm') +' ~ '+
            moment(timePeriod.toDate).format('YYYY-MM-DD HH:mm')
        ;
    }
}