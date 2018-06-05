import { Component, OnDestroy, OnInit} from '@angular/core';
import { UserModelService,ModalAction, ModalRequester, RequestType } from '../../../../../../common';
import { NotifyService } from '../../../../../../sdk';

import { MenuFunctionModalModule } from './modal/menu-function-modal.module';

@Component({
    moduleId: module.id,
    selector: 'menu-function-list',
    templateUrl: 'menu-function-list.html',
    styleUrls: ['menu-function-list.css']
})
export class MenuFunctionListComponent implements OnInit, OnDestroy {

    _status: string;
    selectedKind: string = '';
    selectedObject: Object = {};
    selectedCell: Object = null;
    menus: Array<any> = [];
    functions: Array<any> = [];
    menuFunctions: Array<any>;
    _deleteObject: Object = {};

    constructor(
        private modalR: ModalRequester,
        private modalA: ModalAction,
        private notifyS: NotifyService,
        private userS: UserModelService
    ) { }

    ngOnInit() {
        this._setPermissions();
    }

    _setPermissions(): void {
        this.userS
            .getPermissions()
            .subscribe((permission: any) => {
                this._setMenusFunctions(permission);
                this._setMenuChild();
            });
    }

    // devide menu and function using objectLevel
    _setMenusFunctions(permission: any): void {
        permission.map((data:any) => {
            let types = data.operations.map((obj:any)=>{
                    return obj.operationName;
            });
            data['typeI'] = types.slice(0,6).join();
            data['typeE'] = types.slice(6).join();
            if ( data.objectLevel === '1' ) {
                this.menus.push(data);
            } else {
                this.functions.push(data);
            }
        });
    }

    // set child function in menu using parentId
    _setMenuChild(): void {
        this.menuFunctions = this.menus.map((menu: any) => {
            let arr = [];
            arr = this.functions.filter((func:any) => func.parentId === menu.objectId);
            menu['child'] = arr;
            return menu;
        });
    }
    menuCreate(): void {
        this.selectedKind = 'menu';
        this._controlMenuFunction('create', 'Menu Create');
    }
    functionCreate(): void {
        if ( this.selectedKind !== 'menu') {
            alert('no selected menu');
            return;
        }
        this.selectedKind = 'function';
        this._controlMenuFunction('create', 'Function Create');
    }
    menufunctionModify(): void {
        if (this.selectedKind === '' ) {
            alert('no selected menu or functions');
            return;
        }
        this._controlMenuFunction('modify', `Modify ${this.selectedKind}`);
    }

    _controlMenuFunction(status, title): void {
        this._status = status;
        this.modalA.showConfiguration({
            module: MenuFunctionModalModule,
            info: {
                title: title,
                status: this._status,
                kinds: this.selectedKind,
                selectedData: this.selectedObject
            },
            requester: this.modalR
        });

        this.modalR.getObservable().subscribe((response: RequestType)=> {
            this.selectedKind = '';
            this.selectedObject = {};
            this.selectedCell = null;
            if (response.type === 'OK' && response.data) {
                if ( this._status === 'create' ) {
                    this.notifyS.success('create success');
                } else {
                    this.notifyS.success('modify success');
                }
            }
        });
    }

    deleteMenuFunction() :void {

        if ( this.selectedKind === 'function' ) {
            this._deleteObject = this.selectedObject['func'];
        } else {
            this._deleteObject = this.selectedObject['menu'];
        }

        this.modalA.showConfirmDelete({
            info: {
                title: 'delete alert test',
                confirmMessage: `${this._deleteObject['objectName']} 를 삭제하시겠습니까?`,
            },
            requester: this.modalR
        });

        this.modalR.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this._deleteMenuFunction();
            }
        });
    };

    _deleteMenuFunction(): void {
        this.userS.deleteObject(this._deleteObject)
            .subscribe(
                (data) => this.notifyS.success('delete success'),
                (err) => this.notifyS.error('delete error')
            );
    };

    selectMenu(menu: any): void {
        this.selectedKind = 'menu';
        this.selectedObject['menu'] = menu;
        this.selectedCell = null;
        this.selectedCell = menu;
    }
    selectFunc(menu: any, func: any): void {
        this.selectedKind = 'function';
        this.selectedObject['menu'] = menu;
        this.selectedObject['func'] = func;
        this.selectedCell = null;
        this.selectedCell = func;
    }

    ngOnDestroy() {}
}
