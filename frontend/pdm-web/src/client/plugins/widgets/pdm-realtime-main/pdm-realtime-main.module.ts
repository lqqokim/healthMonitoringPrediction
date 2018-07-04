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

import { PdmRealTimeMainComponent } from './pdm-realtime-main.component';
import { RealtimeMainParamTrendComponent } from './components/realtime-main-param-trend.component';

import { RealtimeMainChartComponent } from './components/realtime-main-chart.component';

import { AngularSplitModule } from 'angular-split';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule,
        AngularSplitModule
    ],
    declarations: [
        PdmRealTimeMainComponent,
        RealtimeMainParamTrendComponent,
        RealtimeMainChartComponent
    ],
    exports: [
        PdmRealTimeMainComponent
    ]
})
export class PdmRealTimeMainModule {
    static config(): any {
        return {
            component: PdmRealTimeMainComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRealTimeTrendChartConfig,
            viewConfig: ViewConfig
        };
    }
}
