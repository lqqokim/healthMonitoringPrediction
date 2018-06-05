import {
	ConditionApi,
	ConditionType,
	Condic,
	Formcfg
} from '../../../../common';
import { FormConfigType, Util } from '../../../../sdk';

export class Properties extends ConditionApi {

    // properties 초기값 설정
    preInit(): Array<string> {
        return [];
    }

	init() {
		this.init_dateType();
        this.init_manualTimeline();
    }

	// In Condition 조건
	config(): [ConditionType] {
		return [
            Condic.Common.manualTimeline(),
		    Condic.Common.dateType()
        ];
	}

	form(): [FormConfigType] {
        return [
			Formcfg.Common.manual_timeline(),
			Formcfg.Common.spec_alarming()
        ];
    }
}
