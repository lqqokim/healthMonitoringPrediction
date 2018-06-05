import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { CodeListComponent } from './code-list.component';
import { CodeModifyComponent } from './code-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        CodeListComponent,
        CodeModifyComponent
    ],
    entryComponents: [
        CodeListComponent
    ]
})
export class CodeModule {

    static config(): any {
        return {
            component: CodeListComponent
        };
    }
}
