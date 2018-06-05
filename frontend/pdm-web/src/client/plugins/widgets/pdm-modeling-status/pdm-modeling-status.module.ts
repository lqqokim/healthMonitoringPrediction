// Angular Imports
import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmModelingStatusComponent } from './pdm-modeling-status.component';
import { PdmModelingStatusChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';


@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule
    ],
    declarations: [
        PdmModelingStatusComponent
    ],
    exports: [
        PdmModelingStatusComponent
    ]
})
export class PdmModelingStatusModule {
    static config(): any {
        return {
            component: PdmModelingStatusComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmModelingStatusChartConfig,
            viewConfig: ViewConfig
        };
    }
}
