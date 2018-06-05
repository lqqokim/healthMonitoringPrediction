import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'code-modify',
    templateUrl: './code-modify.html',
    styleUrls: ['./code-modify.css']
})
export class CodeModifyComponent implements OnInit, OnChanges {
    @Input() data: any;

    codeData: any;
    categoryDatas: any[];
    categoryDisabled: boolean;

    useds: any[] = [
        { value: true, label: 'Y' },
        { value: false, label: 'N' }
    ]

    defaults: any[] = [
        { value: true, label: 'Y' },
        { value: false, label: 'N' }
    ];

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if (changes.data.currentValue) {
            let currentValue = changes.data.currentValue;
            this.categoryDatas = currentValue.categoryDatas;
            this.codeData = currentValue.code;
            // this.checkCategoryAll();
        }
    }

    checkCategoryAll() {
        let categoryAllsId;

        for (let i = 0; i < this.categoryDatas.length; i++) {
            if (this.categoryDatas[i].categoryName === 'ALL') {
                categoryAllsId = this.categoryDatas[i].categoryId;
                break;
            }
        }

        if (this.codeData.categoryId === categoryAllsId) {
            this.categoryDisabled = false;
        } else {
            this.categoryDisabled = true;
        }
    }

    getData(): any {
        // console.log('getData', this.codeData);
        return this.codeData;
    }
}