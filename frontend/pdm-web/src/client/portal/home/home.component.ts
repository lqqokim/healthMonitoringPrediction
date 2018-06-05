import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: '[a3p-home]',
    templateUrl: 'home.html'
})
export class HomeComponent {

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        console.log('--HomeComponent init');
    }
}