import {
    ViewApi,
    ConditionType,
    Condic
} from '../../../../common';

export class ViewConfig extends ViewApi {

    displayContext(): ConditionType[] {
        return [
            Condic.Label.plantName()
        ];
    }

    displayConfiguration(): ConditionType[] {
        return [
            Condic.Label.plantName()
        ];
    }

    displaySync(): ConditionType[] {
        return [
            Condic.Label.plantName()
        ];
    }

    displaySync1(): ConditionType[] {
        return [
            Condic.Label.plantName()
        ];
    }
}
