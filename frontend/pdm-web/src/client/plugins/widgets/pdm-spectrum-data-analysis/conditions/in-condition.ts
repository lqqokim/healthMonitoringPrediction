import {
	ConditionApi,
	ConditionType,
	Condic
} from '../../../../common';

export class SpectrumDataAnalysisInCondition extends ConditionApi {

	// tslint:disable-next-line:no-empty
	init() { }

	config(): [ConditionType] {
		return [
			Condic.Tool.plant({
				required: true,
			}),
			Condic.Tool.area_id({
				required: true,
			}),
			Condic.Tool.eqp_id({
				required: true,
			}),
			Condic.Tool.param_id({
				required: false,
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