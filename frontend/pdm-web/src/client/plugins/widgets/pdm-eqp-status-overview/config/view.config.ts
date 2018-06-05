import {
    ViewApi,
    ConditionType,
    Condic
} from '../../../../common';

export class ViewConfig extends ViewApi {

    displayContext(): [ConditionType] {
        return [
            Condic.Label.eqpName()
        ];
    }

    displayParamContext(): [ConditionType] {
        return [
            Condic.Label.eqpName(),
            Condic.Label.paramName()
        ];
    }

    displayEffectContext(): [ConditionType] {
        return [
            Condic.Label.eqpName(),
            Condic.Label.time(),
            Condic.Label.healthIndex()
        ];
    }

    displayConfiguration(): [ConditionType] {
        return [
            Condic.Label.time_period()
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
