import {
    ViewApi,
    ConditionType,
    Condic
} from '../../../../common';

export class SpectrumDataAnalysisViewConfig extends ViewApi {

    displayContext(): [ConditionType] {
        return [
            Condic.Label.from(),
            Condic.Label.to(),
        ];
    }

    displayConfiguration(): [ConditionType] {
        return [
            Condic.Label.plantName()
        ];
    }

    displaySync(): [ConditionType] {
        return [
            Condic.Label.plantName()
            // Condic.Label.from(),
            // Condic.Label.to()
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
