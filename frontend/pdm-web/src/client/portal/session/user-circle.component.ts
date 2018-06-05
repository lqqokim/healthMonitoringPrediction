import { Component, Input } from '@angular/core';
import { SessionService } from '../../common';

@Component({
    moduleId: module.id,
    selector: 'div.a3-user-circle',
    templateUrl: 'user-circle.html'
})
export class UserCircleComponent {
    @Input() divTag: any;
    imagePath: string;

    constructor(private session: SessionService) {
        this.imagePath = session.getUserImgPath();
        console.log('imagePath', this.imagePath);
    }
}
