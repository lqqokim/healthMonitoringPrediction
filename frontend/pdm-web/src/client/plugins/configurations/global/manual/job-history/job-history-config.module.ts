import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { JobHistoryConfigComponent } from './job-history-config.component';
import { JobHistoryComponent } from './partial/job-history.component';
import { PdmConfigService } from './../../pdm/model/pdm-config.service';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        JobHistoryConfigComponent,
        JobHistoryComponent
    ],
    entryComponents: [
        JobHistoryConfigComponent
    ],
    providers: [PdmConfigService]
})
export class JobHistoryConfigModule {

    static config(): any {
        return {
            component: JobHistoryConfigComponent
        };
    }
}