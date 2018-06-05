import { ActionReducer, Action } from '@ngrx/store';
import { RouterModel } from './router.type';

export const RouterReducer: ActionReducer<RouterModel> = (state: RouterModel, action: Action) => {

    if (typeof state === 'undefined') {
        state = {
            actionType: undefined,
            event: undefined,
            toState: undefined,
            toParams: undefined,
            subject: undefined
        };
    }

    switch (action.type) {
        case ActionType.ROUTER_CHANGE_START:
        case ActionType.ROUTER_CHANGE_SUCCESS:
            return change(action.type, state, action.payload);
        default:
            return state;
    }

    function change(actionType: string, state: RouterModel, payload: any) {
        state = {
            actionType,
            event: payload.event,
            toState: payload.toState,
            toParams: payload.toParams,
            subject: payload.subject
        };
        return state;
    }
}