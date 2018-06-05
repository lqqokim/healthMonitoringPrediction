import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../common/common.module';
import { BISTEL_SDKModule } from '../../sdk/sdk.module';

import { ModelingTreeComponent } from '../common/modeling-tree/modeling-tree.component';
import { TreeComponent } from '../common/modeling-tree/tree/tree.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
        
    ],
    declarations: [
        ModelingTreeComponent,
        TreeComponent,
        
    ],
    exports: [
        ModelingTreeComponent,
        TreeComponent
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
