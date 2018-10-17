import { 
	ConditionApi,
	ConditionType, 
	Condic,
	WidgetModel
} from '../../../../common';

export class OutCondition extends ConditionApi {

	init() { }

	config(): ConditionType[] { // not used
		return [
			Condic.Common.time_period()
		];
	}
}
