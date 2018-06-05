import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { ModuleListModule } from '../module-list.module';

import { LocationModifyComponent } from './location/location-modify.component';
import { ModuleModifyComponent } from './module/module-modify.component';
import { ToolModifyComponent } from './tool/tool-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModuleListModule
    ],
    declarations: [
        LocationModifyComponent,
        ModuleModifyComponent,
        ToolModifyComponent
    ],
    exports: [
        LocationModifyComponent,
        ModuleModifyComponent,
        ToolModifyComponent
    ]
})
export class LocationModifyModule {

}
