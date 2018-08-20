import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { FilterAnalysisComponent } from './filter-analysis.component';

import { FoldingItemsComponent } from './components/sideArea/folding-items.component';
import { ConfigListComponent } from './components/sideArea/config-list.component';
import { DragItemListComponent } from './components/sideArea/dragItem-list.component';
import { DataConditionComponent } from './components/sideArea/data-condition.component';
import { MultiSelectComboComponent } from './components/multi-select-combo/multi-select-combo.component';

import { ChartVisualOptionsComponent } from './components/topArea/chart-visual-options.component';
import { ChartVisualOptionsItemComponent } from './components/topArea/chart-visual-options-item.component';
import { ChartDrawAreaComponent } from './components/chartDrawArea/chart-draw-area.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        FilterAnalysisComponent,
        FoldingItemsComponent,
        ConfigListComponent,
        DragItemListComponent,
        DataConditionComponent,
        MultiSelectComboComponent,
        ChartVisualOptionsComponent,
        ChartVisualOptionsItemComponent,
        ChartDrawAreaComponent
    ],
    entryComponents: [
        FilterAnalysisComponent
    ],
    exports:[
        FoldingItemsComponent,
        ConfigListComponent,
        DragItemListComponent,
        DataConditionComponent,
        MultiSelectComboComponent,
        ChartVisualOptionsComponent,
        ChartVisualOptionsItemComponent,
        ChartDrawAreaComponent
    ]
})
export class FilterAnalysisModule {

    static config(): any {
        return {
            component: FilterAnalysisComponent
        };
    }
}
