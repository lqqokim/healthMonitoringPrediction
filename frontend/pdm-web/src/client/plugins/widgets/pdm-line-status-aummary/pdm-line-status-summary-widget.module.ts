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

import { PdmLineStatusSummaryWidgetComponent } from './pdm-line-status-summary-widget.component';
import { LineStatusSummaryComponent } from './components/line-status-summary.component';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule
    ],
    declarations: [
        PdmLineStatusSummaryWidgetComponent,
        LineStatusSummaryComponent
    ],
    exports: [
        PdmLineStatusSummaryWidgetComponent
    ]
})
export class PdmLineStatusSummaryWidgetModule {
    static config(): any {
        return {
            component: PdmLineStatusSummaryWidgetComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
