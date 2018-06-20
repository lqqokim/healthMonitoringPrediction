import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { PluginCommonModule } from '../../../../common/plugins.common.module';

import { ModelSimulatorComponent } from './model-simulator.component';
import { ModelingChartComponent} from './component/modeling-chart/modeling-chart.component';
import { ModelingSimulatorChartComponent } from './component/modeling-simulator-chart/modeling-simulator-chart.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        PluginCommonModule
    ],
    declarations: [
        ModelSimulatorComponent,
        ModelingChartComponent,
        ModelingSimulatorChartComponent
    ],
    entryComponents: [
        ModelSimulatorComponent
    ],
})
export class ModelSimulatorModule {

    static config(): any {
        return {
            component: ModelSimulatorComponent
        };
    }
}
