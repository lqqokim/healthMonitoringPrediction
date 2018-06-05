import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class SessionStore {

    LOGIN_KEY: string = 'acubed_login';
    TOKEN_KEY: string = 'acubed_key';

    constructor(private _cookieService: CookieService) {}

    set(key: any, value: any) {
        this._cookieService.putObject(key, value);
    }

    get(key: any): any {
        return this._cookieService.getObject(key);
    }

    remove(key: any) {
        this._cookieService.remove(key);
    }

    clearAll(key: any) {
        this._cookieService.remove(key);
    }

    /**
     * Biz Call
     */
    setSignin(value: any) {
        this.set(this.LOGIN_KEY, value);
    }

    isSignin() {
        if(this.get(this.LOGIN_KEY)) {
            return true;
        } else {
            return false;
        }
    }

    getSignInfo() {
        return this.get(this.LOGIN_KEY);
    }

    clearSignin() {
        this.remove(this.LOGIN_KEY);
    }

    setToken(token: any) {
        this.set(this.TOKEN_KEY, token);
    }

    getToken() {
        return this.get(this.TOKEN_KEY);
    }

    removeToken() {
        this.remove(this.TOKEN_KEY);
    }

    getTokenString() {
        let token = this.get(this.TOKEN_KEY);
        return token ? token.token_type + ' ' + token.access_token : '';
    }
}
