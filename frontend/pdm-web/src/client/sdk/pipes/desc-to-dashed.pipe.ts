import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'a3DescToDashed' })
export class DescToDashedPipe implements PipeTransform {
    transform(desc: string, args: string[]): any {
        return desc || '-';
    }
}
