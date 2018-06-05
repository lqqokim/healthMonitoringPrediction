import { ActionReducer, Action } from '@ngrx/store';
import { ContextMenuModel } from './context-menu.type';

export const ContextMenuReducer: ActionReducer<ContextMenuModel> = (state: ContextMenuModel, action: Action) => {
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: '',
            id: -1,
            tooltip: undefined,
            template: undefined,
            outCondition: undefined,
            contextMenuAction: undefined,
            contextMenuOption: undefined,
            requester: undefined
        };
    }

    switch (action.type) {
        case ActionType.SHOW_CONTEXT_MENU:
            return {
                actionType: ActionType.SHOW_CONTEXT_MENU,
                id: action.payload.id,
                tooltip: action.payload.tooltip,
                template: action.payload.template,
                outCondition: action.payload.outCondition,
                contextMenuAction: action.payload.contextMenuAction,
                contextMenuOption: action.payload.contextMenuOption,
                requester: action.payload.requester
            };

        case ActionType.CLOSE_CONTEXT_MENU:
            return {
                actionType: ActionType.CLOSE_CONTEXT_MENU,
                id: action.payload.id
            };

        default:
            return state;
    }
};
