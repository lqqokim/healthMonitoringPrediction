import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { NotifyService } from '../../../../sdk';
import {
    ModalAction,
    ModalRequester,
    UserModelService,
    SessionService
} from '../../../../common';

@Component({
    moduleId: module.id,
    selector: 'profile-userconfig',
    templateUrl: 'profile-userconfig.html',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        class: 'height-full'
    }
})
export class ProfileUserConfigComponent implements OnInit {

    userInfo: any;
    user = {
            name:'',
            description:'',
            email:'',
            phone:'',
            position:'',
            department:'',
            location: ''
    };
    submitted: boolean = true;
    profileForm: FormGroup;

    constructor(
        private session: SessionService,
        private userService: UserModelService,
        private fb: FormBuilder,
        private notify: NotifyService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
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
                    // console.log('view complete')
                }
            );
    }

    _modifyUser(user: any) {
        this.userService.modifyUserProfile(user)
            .subscribe(
                () => {
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
        if (this.user.description) {
            let textDescription  = this.user.description;
            textDescription = textDescription.replace(/\n/g, '<br>');
            textDescription = textDescription.replace(/ /g, '&nbsp;');

            $('#aboutMe').html(textDescription);
        }

        this.profileForm = this.fb.group({
                name: [this.user.name, [Validators.required, Validators.maxLength(50)]],
                email: [this.user.email, [Validators.required, this.emailValidator]],
                phone: [this.user.phone, [this.phoneValidator]],
                description: [this.user.description, [Validators.maxLength(1024)]],
                position: [this.user.position, [Validators.maxLength(50)]],
                department: [this.user.department, [Validators.maxLength(50)]],
                location: [this.user.location, [Validators.maxLength(1024)]]
            });
    }

    emailValidator(control: FormControl): any {
        const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if (control.value && !emailRegexp.test(control.value)) {
            return { invalidEmail: true };
        }
    }

    phoneValidator(control: FormControl): any {
        const phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3,4})[-. ]?([0-9]{4})$/;
        
        if (control.value && !phoneNum.test(control.value)) {
            return { invalidPhone: true };
        }
    }

    submitProfile(value: Object) {
        let userParams = this.user;
        userParams.name = value['name'];
        userParams.description = value['description'];
        userParams.email = value['email'];
        userParams.phone = value['phone'];
        userParams.position = value['position'];
        userParams.department = value['department'];
        userParams.location = value['location'];

        this._modifyUser(userParams);
    }

    cancel() {
        this.submitted = true;
        this.buildForm();
    }

    edit() {
        this.submitted = false;
        this.buildForm();
    }

}