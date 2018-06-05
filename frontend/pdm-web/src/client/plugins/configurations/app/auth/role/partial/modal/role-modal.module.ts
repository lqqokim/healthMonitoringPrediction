import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { RoleModalComponent } from './role-modal.component';
import { RoleModifyComponent } from './role-modify.component';
import { AuthCommonAppConfigModule } from '../../../component/common/common.module';
import { RolePermissionModule } from '../role-permission.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule,
        RolePermissionModule
    ],
    declarations: [
        RoleModalComponent,
        RoleModifyComponent,
    ],
    entryComponents: [
        RoleModalComponent
    ]
})
export class RoleModalModule {

    static config(): any {
        return {
            component: RoleModalComponent
        };
    }
}
