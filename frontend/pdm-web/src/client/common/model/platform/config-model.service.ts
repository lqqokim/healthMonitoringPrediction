import { Injectable } from '@angular/core';
import { ModelCommonService } from "../model-common.service";

@Injectable()
export class ConfigModelService extends ModelCommonService {

	constructor() { super(); }

	getToolModels() {
		return this.GET({
			uriPath: `toolmodels`
		});
	}

	getToolModelVersions(toolModelId: any) {
		return this.GET({
			uriPath: `toolmodels/${toolModelId}/toolmodelversions`
		});
	}

	getToolsByLocationId(locationId: any) {
		return this.GET({
			uriPath: `locations/${locationId}/tools`
		});
	}

	getToolsByModelId(toolModelId: any) {
		return this.GET({
			uriPath: `toolmodels/${toolModelId}/tools`
		});
	}

	getToolsByModelVersion(toolModelId: any, toolModelVersionId: any) {
		return this.GET({
			uriPath: `toolmodels/${toolModelId}/toolmodelversions/${toolModelVersionId}/tools`
		});
	}

	getLocations(locationId: any) {
		/*
		 var param = "?parentLocationId=";
		 if( locationid ) {
		 param += locationid;
		 }
		 */
		return this.GET({
			uriPath: `locations?parentLocationId=${locationId}`
		});
	}

	getLocationTypes() {
		return this.GET({
			uriPath: `locationtypes`
		});
	}

	getProducts() {
		return this.GET({
			uriPath: `products`
		});
	}

	getOperations() {
		return this.GET({
			uriPath: `operations`
		});
	}

	getRecipes() {
		return this.GET({
			uriPath: `recipes`
		});
	}

	getConditions(workspaceId: number, taskerId: number) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/conditions`
		});
	}

	getConditionKey(workspaceId: number, taskerId: number, key: any) {
		return this.GET({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/conditions/${key}`
		});
	}

	createConditions(workspaceId: number, taskerId: number, params: any) {
		return this.PUT({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/conditions`,
			params
		});
	}

	updateConditions(workspaceId: number, taskerId: number, params: any) {
		return this.createConditions(workspaceId, taskerId, params);
	}

	updateConditionKey(workspaceId: number, taskerId: number, key: any, params: any) {
		return this.PUT({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/conditions/${key}`,
			params
		});
	}

	deleteConditionKey(workspaceId: any, taskerId: any, key: any) {
		return this.DELETE({
			uriPath: `workspaces/${workspaceId}/taskers/${taskerId}/conditions/${key}`
		});
	}

	/*
	TODO
	getProperties(workspaceId: any, taskerId: any) {
		return this.GET('workspaces/' + workspaceId + '/taskers/' + taskerId + '/properties');
	}

	getBehaviors(workspaceId: any, taskerId: any) {
		return this.GET('workspaces/' + workspaceId + '/taskers/' + taskerId + '/behaviors');
	}
	*/
}

