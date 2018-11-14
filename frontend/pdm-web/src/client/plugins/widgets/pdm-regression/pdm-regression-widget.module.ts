// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { RegressionInCondition } from './conditions/in-condition';
import { RegressionOutCondition } from './conditions/out-condition';
import { RegressionProperties } from './config/properties';
import { RegressionChartConfig } from './config/chart.config';
import { RegressionViewConfig } from './config/view.config';

import { PluginCommonModule } from '../../common/plugins.common.module';

import { PdmRegressionWidgetComponent } from './pdm-regression-widget.component';
import { RegressionComponent } from './components/regression.component';
import { ParamTrendComponent } from './components/param-trend/param-trend.component';


@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule
    ],
    declarations: [
        PdmRegressionWidgetComponent,
        RegressionComponent,
        ParamTrendComponent
    ],
    exports: [
        PdmRegressionWidgetComponent
    ],
    // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PdmRegressionWidgetModule {
    static config(): any {
        return {
            component: PdmRegressionWidgetComponent,
            properties: RegressionProperties,
            inCondition: RegressionInCondition,
            outCondition: RegressionOutCondition,
            chartConfig: RegressionChartConfig,
            viewConfig: RegressionViewConfig
        };
    }
}
