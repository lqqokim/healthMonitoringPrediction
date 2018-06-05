import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../../sdk/sdk.module';

import { MenuFunctionModalComponent } from './menu-function-modal.component';
import { MenuModifyComponent } from './pages/menu-modify.component';
import { FunctionModifyComponent } from './pages/function-modify.component';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule
    ],
    declarations: [
        MenuFunctionModalComponent,
        MenuModifyComponent,
        FunctionModifyComponent
    ],
    entryComponents: [
        MenuFunctionModalComponent
    ]
})
export class MenuFunctionModalModule {
    static config(): any {
        return {
            component: MenuFunctionModalComponent
        };
    }
}
