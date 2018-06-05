import { Injectable } from '@angular/core';
import { ModelCommonService } from "../model-common.service";

@Injectable()
export class WorkspaceModelService extends ModelCommonService {

	constructor() { super() }

	getWorkspaces(filter: string = '') {
		return this.GET({
			uriPath: `workspaces`,
			querystring: filter
		});
	}

	getWorkspace(workspaceId: number) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}`
		});
	}

	createWorkspace(request: any) {
		return this.PUT({
			uriPath: `workspaces`,
			params: request
		});
	}

	updateWorkspace(workspaceId: number, request: any) {
		return this.PUT({
			uriPath: `workspaces/${workspaceId}`,
			params: request
		});
	}

	deleteWorkspace(workspaceId: number) {
		return this.DELETE({
			uriPath: `workspaces/${workspaceId}`
		});
	}

	deleteWorkspaces(request: any) {
		return this.DELETE({
			uriPath: `workspaces`,
			params: request
		});
	}

	getTaskers(workspaceId: number) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/taskers`
		});
	}

	getTasker(workspaceId: number, taskerId: number) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}`
		});
	}

	createTasker(workspaceId: number, request: any) {
		return this.PUT({
			uriPath: `workspaces/${workspaceId}/taskers`,
			params: request
		});
	}

	updateTasker(workspaceId: number, taskerId: number, request: any) {
		return this.PUT({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}`,
			params: request
		});
	}

	deleteTasker(workspaceId: number, taskerId: number) {
		return this.DELETE({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}`
		});
	}

	getConditions(workspaceId: any, taskerId: any) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/conditions`
		});
	}

	getProperties(workspaceId: any, taskerId: any) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/properties`
		});
	}

	getBehaviors(workspaceId: any, taskerId: any) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/behaviors`
		});
	}

	getTaskerTypes() {
		return this.GET({
			uriPath: `taskertypes`
		});
	}

	getTaskerType(key: string, value: string) {
		return this.GET({
			uriPath: `taskertypes?${key}=${value}`
		});
	}

	getMyWorkspaces() {
		return this.GET({
			uriPath: `workspaces/myworkspaces`,
		});
	}

	getMyWorkspace(workspaceId: number) {
		return this.GET({
			uriPath: `workspaces/myworkspaces/${workspaceId}`
		});
	}

	updateWorkspaceFavorite(worksapceId: number, request: any) {
		return this.PUT({
			uriPath: `workspaces/${worksapceId}/favorite`,
			params: request
		});
	}

	/************************************************************************
     *
     * Share dashboard
     *
     ************************************************************************/
	getWorkspacesSharemembers(workspaceId: number) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/sharemembers`
		});
	}

	updateWorkspacesSharemembers(workspaceId: number, request: any) {
		return this.PUT({
			uriPath: `workspaces/${workspaceId}/sharemembers`,
			params: request
		});
	}

	deleteWorkspacesSharemembers(workspaceId: number, request: any) {
		return this.DELETE({
			uriPath: `workspaces/${workspaceId}/sharemembers`,
            params: request
		});
	}

}
