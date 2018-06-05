import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ParameterListModalComponent } from './parameter-list-modal.component';
import { ParameterListModifyComponent } from './parameter-list-modify.component';
// import { AuthCommonAppConfigModule } from '../../../component/common/common.module';
import { ToolsComponentModule } from '../../../component/component.module';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        ToolsComponentModule
    ],
    declarations: [
        ParameterListModalComponent,
        ParameterListModifyComponent,
    ],
    entryComponents: [
        ParameterListModalComponent
    ]
})
export class ModuleTypeModalModule {

    static config(): any {
        return {
            component: ParameterListModalComponent
        };
    }
}
