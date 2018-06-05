import { ActionReducer, Action } from '@ngrx/store';
import { UserModel } from './user.type';

export const UserReducer: ActionReducer<UserModel> = (state: UserModel, action: Action) => {
    //console.log('>> current.reducer state', state);
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: undefined,
            userId: undefined
        };
    }

    switch (action.type) {
        case ActionType.SIGNED_USER:
        case ActionType.LOGOUT_USER:
            return {
                actionType: action.type,
                userId: action.payload.userId
            };
        default:
            return state;
    }
};
