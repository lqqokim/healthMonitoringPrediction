import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SidebarService {
    
    private _sidebarNotifier = new Subject<any>();
    private _sidebarObservable$ = this._sidebarNotifier.asObservable();

    getObservable(): Observable<any> {
        return this._sidebarObservable$;
    }

    showSpinner() {
        if (this._sidebarNotifier) {
            this._sidebarNotifier.next({type: SPINNER.INIT});
        }
    }

    showNoData() {
        if (this._sidebarNotifier) {
            this._sidebarNotifier.next({type: SPINNER.NODATA});
        }
    }

    hideSpinner() {
        if (this._sidebarNotifier) {
            this._sidebarNotifier.next({type: SPINNER.NONE});
        }
    }

    showError() {
        if (this._sidebarNotifier) {
            this._sidebarNotifier.next({type: SPINNER.ERROR});
        }
    }

    showNotificationDetail(notification: any) {
        if (this._sidebarNotifier) {
            this._sidebarNotifier.next({type: 'SHOW_NOTIFICATION_DETAIL', data: notification});
        }
    }

    hideNotificationDetail() {
        if (this._sidebarNotifier) {
            this._sidebarNotifier.next({type: 'HIDE_NOTIFICATION_DETAIL'});
        }
    }

    setOverflowHidden(isHidden: boolean) {
        if (isHidden) {
            this._sidebarNotifier.next({type: 'OVERFLOW_HIDDEN'});
        } else {
            this._sidebarNotifier.next({type: 'OVERFLOW_AUTO'});
        }
    }
}