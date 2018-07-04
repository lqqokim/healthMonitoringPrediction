// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmRadarChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

// This Module's Components
import { PdmWostEqpListComponent } from './pdm-worst-eqp-list.component';
import { StatusChangeComponent } from '../../common/status-chart-canvas/status-change.component';
import { TreeModule } from 'ng2-tree';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        TreeModule
    ],
    declarations: [
        PdmWostEqpListComponent,
        StatusChangeComponent
    ],
    exports: [
        PdmWostEqpListComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PdmWostEqpListModule {
    static config(): any {
        return {
            component: PdmWostEqpListComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
