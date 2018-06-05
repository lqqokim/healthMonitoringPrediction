import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../sdk/sdk.module';

import { PasswordUserConfigComponent } from './password-userconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        PasswordUserConfigComponent
    ],
    entryComponents: [
        PasswordUserConfigComponent
    ]
})
export class PasswordUserConfigModule {

    static config(): any {
        return {
            component: PasswordUserConfigComponent
        };
    }
}
