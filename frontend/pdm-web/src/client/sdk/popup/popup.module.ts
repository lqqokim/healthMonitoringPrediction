import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NotifyService } from './notify/notify.service';
import { SpinnerModule } from './spinner/spinner.module';
import { TranslaterModule } from '../i18n/translater.module';
import { ContextMenuService } from './context-menu/context-menu.service';
import { ModalModule } from './modal/modal.module';

@NgModule({
    imports: [
        SpinnerModule,
        TranslaterModule
    ],
    declarations: [],
    exports: [
        SpinnerModule,
        ModalModule
    ]
})
export class PopupModule {
    static forProviders(): any[] {
      return [
          NotifyService,
		  ContextMenuService,
          ...ModalModule.forProviders()
      ];
    }
}
