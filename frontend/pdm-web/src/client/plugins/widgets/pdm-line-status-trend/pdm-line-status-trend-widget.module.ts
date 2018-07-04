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

import { PdmLineStatusTrendWidgetComponent } from './pdm-line-status-trend-widget.component';
import { LineStatusTrendComponent } from './components/line-status-trend.component';


@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule
    ],
    declarations: [
        PdmLineStatusTrendWidgetComponent,
        LineStatusTrendComponent
    ],
    exports: [
        PdmLineStatusTrendWidgetComponent
    ]
})
export class PdmLineStatusTrendWidgetModule {
    static config(): any {
        return {
            component: PdmLineStatusTrendWidgetComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
