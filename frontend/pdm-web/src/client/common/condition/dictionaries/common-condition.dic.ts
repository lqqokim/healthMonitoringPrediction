import { ConditionType, ConditionValueType } from '../condition.type';
import { compose } from '../util/condition-dic.util';

export class CommonConditionDic {

    static common_name(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.NAME,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static common_alias(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.ALIAS,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static cutoff_type(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.CUTOFF_TYPE,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static day_period(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.DAY_PERIOD,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static day_period30(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.DAY_PERIOD_30,
            {
                type: 'number',
                required: false
            },
            newCondition);
    }

    static time_periods(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.TIME_PERIODS,
            {
                isGroup: false,
                type: 'any'
            },
            newCondition);
    }

    static time_period(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.TIME_PERIOD,
            {
                isGroup: true,
                value: [
                    CommonConditionDic.time_period_from(),
                    CommonConditionDic.time_period_to()
                ],
                required: false
            },
            newCondition);
    }

    static time_period_from(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.FROM,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static time_period_to(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.TO,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static threshold(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.THRESHOLD,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static score(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.SCORE,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static start_dtts(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.START_DTTS,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static end_dtts(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.END_DTTS,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static location ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.LOCATION,
            {
                type: 'any',
                isGroup: false,
                required: true
            },
            newCondition);
    }

    static category ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.CATEGORY,
            {
                type: 'any',
                required: false
            },
            newCondition);
    }

    static usl(newCondition: ConditionValueType = {}): ConditionType {
		return compose(
			CD.USL,
			{
				type: 'number',
				required: true
			},
			newCondition);
	}

	static ucl(newCondition: ConditionValueType = {}): ConditionType {
		return compose(
			CD.UCL,
			{
				type: 'number',
				required: true
			},
			newCondition);
	}

    static manualTimeline(newCondition: ConditionValueType = {}): ConditionType {
		return compose(
			CD.MANUAL_TIMELINE,
			{
				type: 'any',
				required: false
			},
			newCondition);
	}

    static dateType(newCondition: ConditionValueType = {}): ConditionType {
		return compose(
			CD.DATE_TYPE,
			{
				type: 'any',
				required: false
			},
			newCondition);
	}
}
