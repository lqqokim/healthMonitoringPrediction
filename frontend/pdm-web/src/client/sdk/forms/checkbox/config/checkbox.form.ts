import { EventEmitter } from '@angular/core';

import { FormControlBase } from '../../builder/form-control-base';
import { CheckboxConfigType } from './checkbox.type';

export class CheckboxForm extends FormControlBase<string> {
    controlType = 'checkbox';
    config: CheckboxConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}