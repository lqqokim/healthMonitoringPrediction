import {
	Component, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit
} from "@angular/core";
import { ContextMenuWidgetApi } from "../../context-menu-widget.api";

@Component({
    moduleId: module.id,
    selector: 'template-widget-common',
    templateUrl: 'template-widget-common.html'
})
export class TemplateWidgetCommonComponent extends ContextMenuWidgetApi implements OnInit, AfterViewInit, OnDestroy {

	templateContent: any;

	constructor(changeDetectorRef: ChangeDetectorRef) {
		super(changeDetectorRef);
	}

	ngOnInit() {

	}

    ngAfterViewInit() {
        // console.log('TemplateWidgetCommonComponent :: ngAfterViewInit');
    }

	ngOnDestroy() {

	}

	parseContent(data: any): any {
	    if (data) {
	        if (data.invisibleName) return `${data.value}`;
	        else return `${data.name} : ${data.value}`;
        }
        return '';
    }
 }
