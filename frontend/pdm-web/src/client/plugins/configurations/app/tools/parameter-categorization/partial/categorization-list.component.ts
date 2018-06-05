import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { Observable } from 'rxjs/Observable';

import { ImportModalModule } from './modal/import-modal.module';


import {
    // AppModelService,
    FdcModelService,
    ModalAction,
    ModalRequester,
    RequestType
} from '../../../../../../common';
import { NotifyService, Translater } from '../../../../../../sdk';

// import { ToolGroupModalModule } from './modal/tool-group-modal.module';

@Component({
    moduleId: module.id,
    selector: 'categorization-list',
    templateUrl: `categorization-list.html`,
    providers: [FdcModelService]
})
export class CategorizationListComponent implements OnInit {

    @Output() dataLoadCompleted: EventEmitter<any> = new EventEmitter();
    @Output() categoriesChange: EventEmitter<any> = new EventEmitter();
    @Output() changeMode: EventEmitter<any> = new EventEmitter();

    @ViewChild('colorMenu') colorMenuEl: any;
    @ViewChild('categoryList') categoryListEl: any;

    appCodeCategoriesDatas: any[];
    isMainSelected: boolean = false;
    selectedItems: any = [];

    isShowColorMenu: boolean = false;
    isFirstColor: boolean = true;


    /** edit <-> view */
    currentEditCategory: any;           //현재 작업중인 category Info.

    private _appName = 'FDC';
    private _codeCategoryName = 'Priority';
    private _popupHeight: number = 130;
    private _popupWidth: number = 220;
    private _isDeleteMode = false;

    private _currentEditNameEl: any;

    private _oriData: any[];
    private _isCallCreate: boolean = false;     //create 버튼을 여러번 클릭되는 것을 방지하기 위한 변수.
    private _isFocusNewItem = false;

    private _isRollBack = false;

    // paramCategorySumDatas: any[];

    constructor(
        // private AppCommonService: AppModelService,
        private FdcPlusService: FdcModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private el: ElementRef
    ) { }

    ngOnInit() {
        this.getParameterCategories(true);
        this.rememberColorPopupSize();
    }

    rememberColorPopupSize() {
        const el = $(this.colorMenuEl.nativeElement);
        el.show();
        this._popupHeight = el.height();
        this._popupWidth = el.width();
        el.hide();
    }

    getParameterCategories(isResetParamSum: boolean = false) {
        this.FdcPlusService.getPrioriityCodes().subscribe((data: any) => {
            this._oriData = data;

            const findUncategorizedIdx = data.findIndex((item: any) => {
                return item.code === A3_CODE.DFD.PARAMETER_NONE_PRIORITY.code;
            });

            data.forEach((category: any, idx: number) => {
                if (!category.codeProperties) {
                    category.codeProperties = [];
                }
                if (category.codrOrder !== undefined) {
                    category.codeOrder = 0;
                }
            });

            //fix uncategorized color
            let uncategorizedItemColor: any;
            if (data[findUncategorizedIdx].codeProperties) {
                uncategorizedItemColor = data[findUncategorizedIdx].codeProperties.find((prop: any) => {
                    return prop.propertyName === 'COLOR';
                });

                if (uncategorizedItemColor) {
                    uncategorizedItemColor.propertyValue = '#bbbbbb';
                } else {
                    data[findUncategorizedIdx].codeProperties.push({
                        propertyName: 'COLOR',
                        propertyValue: '#bbbbbb'
                    });
                }
            } else {
                data[findUncategorizedIdx].codeProperties = [];
                data[findUncategorizedIdx].codeProperties.push({
                    propertyName: 'COLOR',
                    propertyValue: '#bbbbbb'
                });
            }


            this.appCodeCategoriesDatas = data.map((item: any) => {
                if (this.appCodeCategoriesDatas) {
                    const findItem = this.appCodeCategoriesDatas.find((i: any) => {
                        return i.codeId === item.codeId;
                    });
                    if (findItem) {
                        return Object.assign(findItem, item);
                    } else {
                        return Object.assign({
                            isSelected: false,
                            isEditName: false,
                            isEditDesc: false,
                            isFirstEditName: false,
                            isFirstEditDesc: false,
                        }, item);
                    }
                } else {
                    return Object.assign({
                        isSelected: false,
                        isEditName: false,
                        isEditDesc: false,
                        isFirstEditName: false,
                        isFirstEditDesc: false,
                    }, item);
                }
            });

            this.appCodeCategoriesDatas.splice(findUncategorizedIdx, 1);

        }, (err: Error) => {
            throw err;
        }, () => {
            if (this._isFocusNewItem) {
                console.log('categorization-list : _isFocusNewItem -> false');
                this._isFocusNewItem = false;
                setTimeout(() => {
                    this._isCallCreate = false;
                    //set focus..
                    const focusTarget = this.categoryListEl.nativeElement;
                    focusTarget.children[1].children[0].click();
                    console.log('categorization-list : focus Item completed', focusTarget);
                }, 100);
            }
            // this._resetCheckBoxs();
            //create categories data..
            this.dataLoadCompleted.emit({
                data: {
                    itemList: this._oriData,
                    isResetParamSum: isResetParamSum
                }
                // oriData: this.oriData
            });
            // this.initPageView();
        });
    }

