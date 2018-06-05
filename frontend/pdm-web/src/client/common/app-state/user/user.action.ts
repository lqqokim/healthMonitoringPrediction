import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class UserAction {

    constructor(private store: Store<AppState>) {}
    
    signed(userId?: string) {
        var action = {
            type: ActionType.SIGNED_USER,
            payload: {
                userId
            }
        };

        this.store.dispatch(action);
    }

    logout(userId?: string) {
        var action = {
            type: ActionType.LOGOUT_USER,
            payload: {
                userId
            }
        };

        this.store.dispatch(action);
    }
}
