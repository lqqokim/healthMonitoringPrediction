import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { UserModelService, ModalApplier } from '../../../../../../../../common';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    moduleId: module.id,
    selector: 'function-modify',
    templateUrl: 'function-modify.component.html',
    styleUrls: ['function-modify.component.css']
})
export class FunctionModifyComponent implements OnChanges, OnInit, OnDestroy {
    @Input() data: any;

    status: string;

    _selectedData: any;
    _applier: ModalApplier;
    _subscription: Subscription;

    function: any;
    parentMenu: any;

    usedActions: Array<any> = [];
    notUsedActions: Array<any> = [];
    selectedNotUsedAction: Object = null;
    selectedUsedAction: Object = null;

    newActionInput: string;

    myFormGroup: FormGroup;
    _isValid: boolean;

    constructor(
        private userS: UserModelService,
        private _formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this._settingFormValidator();
    }

    ngOnChanges(changes: any): void {
        if (changes && changes.data) {
            // 전달된 data와 applier를 변수에 담음
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;
            this.parentMenu = this._selectedData.data.menu;
            if (this.status === 'create') {
                this.function = {};
                this.function['objectName'] = '';
            } else if (this.status === 'modify') {
                this.function = this._selectedData.data.func;
                this._setActions();
            }
            this._waitApply();
            // need to get all operations
            // this._userS.getOperations.subscribe();
        }
    }

    _setActions(): void {
        if ( this.function.operations.length > 6) {
            this.usedActions = this.function.operations.slice(6);
        }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    if (this._isValid !== true) {
                        alert('valid error function');
                        return;
                    };
                    this._saveFunction();
                }
            });
    }

    _settingFormValidator(): void {
        this.myFormGroup = new FormGroup({
            functionName: new FormControl('',[<any>Validators.required])
        });
    }
    _subscribeFormChanges(): void {
        const myFormStatusChanges$ = this.myFormGroup.statusChanges;
        myFormStatusChanges$.subscribe(result => {
            if (result === 'INVALID') {
                this._isValid = false;
            } else {
                this._isValid = true;
            }
        });
    }
    _saveFunction(): void {
        this.function['objectLevel'] = 2;
        this.function['parentId'] = this.parentMenu['objectId'];
        this.function['operations'] = this.usedActions;
        if (this.status === 'create') {
             //extend Operators
            this.userS.createObject([this.function])
                .subscribe(
                    (data) => this._applier.appliedSuccess(),
                    (error) => this._applier.appliedFailed()
                );
        } else {
            this.userS.createObject(this.function)
                .subscribe(
                    (data) => this._applier.appliedSuccess(),
                    (error) => this._applier.appliedFailed()
                );
        }
    }

    selectNotUsedAction(action: any): void {
        this._resetSelect();
        this.selectedNotUsedAction = action;
    }
    selectUsedAction(action: any): void {
        this._resetSelect();
        this.selectedUsedAction = action;
    }

    addNewAction(action: string): void {
        if (action === '') {
            alert('action name is empty');
            return;
        }
        const actionInfo = {
            operationName: action,
            type: 'E'
        };
        this.notUsedActions.push(actionInfo);
    }

    addAction(): void {
        // notused -> used
        if (this.selectedNotUsedAction === null) {
            alert('action not selected');
            return;
        }
        const iActionIndex = this.notUsedActions.indexOf(this.selectedNotUsedAction);
        this.notUsedActions.splice(iActionIndex,1);
        console.log(this.selectedNotUsedAction);
        this.usedActions.push(this.selectedNotUsedAction);
        this._resetSelect();
    }
    removeAction(): void {
        // used -> not used
        if (this.selectedUsedAction === null) {
            alert('action not selected');
            return;
        }
        const iActionIndex = this.usedActions.indexOf(this.selectedUsedAction);
        this.usedActions.splice(iActionIndex,1);
        console.log(this.selectedUsedAction);
        this.notUsedActions.push(this.selectedUsedAction);
        this._resetSelect();

    }
    _resetSelect(): void {
        this.selectedNotUsedAction = null;
        this.selectedUsedAction = null;
    }
    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
