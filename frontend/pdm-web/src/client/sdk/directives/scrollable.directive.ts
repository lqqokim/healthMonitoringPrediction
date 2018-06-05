import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
    selector: '[scrollable]'
})
export class ScrollableDirective {
    constructor(public renderer: Renderer, public elementRef: ElementRef) { }

    ngOnInit() {
        // console.log('ScrollableDirective :: ngOnInit');
        $(this.elementRef.nativeElement).bind('mousewheel DOMMouseScroll MozMousePixelScroll',
            (event: any) => {
                // console.log('ScrollableDirective', event);
                if ((event.currentTarget.scrollHeight - event.currentTarget.clientHeight) > 0) {
                    event.stopPropagation();
                }
            }
        );
    }

    ngOnDestroy() {
         $(this.elementRef.nativeElement).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
    }
}
