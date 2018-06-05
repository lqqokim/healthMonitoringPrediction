import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'a3w-chart-header',
    template: ` 
        <div class="a3-chart-header">
            <ng-content></ng-content>
        </div>
    `
})
export class WidgetHeaderComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}