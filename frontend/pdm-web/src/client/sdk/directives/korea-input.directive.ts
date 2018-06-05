import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
    selector: 'input[kr-input]'
})
export class KoreaInputDirective {
    constructor(public renderer: Renderer, public elementRef: ElementRef) { }

    // @see navigation-title.html
    ngOnInit() {
        // this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
        if(this.elementRef.nativeElement) {
            this.elementRef.nativeElement
                .addEventListener('compositionstart', (e: any) => {
                    e.stopImmediatePropagation();
                });
        }
    }
}