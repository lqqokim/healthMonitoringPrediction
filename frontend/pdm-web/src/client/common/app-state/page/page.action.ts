import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class PageAction {

    constructor(private store: Store<AppState>) {}

    checkPage(actionType: string) {
        const action = {
            type: ActionType.CHECK_PAGE,
            payload: {
                originalActionType: actionType
            }
        };

        this.store.dispatch(action);
    }

    moveWidgetOnDashboard(dashboardId: number, widgetId: number) {
        const action = {
            type: ActionType.CHECK_PAGE,
            payload: {
                originalActionType: ActionType.MOVE_WIDGET_IN_DASHBOARD,
                dashboardId,
                widgetId
            }
        };

        this.store.dispatch(action);
    }
}
