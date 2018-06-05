//Angular
import { Component, Input, OnInit, OnChanges, ViewEncapsulation, SimpleChanges } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'parameter-modify',
    templateUrl: 'master-parameter-modify.html',
    styleUrls: ['./master-parameter-modify.css'],
    encapsulation: ViewEncapsulation.None
})
export class MasterParamModifyComponent implements OnInit, OnChanges {
    @Input() data: any;

    paramData: any;

    constructor() { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: any): void {
        if (changes.data.currentValue) {
            this.paramData = changes.data.currentValue;
        }
    }

    getData(): any {
        return this.paramData;
    }
}