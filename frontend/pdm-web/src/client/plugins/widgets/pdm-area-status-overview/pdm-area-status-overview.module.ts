// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmAreaStatusOverviewComponent } from './pdm-area-status-overview.component';
import { PdmAreaStatusOverviewChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        PdmAreaStatusOverviewComponent
    ],
    exports: [
        PdmAreaStatusOverviewComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PdmAreaStatusOverviewModule {
    static config(): any {
        return {
            component: PdmAreaStatusOverviewComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmAreaStatusOverviewChartConfig,
            viewConfig: ViewConfig
        };
    }
}
