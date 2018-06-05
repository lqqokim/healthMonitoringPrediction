import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UUIDUtil } from '../../utils/uuid.util';
import { MultiSelectorConfigType } from './config/multi-selector.type';
import { MatchNamePipe } from '../../pipes/match-name.pipe';

/**
 * Multi-Selector
 */
@Component({
    moduleId: module.id,
    selector: 'a3s-multi-selector',
    templateUrl: 'multi-selector.html',
    providers: [
        MatchNamePipe,
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiSelectorComponent), multi: true }
    ],
    encapsulation: ViewEncapsulation.None
})
export class MultiSelectorComponent implements OnChanges, OnDestroy, ControlValueAccessor {

    @Input() config: MultiSelectorConfigType;
    @Input() isDisabled: boolean = false;
    @Input() isNotDynamic: boolean = false;
    @Input() outsideClassToClose: string;
    @Input() isDropUp: boolean = false;
    @Input() rowCount: number = 10;
    @Output() outsideClick: EventEmitter<any> = new EventEmitter();
    @Output() selectedItem: EventEmitter<any> = new EventEmitter();
    @Output() removedItems: EventEmitter<any> = new EventEmitter();

    @ViewChild('searchTextInput') searchTextInput: ElementRef;

    isDisabledForThisComponent: boolean = false;
    originList: any = []; //original data
    filterList: any = []; //filter 된 list
    selectText: string = 'Select';//선택내용을 표시할 text
    isLoading: boolean = true;
    isOpen: boolean = false;
    searchText: string;
    selectedItems: any = [];
    isLoad: boolean = false;
    isAllChecked: boolean = false;
    multiSelectorId: string;
    maxHeight: number = 0;

    private _isAlreadyInit: boolean;
    private _selectedIdList: any = [];
    private _selectedIdItems: any = [];
    private _tempSelectedIdItems: any = [];

    // for ControlValueAccessor
    propagateChange: any = () => { };

