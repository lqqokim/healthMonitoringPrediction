import {
	Component, OnDestroy, OnInit, ElementRef, ViewChild, ViewContainerRef
} from "@angular/core";
import { ContextMenuModel } from "../../../app-state/context-menu/context-menu.type";
import { ContextMenuRequester } from "../context-menu-requester";

@Component({
    moduleId: module.id,
    selector: 'context-menu-acubd-map',
    templateUrl: 'context-menu-acubed-map.html'
})

export class ContextMenuAcubedMapComponent implements OnInit, OnDestroy {

	config: ContextMenuModel;
	requester: ContextMenuRequester;
    selectedData: any;

	constructor(
		private element: ElementRef
	) {}

	ngOnInit() {

	}

	ngOnDestroy() {
		// console.log('ContextMenuWidgetComponent :: ngOnDestroy');
	}

	setConfig(cm: ContextMenuModel) {
		this.config = cm;
		this.requester = cm.requester;
        this.selectedData = cm.template.data;
	}

	getEl(): any{
		return this.element.nativeElement;
	}

    deleteWorkspace() {
        this.requester.deleteWorkspace(this.selectedData);
    }

    shareWorkspace() {
        this.requester.shareWorkspace(this.selectedData);
    }

    goTasker() {
        this.requester.goTasker(this.selectedData);
    }

    scheduleTasker() {
        this.requester.scheduleTasker(this.selectedData);
    }

    deleteTasker() {
        this.requester.deleteTasker(this.selectedData);
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

	syncBtnClick() {
		if (!this.config.contextMenuAction.disableSync) {
			this.requester.syncCondition();
		}
	}
 }
