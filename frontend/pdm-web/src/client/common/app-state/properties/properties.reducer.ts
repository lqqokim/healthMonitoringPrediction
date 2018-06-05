import { ActionReducer, Action } from '@ngrx/store';
import { PropertiesModel } from './properties.type';

export const PropertiesReducer: ActionReducer<PropertiesModel> = (state: PropertiesModel, action: Action) => {
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: action.type,
            status: 'hide',
            widget: undefined,
            tasker: undefined
        };
    }

    switch (action.type) {
        case ActionType.OPEN_WIDGET_PROPERTIES:
            return {
                actionType: action.type,
                status: 'open',
                widget: action.payload.widget
            };
        case ActionType.CLOSE_WIDGET_PROPERTIES:
            return {
                actionType: action.type,
                status: 'hide',
                widget: action.payload.widget
            };
        case ActionType.APPLY_WIDGET_PROPERTIES:
            return {
                actionType: action.type,
                status: 'apply',
                widget: action.payload.widget
            };

        case ActionType.OPEN_TASKER_PROPERTIES:
            return {
                actionType: action.type,
                status: 'open',
                tasker: action.payload.tasker
            };
        case ActionType.CLOSE_TASKER_PROPERTIES:
            return {
                actionType: action.type,
                status: 'hide',
                 tasker: action.payload.tasker
            };
        case ActionType.APPLY_TASKER_PROPERTIES:
            return {
                actionType: action.type,
                status: 'apply',
                tasker: action.payload.tasker
            };

        default:
            return state;
    }
};
