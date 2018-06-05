import { Directive, ElementRef, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Directive({ selector: '[offClick]' })
export class OffClickDirective implements OnDestroy {

    @Output()
    offClick: EventEmitter<Event> = new EventEmitter<Event>();

    private subscription: Subscription;
    private documentBodyElement: HTMLElement;
    private baseElement: HTMLElement;
    constructor(private el: ElementRef) {
        this.baseElement = this.el.nativeElement;
        this.documentBodyElement = document.body;
        this.subscription = Observable.fromEvent(document, 'click')
            .subscribe((event: Event) => this.clickHandler(event.srcElement, event))
    }

    private clickHandler(currentElement: HTMLElement | Element, event: Event): void {
        if (currentElement === this.documentBodyElement || currentElement == null) {
            this.offClick.emit(event);
            return;
        }
        if (currentElement === this.baseElement) {
            return;
        }
        this.clickHandler(currentElement.parentElement, event);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

@Directive({ selector: '[modalOffClick]' })
export class ModalOffClickDirective implements OnDestroy {
    @Input()
    set modalOffClickTagetByClass(className: any) {
        this._modalOffClickTagetByClass = className;
        this.targetElement = document.getElementsByClassName(className)[0].children[0];
        if (this.targetElement) {
            this.subscription = Observable.fromEvent(this.targetElement, 'click')
                .subscribe((event: Event) => this.clickHandler(event.srcElement, event));
        }
    }
    @Output()
    modalOffClick: EventEmitter<Event> = new EventEmitter<Event>();

    private _modalOffClickTagetByClass: any;

    private subscription: Subscription;
    private documentBodyElement: HTMLElement;
    private targetElement: Element;
    private baseElement: HTMLElement;
    constructor(private el: ElementRef) {
        this.baseElement = this.el.nativeElement;
        this.documentBodyElement = document.body;
        this.subscription = Observable.fromEvent(document, 'click')
            .subscribe((event: Event) => this.clickHandler(event.srcElement, event));
    }

    private clickHandler(currentElement: HTMLElement | Element, event: Event): void {
        if (this.targetElement) {
            if (currentElement === this.targetElement || currentElement == null) {
                this.modalOffClick.emit(event);
                return;
            }
        } else {
            if (currentElement === this.documentBodyElement || currentElement == null) {
                this.modalOffClick.emit(event);
                return;
            }
        }
        if (currentElement === this.baseElement) {
            return;
        }
        this.clickHandler(currentElement.parentElement, event);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
