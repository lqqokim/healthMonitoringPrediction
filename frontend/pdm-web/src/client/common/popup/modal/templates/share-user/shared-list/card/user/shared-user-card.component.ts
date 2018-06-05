import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'shared-user-card',
    templateUrl : 'shared-user-card.html'
})
export class SharedUserCardComponent implements OnInit, OnDestroy {

    @Input() userInfo: any;
    @Output() emitDeleteCard = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    deleteCardClick() {
        this.emitDeleteCard.emit(this.userInfo);
    }
}
