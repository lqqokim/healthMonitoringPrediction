import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../component/component.module';
import { ToolModelListComponent } from './partial/tool-model-list.component';
import { ToolModelAppConfigComponent } from './tool-model-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ToolsComponentModule

    ],
    declarations: [
        ToolModelAppConfigComponent,
        ToolModelListComponent
    ]

})
export class ToolModelAppConfigModule {

    static config(): any {
        return {
            component: ToolModelAppConfigComponent
        };
    }
}
