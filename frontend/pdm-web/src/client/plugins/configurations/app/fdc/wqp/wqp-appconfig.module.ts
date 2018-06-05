import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { WqpAppConfigComponent } from './wqp-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        WqpAppConfigComponent
    ],
    entryComponents: [
        WqpAppConfigComponent
    ]
})
export class WqpAppConfigModule {

    static config(): any {
        return {
            component: WqpAppConfigComponent
        };
    }
}
