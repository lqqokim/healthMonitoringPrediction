import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { PartModalComponent } from './part-modal.component';
import { PartModifyComponent } from './part-modify.component';
// import { AuthCommonAppConfigModule } from '../../../../../../../component/common/common.module';
//oderby module

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        PartModalComponent,
        PartModifyComponent,
    ],
    entryComponents: [
        PartModalComponent
    ]
})
export class PartModalModule {

    static config(): any {
        return {
            component: PartModalComponent
        };
    }
}
