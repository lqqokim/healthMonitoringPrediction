import { ActionReducer, Action } from '@ngrx/store';
import { ModalModel } from './modal.type';

export const ModalReducer: ActionReducer<ModalModel> = (state: ModalModel, action: Action) => {
    let payload = action.payload;
    if (typeof state === 'undefined') {
        state = {
            actionType: '',
            module: undefined,
            info: undefined,
            requester: undefined
        };
    }

    switch (action.type) {
        case ActionType.SHOW_CONFIRM_MODAL:
            return {
                actionType: ActionType.SHOW_CONFIRM_MODAL,
                info: action.payload.info,
                requester: action.payload.requester
            };

        case ActionType.SHOW_CONFIRM_DELETE_MODAL:
            return {
                actionType: ActionType.SHOW_CONFIRM_DELETE_MODAL,
                info: action.payload.info,
                requester: action.payload.requester
            };

        case ActionType.SHOW_ALERT_MODAL:
            return {
                actionType: ActionType.SHOW_ALERT_MODAL,
                info: action.payload.info,
                requester: action.payload.requester
            };

        case ActionType.SHOW_SHARE_MODAL:
            return {
                actionType: ActionType.SHOW_SHARE_MODAL,
                info: action.payload.info,
                requester: action.payload.requester
            };

        case ActionType.SHOW_WORKSPACE_EDIT_MODAL:
            return {
                actionType: ActionType.SHOW_WORKSPACE_EDIT_MODAL,
                info: action.payload.info,
                requester: action.payload.requester
            };

        case ActionType.SHOW_CONFIGURATION_EDIT_MODAL:
            return {
                actionType: ActionType.SHOW_CONFIGURATION_EDIT_MODAL,
                module: action.payload.module,
                requester: action.payload.requester,
                info: action.payload.info
            };

        case ActionType.SHOW_APPLY_MODULE_MODAL:
            return {
                actionType: ActionType.SHOW_APPLY_MODULE_MODAL,
                module: action.payload.module,
                requester: action.payload.requester,
                info: action.payload.info
            };

        default:
            return state;
    }
};
