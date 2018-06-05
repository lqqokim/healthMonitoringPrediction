import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';

import { PartGlobalConfigComponent } from './part-globalconfig.component';
import { PartListComponent } from './partial/part-list.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        WjNavModule
    ],
    declarations: [
        PartGlobalConfigComponent,
        PartListComponent
    ],
    entryComponents: [
        PartGlobalConfigComponent
    ]
})
export class PartGlobalConfigModule {

    static config(): any {
        return {
            component: PartGlobalConfigComponent
        };
    }
}
