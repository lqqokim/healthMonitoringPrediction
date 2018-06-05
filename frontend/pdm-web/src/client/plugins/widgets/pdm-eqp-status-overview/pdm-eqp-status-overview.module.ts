// Angular Imports
import { NgModule } from '@angular/core';

import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmEqpStatusOverviewComponent } from './pdm-eqp-status-overview.component';
import { PdmEqpStatusOverviewChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

@NgModule({
    imports: [
        BISTEL_SDKModule
    ],
    declarations: [
        PdmEqpStatusOverviewComponent
    ],
    exports: [
        PdmEqpStatusOverviewComponent
    ]
})
export class PdmEqpStatusOverviewModule {
    static config(): any {
        return {
            component: PdmEqpStatusOverviewComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmEqpStatusOverviewChartConfig,
            viewConfig: ViewConfig
        };
    }
}
