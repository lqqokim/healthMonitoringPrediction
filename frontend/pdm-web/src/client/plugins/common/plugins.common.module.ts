import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../common/common.module';
import { BISTEL_SDKModule } from '../../sdk/sdk.module';

import { ModelingTreeComponent } from '../common/modeling-tree/modeling-tree.component';
import { TreeComponent } from '../common/modeling-tree/tree/tree.component';

import { FabAreaEqpParamTreeComponent } from '../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';
import { CheckTreeComponent } from '../common/fab-area-eqp-param-tree/check-tree/check-tree.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
        
    ],
    declarations: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent

    ],
    exports: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent
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
