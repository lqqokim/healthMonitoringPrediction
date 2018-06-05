import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { UserModalComponent } from './user-modal.component';
import { UserModifyComponent } from './user-modify.component';
import { AuthCommonAppConfigModule } from '../../../component/common/common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule
    ],
    declarations: [
        UserModalComponent,
        UserModifyComponent,
    ],
    entryComponents: [
        UserModalComponent
    ]
})
export class UserModalModule {

    static config(): any {
        return {
            component: UserModalComponent
        };
    }
}
