import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchComboPipe'
})

export class SearchComboPipe implements PipeTransform {
    constructor() { }
    transform(value: any, args: any): any {
        let filterdValues = [];
        if ( args['term'] !== '') {    
            let term: string = args['term'].toLocaleLowerCase();
            filterdValues = value.filter(item => this.isContain(term,item, args['naming']))
            return filterdValues;
        } else {
            filterdValues = value;
            return filterdValues;
        }
    }

    isContain(term: string, item: any, naming: string): any{
        if ( item[naming].toLocaleLowerCase().indexOf(term) !== -1 ) {
            return item;
        }
    }
}
