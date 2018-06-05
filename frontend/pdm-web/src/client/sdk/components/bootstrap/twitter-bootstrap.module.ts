import { NgModule } from '@angular/core';

import { DropdownModule } from './dropdown/dropdown.module';

@NgModule({
    imports: [DropdownModule.forRoot()],
    exports: [DropdownModule],
    declarations: [],
    providers: [],
})
export class TwitterBootstrapModule { }
