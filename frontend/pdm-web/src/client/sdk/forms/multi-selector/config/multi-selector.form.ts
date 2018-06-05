import { EventEmitter } from '@angular/core';

import { FormControlBase } from '../../builder/form-control-base';
import { MultiSelectorConfigType } from './multi-selector.type';

export class MultiSelectorForm extends FormControlBase<string> {
    controlType = 'multi-selector';
    config: MultiSelectorConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}