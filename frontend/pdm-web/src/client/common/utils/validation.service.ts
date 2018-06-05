
import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

    isWhitespaceInValid(value: string) {
        // It is only whitespace characters
        const defaultPattern: any = /^\s*$/;
        return defaultPattern.test(value);
    }

    trimWhitespace(value: string) {
        return value.replace(/^\s+|\s+$/g,'');
    }
}