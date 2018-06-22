import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../common/common.module';
import { BISTEL_SDKModule } from '../../sdk/sdk.module';

import { ModelingTreeComponent } from '../common/modeling-tree/modeling-tree.component';
import { TreeComponent } from '../common/modeling-tree/tree/tree.component';

import { FabAreaEqpParamTreeComponent } from '../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';
import { CheckTreeComponent } from '../common/fab-area-eqp-param-tree/check-tree/check-tree.component';

import { StatusChartComponent }  from '../common/status-chart/status-chart.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
        
    ],
    declarations: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent,
        StatusChartComponent

    ],
    exports: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent,
        StatusChartComponent
    ]
    // ,
    // entryComponents: [
    //     ModelingTreeComponent
    // ]
})
export class PluginCommonModule {

    // static config(): any {
    //     return {
    //         component: ModelingTreeComponent
    //     };
    // }
}
