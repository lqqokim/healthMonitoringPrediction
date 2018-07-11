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
import { ModalPopComponent } from './components/modal-pop.component';
import { PluginCommonModule } from '../../common/plugins.common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        PluginCommonModule
    ],
    declarations: [
        PdmEqpHealthIndex,
        ModalPopComponent
    ],
    exports: [
        PdmEqpHealthIndex,
        ModalPopComponent
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
