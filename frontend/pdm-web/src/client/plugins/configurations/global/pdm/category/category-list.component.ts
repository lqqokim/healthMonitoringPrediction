import { Component, OnInit, ViewChild } from '@angular/core';
import { PdmConfigService } from '../model/pdm-config.service';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater } from '../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'category-list',
    templateUrl: './category-list.html',
    styleUrls: ['./category-list.css'],
    providers: [PdmConfigService]
})
export class CategoryListComponent implements OnInit {
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @ViewChild('categoryModal') categoryModal: any;
    @ViewChild('categoryModify') categoryForm: any;

    selectedRowData: any;
    categoryData: any;
    categoryDatas: any[] = [
        { categoryId: 23, categoryName: 'FAILURE_TYPE' },
        { categoryId: 24, categoryName: 'REPORT_STATUS' },
        { categoryId: 25, categoryName: 'ALARM_CODE' },
        { categoryId: 43, categoryName: 'JOB_TYPE' },
        { categoryId: 41, categoryName: 'JOB' },
        { categoryId: 42, categoryName: 'JOB_STATUS' }
    ];


    status: string;
    modalTitle: string;

    constructor(
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
        private pdmConfigService: PdmConfigService) {

    }

    ngOnInit() {
        this._getCatagory();
    }

    _getCatagory() {
        // this.pdmConfigService.getAllCategory()
        //     .then((categoryList) => {
        //         this.categoryDatas = categoryList;
        //     }).catch((err) => {

        //     });

        this._firstSelectedData();
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

    deleteCategory(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRowData.categoryName,
                confirmMessage: this.translater.get("MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM", { itemName: this.selectedRowData.categoryName })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteCategory();
            }
        });
    }

    _deleteCategory() {
        // this.pdmConfigService.deleteEqp(this.fabId, this.areaId, this.selectedRowData.eqpId)
        //     .then((res: any) => {
        //         this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
        //         this.updateItem.emit({
        //             init: true
        //         });
        //     }, (err: any) => {
        //         this._showModal(false);
        //     });
    }

    showModal(status: string): void {
        this.status = status;
        let categoryData;

        if (status === 'create') {
            categoryData = {
                categoryName: ''
            }
        } else if (status === 'modify') {
            categoryData = this.selectedRowData;
        }

        this.categoryData = {
            category: categoryData
        };

        this._showModal(true);
    }

    saveData() {
        this._showModal(false);
        let categoryData: any = this.categoryForm.getData();
        let request: any = {
            categoryName: categoryData.categoryName
        };

        this.updateCategory(request);
    }

    createCategory(request: any): void {
        this.pdmConfigService.createCategory(request)
            .then((res) => {
                this._showModal(false);
                this.notify.success("MESSAGE.USER_CONFIG.CREATE_SUCCESS");
                this._getCatagory();
            }).catch((err) => {
                this._showModal(false);
                this.notify.error("MESSAGE.GENERAL.ERROR");
            })
    }

    updateCategory(request: any): void {
        this.pdmConfigService.updateCategory(request)
            .then((res) => {
                this._showModal(false);
                this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
            }).catch((err) => {
                this._showModal(false);
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    private _showModal(isShow): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(this.status);
            $('#categoryModal').modal({
                backdrop: false,
                show: true
            });
        } else {
            $('#categoryModal').modal('hide');
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }
}