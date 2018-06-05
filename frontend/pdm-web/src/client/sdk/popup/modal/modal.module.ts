import { NgModule } from '@angular/core';

import { ModalBackdropComponent } from './modal-backdrop.component';
import { ModalDirective } from './modal.component';
import { ComponentsHelper } from './utils/components-helper.service';

@NgModule({
    declarations: [
        ModalBackdropComponent, 
        ModalDirective
    ],
    exports: [
        ModalBackdropComponent, 
        ModalDirective
    ],
    entryComponents: [ 
        ModalBackdropComponent 
    ]
})
export class ModalModule {
    static forProviders(): any[] {
      return [
          ComponentsHelper
      ];
    }
}