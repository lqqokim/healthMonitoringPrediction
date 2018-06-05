import { ActionReducer, Action } from '@ngrx/store';
import { FilterModel } from './filter.type';

export const FilterReducer: ActionReducer<FilterModel> = (state: FilterModel, action: Action) => {

    if (typeof state === 'undefined') {
        state = {
            status: undefined,
            size: undefined,
            model: undefined,
            requester: undefined,
            isTasker: false
        };
    }

    switch (action.type) {
        case ActionType.OPEN_FILTER_CONTAINER:
            return {
                status: ActionType.OPEN_FILTER_CONTAINER,
                size: action.payload.size,
                model: action.payload.model,
                requester: action.payload.requester,
                isTasker: action.payload.isTasker
            };
        case ActionType.CLOSE_FILTER_CONTAINER:
            return {
                status: ActionType.CLOSE_FILTER_CONTAINER,
                size: undefined,
                model: undefined,
                requester: undefined,
                isTasker: false
            };
        default:
            return state;
    }

}