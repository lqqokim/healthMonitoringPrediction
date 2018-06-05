import { NgModule } from '@angular/core';
import { BISTEL_SDKModule } from '../../../../../sdk';
import { A3_CommonModule } from '../../../../../common';
import { PdmTreeComponent } from './pdm-tree.component';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        WjNavModule
    ],
    declarations: [
        PdmTreeComponent
    ],
    entryComponents: [
        PdmTreeComponent
    ]
})
export class PdmTreeModule {

    static config(): any {
        return {
            component: PdmTreeComponent
        };
    }
}
