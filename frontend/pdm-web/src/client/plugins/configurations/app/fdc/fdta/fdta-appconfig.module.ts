import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { FdtaAppConfigComponent } from './fdta-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        FdtaAppConfigComponent
    ],
    entryComponents: [
        FdtaAppConfigComponent
    ]
})
export class FdtaAppConfigModule {

    static config(): any {
        return {
            component: FdtaAppConfigComponent
        };
    }
}
