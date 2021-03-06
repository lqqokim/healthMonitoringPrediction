import {
    ViewApi,
    ConditionType,
    Condic
} from '../../../../common';

export class PdmCurrentAnalysisViewConfig extends ViewApi {

    displayContext(): [ConditionType] {
        return [
            Condic.Label.tool(),
            Condic.Label.module()
        ];
    }

    displayConfiguration(): [ConditionType] {
        return [
            Condic.Label.from(),
            Condic.Label.to()
        ];
    }

    displaySync(): [ConditionType] {
        return [
            Condic.Label.from(),
            Condic.Label.to()
        ];
    }
}
