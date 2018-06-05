import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ToolsComponentModule } from '../../../component/component.module';

import { InlineGroupModalComponent } from './inline-group-modal.component';
import { InlineGroupModifyComponent } from '../inline-group-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        ToolsComponentModule
    ],
    declarations: [
        InlineGroupModalComponent,
        InlineGroupModifyComponent
    ],
    entryComponents: [
        InlineGroupModalComponent
    ]
})
export class InlineGroupModalModule {

    static config(): any {
        return {
            component: InlineGroupModalComponent
        };
    }
}
