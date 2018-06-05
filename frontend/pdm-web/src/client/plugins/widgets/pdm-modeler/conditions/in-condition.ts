import {
	ConditionApi,
	ConditionType,
	Condic,
	WidgetModel,
} from '../../../../common';

export class InCondition extends ConditionApi {

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
				})
			];
		}
}