    parseImportData(data: any) {
        this.appCodeCategoriesDatas = data;
    }

    createCategory() {
        event.stopPropagation();
        // const isRollBack = true;

        if (this.currentEditCategory) {
            if (this.currentEditCategory.isEditName) {
                let isPass = this._isPassEdit(this.currentEditCategory, true, this._isRollBack);

                if (isPass) {
                    this._removeErrorClass();
                    this.currentEditCategory.isEditName = false;
                    this.updateCategory(this.currentEditCategory);
                } else {
                    if (this._isRollBack) {
                        this._removeErrorClass();
                        this.currentEditCategory.isEditName = false;
                    } else {
                        this._setFocusInput();
                        return;
                    }
                }
            }
        }

        if (this._isCallCreate) return;
        this._isCallCreate = true;

        this._resetCheckBoxs();

        const newName = this._getCategoryNewName();
        const reqParam = [{
            codeId: null,
            code: newName,
            name: newName,
            codeOrder: this._getMinCategoryCodeOrder() - 1,
            default: false,
            used: true,
            description: '',
            codeProperties: [{
                propertyName: 'COLOR',
                propertyValue: '#FB5A3C'
            }]
        }];
        this.FdcPlusService.insertPrioritycodes(reqParam).subscribe((data: any) => {
            console.log('categorization-list : insertPrioritycodes');
            this.selectedItems = [];
            this.toggleMainSelected();
            this.getParameterCategories();

        }, (err: Error) => {
            throw err;
        }, () => {
            console.log('categorization-list : _isFocusNewItem -> true');
            this._isFocusNewItem = true;
        });
    }

    _getCategoryNewName(num?: number): string {
        let count = (num) ? num : 1;
        let newName = 'New' + count;

        const isCode = this.appCodeCategoriesDatas.find((item: any) => {
            return item.name === newName;
        });

        if (!isCode) {
            return newName;
        } else {
            count = count + 1;
            return this._getCategoryNewName(count);
        }
    }

    _getCategoryNewCode(num?: number): string {
        let count = (num) ? num : 1;
        let newName = 'N' + count;

        const isCode = this.appCodeCategoriesDatas.find((item: any) => {
            return item.code === newName;
        });

        if (!isCode) {
            return newName;
        } else {
            count = count + 1;
            return this._getCategoryNewCode(count);
        }
    }

    _getMaxCategoryCodeOrder(): number {
        let codeOrderList;
        if (this.appCodeCategoriesDatas.length === 0) {
            codeOrderList = [0];
        } else {
            codeOrderList = this.appCodeCategoriesDatas.map((item: any) => {
                return item.codeOrder;
            });
        }

        return codeOrderList.reduce((previous: number, current: number) => {
            return previous > current ? previous : current;
        });
    }

    private _getMinCategoryCodeOrder(): number {
        let codeOrderList;
        if (this.appCodeCategoriesDatas.length === 0) {
            codeOrderList = [0];
        } else {
            codeOrderList = this.appCodeCategoriesDatas.map((item: any) => {
                return item.codeOrder;
            });
        }

        return codeOrderList.reduce((previous: number, current: number) => {
            return previous < current ? previous : current;
        });
    }

