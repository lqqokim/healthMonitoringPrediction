import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { A3_CommonModule } from '../../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../../sdk/sdk.module';
import { FdtaConfigModalComponent } from './fdta-config-modal.component';

@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule,
        A3_CommonModule
	],
	declarations: [
        FdtaConfigModalComponent,
	],
    entryComponents: [
        FdtaConfigModalComponent,
    ]
})
export class FdtaConfigModalModule {
   static config(): any {
        return {
            component: FdtaConfigModalComponent
        };
    }
}

