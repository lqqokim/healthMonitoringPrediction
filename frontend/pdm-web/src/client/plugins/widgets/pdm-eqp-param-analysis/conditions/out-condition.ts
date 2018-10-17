import {
	ConditionApi,
	ConditionType,
	Condic
} from '../../../../common';

export class OutCondition extends ConditionApi {

	// tslint:disable-next-line:no-empty
	init() {}

	config(): ConditionType[] {
		return [
			Condic.Common.time_period(),
			//selected
			Condic.Tool.plant(),
			Condic.Tool.area_id()
		];
	}
}