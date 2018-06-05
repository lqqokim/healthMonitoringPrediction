import {
	ConditionApi,
	ConditionType,
	Condic
} from '../../../../common';

export class OutCondition extends ConditionApi {

	// tslint:disable-next-line:no-empty
	init() {}

	config(): [ConditionType] {
		return [
			Condic.Tool.plant(),
			Condic.Tool.eqp_id()
		];
	}
}
