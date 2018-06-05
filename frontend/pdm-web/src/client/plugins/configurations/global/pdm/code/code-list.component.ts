import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';

import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater, SpinnerComponent } from '../../../../../sdk';

// import { CODE_LIST } from './mock-data';

@Component({
    moduleId: module.id,
    selector: 'code-list',
    templateUrl: './code-list.html',
    styleUrls: ['./code-list.css'],
    providers: [PdmConfigService, PdmModelService],
})
export class CodeListComponent implements OnInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('categoryInput') categoryInput: ElementRef;
    @ViewChild('codeModal') codeModal: any;
    @ViewChild('codeModify') codeModify: any;
    @ViewChild("codeForm") codeForm: any;

    selectedRowData: any;
    codeData: any;
    codeDatas: any[];
    categoryDatas: any[];
    categoryFilterDatas: any[];
    selectedCategory: any;
    selectedFab: any;
    plants: any[];

    codeOrders: any[];

    status: string;
    modalTitle: string;

    initCodeDatas: any[];

    isChecked: boolean = false;

    useds: any[] = [
        { value: true, label: 'Y' },
        { value: false, label: 'N' }
    ]

    defaults: any[] = [
        { value: true, label: 'Y' },
        { value: false, label: 'N' }
    ];


    constructor(
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private pdmConfigService: PdmConfigService,
        private pdmModelService: PdmModelService) {

    }

    ngOnInit() {
        this._getFabDatas();
        $('#areaModal').on('hidden.bs.modal', () => {
            this.codeForm.form.reset();
        })
    }

    _getFabDatas(): void {
        this.componentSpinner.showSpinner();
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.plants = plants;
                this.selectedFab = plants[0];
                this._getCodes();
            }).catch((error: any) => {

            });
    }

    _getCodes(): void {
        this.pdmConfigService.getCodes(this.selectedFab.fabId)
            .then((codes) => {
                this.codeDatas = codes.concat(codes);
                this.initCodeDatas = JSON.parse(JSON.stringify(codes)); // deep copy        
                this._getCatagory();
                this._firstSelectedData();
            }).catch((err) => {

            });
    }

    _getCatagory(): void {
        this.pdmConfigService.getAllCategory(this.selectedFab.fabId)
            .then((categories) => {
                let categoryList = [];

                categories.map((value, index) => {
                    categoryList.push({
                        categoryId: index + 1, //for add 'ALL'
                        categoryName: categories[index]
                    });
                });

                this.categoryDatas = categoryList;
                this.categoryFilterDatas = this.categoryDatas.concat([]);
                this.categoryFilterDatas.unshift({ categoryId: 0, categoryName: 'ALL' });
                this.selectedCategory = this.categoryFilterDatas[0];
                
                setTimeout(() => {
                    this.componentSpinner.hideSpinner();
                }, 1000);
            }).catch((err) => {
                this.componentSpinner.showError();
                this._getCodes();
            });
    }

    _firstSelectedData(): void {
        setTimeout(() => {
            if (this.gridInstance.itemsSource && this.gridInstance.itemsSource.length > 0) {
                this.selectedRowData = this.gridInstance.itemsSource[0];
            }
        });
    }

    selectedRow(grid: wjcGrid.FlexGrid, e: CellRangeEventArgs): void {
        this.selectedRowData = grid.selectedItems[0];
    }

    changeCheck(ev: any, category: string): void {
        // console.log('changeCheck', ev, category, this.isChecked);
        if (this.isChecked && category) {
            this.codeData.category = null;
        } else {
            this.codeData.category = this.selectedRowData.category;
        }
    }

    deleteCode(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.name,
                confirmMessage: this.translater.get("MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM", { itemName: this.selectedRowData.name })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this.componentSpinner.showSpinner();
                this._deleteCode();
            }
        });
    }

    _deleteCode() {
        this.pdmConfigService.deleteCode(this.selectedFab.fabId, this.selectedRowData.rawId)
            .then((res: any) => {
                this._showModal(false);
                this._getCodes();
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            }, (err: any) => {
                this._showModal(false);
                this._getCodes();
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    showModal(status: string): void {
        this.status = status;
        let codeData: any = {};
        let selectedCategory: any;

        // if (this.selectedCategory.categoryName === 'ALL') {
        //     selectedCategory = '';
        // } else {
        //     selectedCategory = this.selectedCategory;
        // }

        if (status === 'create') {
            codeData = {
                code: '',
                category: '',
                description: '',
                name: '',
                used_yn: true,
                default_yn: true,
                ordering: this.codeDatas.length + 1,
            };
        } else if (status === 'modify') {
            codeData = Object.assign({}, this.selectedRowData);
        }

        // this.codeData = {
        //     code: codeData,
        //     categoryDatas: this.categoryDatas,
        //     status: status
        // };

        this.codeData = codeData;
        console.log('codeData', this.codeData);
        this._showModal(true);
    }

    saveData(): void {
        this.componentSpinner.showSpinner();

        if (this.isChecked) {
            this.isChecked = false;
        }

        let codeData: any = this.codeData;
        this._showModal(false);
        // let codeData: any = this.codeModify.getData();
        let request: any = {
            category: codeData.category,
            code: codeData.code,
            name: codeData.name,
            default_yn: codeData.default_yn,
            used_yn: codeData.used_yn,
            description: codeData.description,
        };

        if (this.status === 'modify') {
            this.updateCode(request);
        } else if (this.status === 'create') {
            this.createCode(request);
        }

        console.log('code request', request);
    }

    createCode(request): void {
        this.pdmConfigService.createCode(this.selectedFab.fabId, request)
            .then(() => {
                this._showModal(false);
                this._getCodes();
                this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
            }).catch((err) => {
                this._showModal(false);
                this._getCodes();
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    updateCode(request: any): void {
        this.pdmConfigService.updateCode(this.selectedFab.fabId, this.selectedRowData.rawId, request)
            .then(() => {
                this._showModal(false);
                this._getCodes();
                this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
            }).catch(() => {
                this._showModal(false);
                this._getCodes();
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    changeSelectedFab(item: any): void {
        this.componentSpinner.showSpinner();
        this.selectedFab = item;
        this._initDatas();
        this._getCodes();
    }

    saveOrder(): void {
        this.componentSpinner.showSpinner();
        let originDatas = this.gridInstance.itemsSource;
        let updatedDatas = [];

        for (let i = 0; i < originDatas.length; i++) {
            updatedDatas.push({
                rawId: originDatas[i].rawId,
                ordering: i
            });
        }

        this.pdmConfigService.updateCodeOrder(this.selectedFab.fabId, updatedDatas)
            .then((res) => {
                this._getCodes();
                this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
            }).catch((err) => {
                this._getCodes();
                this.notify.error("MESSAGE.GENERAL.ERROR");
            })
    }

    closeModal() {
        if (this.isChecked) {
            this.isChecked = false;
        }

        this.codeForm.form.reset();
    }

    onClickUp(): void {
        let selectedIndex = this.codeDatas.indexOf(this.selectedRowData);

        if (selectedIndex === 0) {
            return;
        }

        // Row switching
        let temp = this.codeDatas[selectedIndex];
        this.codeDatas[selectedIndex] = this.codeDatas[selectedIndex - 1];
        this.codeDatas[selectedIndex - 1] = temp;

        // Reset code order
        for (let i = 0; i < this.codeDatas.length; i++) {
            this.codeDatas[i].order = i + 1;
        }

        // Wijmo refresh
        this.gridInstance.collectionView.refresh();

        setTimeout(() => {
            this.gridInstance.selection = new wjcGrid.CellRange(selectedIndex - 1, 0, selectedIndex, 2);
        });
    }

    onClickDown(): void {
        let selectedIndex = this.codeDatas.indexOf(this.selectedRowData);

        if (selectedIndex === this.gridInstance.itemsSource.length - 1) {
            return;
        }

        // Row switching
        let temp = this.codeDatas[selectedIndex];
        this.codeDatas[selectedIndex] = this.codeDatas[selectedIndex + 1];
        this.codeDatas[selectedIndex + 1] = temp;

        // Reset code order
        for (let i = 0; i < this.codeDatas.length; i++) {
            this.codeDatas[i].order = i + 1;
        }

        // Wijmo refresh
        this.gridInstance.collectionView.refresh();

        setTimeout(() => {
            this.gridInstance.selection = new wjcGrid.CellRange(selectedIndex + 1, 0, selectedIndex, 2);
        });
    }

    onCategoryChange(ev: any): void {
        if (ev) {
            this.selectedCategory = ev;
            this.filterCodeList();
        }
    }

    filterCodeList(): void {
        const codeDatas = JSON.parse(JSON.stringify(this.initCodeDatas)); // deep copy
        // console.log('selectedCategory', this.selectedCategory);

        if (this.selectedCategory.categoryName === 'ALL') {
            this.codeDatas = codeDatas;
        } else {
            this.codeDatas = codeDatas.filter(code => code.category === this.selectedCategory.categoryName);
        }

        this._firstSelectedData();
    }

    nameKeypress(event: KeyboardEvent) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    codeKeypress(event: KeyboardEvent) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    private _showModal(isShow: boolean): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(this.status);
            $('#codeModal').modal({
                backdrop: false,
                show: true
            });
        } else {
            $('#codeModal').modal('hide');
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    private _initDatas() {
        this.codeDatas = null;
        this.codeData = null;
        this.categoryDatas = null;
    }
}