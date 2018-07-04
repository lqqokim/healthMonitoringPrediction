import {
	ConditionApi,
	ConditionType,
	Condic,
	WidgetModel,
	Formcfg
} from '../../../../common';
import { FormConfigType, Util } from '../../../../sdk';

export class Properties extends ConditionApi {

	// properties 초기값 설정
	preInit(): Array<string> {
		return [CD.PLANT, CD.WORST_TOP]; // in-condition에도 추가
	}

	// properties 초기값 설정
	init() {
		this.init_time_period();
	}

	// In Condition 조건
	config(): [ConditionType] {
		return [
			Condic.Tool.plant(),
			// Condic.Tool.worst_top()
		];
	}

	/**
	 * Form config 
	 */
	form(): [FormConfigType] {
		return [
			Formcfg.Factory.plant(),
			// Formcfg.Factory.worst_top(),
			Formcfg.Common.communication(),
			Formcfg.Common.auto_refresh()
		];
	}
}
