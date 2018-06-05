import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class SidebarAction {

    constructor(private store: Store<AppState>) { }

    openSmall(gnbTypeId: any, isToggle?: any, isStopPropagation?: any) {
        if (!isToggle) {
            isToggle = false;
        }

        var action = {
            type: ActionType.OPEN_SIDE_BAR_SMALL,
            payload: {
                gnbTypeId: gnbTypeId,
                isToggle: isToggle,
                isStopPropagation: isStopPropagation
            }
        };

        this.store.dispatch(action);
    }

    openFull(gnbTypeId: any, isToggle?: any, isStopPropagation?: any) {
        if (!isToggle) {
            isToggle = false;
        }

        var action = {
            type: ActionType.OPEN_SIDE_BAR_FULL,
            payload: {
                gnbTypeId: gnbTypeId,
                isToggle: isToggle,
                sStopPropagation: isStopPropagation
            }
        };

        this.store.dispatch(action);
    }

    close() {
        var action = {
            type: ActionType.CLOSE_SIDE_BAR
        };

        this.store.dispatch(action);
    }

    toggleSize(gnbTypeId: any, size: any) {
        if (size === 'small') {
            this.openFull(gnbTypeId, true);
        } else { // full
            this.openSmall(gnbTypeId, true);
        }
    }
}