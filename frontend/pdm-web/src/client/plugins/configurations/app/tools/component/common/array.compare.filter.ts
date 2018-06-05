
import {Injectable, Pipe,PipeTransform} from '@angular/core';

@Pipe({
    name: 'arraycomparefilter'
})
@Injectable()
export class ArrayCompareFilterPipe implements PipeTransform {
    transform(items: any[], inputDatas:any[],key:string): any {
        if(items==undefined || inputDatas==undefined || key==undefined) return items;
        let checkData =[];
        inputDatas.forEach(element => {
            checkData.push(element[key]);
        });

        return items.filter(item => checkData.indexOf(item[key])==-1 );
    }
}