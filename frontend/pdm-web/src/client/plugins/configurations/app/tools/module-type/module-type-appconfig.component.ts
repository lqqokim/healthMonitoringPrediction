import { Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'div.tool-module-type-appconfig',
    templateUrl: 'module-type-appconfig.html',
    styleUrls: ['module-type-appconfig.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [],
    host: {
        'class': 'height-full'
    }
})
export class ModuleTypeAppConfigComponent implements OnInit {


    constructor() { }

    ngOnInit() {

    }


}
