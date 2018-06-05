import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ToolsComponentModule } from '../../../component/component.module';

import { ModuleGroupModalComponent } from './module-group-modal.component';
import { ModuleGroupModifyComponent } from '../module-group-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        ToolsComponentModule
    ],
    declarations: [
        ModuleGroupModalComponent,
        ModuleGroupModifyComponent
    ],
    entryComponents: [
        ModuleGroupModalComponent
    ]
})
export class ModuleGroupModalModule {

    static config(): any {
        return {
            component: ModuleGroupModalComponent
        };
    }
}
