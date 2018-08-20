import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { FabMonitoringComponent } from './fabmonitoring.component';
import { FabEditorComponent } from './component/fab-editor/fab-editor.component';
import { Draggable } from './component/draggable/draggable.component';
import { AnalysisToolModule } from '../../pdm/analysis-tool/analysis-tool.module';
import { BarchartComponent } from './component/barchart/barchart.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AnalysisToolModule
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
