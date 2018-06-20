// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { PdmWostEqpListComponent } from './pdm-worst-eqp-list.component';
import { StatusChangeComponent } from './components/status-change.component';
// import { TreeModule } from 'ng2-tree';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // TreeModule
    ],
    declarations: [
        PdmWostEqpListComponent,
        StatusChangeComponent
    ],
    exports: [
        PdmWostEqpListComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PdmWostEqpListModule {
    static config(): any {
        return {
            component: PdmWostEqpListComponent
        };
    }
}
