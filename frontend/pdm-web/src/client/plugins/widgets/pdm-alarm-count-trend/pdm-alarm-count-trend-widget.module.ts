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

import { PdmAlarmCountTrendWidgetComponent } from './pdm-alarm-count-trend-widget.component';
import { AlarmCountTrendComponent } from './components/alarm-count-trend.component';
import { PluginCommonModule } from '../../common/plugins.common.module';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule
    ],
    declarations: [
        PdmAlarmCountTrendWidgetComponent,
        AlarmCountTrendComponent
    ],
    exports: [
        PdmAlarmCountTrendWidgetComponent
    ]
})
export class PdmAlarmCountTrendWidgetModule {
    static config(): any {
        return {
            component: PdmAlarmCountTrendWidgetComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
