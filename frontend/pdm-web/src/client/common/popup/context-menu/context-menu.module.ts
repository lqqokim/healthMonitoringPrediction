import { NgModule } from '@angular/core';
import { TemplateWidgetCommonComponent } from "./widget/templates/common/template-widget-common.component";
import { CommonModule } from '@angular/common';
import { TemplateWidgetIndentComponent } from "./widget/templates/indent/template-widget-indent.component";
import { TemplateWidgetIndentBottomActionComponent } from "./widget/templates/indent-bottom-action/template-widget-indent-bottom-action.component";
import { TemplateWidgetBottomActionComponent } from "./widget/templates/bottom-action/template-widget-bottom-action.component";
import { ContextMenuWidgetComponent } from "./widget/context-menu-widget.component";
import { ContextMenuAcubedMapComponent } from "./acubed-map/context-menu-acubed-map.component";
import { ContextMenuPdmComponent } from './pdm/context-menu-pdm';
import { PipesModule } from '../../../sdk/pipes/pipes.module';

@NgModule({
	imports: [
		CommonModule,
        PipesModule
	],
	declarations: [
        ContextMenuWidgetComponent,
		ContextMenuAcubedMapComponent,
        ContextMenuPdmComponent,
		TemplateWidgetCommonComponent,
        TemplateWidgetIndentComponent,
		TemplateWidgetIndentBottomActionComponent,
        TemplateWidgetBottomActionComponent
	],
	exports: [
        ContextMenuWidgetComponent,
		ContextMenuAcubedMapComponent,
        ContextMenuPdmComponent,
		TemplateWidgetCommonComponent,
        TemplateWidgetIndentComponent,
		TemplateWidgetIndentBottomActionComponent,
        TemplateWidgetBottomActionComponent
	],
    entryComponents: [
        ContextMenuWidgetComponent,
		ContextMenuAcubedMapComponent,
        ContextMenuPdmComponent,
        TemplateWidgetCommonComponent,
        TemplateWidgetIndentComponent,
		TemplateWidgetIndentBottomActionComponent,
        TemplateWidgetBottomActionComponent
    ]
})
export class ContextMenuModule {
	static forProviders() {
		return [
		];
	}
}
