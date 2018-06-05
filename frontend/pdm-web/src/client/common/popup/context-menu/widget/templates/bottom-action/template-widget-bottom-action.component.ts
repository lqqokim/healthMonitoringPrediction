import {
	Component, OnDestroy, OnInit, ChangeDetectorRef
} from '@angular/core';
import { ContextMenuWidgetApi } from '../../context-menu-widget.api';
import { ContextMenuModel } from '../../../../../app-state/context-menu/context-menu.type';

@Component({
    moduleId: module.id,
    selector: 'template-widget-unselect',
    templateUrl: 'template-widget-bottom-action.html'
})

export class TemplateWidgetBottomActionComponent extends ContextMenuWidgetApi implements OnInit, OnDestroy {

    buttons: any;
	buttonLabel: string;

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
		// this._setButtonLabel();
		this._setButtons();
		this.manualDetectChanges();
	}

    parseContent(data: any): any {
        if (data) {
            if (data.invisibleName) return `${data.value}`;
            else return `${data.name} : ${data.value}`;
        }
        return '';
    }

	btnClick(data: any) {
		this.requester.internalAction(data);
	}

	_setButtons() {
        let actions = Array.isArray(this.config.template.action)
            ? this.config.template.action
            : [this.config.template.action];
        this.buttons = actions.map((d: any) => {
            d.label = this.translate(d.labelI18n);
            return d;
        });
    }

	// _setButtonLabel() {
	// 	let key = this.config.template.action.labelI18n;
	// 	this.buttonLabel = this.translate(key);
	// }
 }
