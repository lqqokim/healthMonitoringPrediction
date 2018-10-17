import {
	ConditionApi,
	ConditionType,
	Condic,
	Formcfg
} from '../../../../common';
import { FormConfigType } from '../../../../sdk';

export class Properties extends ConditionApi {

	preInit(): Array<string> {
		return [CD.PLANT, CD.MONITORING];
	}

	// properties 초기값 설정
	init() {
		this.init_time_period();
	}

	// In Condition 조건
	config(): ConditionType[] {
		return [
			Condic.Tool.plant(),
			Condic.Tool.monitoring()
		];
	}

	/**
	 * Form config 
	 */
	form(): FormConfigType[] {
		return [
			Formcfg.Factory.plant(),
			Formcfg.Factory.monitoring(),
			Formcfg.Common.auto_refresh()
		];
	}
}
