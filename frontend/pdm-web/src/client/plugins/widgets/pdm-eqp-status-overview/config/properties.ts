import {
	ConditionApi,
	ConditionType,
	Condic,
	Formcfg
} from '../../../../common';
import { FormConfigType } from '../../../../sdk';

export class Properties extends ConditionApi {

	preInit(): Array<string> {
		return [];
	}

	// properties 초기값 설정
	init() {
        this.init_time_period();
	}

	// In Condition 조건
	config(): ConditionType[] {
		return [
			Condic.Tool.plant_id({
				required: true
			}),
			Condic.Tool.area_id({
				required: true
			})
		];
	}

	/**
	 * Form config 
	 */
	form(): [FormConfigType] {
		return [
			Formcfg.Common.communication(),
			Formcfg.Common.auto_refresh()
		];
	}
}
