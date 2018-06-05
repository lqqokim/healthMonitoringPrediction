import { Injectable } from '@angular/core';
import { ModelCommonService } from "../model-common.service";

@Injectable()
export class MapModelService extends ModelCommonService {

	constructor() { super() }

	getWorkspacemap(userId: string, filter?: any) {
		return this.GET({
			uriPath: `workspacemap/${userId}`,
			// querystring: {includeSharedUserMap: true}
			querystring: filter
		});
	}

	getTaskerWorkspacemap(workspaceId: number) {
		return this.GET({
			uriPath: `workspacemap/workspace/${workspaceId}`
		})
	}

	getSharedWorkspacemap(userId: string) {
		return this.GET({
			uriPath: `workspacemap/shared/${userId}`
		});
	}

	getSharingWorkspacemap(userId: string) {
		return this.GET({
			uriPath: `workspacemap/sharing/${userId}`
		});
	}

	getTaskerScheduler() {
		return this.GET({
			uriPath: `automation/scheduler/tasker`
		});
	}

	getScheduler() {
		return this.GET({
			uriPath: `automation/scheduler`
		});
	}

	getStateScheduler() {
		return this.GET({
			uriPath: `automation/scheduler/state`
		});
	}

	getMapShareUsers() {
		return this.GET({
			uriPath: `workspacemap/share/users`
		});
	}
}
