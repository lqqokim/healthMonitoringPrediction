import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../component/component.module';
import { ToolGroupListComponent } from './partial/tool-group-list.component';
import { ToolGroupAppConfigComponent } from './tool-group-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ToolsComponentModule

    ],
    declarations: [
        ToolGroupAppConfigComponent,
        ToolGroupListComponent
    ]
})
export class ToolGroupAppConfigModule {

    static config(): any {
        return {
            component: ToolGroupAppConfigComponent
        };
    }
}
