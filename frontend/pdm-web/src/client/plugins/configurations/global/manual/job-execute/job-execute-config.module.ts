import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { JobExecuteConfigComponent } from './job-execute-config.component';
import { JobExecuteComponent } from './partial/job-execute.component';
import { PdmConfigService } from './../../pdm/model/pdm-config.service';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        JobExecuteConfigComponent,
        JobExecuteComponent
    ],
    entryComponents: [
        JobExecuteConfigComponent
    ],
    providers: [PdmConfigService]
})
export class JobExecuteConfigModule {

    static config(): any {
        return {
            component: JobExecuteConfigComponent
        };
    }
}
