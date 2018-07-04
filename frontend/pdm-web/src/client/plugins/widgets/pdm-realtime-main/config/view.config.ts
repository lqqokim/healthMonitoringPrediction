import {
    ViewApi,
    ConditionType,
    Condic
} from '../../../../common';

export class ViewConfig extends ViewApi {

    displayContext(): [ConditionType] {
        return [
            // Condic.Label.tool(),
            // Condic.Label.module()
            Condic.Label.eqpName()
        ];
    }

    paramDisplayContext(): [ConditionType] {
        return [
            Condic.Label.paramName()
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
