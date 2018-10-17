import {
	ConditionApi,
	ConditionType,
	Condic,
	WidgetModel
} from '../../../../common';

import { Formatter } from "../../../../sdk/formatter/formatter.module";

export class OutCondition extends ConditionApi {

	init() {}

	config(): ConditionType[] {
		return [
			Condic.Tool.tool_model(),
			Condic.Tool.tools(),
			Condic.Tool.module(),
			Condic.Tool.tool(),
			Condic.Common.time_period()
		];
	}

	config2(): ConditionType[] {
		return [
			Condic.Tool.tool_model(),
			Condic.Tool.tools(),
			Condic.Tool.module(),
			Condic.Tool.tool(),
			Condic.Common.time_period()
		]
	}
}
