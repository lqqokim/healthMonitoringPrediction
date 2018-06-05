import { TemplateWidgetCommonComponent } from './widget/templates/common/template-widget-common.component';
import { TemplateWidgetBottomActionComponent } from './widget/templates/bottom-action/template-widget-bottom-action.component';
import { TemplateWidgetIndentBottomActionComponent } from './widget/templates/indent-bottom-action/template-widget-indent-bottom-action.component';
import { TemplateWidgetIndentComponent } from './widget/templates/indent/template-widget-indent.component';
import { ContextMenuAcubedMapComponent } from './acubed-map/context-menu-acubed-map.component';
import { ContextMenuPdmComponent } from './pdm/context-menu-pdm';

export class ContextMenuTemplateInfo {
	static WIDGET_COMMON = 'template-widget-common';
	static WIDGET_INDENT = 'template-widget-indent';
	static WIDGET_BOTTOM_ACTION = 'template-widget-bottom-action';
	static ACUBED_MAP = 'context-menu-acubd-map';
	static WIDGET_INDENT_BOTTOM_ACTION = 'template-widget-indent-bottom-action';
	static PDM = 'context-menu-pdm';


	static getTemplate = (templateName: string): any => {
		switch (templateName) {
			case ContextMenuTemplateInfo.WIDGET_COMMON: return TemplateWidgetCommonComponent;
			case ContextMenuTemplateInfo.WIDGET_INDENT: return TemplateWidgetIndentComponent;
			case ContextMenuTemplateInfo.WIDGET_INDENT_BOTTOM_ACTION: return TemplateWidgetIndentBottomActionComponent;
			case ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION: return TemplateWidgetBottomActionComponent;
			case ContextMenuTemplateInfo.ACUBED_MAP: return ContextMenuAcubedMapComponent;
			case ContextMenuTemplateInfo.PDM: return ContextMenuPdmComponent;
			default: return TemplateWidgetCommonComponent;
		}
	}

	static isViewDataTemplate(templateName: string): boolean {
        switch (templateName) {
            case ContextMenuTemplateInfo.WIDGET_INDENT: return false;
			case ContextMenuTemplateInfo.WIDGET_INDENT_BOTTOM_ACTION: return false;
            default: return true;
        }
    }
}
