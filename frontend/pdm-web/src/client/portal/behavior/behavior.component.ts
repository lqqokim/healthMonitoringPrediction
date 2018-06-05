import {
	Component, OnInit, ViewContainerRef, ViewChild
} from '@angular/core';
import { StateManager, ContextMenuModel } from '../../common';
import { BehaviorService } from './behavior.service';

@Component({
	moduleId: module.id,
	selector: 'div.a3-behavior',
	template: '<div #children></div>'
})
export class BehaviorComponent implements OnInit {

	@ViewChild('children', {read: ViewContainerRef}) container: ViewContainerRef;

	subscription: any;

	constructor(
		private stateManager: StateManager,
		private service: BehaviorService
	) {}

	ngOnInit() {
		this._setState();
	}

	_setState() {
		const context$ = this.stateManager.rxContextMenu();
		this.subscription = context$.subscribe((action: ContextMenuModel) => {
			// TODO : modal action type 세분화 필요
			if (action.actionType === ActionType.SHOW_CONTEXT_MENU) {
                this.service.showContext(action, this.container);
            }
            else if (action.actionType === ActionType.CLOSE_CONTEXT_MENU) {
                this.service.closeContext(action);
            }
		});
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
