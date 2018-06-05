import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

import {
    ModalModel,
    ModalApplier,
    UserModelService,
    FdcModelService,
    AppModelService
} from '../../../../../../common';
import { ModalDirective } from '../../../../../../sdk';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcFilter from 'wijmo/wijmo.grid.filter';
import { NotifyService } from '../../../../../../sdk/popup/notify/notify.service';

@Component({
    moduleId: module.id,
    selector: 'fdta-config-modal',
    templateUrl: 'fdta-config-modal.html',
})
export class FdtaConfigModalComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: ModalDirective;
    @ViewChild('WijmoOptionGridInstance') optionGridInstance: wjcGrid.FlexGrid;

    info: any;
    configData: any;
    requester: any;
    isGetData: boolean;
    algorithmGridData: wjcCore.CollectionView = null;
    configOptionList = { //option modify...
        compareLotYN: false,
        compareWaferYN: false,
        waferCount: 10,
        productYN: false,
        recipeYN: false,
        alarmExcludeYN: false,
        maximumTime: 3,
        controlThreshold: 0.8,
        specThreshold: 0.8,
        operationYN: false,
        rsd05YN: false,
        rsd06YN: false,
        moduleId: '',
        mailYN: false,
        notifycationYN: false
    };
    gridInfo: any;
    userConfig: any;
    modifyAlgoList: any;
    _selectedModuleIds: any;
    _modifyFdtaConfigs: any;

    specValidation = true;
    controlValidation = true;
    errorMessage = '';

    codeConfig: any;


    constructor(
        private element: ElementRef,
        private cdf: ChangeDetectorRef,
        private userService: UserModelService,
        private fdcModel: FdcModelService,
        private notify: NotifyService,
        private appModel: AppModelService,
    ) { }

    ngOnInit() {
        this.modal.show();
    }

    setAction(action: ModalModel) {
        this.info = action.info;
        this.requester = action.requester;
        this.userConfig = action.info.userConfig;
        this.codeConfig = action.info.codeConfig;
        this.gridInfo = action.info.gridInfo;
        this._modifyFdtaConfigs = action.info.modifyConfigs;
        this._selectedModuleIds = action.info.selectedModuleIds;

        setTimeout(() => {
            this.setModalInfo();
        }, 500);
    }

    _algoGridSetting(modifyAlgoList: any) {
        let gridData = [];
        modifyAlgoList.map((item) => {
            gridData.push({
                category: item.category,
                option: item.option,
                value: item.value,
                defaultValue: item.defaultValue
            });
        });

        this.algorithmGridData = new wjcCore.CollectionView(gridData);
        this.requester._info.gridData = this.algorithmGridData;
        // this.optionGridInstance.itemsSource = this.algorithmGridData;
        let optionGrid: any = this.optionGridInstance;
        optionGrid.formatItem.addHandler((s, e) => {
            if (e.cell.className.indexOf('wj-header') > -1) {
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';

                wjcCore.setCss(e.cell, {
                    display: 'table',
                    tableLayout: 'fixed'
                });
                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                });
            }
        });

        let filter = new wjcFilter.FlexGridFilter(this.optionGridInstance);
        filter.filterColumns = ['category', 'option'];
    }

    cellEdit(e: any) {
        let flex = this.optionGridInstance;
        // let oldVal = flex.getCellData(e.row, e.col, false);
        let newVal = flex.activeEditor.value;
        this.algorithmGridData.items[e.row].value = newVal;
    }

    setModalInfo() {
        let index, requestData = { moduleIds: [] }, users, codes;

        this.fdcModel
            .getPrioriityCodes()
            .subscribe(
            (data) => {
                // this.codeData = data;
                codes = {
                    key: 'code',
                    initValue: data,
                    setItem: undefined,
                    title: '',
                    selectedValue: [],
                    idField: 'codeId',
                    labelField: 'name',
                    isMultiple: true,
                    isShowSelectedList: false
                };

                this.userService.getUsers().subscribe((list) => {
                    users = {
                        key: 'user',
                        initValue: list,
                        setItem: undefined,
                        title: '',
                        selectedValue: [],
                        idField: 'userId',
                        labelField: 'name',
                        isMultiple: true,
                        isShowSelectedList: true
                    };

                    if (this._selectedModuleIds.length === 1) {
                        index = _.findLastIndex(this._modifyFdtaConfigs, { moduleId: this._selectedModuleIds[0] });
                        if (index !== -1) {
                            this.modifyAlgoList = Object.assign([], this._modifyFdtaConfigs[index].algoOptions);
                            this._algoGridSetting(this.modifyAlgoList);
                            codes.selectedValue = Object.assign([], this._modifyFdtaConfigs[index].alarmCodes) || [];
                            users.selectedValue = Object.assign([], this._modifyFdtaConfigs[index].alarmUsers);
                            this.userConfig = users;
                            this.codeConfig = codes;
                            this._setConfigOption(this._modifyFdtaConfigs[index]);
                            this.isGetData = true;
                        }
                    }

                    if (!this.isGetData) {
                        requestData.moduleIds = this._selectedModuleIds;
                        this.fdcModel
                            .getfdtaOptionList(requestData)
                            .then((response) => {
                                let data = Object.assign({}, response);
                                this.modifyAlgoList = data.algoOptions;
                                this._algoGridSetting(this.modifyAlgoList);
                                codes.selectedValue = data.alarmCodes || [];
                                users.selectedValue = data.alarmUsers;
                                this.userConfig = users;
                                this.codeConfig = codes;
                                this._setConfigOption(data);
                                this.isGetData = true;
                            }, (err: any) => {
                                this.notify.error('MESSAGE.GENERAL.ERROR');
                                console.error('fdTaconfigOptionList exception: ', err);
                            });
                    }
                });
            });

    }

    _setConfigOption(item) {
        _.mapObject(this.configOptionList, (value, key) => {
            if (_.has(item, key)) {
                this.configOptionList[key] = item[key];
                this.requester._info.optionList = this.configOptionList;
            }
        });
    }

    userSelect(selectItem) {
        this.userConfig.selectedValue = selectItem.item;
        this.requester._info.userConfig.selectedValue = selectItem.item;
    }

    codeSelect(selectItem) {
        this.codeConfig.selectedValue = selectItem.item;
        this.requester._info.codeConfig.selectedValue = selectItem.item;
    }

    // text box validation
    waferNumber() {
        if (this.configOptionList.waferCount) {
            this.configOptionList.waferCount = this.numberCheck(this.configOptionList.waferCount);
            this.cdf.detectChanges();
        }
    }

    maximumTimeNumber() {
        if (this.configOptionList.maximumTime) {
            this.configOptionList.maximumTime = this.numberCheck(this.configOptionList.maximumTime);
            this.cdf.detectChanges();
        }
    }

    numberCheck(temp) {
        let result = parseInt(temp.toString().replace(/[^0-9]/g, ''));
        return isNaN(result) ? 0 : result;
    }

    controlLimit() {
        let temp: any = this.configOptionList.controlThreshold.toString();
        if (isNaN(parseFloat(temp))) {
            this.controlValidation = false;
            this.errorMessage = 'Please input number';
            return;
        } else {
            this.configOptionList.controlThreshold = temp.replace(/[^\.0-9]/g, '');

            if (parseFloat(temp) < 0 || parseFloat(temp) > 1) {
                this.controlValidation = false;
                this.errorMessage = 'Please enter value between 0 and 1';
                return;
            } else if (parseFloat(temp) > this.configOptionList.specThreshold) {
                this.controlValidation = false;
                this.errorMessage = 'Please let Control Limit less value than Spec Limit';
                return;
            }
        }

        this.controlValidation = true;
        this.spceLimit();
    }

    spceLimit() {
        let temp: any = this.configOptionList.specThreshold.toString();
        if (isNaN(parseFloat(temp))) {
            this.specValidation = false;
            this.errorMessage = 'Please input number';
            return;
        } else {
            this.configOptionList.specThreshold = temp.replace(/[^\.0-9]/g, '');

            if (parseFloat(temp) < 0 || parseFloat(temp) > 1) {
                this.specValidation = false;
                this.errorMessage = 'Please enter value between 0 and 1';
                return;
            } else if (this.configOptionList.controlThreshold > parseFloat(temp)) {
                this.specValidation = false;
                this.errorMessage = 'Please let Control Limit less value than Spec Limit';
                return;
            }
        }

        this.specValidation = true;
        this.controlLimit();
    }

    floatChange(type, data) {
        data = parseFloat(data.toString());
        if (type === 'sl') {
            this.configOptionList.specThreshold = isNaN(data) ? '' : data;
        } else {
            this.configOptionList.controlThreshold = isNaN(data) ? '' : data;
        }

        this.cdf.detectChanges();
    }

    ok() {
        this.requester.execute();
        this.requester.destroy();
    }

    cancel() {
        this.requester.cancel();
        this.requester.destroy();
    }

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }

        $(this.element.nativeElement).remove();
    }
}
