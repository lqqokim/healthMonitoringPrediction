import { NotificationListModule } from './notification-list.module';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionStore, NotifyService } from "../../../sdk";
import { RouterService } from "../../router/router.service";

@Component({
    moduleId: module.id,
    selector: '[a3p-notification-list-content]',
    template: `
        <ul class="container-group" 
            (click)="showDetailInfo()" 
            [ngClass]="{'active': notification.isActive, 'read': notification.readYN && !notification.isActive}">
            <li class="contents notification">
                <ul>
                    <li class="user-name">{{ notification?.type }}</li>
                    <li class="from">{{ notification?.sourceUserId }}</li>
                    <li class="time">{{ notification?.createDtts | date:'medium' }}</li>
                    <!--li class="content">{{ notification?.message }}</li-->
                </ul>
            </li>
            <li class="icon notification-email"></li>
        </ul>
    `
})
export class NotificationListContentComponent {

    private _notification: any;
    @Output() detail: EventEmitter<any> = new EventEmitter();

    @Input()
    set notification(value: any) {
        this._notification = value;
        this._notification.type = this._getNotificationType(value);
    }

    get notification() {
        return this._notification;
    }

    constructor(
        private sessionStore: SessionStore,
        private notifier: NotifyService,
        private router: RouterService) {}

    showDetailInfo() {
        this.detail.emit(this.notification);
    }

    private _getNotificationType({ notificationType, message }) {
        if (notificationType === ActionType.PUSH_SHARED_DASHBOARD) {
            if (message.indexOf('deleted') > 0) {
                return 'Delete shared dashboard';
            } else {
                return 'Share dashboard';
            }
        } else if (notificationType === ActionType.PUSH_SHARED_WORKSPACE) {
            if (message.indexOf('deleted') > 0) {
                return 'Delete shared workspace';
            } else {
                return 'Share workspace';
            }
        } else if (notificationType === ActionType.PUSH_DELETE_USER) {
            // const loginUserId = this.sessionStore.getSignInfo()['userId'];
            // // show notify window and automatically logout
            // console.log('delete user', message, ', login user', loginUserId);
            // if (loginUserId === message) {
            //     setTimeout(() => {
            //         this.notifier.info('Deleted your id. So, automatically logout after 3 seconds');
            //         this.sessionStore.clearSignin();
            //         this.router.goLogin();
            //     }, 3000);
            // }
            return `Deleted ${message} user`;
        } else {
            return notificationType;
        }
    }
}