    updateCategory(category: any, isCall: boolean = false) {
        if (!category) return;

        // if(!isCall) {
        //     if(!this._isChangeCategory(category)) return;
        // }

        const reqParam = [{
            codeId: category.codeId,
            code: category.name,    //code === name
            name: category.name,
            // codeOrder: (category.codeOrder !== undefined && category.codeOrder !== null && category.codeOrder > -1) ?
            //     category.codeOrder : this._getMaxCategoryCodeOrder() + 1,
            codeOrder: category.codeOrder,
            default: category.default,
            used: category.used,
            description: (category.description) ? category.description : '',
            codeProperties: category.codeProperties
        }];

        this.FdcPlusService.updatePrioritycodes(reqParam).subscribe((data: any) => {
            this.selectedItems = [];
            this.toggleMainSelected();

            if (isCall) {
                this.currentEditCategory = undefined;
            }
            if (!this.currentEditCategory) {
                this.getParameterCategories();
            }
        });
    }

    //TODO : Update 호출 개선하기. by jwhong
    // _isChangeCategory(category:any) {
    //     let isChange = false;

    //     const findOriCategory = this._oriData.find((item) => item.code === category.code);

    //     if(findOriCategory) {
    //         const colorOriProp = _.pluck(findOriCategory.codeProperties, 'propertyValue');
    //         const colorCurProp = _.pluck(category.codeProperties, 'propertyValue');
    //         if(category.name !== findOriCategory.name) {
    //             isChange = true;
    //         }

    //         if(category.description !== findOriCategory.description) {
    //             isChange = true;
    //         }

    //         if(colorOriProp[0] !== colorCurProp[0]) {
    //             isChange = true;
    //         }

    //         if(category.used !== findOriCategory.used) {
    //             isChange = true;
    //         }
    //     }

    //     return isChange;
    // }

