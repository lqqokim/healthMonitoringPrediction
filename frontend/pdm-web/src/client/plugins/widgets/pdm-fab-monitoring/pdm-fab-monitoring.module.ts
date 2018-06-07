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

import { PdmFabMonitoringComponent } from './pdm-fab-monitoring.component';

import { FabMonitoringModule } from '../../configurations/global/pdm/fabmonitoring/fabmonitoring.module';

// import { FabEditorComponent } from '../../configurations/global/pdm/fabmonitoring/component/fab-editor/fab-editor.component';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        FabMonitoringModule
    ],
    declarations: [
        PdmFabMonitoringComponent,
        // FabEditorComponent
    ],
    exports: [
        PdmFabMonitoringComponent
    ]
})
export class PdmFabMonitoringModule {
    static config(): any {
        return {
            component: PdmFabMonitoringComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmRadarChartConfig,
            viewConfig: ViewConfig
        };
    }
}
