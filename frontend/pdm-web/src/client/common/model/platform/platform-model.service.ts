import { Injectable } from '@angular/core';
import { ModelCommonService } from "../model-common.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlatformModelService extends ModelCommonService {

	constructor() { super() }

	getSession(): Observable<any> {
		return this.rxGET({
			uriPath: `session`
		});
	}

	getAuthority(): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/authorities`
		});
	}

	deleteSession() {
		return this.DELETE({
			uriPath: `session`
		});
	}

    getUser(userId: any) {
        return this.GET({
            uriPath: `usermgt/users/${userId}`
        });
    }

	getUsers() {
		return this.GET({
			uriPath: `usermgt/users`
		});
	}

	getGroup(groupId: any) {
		return this.GET({
			uriPath: `usermgt/groups/${groupId}`
		});
	}

    getGroups() {
        return this.GET({
            uriPath: `usermgt/groups`
        });
    }

	getNotifications() {
		return this.GET({
			uriPath: `notifications`
		});
	}

	updateNotificationRead(id, request: any = {}) {
		return this.PUT({
			uriPath: `notifications/${id}/read`,
			params: request
		});
	}

	updateNotificationsRead(request: any = {}) {
		return this.PUT({
			uriPath: `notifications/read`,
			params: request
		});
	}

	getNotificationUnreadCount(request: any) {
		return this.PUT({
			uriPath: `notifications/unreadcount`,
			params: request
		});
	}

    getGroupUsers(groupId: any) {
        return this.GET({
            uriPath: `usermgt/groupusers/${groupId}`
        });
    }

    getRxGroupUsers(groupId: any): Observable<any> {
        return this.rxGET({
            uriPath: `usermgt/groupusers/${groupId}`
        });
    }
}
