import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ImportModalComponent } from './import-modal.component';
import { ImportModifyComponent } from './import-modify.component';
// import { AuthCommonAppConfigModule } from '../../../component/common/common.module';
import { ToolsComponentModule } from '../../../component/component.module';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        ToolsComponentModule
    ],
    declarations: [
        ImportModalComponent,
        ImportModifyComponent,
    ],
    entryComponents: [
        ImportModalComponent
    ]
})
export class ImportModalModule {

    static config(): any {
        return {
            component: ImportModalComponent
        };
    }
}
