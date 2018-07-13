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

import { PdmGaugeWidgetComponent } from './pdm-gauge-widget.component';
import { AlarmWarningVariationComponent } from './components/alarm-warning-variation.component';
import { TrendChartComponent } from './components/trend-chart/trend-chart.component';
import { GaugeChartGenerateComponent } from './components/gauge-chart/gauge-chart-generate.component';
import { PluginCommonModule } from '../../common/plugins.common.module';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule
    ],
    declarations: [
        PdmGaugeWidgetComponent,
        AlarmWarningVariationComponent,
        TrendChartComponent,
        GaugeChartGenerateComponent,
        // D3GaugeChartComponent
    ],
    exports: [
        PdmGaugeWidgetComponent
    ]
})
export class PdmGaugeWidgetModule {
    static config(): any {
        return {
            component: PdmGaugeWidgetComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
