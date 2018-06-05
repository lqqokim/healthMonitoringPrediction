import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'matchName' })
export class MatchNamePipe implements PipeTransform {
    transform(list: any[], labelfield: string, searchText: string): any {
        if (searchText && list && list.length > 0) {
            searchText = searchText.toUpperCase();
            return list.filter((item: any) => item[labelfield].toUpperCase().match(searchText));
        } else {
            return list;
        }
    }
}
