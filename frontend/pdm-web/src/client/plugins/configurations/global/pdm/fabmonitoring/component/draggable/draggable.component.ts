import {Component, Directive, HostListener, EventEmitter, ElementRef, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Directive({
    selector: '[draggable]'
})
export class Draggable implements OnInit {

    mouseup = new EventEmitter<MouseEvent>();
    mousedown = new EventEmitter<MouseEvent>();
    mousemove = new EventEmitter<MouseEvent>();

    mousedrag: Observable<{top, left}>;

    @HostListener('document:mouseup', ['$event'])
    onMouseup(event: MouseEvent) {
        if(event.button!=0) return ;
        this.mouseup.emit(event);
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event: MouseEvent) {
        if(event.button!=0) return false;
        this.mousedown.emit(event);
        return false; // Call preventDefault() on the event
    }

    @HostListener('document:mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if(event.button!=0) return ;
        this.mousemove.emit(event);
    }

    constructor(public element: ElementRef) {
        this.element.nativeElement.style.position = 'relative';
        this.element.nativeElement.style.cursor = 'pointer';

        this.mousedrag = this.mousedown.map(event => {
            console.log("mousedown:",event);
            console.log("mousedown-element:",this.element.nativeElement);
            
            return {
                // top: event.clientY - this.element.nativeElement.getBoundingClientRect().top,
                // left: event.clientX - this.element.nativeElement.getBoundingClientRect().left,
                top: event.clientY - parseInt($(this.element.nativeElement).css('top')),
                left: event.clientX - parseInt($(this.element.nativeElement).css('left')),

            };
        })
        .flatMap(
            imageOffset => this.mousemove.map(pos => ({
                top: pos.clientY - imageOffset.top,
                left: pos.clientX - imageOffset.left
            }))
            .takeUntil(this.mouseup)
        );
    }

    ngOnInit() {
        this.mousedrag.subscribe({
            next: pos => {
                this.element.nativeElement.style.top = pos.top + 'px';
                this.element.nativeElement.style.left = pos.left + 'px';
                console.log("mousedrag:",pos);
            }
        });
    }
}