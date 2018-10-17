import { ConditionControl } from './condition-control';
import { ConditionGroup } from './condition-group';
import { ConditionType } from '../condition.type';

export class ConditionBuilder {

	static createConditionGroup(conditionTypes: ConditionType[], name?: string): ConditionGroup {
		return new ConditionGroup(conditionTypes, name ? name : 'rootConditionGroup');
	}
	
}