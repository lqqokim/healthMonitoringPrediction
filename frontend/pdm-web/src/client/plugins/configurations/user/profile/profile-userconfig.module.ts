import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../sdk/sdk.module';

import { ProfileUserConfigComponent } from './profile-userconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        ProfileUserConfigComponent
    ],
    entryComponents: [
        ProfileUserConfigComponent
    ]
})
export class ProfileUserConfigModule {

    static config(): any {
        return {
            component: ProfileUserConfigComponent
        };
    }
}