    deleteCategory() {
        this._isDeleteMode = true;
        this.modalAction.showConfirmDelete({
            info: {
                title: 'categories',
                confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: 'categories' })['value'],
                delInfos: this.selectedItems
            },
            requester: this.requester,
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            this._isDeleteMode = false;
            if (response.type === 'OK' && response.data) {
                let rxAll: any = [];
                const delInfos = response.data.delInfos;
                delInfos.forEach((info: any) => {
                    rxAll.push(this.FdcPlusService.deletePrioritycodes(info.codeId));
                });
                Observable.forkJoin(rxAll).subscribe((data: any) => {
                    console.log(data);
                }, (err: Error) => {
                    throw err;
                }, () => {
                    this._resetCheckBoxs();
                    this.currentEditCategory = undefined;
                    // this.selectedItems = [];
                    this.getParameterCategories();
                    // this.toggleMainSelected();
                });
            }
        });
    }

    toggleMainSelected() {
        this.selectedItems = this.appCodeCategoriesDatas.filter((item: any) => {
            return item.isSelected;
        });

        if (this.appCodeCategoriesDatas.length === 0) {
            this.isMainSelected = false;
            return;
        }

        if (this.selectedItems.length === this.appCodeCategoriesDatas.length) {
            this.isMainSelected = true;
        } else {
            this.isMainSelected = false;
        }
    };

    toggleAllSelect(flag: boolean) {
        this.appCodeCategoriesDatas.forEach((item: any, idx: number, arr: any) => {
            if (flag) {
                item.isSelected = true;
                // this.selectedItems = 0;
            } else {
                item.isSelected = false;
                // this.selectedItems = arr.length;
            }
        });

        this.toggleMainSelected();
    }

    clickEditName(ev: any, category: any, el: any) {
        ev.preventDefault();    //무조건 있어야 됨..
        // const isRollBack = true;

        if (this.currentEditCategory) {
            if (this.currentEditCategory.code !== category.code) {
                if (this.currentEditCategory.isEditName) {
                    let isPass = this._isPassEdit(this.currentEditCategory, true, this._isRollBack);

                    if (isPass) {
                        this._removeErrorClass();
                        this.currentEditCategory.isEditName = false;
                        this.updateCategory(this.currentEditCategory);
                    } else {
                        if (this._isRollBack) {
                            this._removeErrorClass();
                            this.currentEditCategory.isEditName = false;
                        } else {
                            this._setFocusInput();
                            event.stopPropagation();
                            return;
                        }
                    }
                }
            }
        }
        this.currentEditCategory = category;
        category.isEditName = true;
        category.isFirstEditName = true;

        this._currentEditNameEl = ev.currentTarget.parentElement.children[1]
            || ev.target;
        setTimeout(() => {
            if (this._currentEditNameEl) {
                $(this._currentEditNameEl).find(':input').focus();
            }
        }, 200);
    }

    clickEditDesc(ev: any, category: any, el: any) {
        ev.preventDefault();    //무조건 있어야 됨..
        // const isRollBack = true;

        if (this.currentEditCategory) {
            if (this.currentEditCategory.code !== category.code) {
                if (this.currentEditCategory.isEditDesc) {
                    this.currentEditCategory.isEditDesc = false;
                    this.updateCategory(this.currentEditCategory);
                }
                if (this.currentEditCategory.isEditName) {
                    let isPass = this._isPassEdit(this.currentEditCategory, true, this._isRollBack);

                    if (isPass) {
                        this._removeErrorClass();
                        this.updateCategory(this.currentEditCategory);
                    } else {
                        if (this._isRollBack) {
                            this._removeErrorClass();
                        } else {
                            this._setFocusInput();
                            event.stopPropagation();
                            return;
                        }
                    }
                }
            }
        }
        this.currentEditCategory = category;
        category.isEditDesc = true;
        category.isFirstEditDesc = true;

        const target = ev.currentTarget.parentElement.children[1]
            || ev.target;
        setTimeout(() => {
            if (target) {
                $(target).find(':input').focus();
            }
        }, 200);
    }

    handleKeyEnterName(ev: any, category: any, el: any) {
        let isPass = this._isPassEdit(category);

        // this._currentEditNameEl = ev.currentTarget.parentElement.children[1]
        //     || ev.target;
        if (!isPass) {
            this._setFocusInput();
        } else {
            this._removeErrorClass();
            category.isEditName = false;
            category.isFirstEditName = false;
            this.currentEditCategory = undefined;
            this.updateCategory(category);
        }
    }

    handleKeyEnterDesc(ev: any, category: any) {
        category.isEditDesc = false;
        category.isFirstEditDesc = false;
        this.currentEditCategory = undefined;
        this.updateCategory(category);
    }

    displayChange(category: any) {
        let isPass = this._isPassEdit(category);
        if (!isPass) {
            this._setFocusInput();
        } else {
            this._removeErrorClass();
            category.isEditName = false;
            category.isFirstEditName = false;
            this.currentEditCategory = undefined;
            this.updateCategory(category);
        }
    }

    isDuplicate(column: string, category: any) {
        if (category) {
            return this.appCodeCategoriesDatas.find((item: any) => {
                item[column] = item[column].replace(/(^\s*)|(\s*$)/g, '');
                return (item.codeId !== category.codeId) && (item[column] === category[column]);
            });
        }
        return false;
    }

    offClick(mode: any, category?: any, ev?: any) {
        // const isRollBack = true;
        const isNotify = true;

        if (mode === 'name') {
            if (this.currentEditCategory) {
                if (this.currentEditCategory.code === category.code) {
                    if (category.isEditName) {
                        if (category.isFirstEditName) {
                            category.isFirstEditName = false;
                        } else {
                            if (this._isDeleteMode) {
                                return;
                            }
                            let isPass = this._isPassEdit(category, isNotify, this._isRollBack);

                            if (!isPass) {
                                if (this._isRollBack) {
                                    this._removeErrorClass();
                                    if (!category.isEditDesc) {
                                        if (!this.isShowColorMenu) {
                                            this.currentEditCategory = undefined;
                                        }
                                    }
                                    //this.updateCategory(category);
                                    category.isEditName = false;
                                } else {
                                    category.isEditDesc = false;
                                    this._setFocusInput();
                                }
                            } else {
                                this._removeErrorClass();
                                if (!category.isEditDesc) {
                                    if (!this.isShowColorMenu) {
                                        this.currentEditCategory = undefined;
                                    }
                                }
                                this.updateCategory(category);
                                category.isEditName = false;
                            }
                        }
                    }
                } else {
                    if (category.isEditName) {
                        this.updateCategory(category);
                    }
                    category.isEditName = false;
                }
            }
        } else if (mode === 'desc') {
            if (this.currentEditCategory) {
                if (this.currentEditCategory.code === category.code) {
                    if (category.isEditDesc) {
                        if (category.isFirstEditDesc) {
                            category.isFirstEditDesc = false;
                        } else {
                            if (!category.isEditName) {
                                if (!this.isShowColorMenu) {
                                    this.currentEditCategory = undefined;
                                }
                            }
                            this.updateCategory(category);
                            category.isEditDesc = false;
                        }
                    }
                } else {
                    if (category.isEditDesc) {
                        this.updateCategory(category);
                    }
                    category.isEditDesc = false;
                }
            }
        } else if (mode === 'colorMenu') {
            if (this.isFirstColor) {
                this.isFirstColor = false;
            } else {
                this.isShowColorMenu = false;
            }
        }
    }

    showColorMenu(ev: any, category: any) {
        ev.preventDefault();    //무조건 있어야 됨..
        // const isRollBack = true;

        if (this.currentEditCategory) {
            let isPass = this._isPassEdit(this.currentEditCategory, true, this._isRollBack);

            if (!isPass) {
                if (this._isRollBack) {
                    this._removeErrorClass();
                } else {
                    this.currentEditCategory.isEditName = true;
                    this._setFocusInput();
                    event.stopPropagation();
                    return;
                }
            } else {
                this._removeErrorClass();
            }
        }

        this.isFirstColor = true;
        this.currentEditCategory = category;

        // setTimeout(() => {
        this.colorMenuEl.nativeElement.style.left = (ev.target.offsetLeft - (this._popupWidth / 2) - 8) + 'px';
        // this.colorMenu.nativeElement.style.top = (ev.target.offsetTop - this._popupHeight - 38) + 'px';
        // this.colorMenu.nativeElement.style.left = (ev.clientX - (this._popupWidth) - 8) + 'px';
        this.colorMenuEl.nativeElement.style.top = (ev.clientY - this._popupHeight - 125) + 'px';
        // }, 100);
        this.isShowColorMenu = true;
        // this.colorMenu
    }

    choiceColor(ev: any, color: any) {
        let colorProp = undefined;
        if (this.currentEditCategory.codeProperties && this.currentEditCategory.codeProperties.length > 0) {
            colorProp = this.currentEditCategory.codeProperties.find((item: any) => {
                return item.propertyName === 'COLOR';
            });

            if (colorProp) {
                colorProp.propertyValue = color;
            } else {
                colorProp = {
                    'propertyName': 'COLOR',
                    'propertyValue': color
                };
            }
        } else {
            //없다면, 생성시켜주기..
            const newColorProp = {
                'propertyName': 'COLOR',
                'propertyValue': color
            };

            this.currentEditCategory.codeProperties.push(newColorProp);
        }

        this.updateCategory(this.currentEditCategory, true);
        this.offClick('colorMenu');
    }

    selectedColor(colorCode: string): string {
        if (!this.isShowColorMenu) return '';
        if (!this.currentEditCategory) return '';

        let colorProp = undefined;
        let returnClass = '';
        if (this.currentEditCategory.codeProperties && this.currentEditCategory.codeProperties.length > 0) {
            colorProp = this.currentEditCategory.codeProperties.find((item: any) => {
                return item.propertyName === 'COLOR';
            });
        }

        if (colorProp) {
            if (colorProp.propertyValue === colorCode) {
                returnClass = 'selected';
            }
        }

        return returnClass;
    }

    // setSelectColor(color: any) {
    //     //set css
    //     $(this.el.nativeElement).find('.category-color').removeClass('selected');
    //     $(ev.target).addClass('selected');
    // }

    getCategoryColor(category): any {
        let styles = {
            'background-color': '#FFFFFF'
        };
        let colorProp = undefined;
        if (category.codeProperties && category.codeProperties.length > 0) {
            colorProp = category.codeProperties.find((item: any) => {
                return item.propertyName === 'COLOR';
            });
        }

        if (colorProp) {
            styles['background-color'] = colorProp.propertyValue;
        } else {
            styles['border'] = '1px solid black';
        }

        return styles;
    }

    importCategories() {
        event.stopPropagation();
        // const isRollBack = true;

        let isPass = true;
        if (this.currentEditCategory) {
            isPass = this._isPassEdit(this.currentEditCategory, true, this._isRollBack);

            if (isPass) {
                this._removeErrorClass();
                this.currentEditCategory.isEditName = false;
            } else {
                if (this._isRollBack) {
                    this._removeErrorClass();
                    this.currentEditCategory.isEditName = false;
                } else {
                    this.currentEditCategory.isEditName = true;
                    this._setFocusInput();
                    return;
                }
            }
        }

        this.openImportModal();
    }

    private openImportModal() {
        this.modalAction.showConfiguration({
            module: ImportModalModule,
            info: {
                title: 'Import',
                // selectedData: data,
                // moduleIds: moduleIds
                // datas: this.datas
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._resetCheckBoxs();
                this.getParameterCategories();
            }
        });
    }

    private _setFocusInput() {
        setTimeout(() => {
            if (this._currentEditNameEl) {
                const parentEl = this._currentEditNameEl.parentElement;
                $(parentEl).addClass('has-error');
                $(this._currentEditNameEl).find(':input').focus();
            }
        });
    }

    private _removeErrorClass() {
        setTimeout(() => {
            if (this._currentEditNameEl) {
                const parentEl = this._currentEditNameEl.parentElement;
                $(parentEl).removeClass('has-error');
                $(this._currentEditNameEl).find(':input').removeClass('has-error');
            }
        });
    }

    // currentPageClass(idx: number) {
    //     if (idx === this.currentPageViewIdx) {
    //         return 'selected';
    //     } else {
    //         return '';
    //     }
    // }

    // selectViewPage(idx: number) {
    //     this._initSelect();
    //     this.currentPageViewIdx = idx;
    // };

    // firstPage() {
    //     this.currentPageViewIdx = 0;
    //     this._initSelect();
    // }

    // lastPage() {
    //     this.currentPageViewIdx = this.pageViewList.length - 1;
    //     this._initSelect();
    // }

    // prevPage() {
    //     this._initSelect();
    //     if (this.currentPageViewIdx === 0) return;
    //     this.currentPageViewIdx--;
    // }

    // nextPage() {
    //     this._initSelect();
    //     if (this.currentPageViewIdx === this.pageViewList.length - 1) return;
    //     this.currentPageViewIdx++;
    // }

    // _initSelect() {
    //     // setTimeout(() => {
    //         this.toggleAllSelect(true);
    //     // }, 100);
    //     // setTimeout(() => {
    //     //     this.isMainSelected = false;
    //     //     this.selectedItems = [];
    //     // }, 100);
    // }

    // isFirstPage() {
    //     if (this.currentPageViewIdx === 0) {
    //         return 'disabled';
    //     } else {
    //         return '';
    //     }
    // }

    // isLastPage() {
    //     if (this.currentPageViewIdx === this.pageViewList.length - 1) {
    //         return 'disabled';
    //     } else {
    //         return '';
    //     }
    // }

    private _isPassEdit(category: any, isNotify: boolean = true, isRollBack: boolean = false) {
        const isMatchName = category.name.toLowerCase().indexOf('uncategorized') > -1;
        const isDuplicateName = this.isDuplicate('name', category);
        const maxLength = 32;
        // http://regexr.com/
        const namePattern: RegExp = /[₩~!@#$%<>^&*+=\\\'|`?/,."\[\]\{\}:;\-()]/gi;
        let isPass = true;
        let retErrorType: any;
        let msgParam = {};

        if (namePattern.test(category.name)) {
            isPass = false;
            retErrorType = 'MESSAGE.APP_CONFIG.CATEGORY.CANNOT_SPECIAL_CHARACTORS';
        }
        if (category.name === '') {
            isPass = false;
            retErrorType = 'MESSAGE.APP_CONFIG.CATEGORY.INPUT_NAME';
        }

        let stringByteLength = ((s, b?, i?, c?) => {
            for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
            return b;
        });
        const currentStringByteLength = stringByteLength(category.name);
        if (currentStringByteLength > maxLength) {
            isPass = false;
            retErrorType = 'MESSAGE.APP_CONFIG.CATEGORY.INPUT_NAME';
            // msgParam = {
            //     size: 32
            // };
            category.name = '';
        }
        if (isDuplicateName) {
            isPass = false;
            retErrorType = 'MESSAGE.APP_CONFIG.CATEGORY.DUPLICATE_NAME';
        }
        if (isMatchName) {
            isPass = false;
            retErrorType = 'MESSAGE.APP_CONFIG.CATEGORY.CANNOT_SPECIAL_UNCATEGORIZED';
        }

        if (!isPass) {
            if (isNotify) this.notify.error(retErrorType, msgParam);
            if (isRollBack) category.name = this._oriData.find((item) => item.code === category.code).name;
        }

        if (isRollBack) {
            this.changeMode.emit({
                isEditMode: !isRollBack
            });
        } else {
            this.changeMode.emit({
                isEditMode: !isPass
            });
        }
        return isPass;
    }

    private _resetCheckBoxs() {
        this.isMainSelected = false;                //category header 의 checkbox check 해제.
        this.toggleAllSelect(this.isMainSelected);  //하위 checkbox check 해제
    }
}
