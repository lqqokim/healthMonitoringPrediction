import {
	ConditionApi,
	ConditionType,
	Condic,
	Formcfg
} from '../../../../common';
import { FormConfigType } from '../../../../sdk';

export class RegressionProperties extends ConditionApi {

	preInit(): Array<string> {
		return [CD.PLANT];
	}

	// properties 초기값 설정
	init() {
		this.init_time_period();
	}

	// In Condition 조건
	config(): ConditionType[] {
		return [
			Condic.Tool.plant(),
			Condic.Common.time_period(),
		];
	}

	/**
	 * Form config 
	 */
	form(): FormConfigType[] {
		const newConfig: FormConfigType = {
			config: {
				// isTimePeriod: false,
				format: 'yyyy/MM/dd hh:mm:ss'
			}
		};

		return [
			Formcfg.Factory.plant(),
			Formcfg.Common.time_period(newConfig),
			Formcfg.Common.communication()
			
		];
	}
}
