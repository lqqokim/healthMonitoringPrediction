import { Injectable } from '@angular/core';
import { AppModelService } from "../model/app/common/app-model.service";

@Injectable()
export class AppCommonService {

	constructor(private appModel:AppModelService) {}

	getModules(toolId: number) {
		return this.appModel.getModules(toolId);
	}

	/*
	getToolsTrend(toolId: number) {
		return this.appModel.getToolsTrend(toolId);
	}

	getModules(toolId: number) {
		return this.appModel.getModules(toolId);
	}

	getModule(toolId: number, moduleId: number) {
		return this.appModel.getModule(toolId, moduleId);
	}

	getInlinetools() {
		return this.appModel.getInlineTools();
	}

	getInlineToolInfo(inlineToolId: number) {
		return this.appModel.getInLineToolsInGroup(inlineToolId);
	}
	*/

}


