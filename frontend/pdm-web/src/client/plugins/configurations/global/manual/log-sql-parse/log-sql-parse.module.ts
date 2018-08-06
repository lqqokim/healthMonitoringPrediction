import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { LogSqlParseComponent } from './log-sql-parse.component';
import { PdmConfigService } from './../../pdm/model/pdm-config.service';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        LogSqlParseComponent,
    ],
    entryComponents: [
        LogSqlParseComponent
    ],
    providers: [PdmConfigService]
})
export class LogSqlParseModule {

    static config(): any {
        return {
            component: LogSqlParseComponent
        };
    }
}