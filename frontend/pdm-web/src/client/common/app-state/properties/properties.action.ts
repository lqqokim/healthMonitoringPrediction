import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';
import { WidgetModel } from '../dashboard/dashboard.type';
import { TaskerModel } from '../workspace/workspace.type';

@Injectable()
export class PropertiesAction {

    constructor(private store: Store<AppState>) {}
    
    openWidgetConfiguration(widget: WidgetModel) {
        var action = {
            type: ActionType.OPEN_WIDGET_PROPERTIES,
            payload: {
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    closeWidgetConfiguration(widget: WidgetModel) {
        var action = {
            type: ActionType.CLOSE_WIDGET_PROPERTIES,
            payload: {
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    applyWidgetConfiguration(widget: WidgetModel) {
        var action = {
            type: ActionType.APPLY_WIDGET_PROPERTIES,
            payload: {
                widget: widget
            }
        };

        this.store.dispatch(action);
    }

    openTaskerConfiguration(tasker: TaskerModel) {
        var action = {
            type: ActionType.OPEN_TASKER_PROPERTIES,
            payload: {
                tasker: tasker
            }
        };

        this.store.dispatch(action);
    }

    closeTaskerConfiguration(tasker: TaskerModel) {
        var action = {
            type: ActionType.CLOSE_TASKER_PROPERTIES,
            payload: {
                tasker: tasker
            }
        };

        this.store.dispatch(action);
    }

    applyTaskerConfiguration(tasker: TaskerModel) {
        var action = {
            type: ActionType.APPLY_TASKER_PROPERTIES,
            payload: {
                tasker: tasker
            }
        };

        this.store.dispatch(action);
    }
}
