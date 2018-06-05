//Angular
import { Component, Input, OnInit, OnChanges, ViewEncapsulation, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    selector: 'eqp-copy',
    templateUrl: 'master-eqp-copy.html',
    encapsulation: ViewEncapsulation.None
})
export class MasterEqpCopyComponent implements OnInit, OnChanges {
    @Input() data: any;

    eqpData: any;
    copyValue: string;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if (changes.data.currentValue) {
            let currentValue = changes.data.currentValue;
            this.eqpData = currentValue.eqp;
            this.copyValue = '';
        }
    }

    eqpCopyValue(): any {
        return this.copyValue;
    }
}