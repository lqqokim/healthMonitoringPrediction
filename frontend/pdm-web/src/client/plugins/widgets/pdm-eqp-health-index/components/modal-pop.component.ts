import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'modal-pop',
    templateUrl: 'modal-pop.html',
    styleUrls: ['modal-pop.css'],
    encapsulation: ViewEncapsulation.None
})

export class ModalPopComponent {
    @Input() title: string;

    private popOpen: boolean = true;

    constructor(){
    }

    popClose(e: MouseEvent): void {
        e.preventDefault();
        this.popOpen = false;
    }
}
