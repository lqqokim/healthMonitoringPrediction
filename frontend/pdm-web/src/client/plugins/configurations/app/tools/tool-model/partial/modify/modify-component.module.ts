import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ToolModelModifyComponent } from './model/tool-model-modify.component';
import { ToolModelVersionModifyComponent } from './model-ver/tool-model-ver-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        ToolModelModifyComponent,
        ToolModelVersionModifyComponent
    ],
    exports: [
        ToolModelModifyComponent,
        ToolModelVersionModifyComponent
    ]
})
export class ToolModelModifyModule {

}
