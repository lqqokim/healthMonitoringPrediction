/**
 * When routing enter into path, let's check out authorization. If not valid, go login
 */
import { Injectable } from '@angular/core';
import { CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot } from '@angular/router';

import { SessionStore, Util } from '../../sdk';
import { SessionService } from '../../common';
import { RouterService } from '../router/router.service';

@Injectable()
export class SessionGuard implements CanActivate {

    constructor(
        private sessionService: SessionService, 
        private sessionStore: SessionStore,
        private router: RouterService
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // if (this._sessionManager.isValidSession()) { return true; }
        // this._routerManager.goLogin();
        // return false;
        console.log('>> SessionGuard check');
        this.sessionService.get()
            .subscribe((response: any) => {
                if (this.sessionStore && this.sessionStore.isSignin()) {
                    let linkLocation: string = Util.Data.getCookie('dfd_link_location');
                    if (linkLocation) {
                        this.router.goWidgetOnQueryString(linkLocation);
                    } else {
                        this.router.goHomeDashboard();
                    }
                } 
            }, (error: any) => {
                this.router.goLogin();
                // console.error('session check error', error);
            });

        return true;
    }
}