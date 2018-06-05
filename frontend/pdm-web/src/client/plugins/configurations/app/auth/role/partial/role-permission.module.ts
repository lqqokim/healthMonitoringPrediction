import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../sdk/sdk.module';

import { RolePermissionComponent } from '../partial/role-permission.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        RolePermissionComponent,
    ],
    exports: [
        RolePermissionComponent,
    ],
    entryComponents: [
        RolePermissionComponent
    ]
})
export class RolePermissionModule {

    static config(): any {
        return {
            component: RolePermissionComponent
        };
    }
}
