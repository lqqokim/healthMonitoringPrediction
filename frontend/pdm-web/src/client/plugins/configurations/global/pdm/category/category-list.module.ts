import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { CategoryListComponent } from './category-list.component';
import { CategoryModifyComponent } from './category-modify.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        CategoryListComponent,
        CategoryModifyComponent
    ],
    entryComponents: [
        CategoryListComponent
    ]
})
export class CategoryModule {

    static config(): any {
        return {
            component: CategoryListComponent
        };
    }
}
