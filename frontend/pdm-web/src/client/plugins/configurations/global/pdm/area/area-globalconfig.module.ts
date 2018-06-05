import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';

import { AreaGlobalConfigComponent } from './area-globalconfig.component';
import { AreaModifyComponent } from './partial/area-modify.component';
import { PdmConfigService } from './../model/pdm-config.service';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        WjNavModule
    ],
    declarations: [
        AreaGlobalConfigComponent,
        AreaModifyComponent
    ],
    entryComponents: [
        AreaGlobalConfigComponent
    ],
    providers: [PdmConfigService]
})
export class AreaGlobalConfigModule {

    static config(): any {
        return {
            component: AreaGlobalConfigComponent
        };
    }
}
