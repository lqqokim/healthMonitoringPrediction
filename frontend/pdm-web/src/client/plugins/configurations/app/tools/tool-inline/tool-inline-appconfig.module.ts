import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../component/component.module';

import { InlineToolListComponent } from './partial/inline-tool-list.component';
import { ToolInlineAppConfigComponent } from './tool-inline-appconfig.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        // ToolsComponentModule

    ],
    declarations: [
        ToolInlineAppConfigComponent,
        InlineToolListComponent
    ]

})
export class ToolInlineAppConfigModule {

    static config(): any {
        return {
            component: ToolInlineAppConfigComponent
        };
    }
}
