import { FormControlBase } from '../../builder/form-control-base';
import { SelectorConfigType } from './selector.type';

export class SelectorForm extends FormControlBase<string> {
    controlType = 'selector';
    config: SelectorConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}
