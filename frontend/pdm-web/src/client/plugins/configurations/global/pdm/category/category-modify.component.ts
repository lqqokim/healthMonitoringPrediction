import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'category-modify',
    templateUrl: './category-modify.html',
    styleUrls: ['./category-modify.css']
})
export class CategoryModifyComponent implements OnInit, OnChanges {
    @Input() data: any;

    categoryData: any;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if (changes.data.currentValue) {
            let currentValue = changes.data.currentValue;
            this.categoryData = currentValue.category;
        }
    }

    getData(): any {
        return this.categoryData;
    }
}