import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'viewTimeperiod'})
export class WidgetViewTimeperiod implements PipeTransform {
    transform(time: {
        fromDate: number;
        toDate: number;
    }): string {
        return (
            moment(time.fromDate).format('YYYY-MM-DD HH:mm') +' ~ '+
            moment(time.toDate).format('YYYY-MM-DD HH:mm')
        );
    }
}