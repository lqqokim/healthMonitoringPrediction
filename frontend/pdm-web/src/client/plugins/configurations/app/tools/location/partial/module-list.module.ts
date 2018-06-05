import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../sdk/sdk.module';

import { ModuleListComponent } from './../../location/partial/module-list.component';
// import { ModuleOrderModalModule } from '../partial/modal/module-order-modal.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ModuleOrderModalModule
    ],
    declarations: [
        ModuleListComponent
    ],
    exports: [
        ModuleListComponent
    ],
    entryComponents: [
        ModuleListComponent
    ]
})
export class ModuleListModule {

    static config(): any {
        return {
            component: ModuleListComponent
        };
    }
}
