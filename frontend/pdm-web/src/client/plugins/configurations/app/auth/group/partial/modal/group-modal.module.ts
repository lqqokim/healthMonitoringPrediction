import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { GroupModalComponent } from './group-modal.component';
import { GroupModifyComponent } from './group-modify.component';
import { AuthCommonAppConfigModule } from '../../../component/common/common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule
    ],
    declarations: [
        GroupModalComponent,
        GroupModifyComponent,
    ],
    entryComponents: [
        GroupModalComponent
    ]
})
export class GroupModalModule {

    static config(): any {
        return {
            component: GroupModalComponent
        };
    }
}
