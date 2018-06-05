import { Component, OnInit } from '@angular/core';

import { PlatformModelService } from '../../../common';
import { Util } from '../../../sdk';

import { SidebarService } from '../sidebar.service';
import { RouterService } from '../../router/router.service';

@Component({
    moduleId: module.id,
    selector: '[a3p-sidebar-panel][a3p-notification-list]',
    template: `
        <div class="a3-sidebar-group notification-list height-full">
            <div a3p-notification-list-content 
                class="a3-container-group"
                [notification]="notification"
                (detail)="showDetailInfo($event)"
                *ngFor="let notification of notifications">
            </div>
        </div>
        <div class="a3-sidebar-group notification-detail">
            <i class="arrow-right-icon sidebar-icons" (click)="hideDetailInfo()"></i>
            <div class="a3-sidebar-notification-group">
                <ul>
                    <li class="user-name">{{ detail?.type }}</li>
                    <li class="type" *ngIf="detail?.linkUrl" class="text-link">
                        Link : <a href="#" (click)="$event.preventDefault(); goPanel(detail);">{{ detail?.linkUrl }}</a>
                    </li>
                    <li class="from">From : {{ detail?.sourceUserId }}</li>
                    <li class="time">Date : {{ detail?.createDtts | date:'medium' }}</li>
                    <li class="content">{{ detail?.message }}</li>
                </ul>
            </div>
        </div>
    `,
    host: {
        'class': 'height-full'
    }
})
export class NotificationListComponent implements OnInit {

    notifications: any[];
    detail: any;
    hideDetail: boolean;

    constructor(
        private sidebar: SidebarService,
        private platform: PlatformModelService,
        private router: RouterService
    ) {}

    ngOnInit() {
        //TODO websocket 
        this.platform
            .getNotifications()
            .then((response) => {
                // TEST
                // this.notifications = [{
                //     notificationType: ActionType.PUSH_PREDEFINED_DASHBOARD,
                //     linkUrl: '/dashboards/548',
                //     dashboardId: 548,
                //     widgetId: 2835,
                //     readYN: true,
                //     type: 'PETER',
                //     sourceUserId: 'YSYUN',
                //     message: 'TEST Go to widget on dashboard',
                //     email: 'ysyun@bistel.com'
                // }];
                // this.notifications = response;
                this.notifications.forEach((notification) => notification.isActive = false);
                this.sidebar.hideSpinner();
                // when change small -> full or full -> small panel of sidebar
                if (this.detail) {
                    this.showDetailInfo(this.detail);
                }
            }, (error) => {
                console.error('get notifications exception', error);
                this.sidebar.hideSpinner();
            });
    }

    setDetailInfo(notification: any) {
        this.detail = notification;
    }

    showDetailInfo(notification: any) {
        this.detail = notification;
        this.notifications.forEach((item) => {
            if (notification.notificationId === item.notificationId) {
                item.isActive = true;
            } else {
                item.isActive = false;
            }
        });

        this.sidebar.showNotificationDetail(Util.Data.mergeDeep({}, notification));

        if (!notification.readYN) {
            this.platform
                .updateNotificationRead(notification.notificationId)
                .then(
                    (s) => { notification.readYN = true; },
                    (e) => { console.error('set read status for notification exception',e); }
                );
        }
    }

    hideDetailInfo() {
        this.detail = undefined;
        this.notifications.forEach((item) => item.isActive = false);
        this.sidebar.hideNotificationDetail();
    }

    goPanel(panel) {
        if (!panel.linkUrl) {
            return;
        }
        const infos = panel.linkUrl.split('/');

        if (panel.notificationType === ActionType.PUSH_SHARED_DASHBOARD) {
            this.router.goDashboard(infos[2]);
        }
        if (panel.notificationType === ActionType.PUSH_SHARED_WORKSPACE) {
            this.router.goHomeWorkspace(infos[2]);
        }
        if (panel.notificationType === ActionType.PUSH_PREDEFINED_DASHBOARD) {
            // TODO: make third params to query on widget
            this.router.goWidgetOnDashboard(panel.dashboardId, panel.widgetId, panel);
        }
    }
}