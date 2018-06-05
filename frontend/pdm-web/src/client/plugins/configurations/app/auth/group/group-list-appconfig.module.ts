import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { GroupListAppConfigComponent } from './group-list-appconfig.component';
import { GroupListComponent } from './partial/group-list.component';

import { AuthCommonAppConfigModule } from '../component/common/common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule
    ],
    declarations: [
        GroupListAppConfigComponent,
        GroupListComponent
    ],
    entryComponents: [
        GroupListAppConfigComponent
    ]
})
export class GroupListAppConfigModule {
    static config(): any {
        return {
            component: GroupListAppConfigComponent
        };
    }
}
