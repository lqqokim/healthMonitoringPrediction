import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { CommonWebSocketService, SessionStore, InjectorUtil, NotifyService, Translater } from '../../sdk';
import { PushAction, StateManager, UserModel, UserAction, SessionService } from '../../common';
import { RouterService } from '../router/router.service';

@Injectable()
export class PushService {

    userSubscription: Subscription;
    // ws://xxx.xxx.xxx.xxx/portal/service/socket/notificationData
    NOTIFICATION_URL: string = 'socket/notificationData';
    isAlreadyDelete: boolean = false;

    constructor(
        private websocketService: CommonWebSocketService,
        private sessionStore: SessionStore,
        private pushAction: PushAction,
        private stateManager: StateManager,
        private userAction: UserAction,
        private notifier: NotifyService,
        private router: RouterService,
        private translater: Translater
    ) {
        setTimeout(() => this._state(), 1000);
    }

    _state() {
        this.userSubscription = this.stateManager.rxUser().subscribe((user: UserModel) => {
            // connect when user login
            if (user.actionType === ActionType.SIGNED_USER) {
                if (this.websocketService.isOpened()) {
                    this.websocketService.close();
                    if (this.userSubscription) {
                        this.userSubscription.unsubscribe();
                    }
                }
                const session = InjectorUtil.getService(SessionService);
                this.websocketService.createWebSocket(this.NOTIFICATION_URL, session.getUserId());
                this._listenPushMessage();
            } else if (user.actionType === ActionType.LOGOUT_USER) {
                this.websocketService.close();
            }
        });

        // connect when browser reload
        if (!this.websocketService.isOpened() && this.sessionStore.isSignin()) {
            const session = InjectorUtil.getService(SessionService);
            this.websocketService.createWebSocket(this.NOTIFICATION_URL, session.getUserId());
            this._listenPushMessage();
        }
    }

    _listenPushMessage() {
        this.websocketService
            .getDataStream()
            .subscribe((messagesEvent: MessageEvent) => {
                if (messagesEvent) {
                    const data = JSON.parse(messagesEvent.data);
                    console.log('>> push notifications', data);
                    // 다시 notification list를 읽는다. 
                    if (data.command === 'notifications' && data.push && data.push.length > 0) {
                        data.push.forEach((notification) => {
                            if (notification.type === ActionType.PUSH_SHARED_DASHBOARD) {
                                this.pushAction.sharedDashboard(notification);
                            } else if (notification.type === ActionType.PUSH_SHARED_WORKSPACE) {
                                this.pushAction.sharedWorkspace(notification);
                            } else if (notification.type === ActionType.PUSH_DELETE_USER) {
                                this._deleteMyId(notification.content);
                            }
                        });
                    }
                }
            },
            (err: any) => {
                console.error('receive notification based on websocket exception:', err);
            },
            () => console.log('listen socket complete'));
    }

    _deleteMyId(userId: string) {
        const loginUserId = this.sessionStore.getSignInfo()['userId'];
            // show notify window and automatically logout
            console.log('delete user', userId, ', login user', loginUserId);
            if ((loginUserId === userId) && !this.isAlreadyDelete) {
                this.isAlreadyDelete = true;
                this.translater.get('MESSAGE.GENERAL.DELETE_USER', {userId}).subscribe((msg: string) => {
                    this.notifier.info(msg);
                    setTimeout(() => {
                        this.sessionStore.clearSignin();
                        this.router.goLogin();
                    }, 3000);
                });
            }
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

}