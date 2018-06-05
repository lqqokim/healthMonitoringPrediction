import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { RoleListAppConfigComponent } from './role-list-appconfig.component';
import { RoleListComponent } from './partial/role-list.component';
// import { RolePermissionComponent } from './partial/role-permission.component';
// import { RoleModifyComponent } from './partial/modal/role-modify.component';
import { AuthCommonAppConfigModule } from '../component/common/common.module';
import { RolePermissionModule } from './partial/role-permission.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule,
        RolePermissionModule
    ],
    declarations: [
        RoleListAppConfigComponent,
        RoleListComponent,
        // RolePermissionComponent,
        // RoleModifyComponent
    ],
    exports: [
        RoleListAppConfigComponent,
        RoleListComponent,
        // RolePermissionComponent,
        // RoleModifyComponent
    ],
    entryComponents: [
        RoleListAppConfigComponent
    ]
})
export class RoleListAppConfigModule {

    static config(): any {
        return {
            component: RoleListAppConfigComponent
        };
    }
}
