import {
	Component, OnDestroy, OnInit, ElementRef, ViewChild, ViewContainerRef
} from "@angular/core";
import { ContextMenuModel } from "../../../app-state/context-menu/context-menu.type";
import { ContextMenuRequester } from "../context-menu-requester";

@Component({
    moduleId: module.id,
    selector: 'context-menu-pdm',
    templateUrl: 'context-menu-pdm.html'
})
export class ContextMenuPdmComponent implements OnInit, OnDestroy {

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
        this.requester.deleteWorkspace({});
    }
 }
