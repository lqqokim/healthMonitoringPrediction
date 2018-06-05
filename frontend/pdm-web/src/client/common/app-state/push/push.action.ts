import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class PushAction {

    constructor(private store: Store<AppState>) {}
    
    sharedDashboard({content, senderId, linkUrl}) {
        var action = {
            type: ActionType.PUSH_SHARED_DASHBOARD,
            payload: {
                content,
                senderId,
                linkUrl
            }
        };

        this.store.dispatch(action);
    }

     sharedWorkspace({content, senderId, linkUrl}) {
        var action = {
            type: ActionType.PUSH_SHARED_WORKSPACE,
            payload: {
                content,
                senderId,
                linkUrl
            }
        };

        this.store.dispatch(action);
    }
}
