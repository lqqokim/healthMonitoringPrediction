import { Injectable } from '@angular/core';
import { ModelCommonService } from '../../model-common.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ToolModelService extends ModelCommonService {

	constructor() { super() }

	getLocations(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/locations/`
		});
	}
	getLocationList(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/location/`
		});
	}
	getLocation(locationId: string): Observable<any> {
		return this.rxGET({
			uriPath: `tools/location/${locationId}`
		});
	}
	createLocation(location: any): Observable<any> {
		return this.rxPOST({
			uriPath: `tools/location/`,
			params: location
		});
	}
	modifyLocation(location: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/location/${location.locationId}`,
			params: location
		});
	}
	deleteLocation(location: String): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/location/`,
			params: location
		});
	}

	getLocationTypes(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/locationtype/`
		});
	}
	getLocationTools(locationId: string): Observable<any> {
		return this.rxGET({
			uriPath: `tools/locationtools/${locationId}`
		});
	}
	getTools(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/tool/`
		});
	}
	getTool(toolId): Observable<any> { // Select EQP : module list
		return this.rxGET({
			uriPath: `tools/tools/${toolId}`
		});
	}
	createTool(tool: any): Observable<any> {

		return this.rxPOST({
			uriPath: `tools/tools/`,
			params: tool
		});
	}

	modifyTool(tool: any): Observable<any> {

		return this.rxPUT({
			uriPath: `tools/tools/${tool.toolId}`,
			params: tool
		})
	}
	deleteTool(tool: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/tools/`,
			params: tool
		})
	}

	createModule(module: any): Observable<any> {
		return this.rxPOST({
			uriPath: `tools/modules/`,
			params: module
		});
	}
	modifyModule(module: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/modules/${module.moduleId}`,
			params: module
		})
	}
	deleteModule(module: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/modules/`,
			params: module
		})
	}
	getToolGroups(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/toolgroup/`
		});
	}
	getToolGroup(toolGroupId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/toolsgroup/${toolGroupId}`
		});
	}


	createToolGroup(toolGroup: any): Observable<any> {
		return this.rxPOST({
			uriPath: `tools/toolsgroup/`,
			params: toolGroup
		})
	}
	modifyToolGroup(toolGroup: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/toolsgroup/${toolGroup.toolGroupId}`,
			params: toolGroup
		})
	}
	deleteToolGroup(toolGroup: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/toolsgroup/`,
			params: toolGroup
		})
	}


	getModuleTypes(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/moduletype/`
		});
	}

	getModuleType(moduleTypeId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/moduletype/${moduleTypeId}`
		});
	}

	createModuleType(moduleType: any): Observable<any> {
		return this.rxPOST({
			uriPath: `tools/moduletype/`,
			params: moduleType
		})
	}

	modifyModuleType(moduleType: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/moduletype/${moduleType.moduleTypeId}`,
			params: moduleType
		})
	}

	deleteModuleType(moduleTypeId: string): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/moduletype/`,
			params: moduleTypeId
		})
	}

	// 		deleteModuleType(moduleType: any): Observable<any> {
	// 	return this.rxDELETE({
	// 		uriPath: `tools/moduletype/`,
	// 		params: moduleType
	// 	})
	// }


	getToolModelVersions(modelId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/toolmodelmodelver/${modelId}`
		});
	}
	getToolModelVersion(modelVersionId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/toolmodelsver/${modelVersionId}`
		});
	}

	createToolModelVer(toolModelVer: any): Observable<any> {

		return this.rxPOST({
			uriPath: `tools/toolmodelver/`,
			params: toolModelVer
		});
	}
	modifyToolModelVer(toolModelVer: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/toolmodelver/${toolModelVer.toolModelVerId}`,
			params: toolModelVer
		})
	}
	deleteToolModelVer(toolModelVer: String): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/toolmodelver/`,
			params: toolModelVer
		})
	}

	getInlineTools(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/inlinetool/`
		});
	}
	getInlineTool(inlineToolId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/toolsinlinetool/${inlineToolId}`
		});
	}
	createInlineTool(inlineTool: any): Observable<any> {

		return this.rxPOST({
			uriPath: `tools/toolsinlinetool/`,
			params: inlineTool
		});
	}
	modifyInlineTool(inlineTool: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/toolsinlinetool/${inlineTool.inlineToolId}`,
			params: inlineTool
		})
	}
	deleteInlineTool(inlineTool: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/toolsinlinetool/`,
			params: inlineTool
		})
	}


	getModules(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/module/`
		});
	}

	modifyModules(modules: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/modules/`,
			params: modules
		});
	}

	getModulesByParentId(parentId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/modules/parent/${parentId}`
		});
	}

	// 	getModuleByParentId(parentId): Observable<any> {
	// 	return this.rxGET({
	// 		uriPath: `tools/modules/parent/${parentId}`
	// 	});
	// }

	getModulesAllByToolId(toolId): Observable<any> { // EQP에 대한 모든 Module Call
		return this.rxGET({
			uriPath: `tools/modulesall/${toolId}`
		});
	}

	getModulesByToolId(toolId): Observable<any> { // EQP에 대한 Module Call
		return this.rxGET({
			uriPath: `tools/modulesall/${toolId}`
		});
	}

	getModuleGroups(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/modulegroup/`
		});
	}

	getModuleGroup(moduleGroupId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/modulesgroup/${moduleGroupId}`
		});
	}
	createModuleGroup(moduleGroup: any): Observable<any> {

		return this.rxPOST({
			uriPath: `tools/modulesgroup/`,
			params: moduleGroup
		});
	}
	modifyModuleGroup(moduleGroup: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/modulesgroup/{moduleGroup.moduleGroupId}`,
			params: moduleGroup
		})
	}
	deleteModuleGroup(moduleGroup: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/modulesgroup/`,
			params: moduleGroup
		})
	}



	getInlineGroups(): Observable<any> {

		return this.rxGET({
			uriPath: `tools/inlinegroup/`
		});
	}

	getInlineGroup(inlineGroupId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/inlinetoolsgroup/${inlineGroupId}`
		});
	}
	createInlineGroup(inlineGroup: any): Observable<any> {

		return this.rxPOST({
			uriPath: `tools/inlinetoolsgroup/`,
			params: inlineGroup
		});
	}
	modifyInlineGroup(inlineGroup: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/inlinetoolsgroup/{inlineGroup.inlineGroupId}`,
			params: inlineGroup
		})
	}
	deleteInlineGroup(inlineGroup: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/inlinetoolsgroup/`,
			params: inlineGroup
		})
	}


	getToolModels(): Observable<any> {
		return this.rxGET({
			uriPath: `tools/toolmodel/`

		});
	}
	getToolModel(toolModelId): Observable<any> {
		return this.rxGET({
			uriPath: `tools/toolmodel/${toolModelId}`

		});
	}
	createToolModel(toolModel: any): Observable<any> {

		return this.rxPOST({
			uriPath: `tools/toolmodel/`,
			params: toolModel
		});
	}
	modifyToolModel(toolModel: any): Observable<any> {
		return this.rxPUT({
			uriPath: `tools/toolmodel/${toolModel.toolModelId}`,
			params: toolModel
		})
	}
	deleteToolModel(toolModelId: any): Observable<any> {
		return this.rxDELETE({
			uriPath: `tools/toolmodel/`,
			params: toolModelId
		})
	}

}
