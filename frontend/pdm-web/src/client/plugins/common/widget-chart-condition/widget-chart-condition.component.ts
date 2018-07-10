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

    time: string = undefined;

    constructor(){
    }

    // timePeriod 시간 출력용으로 변환
    timeConvert(): void {
        if( this.timePeriod === undefined ){ return; }

        this.time =
            moment(this.timePeriod.fromDate).format('YYYY-MM-DD HH:mm') +' ~ '+
            moment(this.timePeriod.toDate).format('YYYY-MM-DD HH:mm')
        ;
    }

    ngOnChanges(c: any){
        this.timeConvert();
    }
}