// Angular Imports
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BTreeComponent } from './btree.component/btree.component';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';
import { SpinnerModule } from './../../../../sdk/popup/spinner/spinner.module';

import { BrowserModule }  from '@angular/platform-browser';


@NgModule({
    imports: [
       FormsModule,
       BrowserModule,
       WjNavModule,
       SpinnerModule
    ],
    declarations: [
        BTreeComponent
    ],
    exports: [
        BTreeComponent
    ]
})
export class BtreeComponentModule {
    // static config(): any {
    //     return {
    //         component: BTreeComponent,
    //         properties: Properties,
    //         inCondition: InCondition,
    //         outCondition: OutCondition,
    //         chartConfig: MonitoringDetailChartConfig,
    //         viewConfig: ViewConfig
    //     };
    // }
}
