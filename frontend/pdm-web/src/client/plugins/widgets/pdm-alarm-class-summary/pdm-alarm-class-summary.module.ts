// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { PdmAlarmClassSummaryComponent } from './pdm-alarm-class-summary.component';
import { PluginCommonModule } from '../../common/plugins.common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        PluginCommonModule
    ],
    declarations: [
        PdmAlarmClassSummaryComponent
    ],
    exports: [
        PdmAlarmClassSummaryComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class PdmAlarmClassSummaryModule {
    static config(): any {
        return {
            component: PdmAlarmClassSummaryComponent
        };
    }
}