import { NgModule } from '@angular/core';
import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk';
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmModelerChartConfig } from './config/chart.config';
import { PdmModelerComponent } from './pdm-modeler.component';
import { ViewConfig } from './config/view.config';
import { Ng2NoUiSliderComponent } from './partial/ng2-nouislider/ng2-nouislider.component';
import { ContourChartComponent } from './partial/chart/contour-chart/contour-chart.component';
import { MIChartComponent } from './partial/chart/mi-chart/component/mi-chart.component';
import { LegendComponent } from './partial/chart/mi-chart/component/legend/legend.component';
import { ChartComponent } from './partial/chart/mi-chart/component/chart/chart.component';
import { MiChartRootComponent } from './partial/chart/mi-chart/mi-chart-root.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        PdmModelerComponent,
        Ng2NoUiSliderComponent,
        ContourChartComponent,
        MiChartRootComponent,
        MIChartComponent,
        ChartComponent,
        LegendComponent
    ]
})
export class PdmModelerModule {

   static config(): any {
        return {
            component: PdmModelerComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfigs: [PdmModelerChartConfig],
            viewConfig: ViewConfig
            // add filter module
        };
    }
}
