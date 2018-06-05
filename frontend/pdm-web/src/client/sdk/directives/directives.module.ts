import { NgModule } from '@angular/core';
import { FocusMeDirective } from './focus-me.directive';
import { KoreaInputDirective } from './korea-input.directive';
import { UppercaseDirective } from './uppercase.directive';
import { ScrollableDirective } from './scrollable.directive';
import { OffClickDirective, ModalOffClickDirective } from './off-click.directive';
import { ExcludePatternDirective } from './exclude-pattern.directive';
import { maxSizeDirective } from './max-size.directive';

@NgModule({
    declarations: [
        FocusMeDirective,
        KoreaInputDirective,
        UppercaseDirective,
        ScrollableDirective,
        OffClickDirective,
        ModalOffClickDirective,
        ExcludePatternDirective,
        maxSizeDirective
    ],
    exports: [
        FocusMeDirective,
        KoreaInputDirective,
        UppercaseDirective,
        ScrollableDirective,
        OffClickDirective,
        ModalOffClickDirective,
        ExcludePatternDirective,
        maxSizeDirective
    ]
})
export class DirectivesModule {}
