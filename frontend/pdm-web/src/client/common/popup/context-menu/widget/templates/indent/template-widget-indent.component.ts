import {
	Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ChangeDetectorRef
} from "@angular/core";
import { ContextMenuWidgetApi } from "../../context-menu-widget.api";
import { ContextMenuModel } from "../../../../../app-state/context-menu/context-menu.type";

@Component({
    moduleId: module.id,
    selector: 'template-widget-indent',
    templateUrl: 'template-widget-indent.html'
})

export class TemplateWidgetIndentComponent extends ContextMenuWidgetApi implements OnInit, OnDestroy {

	// constructor() { super() }
	constructor(changeDetectorRef: ChangeDetectorRef) { 
		super(changeDetectorRef);
	}

	ngOnInit() {

	}

	ngOnDestroy() {

	}
 }
