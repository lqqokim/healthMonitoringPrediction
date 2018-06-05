import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../app-state.type';
import { FilterRequester } from '../../filter/filter-requester';

@Injectable()
export class FilterAction {

    constructor(private store: Store<AppState>) { }

    openWidget(model: any, event: any, size: string = 'small'): Observable<any> {
        return this._open(model, event, size, false);
    }

    openTasker(model: any, event: any, size: string = 'small'): Observable<any> {
        return this._open(model, event, size, true);
    }

    _open(model: any, event: any, size: string = 'small', isTasker: boolean): Observable<any> {
        // stop auto close event. 
        event.stopPropagation();

        const requester = new FilterRequester();
        requester.setModel(model);

        var action = {
            type: ActionType.OPEN_FILTER_CONTAINER,
            payload: {
                size,
                model,
                requester,
                isTasker
            }
        };

        this.store.dispatch(action);

        return requester.getFilterObservable();
    }


    close() {
        var action = {
            type: ActionType.CLOSE_FILTER_CONTAINER
        };

        this.store.dispatch(action);
    }
}