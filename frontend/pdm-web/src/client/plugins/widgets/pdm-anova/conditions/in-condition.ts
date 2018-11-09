import {
	ConditionApi,
	ConditionType,
	Condic
} from '../../../../common';

export class AnovaInCondition extends ConditionApi {

	// tslint:disable-next-line:no-empty
	init() {}

	config(): ConditionType[] {
		return [
			// Condic.Common.time_period({
			// 	required: true
			// })
			Condic.Tool.plant({
				required: true
			}),
			Condic.Common.time_period({
				required: true
			}),
			// Condic.Tool.radar_type({
			// 	required: true
			// })
		];
	}
}