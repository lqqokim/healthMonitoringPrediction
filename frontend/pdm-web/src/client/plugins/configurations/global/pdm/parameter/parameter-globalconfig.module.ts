import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';

import { ParameterGlobalConfigComponent } from './parameter-globalconfig.component';
import { ParameterListComponent } from './partial/parameter-list.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        WjNavModule
    ],
    declarations: [
        ParameterGlobalConfigComponent,
        ParameterListComponent
    ],
    entryComponents: [
        ParameterGlobalConfigComponent
    ]
})
export class ParameterGlobalConfigModule {

    static config(): any {
        return {
            component: ParameterGlobalConfigComponent
        };
    }
}
