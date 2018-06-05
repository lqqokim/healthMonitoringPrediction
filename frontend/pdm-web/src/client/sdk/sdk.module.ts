import { NgModule, ModuleWithProviders } from '@angular/core';

import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import { BrowserModule } from '@angular/platform-browser';

import { ChartsModule } from './charts/charts/charts.module';
import { ChartConfigModule } from './charts/config/chart-config.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
import { FormatterModule } from './formatter/formatter.module';
import { PopupModule } from './popup/popup.module';
import { ModelModule } from './model/model.module';
import { SessionModule } from './session/session.module';
import { UtilsModule } from './utils/utils.module';
import { TranslaterModule } from "./i18n/translater.module";
import { BISTEL_FormsModule } from './forms/forms.module';
import { BISTEL_ComponentsModule } from './components/components.module';

// Wijmo modules
import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjChartModule } from 'wijmo/wijmo.angular2.chart';
import { WjChartAnalyticsModule } from 'wijmo/wijmo.angular2.chart.analytics';
import { WjChartAnimationModule } from 'wijmo/wijmo.angular2.chart.animation';
import { WjChartAnnotationModule } from 'wijmo/wijmo.angular2.chart.annotation';
import { WjChartFinanceAnalyticsModule } from 'wijmo/wijmo.angular2.chart.finance.analytics';
import { WjChartHierarchicalModule } from 'wijmo/wijmo.angular2.chart.hierarchical';
import { WjChartFinanceModule } from 'wijmo/wijmo.angular2.chart.finance';
import { WjChartInteractionModule } from 'wijmo/wijmo.angular2.chart.interaction';
import { WjChartRadarModule } from 'wijmo/wijmo.angular2.chart.radar';
import { WjGaugeModule } from 'wijmo/wijmo.angular2.gauge';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridGrouppanelModule } from 'wijmo/wijmo.angular2.grid.grouppanel';
import { WjGridMultirowModule } from 'wijmo/wijmo.angular2.grid.multirow';
import { WjGridSheetModule } from 'wijmo/wijmo.angular2.grid.sheet';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { WjOlapModule } from 'wijmo/wijmo.angular2.olap';

import { DndModule } from 'ng2-dnd';
import { ToastyModule } from 'ng2-toasty';
import { VisMapModule } from "./charts/vis-map/vis.module";

import { StompService } from './websocket/stomp.service';
import { CommonWebSocketService } from './websocket/common-websocket.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
		TranslaterModule,
        BISTEL_FormsModule,

        // Wijmo modules
        WjCoreModule,
        WjChartModule,
        WjChartAnalyticsModule,
        WjChartAnimationModule,
        WjChartAnnotationModule,
        WjChartFinanceAnalyticsModule,
        WjChartHierarchicalModule,
        WjChartFinanceModule,
        WjChartInteractionModule,
        WjChartRadarModule,
        WjGaugeModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule,
        WjGridGrouppanelModule,
        WjGridMultirowModule,
        WjGridSheetModule,
        WjInputModule,
        WjOlapModule,

        DndModule.forRoot(),
        ToastyModule.forRoot()
    ],
    declarations: [
    ],
    exports: [
        CommonModule,
        HttpModule,
        RouterModule,

		TranslaterModule,

        // VisMapModule,
        ChartsModule,
        DirectivesModule,
        PipesModule,
        FormatterModule,
        PopupModule,
        ModelModule,
        SessionModule,
        UtilsModule,
        ChartConfigModule,
        BISTEL_FormsModule,
        BISTEL_ComponentsModule,

        // Wijmo modules
        WjCoreModule,
        WjChartModule,
        WjChartAnalyticsModule,
        WjChartAnimationModule,
        WjChartAnnotationModule,
        WjChartFinanceAnalyticsModule,
        WjChartHierarchicalModule,
        WjChartFinanceModule,
        WjChartInteractionModule,
        WjChartRadarModule,
        WjGaugeModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule,
        WjGridGrouppanelModule,
        WjGridMultirowModule,
        WjGridSheetModule,
        WjInputModule,
        WjOlapModule,

        DndModule,
        ToastyModule
    ]
})
export class BISTEL_SDKModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BISTEL_SDKModule,
            providers: [
				...TranslaterModule.forProviders(),
                ...FormatterModule.forProviders(),
                ...ChartConfigModule.forProviders(),
                ...PopupModule.forProviders(),
                ...ModelModule.forProviders(),
                ...SessionModule.forProviders(),
                ...UtilsModule.forProviders(),
                ...BISTEL_FormsModule.forProviders(),
                StompService,
                CommonWebSocketService
            ]
        }
    }
}
