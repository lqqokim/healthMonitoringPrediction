// Angular Imports
import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmRadarChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

import { PdmBarWidgetComponent } from './pdm-bar-widget.component';
import { AlarmWarningVariationComponent } from './components/alarm-warning-variation.component';
import { RadarChartComponent } from './components/radar-chart/radar-chart.component';
import { TrendChartComponent } from './components/trend-chart/trend-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule
    ],
    declarations: [
        PdmBarWidgetComponent,
        AlarmWarningVariationComponent,
        RadarChartComponent,
        TrendChartComponent,
        BarChartComponent
    ],
    exports: [
        PdmBarWidgetComponent
    ]
})
export class PdmBarWidgetModule {
    static config(): any {
        return {
            component: PdmBarWidgetComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
