// Angular Imports
import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { PluginCommonModule} from '../../common/plugins.common.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmRealTimeTrendChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

import { PdmRealTimeParamTrendComponent } from './pdm-realtime-param-trend.component';
import { AlarmWarningBadComponent } from './components/realtimeparamtrend.component';

import { RealtimeChartComponent } from './components/realtimechart.component';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule
    ],
    declarations: [
        PdmRealTimeParamTrendComponent,
        AlarmWarningBadComponent,
        RealtimeChartComponent
    ],
    exports: [
        PdmRealTimeParamTrendComponent
    ]
})
export class PdmRealTimeParamTrendModule {
    static config(): any {
        return {
            component: PdmRealTimeParamTrendComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRealTimeTrendChartConfig,
            viewConfig: ViewConfig
        };
    }
}
