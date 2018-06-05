import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { AuthCommonAppConfigModule } from '../../auth/component/common/common.module';
import { ToolsComponentModule } from '../component/component.module';
import { LocationModifyModule } from './partial/modify/modify-component.module';

import { LocationAppConfigComponent } from './location-appconfig.component';
import { LocationTreeviewComponent } from './partial/location-treeview.component';
import { LocationToolModuleComponent } from './partial/location-tool-module.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule,
        ToolsComponentModule,
        LocationModifyModule,
    ],
    declarations: [
        LocationAppConfigComponent,
        LocationTreeviewComponent,
        LocationToolModuleComponent,
    ],
    exports: [
        LocationAppConfigComponent,
        LocationTreeviewComponent,
        LocationToolModuleComponent,
    ],
    entryComponents: [
        LocationAppConfigComponent
    ]
})
export class LocationAppConfigModule {

    static config(): any {
        return {
            component: LocationAppConfigComponent
        };
    }
}
