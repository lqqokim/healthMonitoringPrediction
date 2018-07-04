// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { PdmAlarmHistoryComponent } from './pdm-alarm-history.component';

//* ng2-table 사용을 위한 모듈 로드
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { TableComponent } from '../../common/ng2-table/table.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        Ng2TableModule,
        FormsModule
    ],
    declarations: [
        PdmAlarmHistoryComponent,
        TableComponent
    ],
    exports: [
        PdmAlarmHistoryComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class PdmAlarmHistoryModule {
    static config(): any {
        return {
            component: PdmAlarmHistoryComponent
        };
    }
}
