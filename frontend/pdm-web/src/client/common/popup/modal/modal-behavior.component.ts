import {
	Component, OnInit, ViewContainerRef, ViewChild
} from '@angular/core';

import { StateManager } from '../../app-state/state-manager.service';
import { ModalModel } from '../../app-state/modal/modal.type';

import { ModalBehaviorService } from './modal-behavior.service';

@Component({
	moduleId: module.id,
	selector: 'div.a3-modal-behavior',
	template: '<div #children></div>'
})
export class ModalBehaviorComponent implements OnInit {

	@ViewChild('children', { read: ViewContainerRef }) container: ViewContainerRef;
	private _subscription: any;

	constructor(
		private stateManager: StateManager,
		private service: ModalBehaviorService
	) { }

	ngOnInit() {
		this._setState();
	}

	_setState() {
		const modal$ = this.stateManager.rxModal();
		this._subscription = modal$.subscribe((action: ModalModel) => {
			if (!action || !action.actionType || !action.requester) {
				// console.warn('--modal action type wrong');
				return;
			}

			// set type in modal-requester
			action.requester.setAction(action);

			if (action.actionType === ActionType.SHOW_CONFIRM_MODAL) {
				this.service.confirm(action, this.container);
			}
			else if (action.actionType === ActionType.SHOW_CONFIRM_DELETE_MODAL) {
				this.service.confirmDelete(action, this.container);
			}
			else if (action.actionType === ActionType.SHOW_ALERT_MODAL) {
				this.service.alert(action, this.container);
			}
			else if (action.actionType === ActionType.SHOW_SHARE_MODAL) {
				this.service.share(action, this.container);
			}
			else if (action.actionType === ActionType.SHOW_WORKSPACE_EDIT_MODAL) {
				this.service.edit(action, this.container);
			}
			else if (action.actionType === ActionType.SHOW_CONFIGURATION_EDIT_MODAL) {
				// module 정보가 있어야 한다.
				this.service.configuration(action, this.container);
			}
			else if (action.actionType === ActionType.SHOW_APPLY_MODULE_MODAL) {
				// module 정보가 있어야 한다.
				this.service.applyModule(action, this.container);
			}
		});
	}

	ngOnDestroy() {
		if (this._subscription) {
			this._subscription.unsubscribe();
		}
	}
}
