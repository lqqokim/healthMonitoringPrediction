import {
	ConditionApi,
	ConditionType,
	Condic,
	WidgetModel,
	Formcfg
} from '../../../../common';
import { FormConfigType, Util } from '../../../../sdk';

export class PdmCurrentAnalysisProperties extends ConditionApi {

	// properties 초기값 설정
	preInit(): Array<string> {
		return [];
	}

	init() {
		this.init_manualTimeline();
	}

	// In Condition 조건
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

	form(): [FormConfigType] {
		return [
			Formcfg.Common.location_fdc_analysis_model_param()
		];
	}
}
