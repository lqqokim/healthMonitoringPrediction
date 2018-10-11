import {
    ViewApi,
    ConditionType,
    Condic,
    ConditionValueType
} from '../../../../common';

export class ViewConfig extends ViewApi {

    displayContext(): ConditionType[] {
        return [
            Condic.Label.eqpName(),
        ];
    }

    paramDisplayContext(): ConditionType[] {
        return [
            Condic.Label.paramName()
        ];
    }

    displayConfiguration(): ConditionType[] {
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

    // displayParamContext(): [ConditionType] {
    //     const newConfig: ConditionValueType = {
    // 		config: {
    // 			format: 'YYYY/MM/DD'
    // 		}
    // 	};
    //     return [
    //         Condic.Label.plantName(),
    //         Condic.Label.eqpName(),
    //         Condic.Label.time_period(newConfig)
    //     ];
    // }

    // displayEffectContext(): [ConditionType] {
    //     return [
    //         Condic.Label.eqpName(),
    //         Condic.Label.time(),
    //         Condic.Label.healthIndex()
    //     ];
    // }

    displaySync(): [ConditionType] {
        return [
            Condic.Label.from(),
            Condic.Label.to()
            // Condic.Label.time_period()
        ];
    }

    // displaySync1(): [ConditionType] {
    //     return [
    //         Condic.Label.from(),
    //         Condic.Label.to()
    //         // Condic.Label.time_period()
    //     ];
    // }
}
