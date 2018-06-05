import { FormControlBase } from '../../builder/form-control-base';
import { ManualTimelineConfigType } from './manual-timeline.type';

export class ManualTimelineForm extends FormControlBase<string> {
    controlType = 'manual-timeline';
    config: ManualTimelineConfigType;

    constructor(options: {} = {}) {
        super(options);
        this.config = (<any>options)['config'] || { title: 'unnamed' };
        this.config.key = (<any>options)['key'];
    }
}
