import { EventEmitter } from '@angular/core';

import { FormControlBase } from '../../builder/form-control-base';
import { SelectorGroupConfigType } from './selector-group.type';

export class SelectorGroupForm extends FormControlBase<string> {
    controlType = 'selector-group';
    config: SelectorGroupConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}