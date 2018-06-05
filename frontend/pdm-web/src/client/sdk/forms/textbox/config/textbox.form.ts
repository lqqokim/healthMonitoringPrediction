import { EventEmitter } from '@angular/core';

import { FormControlBase } from '../../builder/form-control-base';
import { TextboxConfigType } from './textbox.type';

export class TextboxForm extends FormControlBase<string> {
    controlType = 'textbox';
    config: TextboxConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}