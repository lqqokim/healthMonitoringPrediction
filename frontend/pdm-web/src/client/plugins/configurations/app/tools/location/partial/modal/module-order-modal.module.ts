import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ModuleOrderModalComponent } from './module-order-modal.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        ModuleOrderModalComponent,
    ],
    entryComponents: [
        ModuleOrderModalComponent
    ]
})
export class ModuleOrderModalModule {

    static config(): any {
        return {
            component: ModuleOrderModalComponent
        };
    }
}
