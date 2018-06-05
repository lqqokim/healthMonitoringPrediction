import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { UserListAppConfigComponent } from './user-list-appconfig.component';
import { UserListComponent } from './partial/user-list.component';
// import { UserModifyComponent } from './partial/user-modify.component';
import { AuthCommonAppConfigModule } from './../component/common/common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule
    ],
    declarations: [
        UserListAppConfigComponent,
        UserListComponent,
        // UserModifyComponent,
    ],
    entryComponents: [
        UserListAppConfigComponent
    ]
})
export class UserListAppConfigModule {

    static config(): any {
        return {
            component: UserListAppConfigComponent
        };
    }
}
