// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { PdmAlarmHistoryComponent } from './pdm-alarm-history.component';
import { PluginCommonModule } from '../../common/plugins.common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        PluginCommonModule
    ],
    declarations: [
        PdmAlarmHistoryComponent
    ],
    exports: [
        PdmAlarmHistoryComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class PdmAlarmHistoryModule {
    static config(): any {
        return {
            component: PdmAlarmHistoryComponent
        };
    }
}
