// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { CorrelationInCondition } from './conditions/in-condition';
import { CorrelationOutCondition } from './conditions/out-condition';
import { CorrelationProperties } from './config/properties';
import { CorrelationChartConfig } from './config/chart.config';
import { CorrelationViewConfig } from './config/view.config';

import { PluginCommonModule } from '../../common/plugins.common.module';

import { PdmCorrelationWidgetComponent } from './pdm-correlation-widget.component';
import { CorrelationComponent } from './components/correlation.component';

//Chart Libraries
import { PlotlyModule } from 'angular-plotly.js';
import { AngularSplitModule } from 'angular-split';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule,
        PlotlyModule,
        AngularSplitModule
    ],
    declarations: [
        PdmCorrelationWidgetComponent,
        CorrelationComponent,
    ],
    exports: [
        PdmCorrelationWidgetComponent
    ],
    // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PdmCorrelationWidgetModule {
    static config(): any {
        return {
            component: PdmCorrelationWidgetComponent,
            properties: CorrelationProperties,
            inCondition: CorrelationInCondition,
            outCondition: CorrelationOutCondition,
            chartConfig: CorrelationChartConfig,
            viewConfig: CorrelationViewConfig
        };
    }
}
