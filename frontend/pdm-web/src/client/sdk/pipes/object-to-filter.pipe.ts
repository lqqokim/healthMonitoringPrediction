import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'a3ToFilter' })
export class ObjectToFilterPipe implements PipeTransform {
    transform(items: any[], args: any[]): any {
        if (args === undefined) {
            return items;
        }
        return _.where(items, args[0]); 
    }
}
