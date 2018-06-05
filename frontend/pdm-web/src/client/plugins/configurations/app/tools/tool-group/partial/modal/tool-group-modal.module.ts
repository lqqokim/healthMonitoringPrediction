import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ToolsComponentModule } from '../../../component/component.module';

import { ToolGroupModalComponent } from './tool-group-modal.component';
import { ToolGroupModifyComponent } from '../tool-group-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        ToolsComponentModule
    ],
    declarations: [
        ToolGroupModalComponent,
        ToolGroupModifyComponent
    ],
    entryComponents: [
        ToolGroupModalComponent
    ]
})
export class ToolGroupModalModule {

    static config(): any {
        return {
            component: ToolGroupModalComponent
        };
    }
}
