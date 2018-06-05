import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ToolsComponentModule } from '../../../component/component.module';

import { InlineToolModalComponent } from './inline-tool-modal.component';
import { InlineToolModifyComponent } from '../inline-tool-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        ToolsComponentModule
    ],
    declarations: [
        InlineToolModalComponent,
        InlineToolModifyComponent
    ],
    entryComponents: [
        InlineToolModalComponent
    ]
})
export class InlineToolModalModule {

    static config(): any {
        return {
            component: InlineToolModalComponent
        };
    }
}
