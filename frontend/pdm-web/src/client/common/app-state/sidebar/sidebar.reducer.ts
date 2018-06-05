import { ActionReducer, Action } from '@ngrx/store';
import { SidebarModel } from './sidebar.type';

export const SidebarReducer: ActionReducer<SidebarModel> = (state: SidebarModel, action: Action) => {

    if (typeof state === 'undefined') {
        state = {
            status: 'hide',
            gnbTypeId: undefined
        };
    }

    switch (action.type) {
        case ActionType.OPEN_SIDE_BAR_SMALL:
            return {
                status: 'small',
                gnbTypeId: action.payload.gnbTypeId,
                isToggle: action.payload.isToggle,
                isStopPropagation: action.payload.isStopPropagation
            };
        case ActionType.OPEN_SIDE_BAR_FULL:
            return {
                status: 'full',
                gnbTypeId: action.payload.gnbTypeId,
                isToggle: action.payload.isToggle,
                isStopPropagation: action.payload.isStopPropagation
            };
        case ActionType.CLOSE_SIDE_BAR:
            return {
                status: 'hide',
                gnbTypeId: undefined
            };
        default:
            return state;
    }

}