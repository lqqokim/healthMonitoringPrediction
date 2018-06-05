import { NgModule } from '@angular/core';
import { CamelToDashedPipe } from './camel-to-dashed.pipe';
import { DescToDashedPipe } from './desc-to-dashed.pipe';
import { JsonToIterablePipe } from './json-to-iterable.pipe';
import { MatchNamePipe } from './match-name.pipe';
import { ObjectToFilterPipe } from './object-to-filter.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
    declarations: [
        CamelToDashedPipe,
        DescToDashedPipe,
        JsonToIterablePipe,
        MatchNamePipe,
        ObjectToFilterPipe,
        SafeHtmlPipe
    ],
    exports: [
        CamelToDashedPipe,
        DescToDashedPipe,
        JsonToIterablePipe,
        MatchNamePipe,
        ObjectToFilterPipe,
        SafeHtmlPipe
    ]
})
export class PipesModule {}
