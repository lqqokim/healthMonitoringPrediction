// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
// import { PdmRadarChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

// This Module's Components
import { PdmEqpHealthIndex } from './pdm-eqp-health-index.component';
import { ModalPopComponent } from './components/modal-popup/modal-pop.component';
import { PluginCommonModule } from '../../common/plugins.common.module';
import { LogicChartComponent } from './components/logic-chart/logic-chart.component';
import { TrendChartComponent } from './components/trend-chart/trend-chart.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        PluginCommonModule
    ],
    declarations: [
        PdmEqpHealthIndex,
        ModalPopComponent,
        LogicChartComponent,
        TrendChartComponent
    ],
    exports: [
        PdmEqpHealthIndex,
        ModalPopComponent,
        LogicChartComponent,
        TrendChartComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class PdmEqpHealthIndexModule {
    static config(): any {
        return {
            component: PdmEqpHealthIndex,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            viewConfig: ViewConfig
        };
    }
}
