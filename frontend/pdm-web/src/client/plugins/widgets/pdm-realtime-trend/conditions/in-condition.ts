import {
	ConditionApi,
	ConditionType,
	Condic,
	WidgetModel,
} from '../../../../common';

export class InCondition extends ConditionApi {

	init() {}

	config(): [ConditionType] {
		return [
			// Condic.Common.time_period({
			// 	required: true
			// })
			Condic.Tool.plant({
				required: true
			}),
			Condic.Tool.worst_top({
				required: true
			})
			// Condic.Common.time_period({
			// 	required: true
			// }),
			// Condic.Tool.radar_type({
			// 	required: true
			// })
		];
	}
}
