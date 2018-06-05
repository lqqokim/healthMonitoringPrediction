import { ConditionType } from '../condition.type';
import { Util } from '../../../sdk';

export const compose = (name: string, previous: any, current: any): ConditionType => {
    let condition = Util.Data.mergeDeep(previous, current);
    condition.name = name;
    return condition;
};

export const labelCompose = (name: string, previous: any, current: any): ConditionType => {
	// defien default value
	previous.type = previous.type || 'string';

	let condition = Util.Data.mergeDeep(previous, current);
	condition.name = name;
	return condition;
};
