import { Injectable } from '@angular/core';
import {
    RestfulModelService,
    RestfulOptions,
    RestfulParamsOptions,
    InjectorUtil
} from "../../../sdk";

@Injectable()
export class SelectorGroupService {
    RESTFUL: RestfulModelService;

    constructor() {
        this.RESTFUL = InjectorUtil.getService(RestfulModelService);
    }

    GET(options: RestfulOptions) {
        return this.RESTFUL.GET(options);
    }

    POST(options: RestfulParamsOptions) {
        return this.RESTFUL.POST(options);
    }

    getParameters(parameters) {
        return this.POST({
            uriPath: 'fdcplus/faults/details/parameters',
            params: parameters
        });
    }

    getToolModel(locationId: any) {
        return this.GET({
            uriPath: `toolmodels?locationId=${locationId}&includeChildLocation=false`
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

    getToolsByModelId(toolModelId: any, locationId: any) {
        return this.GET({
            uriPath: `toolmodels/${toolModelId}/tools?locationId=${locationId}&usedYn=Y`
        });
    }

    getToolsByModelVersion(toolModelId: any, toolModelVersionId: any) {
        return this.GET({
            uriPath: `toolmodels/${toolModelId}/toolmodelversions/${toolModelVersionId}/tools`
        });
    }

    getLocations(locationId: any) {
        if (locationId === null || locationId === undefined) {
            locationId = '';
        }

        return this.GET({
            uriPath: `locations?parentLocationId=${locationId}`
        });
    }

    getLocationTypes() {
        return this.GET({
            uriPath: `locationtypes`
        });
    }

}

