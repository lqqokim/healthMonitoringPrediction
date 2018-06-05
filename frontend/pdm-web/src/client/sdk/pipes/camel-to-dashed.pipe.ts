import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'a3CamelToDashed' })
export class CamelToDashedPipe implements PipeTransform {
    transform(input: string, args: string[]): any {
        input = input || '';
        return input.replace(/([A-Z])/g, function ($1) { return "-" + $1.toLowerCase(); });
    }
}
