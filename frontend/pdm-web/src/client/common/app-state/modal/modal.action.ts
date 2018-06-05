import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state.type';
import { ModalModel } from './modal.type';

@Injectable()
export class ModalAction {

    constructor(private store: Store<AppState>) {}

    showConfirm(cm: ModalModel) {
        const action = {
            type: ActionType.SHOW_CONFIRM_MODAL,
            payload: {
                info: cm.info,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }

    showConfirmDelete(cm: ModalModel) {
        const action = {
            type: ActionType.SHOW_CONFIRM_DELETE_MODAL,
            payload: {
                info: cm.info,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }

    showAlert(cm: ModalModel) {
        const action = {
            type: ActionType.SHOW_ALERT_MODAL,
            payload: {
                info: cm.info,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }

    showShare(cm: ModalModel) {
        const action = {
            type: ActionType.SHOW_SHARE_MODAL,
            payload: {
                info: cm.info,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }

    showEditWorkspace(cm: ModalModel) {
        const action = {
            type: ActionType.SHOW_WORKSPACE_EDIT_MODAL,
            payload: {
                info: cm.info,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }

    showConfiguration(cm: ModalModel) {
        const action = {
            type: ActionType.SHOW_CONFIGURATION_EDIT_MODAL,
            payload: {
                module: cm.module,
                info: cm.info,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }

    showApplyModal(cm: ModalModel) {
        const action = {
            type: ActionType.SHOW_APPLY_MODULE_MODAL,
            payload: {
                module: cm.module,
                info: cm.info,
                requester: cm.requester
            }
        };
        this.store.dispatch(action);
    }
}
