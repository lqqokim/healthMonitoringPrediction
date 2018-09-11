import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';

import { MasterInfoComponent } from './master-info.component';
import { WjTreeComponent } from './tree/wj-tree.component';

import { MasterAreaListComponent } from './partial/area/master-area-list.component';
import { MasterEqpListComponent } from './partial/eqp/master-eqp-list.component';
import { MasterParameterListComponent } from './partial/parameter/master-parameter-list.component';
import { MasterPartListComponent } from './partial/part/master-part-list.component';

import { MasterAreaModifyComponent } from './partial/area/master-area-modify.component';
import { MasterEqpModifyComponent } from './partial/eqp/master-eqp-modify.component';
import { MasterParamModifyComponent } from './partial/parameter/master-parameter-modify.component';
import { MasterPartModifyComponent } from './partial/part/master-part-modify.component';
import { MasterSpecRuleComponent } from './partial/spec-rule/master-spec-rule.component';

import { MasterEqpCopyComponent } from './partial/eqp/master-eqp-copy.component';

import { AngularSplitModule } from 'angular-split';

// import { NgTree } from 'ng.tree';



@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        WjNavModule,
        AngularSplitModule
        
    ],
    declarations: [
        MasterInfoComponent,
        WjTreeComponent,
        
        MasterAreaListComponent,
        MasterEqpListComponent,
        MasterParameterListComponent,
        MasterPartListComponent,

        MasterAreaModifyComponent,
        MasterEqpModifyComponent,
        MasterParamModifyComponent,
        MasterPartModifyComponent,
        MasterSpecRuleComponent,

        MasterEqpCopyComponent,
        // NgTree
        
    ],
    entryComponents: [
        MasterInfoComponent
    ]
})
export class MasterInfoModule {

    static config(): any {
        return {
            component: MasterInfoComponent
        };
    }
}
