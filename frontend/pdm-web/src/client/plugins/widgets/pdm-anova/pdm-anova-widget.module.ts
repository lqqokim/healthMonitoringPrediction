// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { AnovaInCondition } from './conditions/in-condition';
import { AnovaOutCondition } from './conditions/out-condition';
import { AnovaProperties } from './config/properties';
import { PdmAnovaChartConfig } from './config/chart.config';
import { AnovaViewConfig } from './config/view.config';

import { PluginCommonModule } from '../../common/plugins.common.module';

import { PdmAnovaWidgetComponent } from './pdm-anova-widget.component';
import { AnovaComponent } from './components/anova.component';


@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule
    ],
    declarations: [
        PdmAnovaWidgetComponent,
        AnovaComponent,
    ],
    exports: [
        PdmAnovaWidgetComponent
    ],
    // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PdmAnovaWidgetModule {
    static config(): any {
        return {
            component: PdmAnovaWidgetComponent,
            properties: AnovaProperties,
            inCondition: AnovaInCondition,
            outCondition: AnovaOutCondition,
            chartConfig: PdmAnovaChartConfig,
            viewConfig: AnovaViewConfig
        };
    }
}
