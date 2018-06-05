import {
    ViewApi,
    ConditionType,
    Condic,
    ConditionValueType
} from '../../../../common';

export class ViewConfig extends ViewApi {

    displayContext(): [ConditionType] {
        return [
            Condic.Label.plantName(),
            Condic.Label.time_period()
        ];
    }

    displayConfiguration(): [ConditionType] {
        const newConfig: ConditionValueType = {
			config: {
				format: 'YYYY/MM/DD'
			}
		};
        return [
            Condic.Label.plantName(),
            Condic.Label.time_period(newConfig)
        ];
    }

    displaySync(): [ConditionType] {
        return [
            Condic.Label.from(),
            Condic.Label.to()
            // Condic.Label.time_period()
        ];
    }

    displaySync1(): [ConditionType] {
        return [
            Condic.Label.from(),
            Condic.Label.to()
            // Condic.Label.time_period()
        ];
    }
}
