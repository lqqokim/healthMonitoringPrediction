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
			{
				name: CD.LOCATION, // location..
				isGroup: false,
				required: true,
				type: 'any'
			}, {
				name: CD.TOOL_MODEL,
				isGroup: true,
				required: false,
				value: [
					Condic.Common.common_name(),
					Condic.Tool.tool_model_id()
				]

			}, {
				name: CD.TOOLS,
				isGroup: false,
				required: false,
				type: 'any'
			}
		];
	}
}
