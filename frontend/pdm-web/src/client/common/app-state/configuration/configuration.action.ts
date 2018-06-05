import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';

@Injectable()
export class ConfigurationAction {

    constructor(private store: Store<AppState>) { }

    openApp(applicationId: any, menuId: any) {
        const action = {
            type: ActionType.APPCONFIG,
            payload: {
                applicationId,
                menuId
            }
        };

        this.store.dispatch(action);
    }

    openGlobal(applicationId: any, menuId: any) {
        const action = {
            type: ActionType.GLOBALCONFIG,
            payload: {
                applicationId,
                menuId
            }
        };

        this.store.dispatch(action);
    }

    openUser(applicationId: any, menuId: any) {
        const action = {
            type: ActionType.USERCONFIG,
            payload: {
                applicationId,
                menuId
            }
        };

        this.store.dispatch(action);
    }
}
