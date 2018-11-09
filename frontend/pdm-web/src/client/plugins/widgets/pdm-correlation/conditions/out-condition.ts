import {
	ConditionApi,
	ConditionType,
	Condic
} from '../../../../common';

export class CorrelationOutCondition extends ConditionApi {

	// tslint:disable-next-line:no-empty
	init() { }

	config(): ConditionType[] {
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