// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmRadarChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

import { PdmAlarmCountSummaryWidgetComponent } from './pdm-alarm-count-summary-widget.component';
import { AlarmCountSummaryComponent } from './components/alarm-count-summary.component';
import { PluginCommonModule } from '../../common/plugins.common.module';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule
    ],
    declarations: [
        PdmAlarmCountSummaryWidgetComponent,
        AlarmCountSummaryComponent,
    ],
    exports: [
        PdmAlarmCountSummaryWidgetComponent
    ],
    // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PdmAlarmCountSummaryWidgetModule {
    static config(): any {
        return {
            component: PdmAlarmCountSummaryWidgetComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
