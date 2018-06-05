import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { UserModelService, ModalApplier } from '../../../../../../../../common';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
    moduleId: module.id,
    selector: 'menu-modify',
    templateUrl: 'menu-modify.component.html',
    styleUrls: ['menu-modify.component.css']
})
export class MenuModifyComponent implements OnChanges, OnInit, OnDestroy {
    @Input() data: any;

    status: string;
    _selectedData: any;
    _applier: ModalApplier;
    _subscription: Subscription;
    menuName: string;
    menu: any;
    myFormGroup: FormGroup;
    _isValid: boolean;


    constructor(
        private userS: UserModelService,
        private _formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this._settingFormValidator();
        // this._subscribeFormChanges();
    }

    ngOnChanges(changes): void {
        if (changes && changes.data) {
            // 전달된 data와 applier를 변수에 담음
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this.status = this._selectedData.status;

            if (this.status === 'create') {
                // this.userData = {};
                this.menu = {};
                this.menu['menuName'] = '';
            } else if (this.status === 'modify') {
                this.menu = this._selectedData.data.menu;
            }
            this._waitApply();
        }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    if (this._isValid !== true) {
                        alert('valid error menu');
                        return;
                    };
                    this._saveMenu();
                }
            });
    }

    _settingFormValidator(): void {
        this.myFormGroup = new FormGroup({
            menuName: new FormControl('', [<any>Validators.required,])
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

    _saveMenu():void {

        if (this.status === 'create') {
            this.menu['objectLevel'] = 1;
            this.userS
                .createObject([this.menu])
                .subscribe(
                    (data) => this._applier.appliedSuccess(),
                    (error) => this._applier.appliedFailed()
                );
        } else {
            this.userS
                .modifyObject(this.menu)
                .subscribe(
                    (data) => this._applier.appliedSuccess(),
                    (error) => this._applier.appliedFailed()
                );
        }
    }

    keyUp(object) {
        object.target.value = object.target.value.toLocaleUpperCase();
    }
    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
