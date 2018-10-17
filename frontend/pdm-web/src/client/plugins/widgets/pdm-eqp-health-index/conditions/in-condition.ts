import {
	ConditionApi,
	ConditionType,
	Condic
} from '../../../../common';

export class InCondition extends ConditionApi {

	// tslint:disable-next-line:no-empty
	init() {}

	config(): ConditionType[] {
		return [
			Condic.Tool.plant({
				required: true
			}),
			Condic.Tool.area({
				required: true
			}),
			Condic.Common.time_period({
				required: true
			})
		];
	}
}