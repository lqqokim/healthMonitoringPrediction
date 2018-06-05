import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';

import { EqpGlobalConfigComponent } from './eqp-globalconfig.component';
import { EqpListComponent } from './partial/eqp-list.component';
import { PdmConfigService } from './../model/pdm-config.service';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        WjNavModule
    ],
    declarations: [
        EqpGlobalConfigComponent,
        EqpListComponent
    ],
    entryComponents: [
        EqpGlobalConfigComponent
    ],

    providers: [PdmConfigService]
})
export class EqpGlobalConfigModule {

    static config(): any {
        return {
            component: EqpGlobalConfigComponent
        };
    }
}
