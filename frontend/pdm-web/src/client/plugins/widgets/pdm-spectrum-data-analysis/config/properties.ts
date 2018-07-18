import {
	ConditionApi,
	ConditionType,
	Condic,
	Formcfg
} from '../../../../common';
import { FormConfigType } from '../../../../sdk';

export class SpectrumDataAnalysisProperties extends ConditionApi {

	preInit(): Array<string> {
		// return [CD.PLANT, CD.CUTOFF_TYPE_DAY, CD.ANALYSIS_SPEC, CD.ANALYSIS_SPEC_VISIBLE];
		return [CD.PLANT, CD.CUTOFF_TYPE_DAY];
	}

	// properties 초기값 설정
	init() {
        this.init_time_period();
	}

	// In Condition 조건
	config(): [ConditionType] {
		return [
			Condic.Tool.plant(),
			Condic.Tool.area_id(),
			Condic.Common.cutoff_type(),
			Condic.Common.day_period(),
			Condic.Common.day_period30(),
			Condic.Common.time_period(),
			Condic.Tool.analysis_spec(),
			Condic.Tool.analysis_spec_visible(),
		];
	}

	/**
	 * Form config 
	 */
	form(): [FormConfigType] {
		const newConfig: FormConfigType = {
			config: {
				isTimePeriod: false,
				format: 'yyyy/MM/dd hh:mm:ss'
			}
		};
		return [
			Formcfg.Factory.plant(),
			Formcfg.Common.time_period(newConfig),
			// Formcfg.Common.communication(),
			// Formcfg.Factory.analysis_spec(),
			// Formcfg.Factory.analysis_spec_visible(),
			Formcfg.Common.auto_refresh()
		];
	}
}
