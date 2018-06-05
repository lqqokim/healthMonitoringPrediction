import { EventEmitter } from '@angular/core';

import { FormControlBase } from '../../builder/form-control-base';
import { SpecAlarmingConfigType } from './spec-alarming.type';

export class SpecAlarmingForm extends FormControlBase<string> {
    controlType = 'spec-alarming';
    config: SpecAlarmingConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}