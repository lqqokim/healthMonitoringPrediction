import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { FabMonitoringComponent } from './fabmonitoring.component';
import { FabEditorComponent } from './component/fab-editor/fab-editor.component';
import { Draggable } from './component/draggable/draggable.component';
import { FilterAnalysisModule } from '../../pdm/filter-analysis/filter-analysis.module';
import { BarchartComponent } from './component/barchart/barchart.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        FilterAnalysisModule
    ],
    declarations: [
        FabMonitoringComponent,
        FabEditorComponent,
        Draggable,
        BarchartComponent
    ],
    entryComponents: [
        FabMonitoringComponent
    ],
    exports:[FabEditorComponent,BarchartComponent]
})
export class FabMonitoringModule {

    static config(): any {
        return {
            component: FabMonitoringComponent
        };
    }
}
