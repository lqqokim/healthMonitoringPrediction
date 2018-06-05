import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigurationService {
    
    private _spinnerNotifier = new Subject<any>();
    private _spinnerObservable$ = this._spinnerNotifier.asObservable();

    getObservable(): Observable<any> {
        return this._spinnerObservable$;
    }

    showSpinner() {
        if (this._spinnerNotifier) {
            this._spinnerNotifier.next({type: SPINNER.INIT});
        }
    }

    showNoData() {
        if (this._spinnerNotifier) {
            this._spinnerNotifier.next({type: SPINNER.NODATA});
        }
    }

    hideSpinner() {
        if (this._spinnerNotifier) {
            this._spinnerNotifier.next({type: SPINNER.NONE});
        }
    }

    showError() {
        if (this._spinnerNotifier) {
            this._spinnerNotifier.next({type: SPINNER.ERROR});
        }
    }
}