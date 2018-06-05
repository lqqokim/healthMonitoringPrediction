import { NgModule, ApplicationRef } from '@angular/core';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { #NAME#Properties } from './config/#FILE_NAME#.properties';
import { #NAME#InCondition } from './conditions/#FILE_NAME#.in-condition';
import { #NAME#OutCondition } from './conditions/#FILE_NAME#.out-condition';
import { #NAME#Component } from './#FILE_NAME#.component';

import { #NAME#ChartConfig } from './config/#FILE_NAME#.chart.config';
import { #NAME#ViewConfig } from "./config/#FILE_NAME#.view.config";

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [#NAME#Component]
})
export class #NAME#Module {

    static config(): any {
        return {
            component: #NAME#Component,
            properties: #NAME#Properties,
            inCondition: #NAME#InCondition,
            outCondition: #NAME#OutCondition,
            chartConfigs: [#NAME#ChartConfig],
            viewConfig: #NAME#ViewConfig
        };
    }
}
