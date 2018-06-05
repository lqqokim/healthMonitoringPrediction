import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { AutoModelingGlobalConfigComponent } from './auto-modeling-globalconfig.component';
import { AutoModelingComponent } from './partial/auto-modeling.component';
import { PdmConfigService } from './../model/pdm-config.service';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        AutoModelingGlobalConfigComponent,
        AutoModelingComponent
    ],
    entryComponents: [
        AutoModelingGlobalConfigComponent
    ],
    providers: [PdmConfigService]
})
export class AutoModelingGlobalConfigModule {

    static config(): any {
        return {
            component: AutoModelingGlobalConfigComponent
        };
    }
}