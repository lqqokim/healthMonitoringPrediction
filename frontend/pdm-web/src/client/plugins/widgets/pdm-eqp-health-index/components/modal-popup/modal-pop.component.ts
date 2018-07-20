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

    private popOpen: boolean = false;

    constructor(){
    }

    close(e?: MouseEvent): void {
        if( e ){
            e.preventDefault();
        }
        this.popOpen = false;
    }

    open(e?: MouseEvent): void {
        if( e ){
            e.preventDefault();
        }
        this.popOpen = true;
    }
    
}
