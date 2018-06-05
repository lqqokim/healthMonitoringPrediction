import { NgModule } from '@angular/core';
import { BISTEL_SDKModule } from '../../../../../../sdk';
import { A3_CommonModule } from '../../../../../../common';
import { ErrorModalComponent } from './error-modal.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        ErrorModalComponent
    ],
    entryComponents: [
        ErrorModalComponent
    ]
})
export class ErrorModalModule {

    static config(): any {
        return {
            component: ErrorModalComponent
        };
    }
}
