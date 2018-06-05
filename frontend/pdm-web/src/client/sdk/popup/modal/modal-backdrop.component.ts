import { Component, ElementRef, Renderer } from '@angular/core';

import { ClassName } from './modal-options.type';

export class ModalBackdropOptions {
    animate: boolean = true;

    constructor(options: ModalBackdropOptions) {
        Object.assign(this, options);
    }
}

@Component({
    selector: 'bs-modal-backdrop',
    template: '',
    host: { 'class': ClassName.BACKDROP }
})
export class ModalBackdropComponent {
    element: ElementRef;
    renderer: Renderer;

    private _isAnimated: boolean;
    private _isShown: boolean = false;

    constructor(options: ModalBackdropOptions, element: ElementRef, renderer: Renderer) {
        this.element = element;
        this.renderer = renderer;
        this.isAnimated = options.animate !== false;
    }

    get isAnimated(): boolean {
        return this._isAnimated;
    }

    set isAnimated(value: boolean) {
        this._isAnimated = value;
        this.renderer.setElementClass(this.element.nativeElement, `${ClassName.FADE}`, value);
    }

    get isShown(): boolean {
        return this._isShown;
    }

    set isShown(value: boolean) {
        this._isShown = value;
        this.renderer.setElementClass(this.element.nativeElement, `${ClassName.IN}`, value);
    }
}