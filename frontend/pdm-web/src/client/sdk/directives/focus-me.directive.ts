import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
    selector: 'input[focus-me]'
})
export class FocusMeDirective {
    constructor(public renderer: Renderer, public elementRef: ElementRef) { }

    // @see navigation-title.html
    ngOnInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
    }
}