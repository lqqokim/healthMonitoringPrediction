import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { FdcModelService } from '../../../../../../common';
import { Util } from '../../../../../../sdk';
import { FormValueChangeType } from '../../../../../../sdk/core/form.type';
import { FilterColorSelect } from '../../../../../../sdk/components/filter-selector/filter-color-selector';

@Component({
    moduleId: module.id,
    selector: 'a3w-category-selector',
    templateUrl: 'category-selector.html',
})
export class CategorySelectorComponent {
    @Output() multiSeletorChanged = new EventEmitter();
    @ViewChild('filterSelector') filterSelectorEl: FilterColorSelect;
    @Input() selectedCategories: any;

    data: any;
    selectorConfig: any;
    selectorList: any = [];
    selectedItems: any = [];

    constructor(
        private fdcModel: FdcModelService,
    ) { }


    ngOnInit() {
        this._init();
    }

    _init() {
        this._getData();
    }

    _getData() {
        return new Promise((resolve, reject) => {
            this.fdcModel
                .getPrioriityCodes()
                .subscribe(
                (data) => {
                    // this.data = _.sortBy(_.where(data, { used: true }), 'code');
                    data = _.where(data, {used: true});
                    this.data = data.sort((a, b) => {
                        a = a.code;
                        b = b.code;

                        if (a.toLowerCase() < b.toLowerCase()) {
                            return -1;
                        } else if (a.toLowerCase() > b.toLowerCase()) {
                            return 1;
                        } else {
                            if (a < b) {
                                return -1;
                            } else if (a > b) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                    this._parseDataList(this.data);
                    resolve(this.data);
                }, (error: any) => {
                    reject(error);
                });

        });
    }

    _parseDataList(data) {
        this.selectorList = data.map((d) => {
            let codeColor = _.pluck(d.codeProperties, 'propertyValue');
            if (d.code === A3_CODE.DFD.PARAMETER_NONE_PRIORITY.code) {
                d.color = '#bbbbbb';
            } else {
                d.color = codeColor[0];
            }
            d.label = d.name;
            return d;
        });
        this.filterSelectorEl.listData = this.selectorList;
        let codeIds = _.pluck(this.selectorList, 'codeId');
        let filterCategories: any;
        let initCategories = Util.Validate.default(this.selectedCategories, _.pluck(this.selectorList, 'codeId'));

        filterCategories = _.map(initCategories, (ids) => {
            return _.filter(codeIds, (d) => {
                if (ids === d) {
                    return d;
                }
            });
        });
        this.selectedItems = _.compact(_.flatten(filterCategories));
    }

    filterSelectorApply(value: FormValueChangeType) {
        let checkedItems = _.pluck(value.valueItems, 'codeId');
        this.selectedItems = checkedItems;
        this.multiSeletorChanged.emit(checkedItems);
    }

    // API
    selectCategories(codeIds: Array<number>) {
        this.selectedItems = codeIds;
        this.multiSeletorChanged.emit(codeIds);
    }
}
