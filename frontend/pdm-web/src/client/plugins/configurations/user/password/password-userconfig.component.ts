import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import {
    UserModelService,
    SessionService
} from '../../../../common';

import { NotifyService } from '../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'password-userconfig',
    templateUrl: 'password-userconfig.html'
})
export class PasswordUserConfigComponent implements OnInit, OnDestroy {
    userInfo: any;
    user = {
        password: '',
    };
    submitted: boolean = false;
    passwordForm: FormGroup;

    private _passwordSubscription: Subscription;
    private _passwordGruopSubscription: Subscription;

    constructor(
        private session: SessionService,
        private userService: UserModelService,
        private fb: FormBuilder,
        private notify: NotifyService
    ) { }

    ngOnInit() {
        this._getUser();
    }

    _getUser() {
        this.userInfo = this.session.getUserInfo();
        this.buildForm();
        this.userService.getUsers()
            .subscribe(
                users => {
                    let findUser = _.findWhere( users, { userId: this.userInfo.userId } );
                    this.user = findUser;
		        },
                error => {
                    console.log('Error HTTP GET Service', error);
                },
                () => {
                    this.buildForm();
                    // console.log('view complete');
                }
            );
    }

    _modifyUserPassword(user: any) {
        this.userService.modifyUserProfile(user)
            .subscribe(
                (data) => {
                    this.submitted = true;
                    this._getUser();
                },
                error => {
                    this.notify.error('MESSAGE.GENERAL.ERROR');
                    console.log('Error HTTP PUT Service', error); 
                },
                () => {
                    this.notify.success('MESSAGE.USER_CONFIG.SAVE_SUCCESS');
                    // console.log('completed')
                }
        );
    }

    buildForm() {
        this.passwordForm = this.fb.group({
                                    password: ['', Validators.required],
                                    passwords: this.fb.group({
                                        newPassword: ['', Validators.required],
                                        confirmPassword: ['', Validators.required],
                                    })
                                });

        this.formChangesAndSetValidity();
    }

    formChangesAndSetValidity() {
        const passwordChanges$ = this.passwordForm.controls['password'].valueChanges;
        const passwordGroupValueChanges$ = this.passwordForm.controls['passwords'].valueChanges;

        this._passwordSubscription = passwordChanges$.subscribe(password => {
            if (password === this.user.password) {
                this.passwordForm.controls['password'].setErrors(null);
            } else if (password === '') {
                this.passwordForm.controls['password'].setErrors({ 'required' : true });
            } else {
                this.passwordForm.controls['password'].setErrors({ 'invalidPassword' : true });
            }
        });

        this._passwordGruopSubscription = passwordGroupValueChanges$.subscribe(group => {
            if (group.newPassword === group.confirmPassword) {
                this.passwordForm.controls['passwords'].setErrors(null);
            } else {
                this.passwordForm.controls['passwords'].setErrors({ 'mismatchedPasswords' : true });
            }
        });
    }

    submitPassword(value: Object) {
        let userObj = this.user;
        userObj.password = value['passwords']['newPassword'];
        this._modifyUserPassword(userObj);
    }

    // tslint:disable-next-line:no-empty
    cancel() {

    }

    ngOnDestroy() {
        if (this._passwordSubscription) {
            this._passwordSubscription.unsubscribe();
        }
        if (this._passwordGruopSubscription) {
            this._passwordGruopSubscription.unsubscribe();
        }
    }
  
}