    constructor(private element: ElementRef, private _matchPipe: MatchNamePipe) {
        this.multiSelectorId = `multi-selector-${UUIDUtil.new()}`;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['config']) {
            this.config = (<MultiSelectorConfigType>changes['config'].currentValue);

            if (this.config && this._isAlreadyInit) {
                this._onChangeList();
            }

            if (this.config && !this._isAlreadyInit) {
                this._init();
                this._isAlreadyInit = true;
            }

            if (this.config.isDefaultAllChecked) {
                this._selectAll();
            }
        }
        if (changes['isDisabled']) {
            this.isDisabled = changes['isDisabled'].currentValue;
            this.isDisabledForThisComponent = this.isDisabled;
        }
    }


    setSelectedValue(value: any) {
        this.config.selectedValue = value;
        this._initSelectedValue();
        this._onChangeList();
        this._change();
    }

    getSelectedValue() {
        return this._getSelectedItem(this.originList, this._selectedIdItems);
    }

    _init() {
        this.isAllChecked = false;

        // set default data
        if (this.config && !this.config.idField) {
            this.config.idField = 'id';
        }

        if (this.config && !this.config.labelField) {
            this.config.labelField = 'name';
        }

        let dom: any;
        if (this.outsideClassToClose) {
            dom = jQuery(this.outsideClassToClose);
        } else {
            dom = jQuery(document);
        }

        dom.on('click', (evt: any) => {
            if (this.isOpen === false) return;
            if (!jQuery(evt.target).closest('#' + this.multiSelectorId).length) {
                this.isOpen = false;
                this.searchText = '';
                this._closeEmit();
            }
        });

        this._initData();
        this._onChangeList();
    }

    _initData() {
        this._initSelectedValue();
        this._propagateChangeValue(true);
    }

    _initSelectedValue() {
        let value = this.config.selectedValue;
        if (value && !this.config.isMultiple && !_.isArray(value)) {
            value = [value];
        }

        if (!value || (_.isArray(value) && value[0] === null) || (_.isArray(value) && value[0] === undefined)) {
            value = [];
        }
        this._selectedIdList = this._getSelectedIdList(value);
    }

    _propagateChangeValue(isInit: boolean) {
        let event: any;
        if (isInit) {
            event = this.config.selectedValue;
        } else {
            event = this._getSelectedItem(this.originList, this._selectedIdItems);
        }

        // Propagate Form value
        if (this.propagateChange && !this.isNotDynamic) {
            if (this.config.isMultiple) {
                if (_.isArray(event)) {
                    // transformItem이 등록되어 있다면 변환한 값을 준다.
                    this.propagateChange(this._transformItem(event));
                } else {
                    this.propagateChange(this._transformItem([event]));
                }
            } else {
                if (_.isArray(event) && event.length > 0) {
                    this.propagateChange(this._transformItem(event[0]));
                } else {
                    this.propagateChange(this._transformItem(event));
                }
            }
        }

        // EventEmitter internal
        if (this.selectedItem) {
            if (this.config.isMultiple) {
                if (_.isArray(event)) {
                    this.selectedItem.emit(this._emitEvent(this._transformItem(event), isInit));
                } else {
                    this.selectedItem.emit(this._emitEvent(this._transformItem([event]), isInit));
                }
            } else {
                if (_.isArray(event) && event.length > 0) {
                    this.selectedItem.emit(this._emitEvent(this._transformItem(event[0]), isInit));
                } else {
                    this.selectedItem.emit(this._emitEvent(this._transformItem(event), isInit));
                }
            }
        }
    }

    _getSelectedIdList(selectedList: any) {
        let returnList: any[] = [];
        if (selectedList && selectedList.length > 0) {
            for (let j = 0; j < selectedList.length; j++) {
                const value = selectedList[j][this.config.idField];
                if (value !== undefined) {
                    returnList.push(value);
                }
            }
        }
        /**
         * angular v1 버전에서 id 값만 있을 경우
         */
        if (returnList.length === 0) {
            returnList = selectedList;
        }
        return returnList;
    }

    _onChangeList() {
        if (!this.config || !this.config.initValue) return;
        //list 초기화시에는 모든 저장 데이터도 초기화 된다.
        this._clearData();
        if (this.config.initValue && this.config.initValue.length > 0) {
            this.originList = this.config.initValue;
            this.filterList = this.originList.slice(0);

            let selectedValue = this.config.selectedValue;
            if (!this.config.isMultiple && !_.isArray(selectedValue)) {
                selectedValue = [selectedValue];
            }
            if (!selectedValue || (_.isArray(selectedValue) && selectedValue[0] === null)
                || (_.isArray(selectedValue) && selectedValue[0] === undefined)) {
                selectedValue = [];
            }
            // id만을 추출해서 설정한다.
            this._selectedIdList = this._getSelectedIdList(selectedValue);
            if (this._selectedIdList) {//처음 로딩시 선택된 리스트가 있다면 반영해준다.
                this._tempSelectedIdItems = this._selectedIdList.slice(0);
                this._change(true);
            }
        } else {
            this.originList = [];
            this.filterList = [];
        }
        this.isDisabledForThisComponent = this.filterList.length === 0 || this.isDisabled;
        this.isLoading = false;
    }

    /**
     * implement ControlValueAccessor interface
     */
    writeValue(value: any) {
        if (value) {
        }
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() { }

    _transformItem(event) {
        if (!this.config.transformItem) {
            return event;
        }

        if (this.config.isMultiple) {
            if (_.isArray(event)) {
                event = this.config.transformItem(event);
            } else {
                event = this.config.transformItem([event]);
            }
        } else {
            if (_.isArray(event) && event.length > 0) {
                event = this.config.transformItem(event[0]);
            } else {
                event = this.config.transformItem(event);
            }
        }

        return event;
    }

    _emitEvent(data, init) {
        return {
            key: this.config.key,
            item: data,
            isRead: init
        };
    }

    /**
     * closet 에 안들어오면 multiselector를 닫아준다.
     * clickDOMtoClose
     */
    closeDropdown($event?: any) {
        if (this.isOpen === false) return;

        if ($event === undefined) {
            this.isOpen = false;
            this.searchText = '';
        }
    }

    _closeEmit() {
        let event: any = this._getSelectedItem(this.originList, this._selectedIdItems);
        if (event && this.outsideClick) {
            if (this.config.isMultiple) {
                if (_.isArray(event)) {
                    this.outsideClick.emit(this._emitEvent(this._transformItem(event), false));
                } else {
                    this.outsideClick.emit(this._emitEvent(this._transformItem([event]), false));
                }
            } else {
                if (_.isArray(event) && event.length > 0) {
                    this.outsideClick.emit(this._emitEvent(this._transformItem(event[0]), false));
                } else {
                    this.outsideClick.emit(this._emitEvent(this._transformItem(event), false));
                }
            }
        }
    }

    openDropdown(event: any) {
        if (!this.isDisabledForThisComponent) {
            this.isOpen = !this.isOpen;
            this.isDropUp = this._calcDropdownDirection(event);
            this.maxHeight = this._calcDrowdownMaxheight(event);
            this.isAllChecked = (this.filterList.length > 0 && this._selectedIdItems.length === this.filterList.length);
            if (this.isOpen && this.config.isMultiple) {
                this._focus();
            }
        }
    }

    _calcDropdownDirection(event: any) {
        const maxHeight: number = this._calcDrowdownMaxheight(event);
        const available = this._availableInfo(event);
        const isUp: boolean = available.bottom < maxHeight;
        return isUp;
    }

    _calcDrowdownMaxheight(event: any): number {
        const header: number = 78;
        const list: number = this.rowCount * 23;
        const gap: number = 10;
        const maxHeight: number = header + list + gap;
        const availableHeight: number = this._availableInfo(event).height;
        return maxHeight > availableHeight ? availableHeight : maxHeight;
    }

    _availableInfo(event: any) {
        const body = document.body;
        const target = event.target;
        const rect = target.getBoundingClientRect();
        const availableTop: number = rect.y * 0.9;
        const availableBottom: number = (body.clientHeight - rect.y - rect.height) * 0.9;
        const height: number = availableTop > availableBottom ? availableTop : availableBottom;
        return {
            height: height,
            top: availableTop,
            bottom: availableBottom
        };
    }

    _focus() {
        setTimeout(() => this.searchTextInput.nativeElement.focus(), 10);
    }

    checkedAll() {
        this.isAllChecked = !this.isAllChecked;
        if (this.isAllChecked) {
            this._selectAll();
        } else {
            this._deselectAll();
        }
    }

    removeItem(idField: any) {
        let index = _.findIndex(this.filterList, { [this.config.idField]: idField });
        if (index >= 0) {
            this._tempSelectedIdItems.splice(index, 1);
        }
        this._change();
    }

    showRemoveItem(selectedItem: any) {
        if (!this.isDisabledForThisComponent) {
            let intIndex = -1;
            this._tempSelectedIdItems.forEach((item: any, index: number) => {
                if (item === selectedItem[this.config.idField]) {
                    intIndex = index;
                }
            });
            if (intIndex >= 0) {
                this._tempSelectedIdItems.splice(intIndex, 1);
            } else {
                this._tempSelectedIdItems.push(selectedItem[this.config.idField]);
            }
            this._change();
            this._updateCheckAll();
            this.removedItems.emit({remains: this._selectedIdItems});
        }
    }

    toggleSelectItem(selectedItem: any) {
        if (this.config.isMultiple) {
            let intIndex = -1;
            this._tempSelectedIdItems.forEach((item: any, index: number) => {
                if (item === selectedItem[this.config.idField]) {
                    intIndex = index;
                }
            });
            if (intIndex >= 0) {
                this._tempSelectedIdItems.splice(intIndex, 1);
            } else {
                this._tempSelectedIdItems.push(selectedItem[this.config.idField]);
            }

            this._updateCheckAll();
        } else {
            this._tempSelectedIdItems = [];
            this._tempSelectedIdItems.push(selectedItem[this.config.idField]);
            this.closeDropdown();
        }

        this._change();
    }

    getClassName(selectedItem: any) {
        let varClassName = { visibility: 'hidden' };
        if (this.config.isMultiple) {
            this._tempSelectedIdItems.forEach((item: any, index: number) => {
                if (item === selectedItem[this.config.idField]) {
                    varClassName = { visibility: 'visible' };
                }
            });
        } else {
            if (this._tempSelectedIdItems[0] === selectedItem[this.config.idField]) {
                varClassName = { visibility: 'visible' };
            }
        }
        return (varClassName);
    }

    searchTextChange(event) {
        //console.log('searchTextChange', event)
    }

    _updateCheckAll() {
        this.isAllChecked = this._tempSelectedIdItems.length === this.filterList.length;
    }

    _selectAll() {
        this.isAllChecked = true;
        const matchIds = this._getMatchIds();
        this._tempSelectedIdItems = _.uniq(this._tempSelectedIdItems.concat(matchIds));
        this._change();
    }

    _deselectAll() {
        const matchIds = this._getMatchIds();
        this._tempSelectedIdItems = _.difference(this._tempSelectedIdItems, matchIds);
        this._change();
    }

    _disable() {
        this._clearData();
    }

    _clearData() {
        this.isAllChecked = false;
        this._selectedIdItems = [];
        this._tempSelectedIdItems = [];
        this.filterList = []; //this.filterList ? this.filterList : [];
        this.selectedItems = [];
        this.selectText = this._getSelectText();
    }

    _change(init?: any) {
        this.config.isMultiple ? this._changeMultiMode(init) : this._changeSingleMode(init);
    }

    _changeSingleMode(init?: any) {
        this._selectedIdItems = this._tempSelectedIdItems.slice(0);
        this.selectText = this._getSelectText();
        this._propagateChangeValue(init);
    }

    _changeMultiMode(init?: any) {
        const matchIds = this._getMatchIds();
        const differance = _.difference(matchIds, this._tempSelectedIdItems.slice(0));
        this._selectedIdItems = this._tempSelectedIdItems.slice(0);
        this.selectedItems = _.filter(this.originList, (d) => {
            return _.find(this._selectedIdItems, (item) => item === d[this.config.idField]) !== undefined;
        });
        this.selectText = this._getSelectText();
        this.isAllChecked = this._selectedIdItems.length > 0 && differance.length === 0;
        this.isLoad = false;
        this._propagateChangeValue(init);
    }

    _getSelectedItem(orgData: any, targetData: any) {
        let returnList: any[] = [];
        if (targetData !== null && orgData !== null) {
            for (let i = 0; i < orgData.length; i++) {
                for (let j = 0; j < targetData.length; j++) {
                    if (orgData[i][this.config.idField] === targetData[j]) {
                        returnList.push(orgData[i]);
                        break;
                    }
                }
            }
        } else {
            returnList = null;
        }
        return returnList;
    }

    _getItemLabel(id: any) {
        let returnLabel = '';
        if (this.originList) {
            for (let i = 0; i < this.originList.length; i++) {
                if (this.originList[i][this.config.idField] === id) {
                    returnLabel = this.originList[i][this.config.labelField];
                    break;
                }
            }
        }
        return returnLabel;
    }

    _getSelectText(): string {
        const multiple: boolean = this.config.isMultiple;
        const selectedValue: boolean = this.config.showSelectedValue;
        let text: string;
        if (multiple && selectedValue) {
            const values = _.pluck(this.selectedItems, this.config.labelField).join(', ');
            text = `${this._selectedIdItems.length} of ${this.filterList.length} ${values}`;
        } else if (multiple) {
            text = `${this._selectedIdItems.length} of ${this.filterList.length} Selected`;
        } else {
            text = this._getItemLabel(this._selectedIdItems[0]);
        }
        return text;
    }

    _getMatchIds() {
        const matchList = this._matchPipe.transform(this.filterList, this.config.labelField, this.searchText);
        const matchIds = matchList.length > 0 ? _.pluck(matchList, this.config.idField) : [];
        return matchIds;
    }

    ngOnDestroy() {
        $(this.element.nativeElement).remove();
    }
}
