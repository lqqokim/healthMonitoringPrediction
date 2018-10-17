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
			Condic.Tool.plant({
				required: true
			}),
			Condic.Tool.eqp_id({
				required: false
			}),
			Condic.Tool.param_id({
				required: false
			}),
			Condic.Common.time_period({
				required: true
			}),
			Condic.Common.category({
				required: false
			})
		];
	}
}
