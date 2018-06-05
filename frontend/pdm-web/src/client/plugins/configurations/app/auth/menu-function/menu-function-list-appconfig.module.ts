import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { MenuFunctionListAppConfigComponent } from './menu-function-list-appconfig.component';
import { MenuFunctionListComponent } from './partial/menu-function-list.component';
import { AuthCommonAppConfigModule } from './../component/common/common.module';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule
    ],
    declarations: [
        MenuFunctionListAppConfigComponent,
        MenuFunctionListComponent
    ],
    entryComponents: [
        MenuFunctionListAppConfigComponent
    ]
})
export class MenuFunctionListAppConfigModule {

    static config(): any {
        return {
            component: MenuFunctionListAppConfigComponent
        };
    }
}
