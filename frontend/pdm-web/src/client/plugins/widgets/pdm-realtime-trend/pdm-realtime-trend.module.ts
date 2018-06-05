// Angular Imports
import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmRealTimeTrendChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

import { PdmRealTimeTrendComponent } from './pdm-realtime-trend.component';
import { AlarmWarningBadComponent } from './components/alarm-warning-bad.component';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule
    ],
    declarations: [
        PdmRealTimeTrendComponent,
        AlarmWarningBadComponent,
    ],
    exports: [
        PdmRealTimeTrendComponent
    ]
})
export class PdmRealTimeTrendModule {
    static config(): any {
        return {
            component: PdmRealTimeTrendComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRealTimeTrendChartConfig,
            viewConfig: ViewConfig
        };
    }
}
