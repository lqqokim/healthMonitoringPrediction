//Angular
import { NgModule } from '@angular/core';

//MIP Common Modules
import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';
import { PluginCommonModule } from '../../common/plugins.common.module';

//This Module's Widget Settings 
import { SpectrumDataAnalysisInCondition } from './conditions/in-condition';
import { SpectrumDataAnalysisOutCondition } from './conditions/out-condition';
import { SpectrumDataAnalysisProperties } from './config/properties';
import { SpectrumDataAnalysisViewConfig } from './config/view.config';
import { SpectrumDataAnalysisChartConfig } from './config/chart.config';

//Chart Libraries
import { PlotlyModule } from 'angular-plotly.js';

//This Module's Components
import { PdmSpectrumDataAnalysisWidgetComponent } from './pdm-spectrum-data-analysis-widget.component';
import { SpectrumDataAnalysisComponent } from './components/spectrum-data-analysis.component';

import { AngularSplitModule } from 'angular-split';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        PluginCommonModule,
        PlotlyModule,
        AngularSplitModule
    ],
    declarations: [
        PdmSpectrumDataAnalysisWidgetComponent,
        SpectrumDataAnalysisComponent
    ],
    exports: [
        PdmSpectrumDataAnalysisWidgetComponent
    ]
})
export class PdmSpectrumDataAnalysisWidgetModule {
    static config(): any {
        return {
            component: PdmSpectrumDataAnalysisWidgetComponent,
            properties: SpectrumDataAnalysisProperties,
            inCondition: SpectrumDataAnalysisInCondition,
            outCondition: SpectrumDataAnalysisOutCondition,
            chartConfig: SpectrumDataAnalysisChartConfig,
            viewConfig: SpectrumDataAnalysisViewConfig
        };
    }
}
