import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../component/component.module';

import { InlineGroupListComponent } from './partial/inline-group-list.component';
import { ToolInlineGroupAppConfigComponent } from './tool-inline-group-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ToolsComponentModule
    ],
    declarations: [
        ToolInlineGroupAppConfigComponent,
        InlineGroupListComponent
    ]
})
export class ToolInlineGroupAppConfigModule {

    static config(): any {
        return {
            component: ToolInlineGroupAppConfigComponent
        };
    }
}
