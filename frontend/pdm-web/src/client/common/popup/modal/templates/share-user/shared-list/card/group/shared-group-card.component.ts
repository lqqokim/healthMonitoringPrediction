import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'shared-group-card',
    templateUrl : 'shared-group-card.html'
})
export class SharedGroupCardComponent implements OnInit, OnDestroy {

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
