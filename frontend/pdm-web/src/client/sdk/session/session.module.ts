import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { SessionStore } from './session-store.service';

@NgModule({
    exports: []
})
export class SessionModule {
    static forProviders(): any[] {
        return [
            CookieService,
            SessionStore
        ];
    }
}