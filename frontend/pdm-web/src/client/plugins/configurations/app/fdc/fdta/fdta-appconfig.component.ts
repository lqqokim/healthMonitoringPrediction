import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { SpinnerComponent, NotifyService, Formatter } from '../../../../../sdk';
import {
    SessionService,
    UserModelService,
    RequestType,
    ModalAction,
    ModalRequester,
    WijmoApi
} from '../../../../../common';

import { FdtaAppConigService } from './fdta-appconfig.service';
import { FdtaConfigModalModule } from './modal/fdta-config-modal.module';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcFilter from 'wijmo/wijmo.grid.filter';

@Component({
    moduleId: module.id,
    selector: 'div.fdta-appconfig',
    templateUrl: 'fdta-appconfig.html',
    styleUrls: ['fdta-appconfig.css'],
    host: {
        'class': 'relative'
    },
    encapsulation: ViewEncapsulation.None,
    providers: [FdtaAppConigService]
})
export class FdtaAppConfigComponent extends WijmoApi implements OnInit {
    @ViewChild('WijmoGridInstance') gridInstance: any;
    // @ViewChild('WijmoOptionGridInstance') optionGridInstance: any;
    @ViewChild('fdtaSpinner') fdtaSpinner: SpinnerComponent;

    private _selectedModuleIds: any = []; // selected moduleIds on config list
    private _modifyFdtaConfigs = []; // modified fdtaconfig list
    private _userId: string;

    // tslint:disable-next-line:member-ordering
    gridInfo = {
        totalCount: 0,
        selectedCount: 0,
        modifiedCount: 0
    };
    configGridData: wjcCore.CollectionView = null;
    selectAll: boolean = false;

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

    userConfig: any = {}; //MultiSelectorConfigType
    codeConfig: any = {}; //MultiSelectorConfigType

    specValidation = true;
    controlValidation = true;
    errorMessage = '';
    modifyAlgoList: any;

    constructor(
        private fdtaConfig: FdtaAppConigService,
        private notify: NotifyService,
        private session: SessionService,
        private userService: UserModelService,
        private cdf: ChangeDetectorRef,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
    ) {
        super();
    }

    ngOnInit() {
        this.fdtaSpinner.showSpinner();
        this._setConfigListData();

        this._userId = this.session.getUserId();
    }

    saveConfigList() {
        this.fdtaSpinner.showSpinner();
        let timeStamp = +moment();//moment().valueOf(); : Unix Timestamp (milliseconds)

        this._modifyFdtaConfigs.map((data) => {
            data.lastUpdateDtts = timeStamp;
        });

        let requestData = { fdtaConfigs: this._modifyFdtaConfigs };

        this.fdtaConfig
            .savefdtaOption(requestData)
            .then((response) => {
                if (response.status === 'OK') {
                    this._clearConfigValue();
                    this._setConfigListData();

                    this.notify.success('MESSAGE.APP_CONFIG.FDTA.SAVE_SUCCESS');
                    this.fdtaSpinner.hideSpinner();
                } else {
                    // notify.error(response.msg, undefined);
                    this.notify.error('MESSAGE.GENERAL.ERROR');
                    console.error('savefdtaOption exception: ', response.msg);
                    this.fdtaSpinner.hideSpinner();
                }
            }, (err) => {
                // notify.error(err.data.message, undefined);
                this.notify.error(err);
                console.error('savefdtaOption exception: ', err);
                this.fdtaSpinner.hideSpinner();
            });
    }

    cancelConfigList() {
        // this.notify.success('clear');
        this._clearConfigValue();
    }

