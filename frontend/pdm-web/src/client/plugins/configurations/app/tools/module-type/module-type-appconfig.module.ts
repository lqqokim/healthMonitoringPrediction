import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../component/component.module';
import { ModuleTypeListComponent } from './partial/module-type-list.component';
import { ModuleTypeAppConfigComponent } from './module-type-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ToolsComponentModule

    ],
    declarations: [
        ModuleTypeAppConfigComponent,
        ModuleTypeListComponent
    ],
    entryComponents: [
        ModuleTypeAppConfigComponent
    ]
})
export class ToolModuleTypeAppConfigModule {

    static config(): any {
        return {
            component: ModuleTypeAppConfigComponent
        };
    }
}
