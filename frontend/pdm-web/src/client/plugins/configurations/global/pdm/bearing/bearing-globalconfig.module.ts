import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';

import { BearingGlobalConfigComponent } from './bearing-globalconfig.component';
import { BearingListComponent } from './partial/bearing-list.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        WjNavModule
    ],
    declarations: [
        BearingGlobalConfigComponent,
        BearingListComponent
    ],
    entryComponents: [
        BearingGlobalConfigComponent
    ]
})
export class BearingGlobalConfigModule {

    static config(): any {
        return {
            component: BearingGlobalConfigComponent
        };
    }
}
