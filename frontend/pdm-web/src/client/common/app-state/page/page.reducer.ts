import { ActionReducer, Action } from '@ngrx/store';
import { PageModel } from './page.type';

export const PageReducer: ActionReducer<PageModel> = (state: PageModel, action: Action) => {
    //console.log('>> current.reducer state', state);
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: undefined,
            originalActionType: undefined,
            dashboardId: undefined,
            widgetId: undefined,
        };
    }

    switch (action.type) {
        case ActionType.CHECK_PAGE:
            return {
                actionType: ActionType.CHECK_PAGE,
                originalActionType: action.payload.originalActionType,
                dashboardId: action.payload.dashboardId,
                widgetId: action.payload.widgetId
            };
        default:
            return {
                actionType: undefined,
                originalActionType: undefined,
                dashboardId: undefined,
                widgetId: undefined
            };
    }
};
