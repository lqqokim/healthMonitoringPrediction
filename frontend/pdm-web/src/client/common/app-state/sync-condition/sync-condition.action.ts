import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class SyncConditionAction {

    constructor(private store: Store<AppState>) {}

    syncOutCondition(widgetId: number, widgetTitle: string, data: any) {
        var action = {
            type: ActionType.SYNC_OUT_CONDITION,
            payload: {
                widgetId: widgetId,
                widgetTitle: widgetTitle,
                data: data
            }
        };

        this.store.dispatch(action);
    }
}