    showModal() {
        //showConfiguration
        this.modalAction.showConfiguration({
            module: FdtaConfigModalModule,
            info: {
                userConfig: this.userConfig,
                codeConfig: this.codeConfig,
                gridInfo: this.gridInfo,
                modifyConfigs: this._modifyFdtaConfigs,
                selectedModuleIds: this._selectedModuleIds
            },
            requester: this.modalRequester
        });

        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                console.log('show dfd config ok', response.data);
                const modalResponse = response.data;
                this.algorithmGridData = modalResponse.gridData;
                this.userConfig = modalResponse.userConfig;
                this.configOptionList = modalResponse.optionList;
                this.codeConfig = modalResponse.codeConfig;
                this.okConfigOption();
            }
        });
    }

    okConfigOption() {
        if (!this.controlValidation || !this.specValidation) return;

        let config: any = this.configOptionList, index;

        // $$hashkey delete...
        config.algoOptions = Object.assign([], this.algorithmGridData.items);
        config.alarmUsers = Object.assign([], this.userConfig.selectedValue);
        config.alarmCodes = Object.assign([], this.codeConfig.selectedValue);
        // config.alarmCodes = Object.assign([], this.codeConfig.selectedValue.map((item) => { return item.codeId; }));
        config.lastUpdateDtts = '';
        config.lastUpdateBy = this._userId;

        this._selectedModuleIds.map((moduleId) => {
            config.moduleId = moduleId;
            index = _.findLastIndex(this._modifyFdtaConfigs, { moduleId: moduleId });

            if (index !== -1) {
                this._modifyFdtaConfigs[index] = Object.assign({}, config);
            } else {
                this._modifyFdtaConfigs.push(Object.assign({}, config));
            }

            // index = _.findLastIndex(this.configGridOptions.data, { moduleId: moduleId });
            // this.configGridOptions.data[index].isModify = true;
        });

        // console.log(this._modifyFdtaConfigs);

        this.algorithmGridData = null;
        this.gridInfo.modifiedCount = this._modifyFdtaConfigs.length;

        this.gridInstance.rows.forEach((d: any, ind: number, arr: Array<any>) => {
            if (d._data.isSelected) {
                d.cssClass = 'a3-modified-cell';
            }
        });

        this.notify.success('MESSAGE.APP_CONFIG.FDTA.SELECTED_ITEM_MODIFY');
    }

    gridSelectAllRows(value: any) {
        this.selectAll = value;
        if (!this.selectAll) this._selectedModuleIds = [];

        let selectYn = this.selectAll;

        this.configGridData.items.forEach((d: any, ind: number, arr: Array<any>) => {
            if (d.isSelected !== selectYn) {
                if (selectYn && this._selectedModuleIds.map((d) => { return d; }).indexOf(d.moduleId) === -1) {
                    this._selectedModuleIds.push(d.moduleId);
                }
                this.gridInstance.setCellData(ind, 'isSelected', this.selectAll);
            }
        });

        this.gridInfo.selectedCount = this._selectedModuleIds.length;
    }

    gridSelectRow(item: any) {
        if (item.isSelected) {
            this._selectedModuleIds.push(item.moduleId);
        } else {
            let index = this._selectedModuleIds.map((d) => { return d; }).indexOf(item.moduleId);
            if (index > -1) {
                this._selectedModuleIds.splice(index, 1);
            }
        }

        this._setSelectAll();

        this.gridInfo.selectedCount = this._selectedModuleIds.length;
    }

    _setSelectAll() {
        let isAllUse = true;

        this.configGridData.items.every((d, ind, arr) => {
            if (!d.isSelected) {
                isAllUse = false;
                return false;
            } else {
                return true;
            }
        });

        this.selectAll = isAllUse;
    }

    private _setConfigListData() {
        this.fdtaConfig
            .getConfigList()
            .then((response) => {
                this.configGridData = new wjcCore.CollectionView(this._setGridData(response));
                this.listGridSetting();

                this.gridInfo.totalCount = response.rowSize;

                this.fdtaSpinner.hideSpinner();
            }, (err: any) => {
                console.error('fdTaconfigList exception: ', err);
                this.notify.error(err);
                this.fdtaSpinner.showError();
            });
    }

    private listGridSetting() {
        this.gridInstance.allowMerging = wjcGrid.AllowMerging.ColumnHeaders;

        if (this.gridInstance.columnHeaders.rows.length > 1) return;

        let hr = new wjcGrid.Row();
        this.gridInstance.columnHeaders.rows.push(hr);
        this.gridInstance.columnHeaders.rows[0].allowMerging = true;

        for (let j = 0; j < this.gridInstance.columns.length; j++) {
            let data = this.gridInstance._cols[j]._hdr,
                key = this.gridInstance._cols[j]._binding._key;

            if (key.indexOf('Control') > -1 || key.indexOf('fdta') > -1) {
                data = 'Control Status';
            }

            this.gridInstance.columns[j].allowMerging = true;
            this.gridInstance.columnHeaders.setCellData(0, j, data);
        }

        // header set css
        this.gridInstance.formatItem.addHandler((s, e) => {
            if (e.cell.className.indexOf('wj-header') > -1) {
                if (e.cell.innerHTML.indexOf('checkbox') === -1) {
                    e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                }

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

        // filter
        let filter = new wjcFilter.FlexGridFilter(this.gridInstance);
        filter.filterColumns = ['toolModel', 'processArea', 'toolName', 'moduleName'];

        //Header Sorting event
        this.gridInstance.hostElement.addEventListener('click', (e: any) => {
            let hitTestInfo = this.gridInstance.hitTest(e);
            //check if clicked cell is column header and first row
            if (hitTestInfo.cellType === wjcGrid.CellType.ColumnHeader && hitTestInfo.row === 0) {
                if (hitTestInfo.col === 0) return;
                if (hitTestInfo.col > 5 && hitTestInfo.col < 9) return;
                //get the binding to sort
                var colName = this.gridInstance.columns[hitTestInfo.col].binding;
                var ascending = false;

                if (colName === 'isSelected') return;

                //store the sort order
                if (this.configGridData.sortDescriptions.length !== 0
                    && this.configGridData.sortDescriptions[0].property === colName) {
                    ascending = this.configGridData.sortDescriptions[0].ascending;
                }
                // remove current sort (if any)
                this.configGridData.sortDescriptions.clear();

                this.configGridData.col = colName;
                this.configGridData.dir = (ascending) ? 'a' : 'd';
                //apply the sort manually
                this.configGridData.sortDescriptions.push(new wjcCore.SortDescription(colName, !ascending));
            }
        });
    }

    private _setGridData(data: any): wjcCore.ObservableArray {
        let gridData = new wjcCore.ObservableArray();
        let column = data.columns, index = column.indexOf('lastUpdateDtts');

        data.rows.forEach((item, ind) => {
            item[index] = Formatter.Date.format(item[index]);
            gridData.push(Object.assign({ isSelected: false }, _.object(column, item)));
        });

        return gridData;
    }

    private _clearConfigValue() {
        this.gridInfo.modifiedCount = 0;

        this._modifyFdtaConfigs = [];

        this._clearSelection();
    }

    private _clearSelection() {
        this.gridInfo.selectedCount = 0;
        this._selectedModuleIds = [];

        this.gridInstance.rows.forEach((d: any, ind: number, arr: Array<any>) => {
            if (d.cssClass) {
                d.cssClass = undefined;
            }
            if (d._data.isSelected) {
                d._data.isSelected = false;
            }
        });
    }
    // tslint:disable-next-line:eofline
}

