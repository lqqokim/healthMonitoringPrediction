import { Injectable } from '@angular/core';
import { ModelCommonService } from "../../model-common.service";
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UserModelService extends ModelCommonService {

	constructor() { super() }

	getUsers(): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/users/`
		});
	}

	getUser(userId: string): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/users/${userId}`
		});
	}
	createUser(users: any[]): Observable<any> {
		return this.rxPOST({
			uriPath: 'usermgt/users/',
			params: users
		});
	}
	modifyUser(user: any): Observable<any> {
		return this.rxPUT({
			uriPath: `usermgt/users/${user.userId}`,
			params: user
		});

	}
	modifyUserProfile(user: any): Observable<any> {
		return this.rxPUT({
			uriPath: `usermgt/userprofile/${user.userId}`,
			params: user
		});

	}
	deleteUser(users: any[]): Observable<any> {
		return this.rxDELETE({
			uriPath: 'usermgt/users/',
			params: users
		});

	}


	getGroups(): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/groups/`
		});
	}
	getGroup(groupId: string): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/groups/${groupId}`
		});
	}
	createGroup(groups: any[]): Observable<any> {
		return this.rxPOST({
			uriPath: 'usermgt/groups/',
			params: groups
		});
	}
	modifyGroup(group: any): Observable<any> {
		return this.rxPUT({
			uriPath: `usermgt/groups/${group.userId}`,
			params: group
		});

	}
	deleteGroup(groups: any[]): Observable<any> {
		return this.rxDELETE({
			uriPath: 'usermgt/groups/',
			params: groups
		});

	}


	getRoles(): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/roles/`
		});
	}
	getRole(roleId: string): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/roles/${roleId}`
		});
	}
	createRole(roles: any[]): Observable<any> {
		return this.rxPOST({
			uriPath: 'usermgt/roles/',
			params: roles
		});
	}
	modifyRole(role: any): Observable<any> {
		return this.rxPUT({
			uriPath: `usermgt/roles/${role.roleId}`,
			params: role
		});

	}
	deleteRole(roles: any[]): Observable<any> {
		return this.rxDELETE({
			uriPath: 'usermgt/roles/',
			params: roles
		});

	}
	getPermissions(): Observable<any> {
		return this.rxGET({
			uriPath: `usermgt/permissions/`
		});
	}

	createObject(objects: any[]): Observable<any> {
		return this.rxPOST({
			uriPath: 'usermgt/permissions/',
			params: objects
		});
	}
	modifyObject(object: any): Observable<any> {
		return this.rxPUT({
			uriPath: `usermgt/permissions/${object.objectId}`,
			params: object
		});
	}
	deleteObject(object: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `usermgt/permissions/${object.objectId}`
		});
	}
}
