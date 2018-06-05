import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class RouterAction {

    constructor(private store: Store<AppState>) { }

    changeStart(event: string, toState: any, toParams?: any, subject?: any) {
        var action = {
            type: ActionType.ROUTER_CHANGE_START,
            payload: {
                event: event,
                toState: toState,
                toParams: toParams,
                subject: subject
            }
        };

        this.store.dispatch(action);
    }

    changeSuccess(event: string, toState: any, toParams?: any, subject?: any) {
        var action = {
            type: ActionType.ROUTER_CHANGE_SUCCESS,
            payload: {
                event: event,
                toState: toState,
                toParams: toParams,
                subject: subject
            }
        };

        this.store.dispatch(action);
    }

}