import { EventEmitter } from '@angular/core';

import { FormControlBase } from '../../builder/form-control-base';
import { DateRangeConfigType } from './date-range.type';

export class DateRangeForm extends FormControlBase<string> {
    controlType = 'date-range';
    config: DateRangeConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}