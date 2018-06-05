import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';
import { CommonModule } from "@angular/common";

@NgModule({
	imports: [
        CommonModule
	],
    declarations: [
        SpinnerComponent
    ],
    exports: [
        SpinnerComponent
    ]
})
export class SpinnerModule {
    static forProviders(): any[] {
      return [
          SpinnerService
      ];
    }
}
