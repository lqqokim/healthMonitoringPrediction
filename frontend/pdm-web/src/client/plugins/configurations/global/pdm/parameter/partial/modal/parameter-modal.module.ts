import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ParameterModalComponent } from './parameter-modal.component';
import { ParameterModifyComponent } from './parameter-modify.component';
// import { AuthCommonAppConfigModule } from '../../../../../../../component/common/common.module';
//oderby module

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        ParameterModalComponent,
        ParameterModifyComponent,
    ],
    entryComponents: [
        ParameterModalComponent
    ]
})
export class ParameterModalModule {

    static config(): any {
        return {
            component: ParameterModalComponent
        };
    }
}
