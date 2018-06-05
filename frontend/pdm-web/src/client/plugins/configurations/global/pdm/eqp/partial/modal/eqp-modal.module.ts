import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { EqpModalComponent } from './eqp-modal.component';
import { EqpModifyComponent } from './eqp-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        EqpModalComponent,
        EqpModifyComponent,
    ],
    entryComponents: [
        EqpModalComponent
    ]
})
export class EqpModalModule {

    static config(): any {
        return {
            component: EqpModalComponent
        };
    }
}
