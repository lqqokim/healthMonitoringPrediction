import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../component/component.module';

import { ModuleGroupListComponent } from './partial/module-group-list.component';
import { ToolModuleGroupAppConfigComponent } from './tool-module-group-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ToolsComponentModule
    ],
    declarations: [
        ToolModuleGroupAppConfigComponent,
        ModuleGroupListComponent
    ]
})
export class ToolModuleGroupAppConfigModule {

    static config(): any {
        return {
            component: ToolModuleGroupAppConfigComponent
        };
    }
}
