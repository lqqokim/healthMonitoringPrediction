import {
	Component, OnDestroy, OnInit, ChangeDetectorRef
} from '@angular/core';
import { ContextMenuWidgetApi } from '../../context-menu-widget.api';
import { ContextMenuModel } from '../../../../../app-state/context-menu/context-menu.type';
import { InternalActionType } from '../../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'template-widget-indent-unselect',
    templateUrl: 'template-widget-indent-bottom-action.html'
})

export class TemplateWidgetIndentBottomActionComponent extends ContextMenuWidgetApi implements OnInit, OnDestroy {

	buttonLabel: string;

	// constructor() { super() }
	constructor(changeDetectorRef: ChangeDetectorRef) {
		super(changeDetectorRef);
	}

	// tslint:disable-next-line:no-empty
	ngOnInit() {

	}

	// tslint:disable-next-line:no-empty
	ngOnDestroy() {

	}

	// override method for ContextMenuApi
	setConfig(cm: ContextMenuModel) {
		super.setConfig(cm);
		this._setButtonLabel();
		this.manualDetectChanges();
	}

	btnClick(event: any) {
		this.requester.internalAction();
	}

	private _setButtonLabel() {
		let key = ( this.config.template.action as InternalActionType).labelI18n;
		this.buttonLabel = this.translate(key);
	}
 }
