import { ActionReducer, Action } from '@ngrx/store';
import { ConfigurationModel } from './configuration.type';

export const ConfigurationReducer: ActionReducer<ConfigurationModel> = (state: ConfigurationModel, action: Action) => {
    //console.log('>> current.reducer state', state);
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: undefined,
            applicationId: undefined,
            menuId: undefined,
        };
    }

    switch (action.type) {
        case ActionType.USERCONFIG:
        case ActionType.APPCONFIG:
        case ActionType.GLOBALCONFIG:
            return {
                actionType: action.type,
                applicationId: action.payload.applicationId,
                menuId: action.payload.menuId,
            };
        default:
            return state;
    }
};
