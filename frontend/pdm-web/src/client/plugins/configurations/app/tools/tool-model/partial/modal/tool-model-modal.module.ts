import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../../../component/component.module';

import { ToolModelModalComponent } from './tool-model-modal.component';
import { ToolModelModifyModule } from '../modify/modify-component.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ToolsComponentModule,
        ToolModelModifyModule
    ],
    declarations: [
        ToolModelModalComponent,
    ],
    entryComponents: [
        ToolModelModalComponent
    ]
})
export class ToolModelModalModule {

    static config(): any {
        return {
            component: ToolModelModalComponent
        };
    }
}
