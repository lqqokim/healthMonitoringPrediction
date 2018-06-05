import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { AcubedMapComponent } from './acubed-map.component';
import { AcubedMapGridComponent } from './grid/acubed-map-grid.component';
import { AcubedMapSharedUserComponent } from './shared-user/acubed-map-shared-user.component';

@NgModule({
    imports: [
        CommonModule,
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        AcubedMapComponent,
        AcubedMapGridComponent,
        AcubedMapSharedUserComponent
    ],
    entryComponents: [
        AcubedMapComponent
    ]
})
export class AcubedMapModule {
   static config(): any {
        return {
            component: AcubedMapComponent
        };
    }
}
