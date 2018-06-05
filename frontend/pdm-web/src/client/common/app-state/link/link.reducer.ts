import { ActionReducer, Action } from '@ngrx/store';
import { LinkModel } from './link.type';

export const LinkReducer: ActionReducer<LinkModel> = (state: LinkModel, action: Action) => {
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: '',
            params: undefined
        };
    }

    switch (action.type) {
        case ActionType.LINK_SAVE_PARAMS:
            return {
                actionType: ActionType.LINK_SAVE_PARAMS,
                params: action.payload.params
            };

        default:
            return state;
    }
};
