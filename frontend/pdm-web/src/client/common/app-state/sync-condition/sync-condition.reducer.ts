import { ActionReducer, Action } from '@ngrx/store';
import { SyncConditionModel } from './sync-condition.type';

export const SyncConditionReducer: ActionReducer<SyncConditionModel> = (state: SyncConditionModel, action: Action) => {
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: '',
            widgetId: -1,
            widgetTitle: '',
            data: undefined
        };
    }

    switch (action.type) {
        case ActionType.SYNC_OUT_CONDITION:
            return {
                actionType: ActionType.SYNC_OUT_CONDITION,
                widgetId: action.payload.widgetId,
                widgetTitle: action.payload.widgetTitle,
                data: action.payload.data
            };
        default:
            return state;
    }
};
