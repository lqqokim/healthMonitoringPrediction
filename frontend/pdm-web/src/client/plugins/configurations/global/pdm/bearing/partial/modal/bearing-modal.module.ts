import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { BearingModalComponent } from './bearing-modal.component';
import { BearingModifyComponent } from './bearing-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        BearingModalComponent,
        BearingModifyComponent,
    ],
    entryComponents: [
        BearingModalComponent
    ]
})
export class BearingModalModule {

    static config(): any {
        return {
            component: BearingModalComponent
        };
    }
}
