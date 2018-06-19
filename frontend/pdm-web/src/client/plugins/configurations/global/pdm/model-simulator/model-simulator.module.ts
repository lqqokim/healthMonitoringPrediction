import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { ModelSimulatorComponent } from './model-simulator.component';
import {  ModelingChartComponent} from './component/modeling-chart/modeling-chart.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        ModelSimulatorComponent,
        ModelingChartComponent
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
