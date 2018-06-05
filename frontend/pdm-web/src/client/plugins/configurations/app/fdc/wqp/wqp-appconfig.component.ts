import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

// import { GridPanel } from 'wijmo.grid';

import { SpinnerComponent, NotifyService } from '../../../../../sdk';

import { WqpAppConfigService } from './wqp-appconfig.service';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcFilter from 'wijmo/wijmo.grid.filter';
import { WijmoApi } from "../../../../../common";

@Component({
    moduleId: module.id,
    selector: 'div.wqp-appconfig',
    templateUrl: 'wqp-appconfig.html',
    styleUrls: ['wqp-appconfig.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [WqpAppConfigService]
})
export class WqpAppConfigComponent extends WijmoApi implements OnInit {
    @ViewChild('WqpConfigSpinner') wqpConfigSpinner:SpinnerComponent;
    @ViewChild('WijmoGridInstance') wijmoGridInstance:any;

    gridData:Array<any>;

    fileName:string;

    selectAll:boolean;

    constructor(
        private wqpAppConfigService: WqpAppConfigService,
        private notify: NotifyService
    ) {
        super();
        this.gridData = [];
        this.fileName = '';
    }

    ngOnInit() {
        this.wijmoGridInstance.formatItem.addHandler((s, e) => {
            if (e.col === 0 && e.cell.className.indexOf('wj-header') < 0) {
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
            else if (e.cell.children.length == 0) {
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';

                wjcCore.setCss(e.cell, {
                    display: 'table',
                    tableLayout: 'fixed'
                });
                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    textAlign: (e.col===2 || e.cell.className.indexOf('wj-header') > -1) ? 'center' : 'left',
                    verticalAlign: 'middle'
                });
            }
        });
        this.wijmoGridInstance.mergeManager.getMergedRange = (panel: any, r: number, c: number, clip?: boolean) => {
            let rg = new wjcGrid.CellRange(r, c);
            
            if(rg.col !== 0) {
                for (var i = rg.row; i < panel.rows.length - 1; i++) {
                    if (panel.getCellData(i, rg.col, true) != panel.getCellData(i + 1, rg.col, true)) {
                        break;
                    }
                    rg.row2 = i + 1;
                }
                for (var i = rg.row; i > 0; i--) {
                    if (panel.getCellData(i, rg.col, true) != panel.getCellData(i - 1, rg.col, true)) {
                        break;
                    }
                    rg.row = i - 1;
                }
            } else {
                for (var i = rg.row; i < panel.rows.length - 1; i++) {
                    if (panel.getCellData(i, 1, true) != panel.getCellData(i + 1, 1, true)) {
                        break;
                    }
                    rg.row2 = i + 1;
                }
                for (var i = rg.row; i > 0; i--) {
                    if (panel.getCellData(i, 1, true) != panel.getCellData(i - 1, 1, true)) {
                        break;
                    }
                    rg.row = i - 1;
                }
            }

            return rg;
        }
        let filter = new wjcFilter.FlexGridFilter(this.wijmoGridInstance);
        filter.filterColumns = ['productName', 'sequence', 'operation'];

        this._getProducts();
    }

    onFileChange(ev:any) {
        let header = [], data = [],
            file:File = ev.target.files[0],
            reader:FileReader = new FileReader(),
            promise = null;
        
        this.wqpConfigSpinner.showSpinner();

        reader.readAsText(file);

        this.fileName = file.name;

        reader.onloadend = (e) => {
            let csvData = reader.result.split('\n');

            $(ev.target).context.value = null;

            csvData.forEach((row, ind) => {
                if(row) {
                    if(ind === 0) {
                        header = row.split(',').map((s) => {return s.trim()});
                    } else {
                        data.push(row.split(',').map((s) => {return s.trim()}));
                    }
                }
            });

            this.gridData = data.map((row) => {
                return {
                    useYn: true,
                    productName: row[header.indexOf('Product')],
                    sequence: row[header.indexOf('Sequence')],
                    operation: row[header.indexOf('Operation')]
                }
            });

            this._setProducts().then((response) => {
                if(response) {
                    this._getProducts().then(() => {
                        this.wqpConfigSpinner.hideSpinner();

                        this.notify.success("MESSAGE.APP_CONFIG.WQP.LOADING_SUCCESS");
                    });
                } else {
                    // error notify: set products error.
                }
            });
        };
    }

    gridSelectAllProducts() {
        let candidates = [], useYn = this.selectAll;

        this.wqpConfigSpinner.showSpinner();

        this.gridData.forEach((d, ind, arr) => {
            if(d.useYn !== useYn) {
                if(candidates.map((d)=>{return d.productName}).indexOf(d.productName) === -1) {
                    candidates.push(d);
                }
                arr[ind].useYn = useYn;
            }
        });

        this._changeProductsUsingStatus(candidates).then(()=>{
            this.wqpConfigSpinner.hideSpinner();
        });
    }

    gridSelectProduct(item) {
        let changedProduct = item.productId,
            changedStatus = item.useYn;

        this.wqpConfigSpinner.showSpinner();

        this.gridData.forEach((d, ind, arr) => {
            if(d.productId === changedProduct) {
                arr[ind].useYn = changedStatus;
            }
        });

        this._setSelectAll();

        this._changeProductUsingStatus(item);
    }

    _getProducts() {
        return this.wqpAppConfigService.getProducts().then((response) => {
            this.gridData = response;

            this._setSelectAll();
        });
    }

    _setSelectAll() {
        let isAllUse = true;

        this.gridData.every((d, ind, arr) => {
            if(!d.useYn) {
                isAllUse = false;
                return false;
            } else {
                return true;
            }
        });

        this.selectAll = isAllUse;
    }

    _setProducts() {
        return this.wqpAppConfigService.setProducts(this.gridData).then((response) => {
            return response.status === 'OK';
        });
    }

    _changeProductsUsingStatus(items) {
        var requests = [];

        items.forEach((item) => {
            requests.push(this.wqpAppConfigService.setProductUseYn(item.productId, item.productName, item.useYn));
        });

        return Promise.all(requests);
    }

    _changeProductUsingStatus(_item) {
        let item = this.gridData.filter((d) => {return d.productName === _item.productName})[0];

        this.wqpAppConfigService.setProductUseYn(item.productId, item.productName, item.useYn).then(() => {
            this.wqpConfigSpinner.hideSpinner();
        });
    }
}
