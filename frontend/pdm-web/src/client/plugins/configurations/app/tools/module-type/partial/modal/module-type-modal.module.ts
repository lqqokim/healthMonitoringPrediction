import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ModuleTypeModalComponent } from './module-type-modal.component';
import { ModuleTypeModifyComponent } from './module-type-modify.component';
// import { AuthCommonAppConfigModule } from '../../../component/common/common.module';
import { ToolsComponentModule } from '../../../component/component.module';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        ToolsComponentModule
    ],
    declarations: [
        ModuleTypeModalComponent,
        ModuleTypeModifyComponent,
    ],
    entryComponents: [
        ModuleTypeModalComponent
    ]
})
export class ModuleTypeModalModule {

    static config(): any {
        return {
            component: ModuleTypeModalComponent
        };
    }
}
