import { NgModule } from '@angular/core';

import { OrderBy } from './orderby.component';


@NgModule({
    imports: [
        
    ],
    declarations: [
        OrderBy

    ],
    exports:[OrderBy]
   
})
export class AuthCommonAppConfigModule {

    static config(): any {
        return {
            component: OrderBy
        };
    }
}
