import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';
import { ContextMenuModel } from './context-menu.type';

@Injectable()
export class ContextMenuAction {

    constructor(private store: Store<AppState>) {}

    showContextMenu(cm: ContextMenuModel) {
        const action = {
            type: ActionType.SHOW_CONTEXT_MENU,
            payload: {
                id: cm.id,
                tooltip: cm.tooltip,
                template: cm.template,
                outCondition: cm.outCondition,
                contextMenuAction: cm.contextMenuAction,
                contextMenuOption: cm.contextMenuOption,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }

    closeContextMenu(id: number = -1) {
        const action = {
            type: ActionType.CLOSE_CONTEXT_MENU,
            payload: {
                id: id
            }
        };
        this.store.dispatch(action);
    }
}
