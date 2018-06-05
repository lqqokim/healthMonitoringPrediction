import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RouterService } from '../router/router.service';
import { RouterModel, StateManager, UserAction, SessionService, CurrentAction, CurrentModel } from '../../common';
import { SessionStore, Translater, Util } from '../../sdk';

@Component({
    moduleId: module.id,
    selector: 'a3-login',
    templateUrl: 'login.html',
    host: {
        '(keydown)': 'onEnter($event)',
        '(keypress)': 'onEnter($event)'
    }
})
export class LoginComponent implements OnInit, OnDestroy {

    userId: string;
    password: string;
    validMessage: string;
    login_title: string = A3_CONFIG.INFO.LOGIN_LOGO;
    signedUser: boolean;
    refCurrent: CurrentModel;

    private _currentSubscription: Subscription;

    constructor(
        private stateManager: StateManager,
        private router: RouterService,
        private currentAction: CurrentAction,
        private sessionService: SessionService,
        private sessionStore: SessionStore,
        private userAction: UserAction,
        private translator: Translater
    ) { }

    ngOnInit() {
        console.log('--loginComponent init');

        jQuery(document).attr({
            title: 'Manufacturing Intelligence'
        });        
        // When automatically logout during open configuration of widget, cause expired Token.
        // var _state = stateManager.getConfiguration();
        // if (_state.status === 'full') {
        //     configurationAction.close();
        // }

        // 이미 signed user이면 login 화면을 보여주지 않는다
        this.signedUser = this.sessionStore.isSignin();
        this._state();
    }

    _state() {
        const current$ = this.stateManager.rxCurrent();
        this._currentSubscription = current$.subscribe((current: CurrentModel) => {
                // if (router && router.event === 'SESSION' && router.toState === '/login') {
                    // 이미 signed user이면 login 화면을 보여주지 않는다
                    this.refCurrent = current;
                    this.signedUser = this.sessionStore.isSignin();
                    // console.log('> is Signed User', this.signedUser);
                // }
            }
        );
    }

    /**
     * listen enter key
     */
    onEnter(event: any) {
        if (event.which === 13) {
            this.submit();
            event.preventDefault();
        }
    }

    submit() {
        if (!this.isValid()) {
            return;
        }

        this.sessionService
            .login({ 'userId': this.userId, 'password': this.password })
            .subscribe((session: any) => {
                this.sessionStore.setSignin({
                    'userId': session.userId,
                    'name': session.name,
                    'userImgPath': this.getUserRandomImagePath()
                });

                this.userAction.signed();

                if (this.refCurrent && this.refCurrent.homeType === ActionType.DASHBOARD) {
                    const linkLocation = Util.Data.getCookie('dfd_link_location');
                    if (linkLocation) {
                        const params = Util.Restful.parseQueryString(linkLocation);
                        this.router.goWidgetOnDashboard(params['dashboardId'], params['widgetId']);
                    } else if (this.refCurrent.dashboardId > -1) {
                        this.router.goDashboard(this.refCurrent.dashboardId);
                    } else {
                        this.router.goDashboards();
                    }
                } else if (this.refCurrent && this.refCurrent.homeType === ActionType.WORKSPACE) {
                    if (this.refCurrent.workspaceId > -1 && this.refCurrent.taskerId > -1) {
                        this.router.goWorkspace(this.refCurrent.workspaceId, this.refCurrent.taskerId);
                    } else {
                        this.router.goDashboards();
                    }
                }

                // 로그인을 하고 특정 대시보드의 위젯으로 이동하고 싶을 경우 호출한다.
                // this.router.goWidgetOnDashboard(548, 2835);
            }, (err: any) => {
                this.userId = '';
                this.password = '';

                var userDom = $('#a3-userid');
                this._showValidMessage('MESSAGE.LOGIN.LOGIN_ERROR');
                userDom.focus();
            });

    }

    isValid() {
        if (!this.userId) {
            var userDom = $('#a3-userid');
            this._showValidMessage('MESSAGE.LOGIN.INPUT_USERNAME');
            userDom.focus();
            return false;
        } else if (!this.password) {
            var pwdDom = $('#a3-userpwd');
            this._showValidMessage('MESSAGE.LOGIN.INPUT_PASSWORD');
            pwdDom.focus();
            return false;
        }
        return true;
    }

    // TODO use it until complete user info story.
    getUserRandomImagePath() {
        return 'assets/images/users/user-' + Math.floor(Math.random() * 8 + 1) + '.png';
    }

    ngOnDestroy() {
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }
    }

    _showValidMessage(key: string) {
        this.validMessage = this.translator.instant(key);
    }

}
