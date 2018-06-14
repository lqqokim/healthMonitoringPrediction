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
            let fromTo = [];
            if(term.indexOf('[')>=0){
                if( term.indexOf(']')>=0 && term.indexOf('-')>=0){
                    let retval = term.match(/\[.*?\]/g)[0];
                    if(retval.length>0){
                        term = term.replace(retval,'');
                        retval = retval.replace('[','');
                        retval = retval.replace(']','');
                        fromTo = retval.split('-');
                    }
                }else{
                    term = term.substr(0,term.indexOf('['));
                }
    
            }
            filterdValues = value.filter(item => this.isContain(term,item,fromTo, args['naming']))
            return filterdValues;
        } else {
            filterdValues = value;
            return filterdValues;
        }
    }

    isContain(term: string, item: any,fromTo:any[], naming: string): any{
        if ( item[naming].toLocaleLowerCase().indexOf(term) !== -1 ) {
            if(fromTo.length>0){
                const  val = this.getNumber(item[naming]);
                if(val!=null && val>=fromTo[0] && val<=fromTo[1]){
                    return item;
                }
            }else{
                return item;
            }
            
        }
    }
    getNumber(str){
        let data = str.match(/[+-]?\d+(?:\.\d+)?/g).map(Number);
        if(data.length>1){
            return data[0]
        }else{
            return null;
        }
    }
}
