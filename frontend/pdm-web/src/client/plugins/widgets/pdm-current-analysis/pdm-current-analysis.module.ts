import { NgModule, ApplicationRef } from '@angular/core';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { PdmCurrentAnalysisProperties } from './config/pdm-current-analysis.properties';
import { PdmCurrentAnalysisInCondition } from './conditions/pdm-current-analysis.in-condition';
import { PdmCurrentAnalysisOutCondition } from './conditions/pdm-current-analysis.out-condition';
import { PdmCurrentAnalysisComponent } from './pdm-current-analysis.component';
import { BestPatternChartComponent } from './partial/best-pattern-chart.component';
import { OutlierPatternChartComponent } from './partial/outlier-pattern-chart.component';

import { PdmCurrentAnalysisChartConfig } from './config/pdm-current-analysis.chart.config';
import { PdmCurrentAnalysisViewConfig } from "./config/pdm-current-analysis.view.config";

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        PdmCurrentAnalysisComponent,
        BestPatternChartComponent,
        OutlierPatternChartComponent
    ]
})
export class PdmCurrentAnalysisModule {

    static config(): any {
        return {
            component: PdmCurrentAnalysisComponent,
            properties: PdmCurrentAnalysisProperties,
            inCondition: PdmCurrentAnalysisInCondition,
            outCondition: PdmCurrentAnalysisOutCondition,
            chartConfigs: [PdmCurrentAnalysisChartConfig],
            viewConfig: PdmCurrentAnalysisViewConfig
        };
    }
}
