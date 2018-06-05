import {
	Component, OnDestroy, OnInit, ElementRef, ViewChild, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef
} from "@angular/core";
import { ContextMenuModel } from "../../../app-state/context-menu/context-menu.type";
import { ContextMenuAction } from "../../../app-state/context-menu/context-menu.action";
import { ContextMenuRequester } from "../context-menu-requester";
import { InjectorUtil } from '../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'div.context-menu-widget',
    templateUrl: 'context-menu-widget.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContextMenuWidgetComponent implements OnInit, OnDestroy {

	@ViewChild('content', {read: ViewContainerRef}) contentView: ViewContainerRef;

	config: ContextMenuModel;
	requester: ContextMenuRequester;

	constructor(
		private element: ElementRef,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {

	}

	ngOnDestroy() {
		// console.log('ContextMenuWidgetComponent :: ngOnDestroy');
	}

	setConfig(value: ContextMenuModel) {
		this.config = value;
		this.requester = value.requester;
		// TODO : 강제로 changeDetected 실행, 로직 검토 필요
		this._manualDetectChanges();
	}

	getEl(): any{
		return this.element.nativeElement;
	}

	commentBtnClick() {
		if (!this.config.contextMenuAction.disableCommnet) {
			this.requester.addComment();
		}
	}

	showAppListBtnClick() {
		if (!this.config.contextMenuAction.disableAppList) {
			let appListType: string = this.config.contextMenuOption ? this.config.contextMenuOption.appListType : null;
			this.requester.showAppList(appListType);
		}
	}

    showDetailViewBtnClick() {
        if (!this.config.contextMenuAction.disableDetailView) {
            this.requester.showDetailView();
        }
    }

	syncBtnClick() {
		if (!this.config.contextMenuAction.disableSync) {
			this.requester.syncCondition();
		}
	}

	tooltipMouseleave() {
		if (this.config.tooltip.eventType !== A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK) {
			if (this.config.requester) this.config.requester.destroyContext();
		}
	}

	private _manualDetectChanges() {
		this.changeDetectorRef.detectChanges();
	}
 }
