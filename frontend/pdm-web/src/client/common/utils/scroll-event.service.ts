import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ContextMenuAction } from './../app-state/context-menu/context-menu.action';
import { ContextMenuModel } from './../app-state/context-menu/context-menu.type';
import {StateManager} from '../app-state/state-manager.service';

@Injectable()
export class ScrollEventService {

    constructor(
        private stateManager: StateManager,
        private contextMenuAction: ContextMenuAction) { }

    listenScrollEvent(dom: any): any {
        return Observable.fromEvent(dom, 'scroll')
            // .debounceTime(50)
            .map((event) => {
                const model: ContextMenuModel = this.stateManager.getContextMenu();
                if(model.actionType === ActionType.SHOW_CONTEXT_MENU) {
                    return true;
                } else {
                    return false;
                }
            })
            .subscribe((isCloseContextMenu: boolean) => {
                if (isCloseContextMenu) {
                    this.contextMenuAction.closeContextMenu();
                }
            });
    }
}