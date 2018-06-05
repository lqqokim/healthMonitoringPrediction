import {
    Component, OnInit, OnDestroy, Input, Output,
    OnChanges, SimpleChanges, EventEmitter,
    forwardRef, ElementRef, ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { MultiSelectorConfigType } from '../multi-selector/config/multi-selector.type';
import { SelectorGroupService } from './selector-group.service';

@Component({
    moduleId: module.id,
    selector: 'a3s-selector-group',
    templateUrl: 'selector-group.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectorGroupComponent), multi: true }
    ],
    encapsulation: ViewEncapsulation.None,
})
export class SelectorGroupComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

    @Input() config: any;
    @Input() outsideClassToClose: string;
    @Output() selectedItem: EventEmitter<any> = new EventEmitter();

    configModel: MultiSelectorConfigType;
    configEquipment: MultiSelectorConfigType;
    configExcludeParams: MultiSelectorConfigType;

    private _locations: any = [];
    private _addCnt: number = 0;
    private _parentId: any;
    private _currentLocationId = -1;
    private _beforeLocationId = -1;

    selectedToolModel = [{ toolModelId: -1, name: 'ALL' }];
    selectedTools = [];
    selectedExcludeParams = [];
    private _selectedTools = [];
    private _selectedExcludeParams = [];
    private _allToolModel = [{ toolModelId: -1, name: 'ALL' }];
    private _toolModels = this._allToolModel;
    private _tools = [];
    private _excludeParams = [];
    private _isInit: boolean = false;
    private _isLocationLoaded: boolean = false;

    private _changedCurrentIdSubscription: Subscription;
    private _changedCurrentIdObserver = new Subject<any>();
    private _changedCurrentIdObservable$ = this._changedCurrentIdObserver.asObservable();

    // for ControlValueAccessor
    propagateChange: any = () => { };

    constructor(
        private element: ElementRef,
        private selectorGroup: SelectorGroupService) { }

    ngOnInit() {
        this._initMultiSelector();
    }

    ngOnChanges(changes: SimpleChanges) { }

    /**
     * implement ControlValueAccessor interface
     */
    writeValue(value: any) {
        if (value) {
            console.log('---writeValue:', value);
        }
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() { }

    _propagateChangeValue(location: any, multi: any) {
        let event: any = {};
        if (location) {
            event[CD.LOCATION] = location;

            if (this.config.isToolModelEnable
                || this.config.isToolsEnable
                || this.config.isExcludeParamsEnable) {
                const selectedMulti = this._getSelectedMultiSelector();
                event[CD.TOOL_MODEL] = selectedMulti[CD.TOOL_MODEL];
                event[CD.TOOLS] = selectedMulti[CD.TOOLS];
                event[CD.EXCLUDE_PARAMETERS] = selectedMulti[CD.EXCLUDE_PARAMETERS];
            }
        }

        if (multi) {
            event[CD.LOCATION] = this._getSelectedLocations();
            event[CD.TOOL_MODEL] = multi[CD.TOOL_MODEL];
            event[CD.TOOLS] = multi[CD.TOOLS];
            event[CD.EXCLUDE_PARAMETERS] = multi[CD.EXCLUDE_PARAMETERS];
        }

        // Propagate Form value
        if (this.propagateChange) {
            // transformItem이 등록되어 있다면 변환한 값을 준다.
            this.propagateChange(this._transformItem(event));
        }

        // EventEmitter internal
        if (this.selectedItem) {
            this.selectedItem.emit(this._emitEvent(this._transformItem(event)));
        }
    }

    _transformItem(event) {
        if (!this.config.transformItem) {
            return event;
        }

        return this.config.transformItem(event);
    }

    _emitEvent(data) {
        return {
            key: this.config.key,
            item: data
        };
    }

    //-------------------------------------------------------------------
    //---------------------------- Location -----------------------------
    //-------------------------------------------------------------------
    registerLocation({ location }) {
        this._locations.push(location);

        //하위 등록시에 선택된 정보가 있다면 해당 정보로 셋팅해준다.
        const selectedObj = (this.config.selectedValue[CD.LOCATION] ? this.config.selectedValue[CD.LOCATION][this._addCnt] : null);
        const selectedId = (selectedObj ? selectedObj.locationId : null);
        //첫 레벨은 parentId를 null로 넘긴다.
        if (location.locationType.locationLevel === 0) {
            location.setLocationData(this._parentId, selectedId);
        }
        this._parentId = selectedId;
        this._addCnt++;
    }

    changedLocation({ locationType, selectedId, isLoad }) {
        const targetLevel = locationType.locationLevel + 1;
        if (selectedId === -1) {
            //ALL을 선택 했으므로 다음 레벨 하위는 다 disable
            for (let i = targetLevel; i < this._locations.length; i++) {
                this._locations[i].disable();
            }
        }
        else {
            if (targetLevel < this._locations.length) {
                //데이터 호출을 위한 하위 리스트 call  
                //하위 등록시에 선택된 정보가 있다면 해당 정보로 셋팅해준다.
                let loadLocationId = null;
                if (isLoad) {
                    //configuration load 면 configuration 에서 정보를 가져와 넘긴다
                    const selectedObj = (this.config.selectedValue[CD.LOCATION] ?
                                            this.config.selectedValue[CD.LOCATION][targetLevel] : null);
                    //loadLocationId : configuration 에 저장된 id
                    loadLocationId = (selectedObj ? selectedObj.locationId : null);

                    //최하위 레벨까지 선택되어야 하므로 마지막 레벨 즉 area까지 오면 id를 반영한다.
                    this._currentLocationId = selectedObj.locationId;
                    this._changedCurrentIdObserver.next(this._currentLocationId);
                }
                this._locations[targetLevel].setLocationData(selectedId, loadLocationId);//selectedId : 이전에 선택된 아이디
                // this._isLocationLoaded = false;
            } else {
                // 초기화
                if (isLoad) {
                    this._setProperties()
                        .then(() => {
                            this._changeFirstLevel(true)
                                .then(() => {
                                    this._initMultiSelectorConfig();
                                    this._isInit = true;
                                });
                        });
                }
            }
        }

        if (!isLoad) {//단순히 로딩시에는 properties에 반영하지 않는다
            this._applyConfiguration(selectedId);
            this._isLocationLoaded = true;
        }
    }

    _applyConfiguration(selectedId: number) {
        //선택할 때 마다 widget properties location 에 반영한다.
        let tempLocations = [],
            sendCurrentLocationId = -1,
            sendCurrentLocationType = null;//하위로 보낼 id

        //첫번째 선택이 ALL이면 초기화 상태이므로 셋팅할 필요 없다.
        tempLocations = this._getSelectedLocations();

        this._propagateChangeValue(tempLocations, undefined);

        //하위 선택시 locationId 를 반영한다.
        for (let i = 0; i < tempLocations.length; i++) {
            if (tempLocations[i].locationId) {
                sendCurrentLocationId = tempLocations[i].locationId;
            }
        }
        //최하위 레벨까지 선택되어야 하므로 마지막 레벨 즉 area까지 오면 id를 반영한다.
        if (tempLocations.length === this._locations.length) {
            this._currentLocationId = sendCurrentLocationId;
            this._changedCurrentIdObserver.next(this._currentLocationId);
        }
    }

    _getSelectedLocations() {
        let tempLocations = [],
            locationType = null,
            locationTypeName = '',
            locationName = this._locations[0].getSelectedName(),
            tempId = this._locations[0].getSelectedId();

        if (tempId < 0) {
            tempLocations = [];
        } else {
            for (let i = 0; i < this._locations.length; i++) {
                tempId = this._locations[i].getSelectedId();
                locationName = this._locations[i].getSelectedName();
                locationType = this._locations[i].locationType;
                locationTypeName = this.config.conditionConstant[locationType.name.toUpperCase()];
                if (locationTypeName === null || locationTypeName === undefined) {
                    locationTypeName = locationType.name.toLowerCase();
                }
                if (tempId > -1) {
                    tempLocations.push({
                        locationTypeName: locationTypeName,
                        locationLevel: locationType.locationLevel,
                        locationTypeId: locationType.locationTypeId,
                        locationId: tempId,
                        locationName: locationName
                    });
                }
                //$scope.a3pLocationSelectorGroup.widget.properties[locationType.name] = tempId;
            }
        }

        return tempLocations;
    }


    //-------------------------------------------------------------------
    //---------------------------- Tool Model ---------------------------
    //-------------------------------------------------------------------
    _initMultiSelector() {
        if (this.config.isToolModelEnable
            || this.config.isToolsEnable
            || this.config.isExcludeParamsEnable) {

            this._subscribeMultiSelector();
        }
    }

    _subscribeMultiSelector() {
        this._changedCurrentIdSubscription = this._changedCurrentIdObservable$.subscribe((changedLocationId: number) => {
            if (!changedLocationId || changedLocationId <= 0 || this._beforeLocationId === changedLocationId) {
                return;
            }
            this._beforeLocationId = changedLocationId;

            // if (this._isInit && this._isLocationLoaded) {
            if (this._isInit) {
                this._changeFirstLevel();
            }
        });
    }

    _setProperties(): Promise<any> {
        if (this._currentLocationId <= 0) {
            let sendCurrentLocationId = null,
                locations = this.config.selectedValue[CD.LOCATION];
            if (locations && locations.length > 0) {
                this._currentLocationId = locations[locations.length - 1].locationId;
            }
        }

        this.selectedToolModel = this.config.selectedValue[CD.TOOL_MODEL] === ''
            || this.config.selectedValue[CD.TOOL_MODEL] === undefined ?
            [{ toolModelId: -1, name: 'ALL' }] : [this.config.selectedValue[CD.TOOL_MODEL]];

        this.selectedTools = this.config.selectedValue[CD.TOOLS] === ''
            || this.config.selectedValue[CD.TOOLS] === undefined ?
            [] : this.config.selectedValue[CD.TOOLS];
        this._selectedTools = _.map(this.selectedTools, _.iteratee('toolId'));

        return this._getExcludeParams()
            .then(() => {
                if (this.config.selectedValue[CD.EXCLUDE_PARAMETERS]) {
                    const ids = _.pluck(this.config.selectedValue[CD.EXCLUDE_PARAMETERS], 'id');
                    this._excludeParams.forEach((param) => {
                        if (ids.indexOf(param.id) > -1) {
                            this.selectedExcludeParams.push(param.id);
                        }
                    });
                    this._refreshExcludeParamsConfig();
                }
            });
    }

    _getExcludeParams(isInit?: boolean) {
        var requestBody = {
            eqpIdsFilter: {
                locationId: this._currentLocationId,
                toolModelId: this.selectedToolModel[0].toolModelId === -1 ? null : this.selectedToolModel[0].toolModelId,
                toolModelVerId: null,
                toolIds: this._selectedTools
            }
        }

        return this.selectorGroup
            .getParameters(requestBody)
            .then((response) => {
                this._excludeParams = response.map(function (param) {
                    return {
                        id: param,
                        label: param
                    }
                });
                if (!isInit) {
                    this._refreshExcludeParamsConfig();
                }
            });
    }

    _changeFirstLevel(isInit?: boolean): Promise<any> {

        if (!isInit) {
            this._selectedTools = [];
            this.selectedTools = [];
            this.selectedToolModel = [{ toolModelId: -1, name: 'ALL' }];
            this.selectedExcludeParams = [];
        }

        // this._isInit = false;
        return this._getToolModel(isInit)
            .then(() => {
                return this._getTools(isInit)
            })
            .then(() => {
                return this._getExcludeParams(isInit).then(() => {
                    return this._applyConfigurationMultiSelector(isInit);
                })
            });
    }

    _getToolModel(isInit?: boolean): Promise<any> {
        return this.selectorGroup
            .getToolModel(this._currentLocationId)
            .then((response) => {
                this._toolModels = _.union(this._allToolModel, response);
                if (!isInit) {
                    this._refreshToolModels();
                }
            }, (err) => {
                console.log('getToolModel exception: ', err);
            });
    }

    _getTools(isInit?: boolean): Promise<any> {
        if (this.selectedToolModel[0].toolModelId === -1) {
            return this.selectorGroup
                .getToolsByLocationId(this._currentLocationId)
                .then((response) => {
                    this._tools = response;
                    if (!isInit) {
                        this._refreshToolConfig();
                    }
                }, (err) => {
                    console.log('getToolsByLocationId exception: ', err);
                });
        } else {
            return this.selectorGroup
                .getToolsByModelId(this.selectedToolModel[0].toolModelId, this._currentLocationId)
                .then((response) => {
                    this._tools = response;
                    if (!isInit) {
                        this._refreshToolConfig();
                    }
                }, (err) => {
                    console.log('getToolsByModelId exception: ', err);
                });
        }
    }

    _applyConfigurationMultiSelector(isInit?: boolean) {
        if (isInit) { return; }
        this._propagateChangeValue(undefined, this._getSelectedMultiSelector());
    }

    _getSelectedMultiSelector() {
        let index, model: any;

        if (this.selectedToolModel[0].toolModelId !== -1) {
            index = _.findLastIndex(this._toolModels, { toolModelId: this.selectedToolModel[0].toolModelId });
            model = this._toolModels[index];
        }

        return {
            [CD.TOOL_MODEL]: model,
            [CD.TOOLS]: this.selectedTools,
            [CD.EXCLUDE_PARAMETERS]: this.selectedExcludeParams
        };

    }

    changedToolModel(selectedItem) {
        if (!_.isArray(selectedItem)) {
            this.selectedToolModel = [selectedItem.item];
        } else {
            this.selectedToolModel = selectedItem.item;
        }

        if (selectedItem && !selectedItem.isRead) {
            this._selectedTools = [];
            this.selectedTools = [];
            this._selectedExcludeParams = [];
            this.selectedExcludeParams = [];

            this._getTools()
                .then(() => {
                    return this._getExcludeParams().then(() => {
                        this._refreshToolConfig();
                        this._refreshExcludeParamsConfig();
                        this._applyConfigurationMultiSelector();
                    });
                });
        }
    }

    changedTools(selectedItems) {
        this.selectedTools = selectedItems.item;

        if (selectedItems && !selectedItems.isRead) {
            this._selectedTools = [];
            this._selectedExcludeParams = [];
            this.selectedExcludeParams = [];

            this._tools.forEach((item) => {
                const toolIds = _.pluck(selectedItems.item, 'toolId');
                if (toolIds.indexOf(item.toolId) !== -1) {
                    this._selectedTools.push(item.toolId);
                }
            });

            this._getExcludeParams()
                .then(() => {
                    this._refreshExcludeParamsConfig();
                    this._applyConfigurationMultiSelector();
                });
        }
    }

    changedExcludeParams(selectedItems) {
        this.selectedExcludeParams = selectedItems.item;

        if (selectedItems && !selectedItems.isRead) {
            this._applyConfigurationMultiSelector();
        }
    }

    _initMultiSelectorConfig() {
        if (this.config.isToolModelEnable) {
            this._refreshToolModels();
        }

        if (this.config.isToolsEnable) {
            this._refreshToolConfig();
        }

        if (this.config.isExcludeParamsEnable) {
            this._refreshExcludeParamsConfig();
        }
    }

    _refreshToolModels() {
        this.configModel = {
            key: 'model',
            initValue: this._toolModels,
            setItem: undefined,
            title: 'Model',
            selectedValue: this.selectedToolModel,
            idField: 'toolModelId',
            labelField: 'name',
            isMultiple: false,
            isShowSelectedList: false,
        };
    }

    _refreshToolConfig() {
        this.configEquipment = {
            key: 'equipment',
            initValue: this._tools,
            setItem: undefined,
            title: 'Equipment',
            selectedValue: this.selectedTools,
            idField: 'toolId',
            labelField: 'alias',
            isMultiple: true,
            isShowSelectedList: true,
        }
    }

    _refreshExcludeParamsConfig() {
        this.configExcludeParams = {
            key: 'exludeparams',
            initValue: this._excludeParams,
            setItem: undefined,
            title: 'Exclude parameters',
            selectedValue: this.selectedExcludeParams,
            idField: 'id',
            labelField: 'label',
            isMultiple: true,
            isShowSelectedList: true,
        }
    }

    ngOnDestroy() {
        $(this.element.nativeElement).remove();

        if (this._changedCurrentIdSubscription) {
            this._changedCurrentIdSubscription.unsubscribe();
        }
    }
}
