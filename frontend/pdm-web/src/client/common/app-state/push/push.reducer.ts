import { ActionReducer, Action } from '@ngrx/store';
import { PushModel } from './push.type';

export const PushReducer: ActionReducer<PushModel> = (state: PushModel, action: Action) => {
    //console.log('>> current.reducer state', state);
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            type: undefined,
            content: undefined,
            senderId: undefined,
            linkUrl: undefined
        };
    }

    switch (action.type) {
        case ActionType.PUSH_SHARED_DASHBOARD:
        case ActionType.PUSH_SHARED_WORKSPACE:
            return {
                type: action.type,
                content: action.payload.content,
                senderId: action.payload.senderId,
                linkUrl: action.payload.linkUrl
            };
        default:
            return state;
    }
};
