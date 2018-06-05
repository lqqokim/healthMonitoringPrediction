//Angular
import { Component, Input, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'area-modify',
    templateUrl: 'master-area-modify.html',
    styleUrls: ['./master-area-modify.css'],
    encapsulation: ViewEncapsulation.None
})
export class MasterAreaModifyComponent implements OnInit, OnChanges {
    @Input() data: any;

    areaData: any;

    constructor() { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: any): void {
        if (changes.data.currentValue) {
            this.areaData = changes.data.currentValue;
        }
    }

    getData(): any {
        return this.areaData;
    }
}