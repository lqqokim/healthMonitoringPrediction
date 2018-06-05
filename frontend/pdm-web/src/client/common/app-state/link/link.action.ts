import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';
import { LinkModel } from './link.type';
import { Util } from '../../../sdk';

@Injectable()
export class LinkAction {

    constructor(private store: Store<AppState>) {}

    saveLink(params: any) {
        const action = {
            type: ActionType.LINK_SAVE_PARAMS,
            payload: {
                params
            }
        };
        this.store.dispatch(action);
    }
}
