import {
    ViewApi,
    ConditionType,
    Condic
} from '../../../../common';

export class ViewConfig extends ViewApi {

    displayContext(): ConditionType[] {
        return <any>[
            // Condic.Label.tool(),
            // Condic.Label.module()
        ];
        //  return <any>[];
    }

    displayConfiguration(): ConditionType[] {
        return <any>[];
    }

    displaySync(): ConditionType[] {
        return <any>[];
    }
}
