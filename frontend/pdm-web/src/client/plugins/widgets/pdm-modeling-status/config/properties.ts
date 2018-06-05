import {
	ConditionApi,
	ConditionType,
	Condic,
	Formcfg
} from '../../../../common';
import { FormConfigType } from '../../../../sdk';

export class Properties extends ConditionApi {

	preInit(): Array<string> {
		return [CD.PLANT];
	}

	// properties 초기값 설정
	// tslint:disable-next-line:no-empty
	init() {}

	// In Condition 조건
	config(): [ConditionType] {
		return [
			Condic.Tool.plant()
		];
	}

	/**
	 * Form config 
	 */
	form(): [FormConfigType] {
		return [
			Formcfg.Factory.plant(),
			Formcfg.Common.communication(),
			Formcfg.Common.auto_refresh()
		];
	}
}
