import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { LocationModalComponent } from './location-modal.component';
// import { LocationModifyModule } from '../location-modify.module';
// import { ModuleModifyModule } from '../module-modify.module';
// import { ToolModifyModule } from '../tool-modify.module';
import { LocationModifyModule } from '../modify/modify-component.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        LocationModifyModule,
        // ModuleModifyModule,
        // ToolModifyModule
        LocationModifyModule
    ],
    declarations: [
        LocationModalComponent,
    ],
    entryComponents: [
        LocationModalComponent
    ]
})
export class LocationModalModule {

    static config(): any {
        return {
            component: LocationModalComponent
        };
    }
}
