import { NgModule } from '@angular/core';
import { RestfulModelService } from './restful-model.service';

@NgModule({
    exports: []
})
export class ModelModule {
    static forProviders(): any[] {
        return [
            RestfulModelService
        ];
    }
}