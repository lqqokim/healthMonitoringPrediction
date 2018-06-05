import { NgModule, ApplicationRef } from '@angular/core';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { Properties } from './config/properties';
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { ChartConfig } from './config/chart.config';
import { ViewConfig } from "./config/view.config";

import { PdmTestComponent } from './pdm-test.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        PdmTestComponent
    ]
})
export class PdmTestModule {
    static config(): any {
        return {
            component: PdmTestComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfigs: [ChartConfig],
            viewConfig: ViewConfig
        };
    }
}
