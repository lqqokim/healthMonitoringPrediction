import { Injectable } from '@angular/core';
import { MccModelService } from "../model/app/mcc/mcc-model.service";
import { AppModelService } from "../model/app/common/app-model.service";

@Injectable()
export class MccCommonService {

	constructor(private mccModel:MccModelService, private appModel:AppModelService) {
	}


	getToolIdByInlineToolIds(inlineToolIds: number[]) { //getToolId
		// return this.mccModel.getToolsByInlineToolId(inlineToolIds[0]).then((res: any) => {
		return this.appModel.getInlineToolInfo(inlineToolIds[0]).then((res: any) => {
			return [{
				inlineToolId: inlineToolIds[0],
				tools: res
			}];
		});
	}
	/*
	getToolsByToolType(inlineToolId: number, tool: string) {
		// inlineToolId: TRACK, SCANNER
		var modelType: string = undefined;
		if (tool == 'CLUSTER' || tool == 'PRE_EXPOSURE' || tool == 'POST_EXPOSURE') {
			modelType = 'TRACK';
		} else if (tool == 'SCANNER') {
			modelType = 'SCANNER';
		}
		return this.mccModel.getToolsByModelType(inlineToolId, modelType);
	}

	getProcessSummarize(toolId: number, params: any) {
		return this.mccModel.getProcessSummarize(toolId, params);
	}

	getPpidsOfProcessSummarize(params: any) {
		return this.mccModel.getPpidsOfProcessSummarize(params);
	}

	getInlineGroups() {
		return this.mccModel.getInlineGroups();
	}

	getInlineToolsByGroupId(inlineGroupId: number) {
		return this.mccModel.getInlineToolsByGroupId(inlineGroupId);
	}
	*/

	/*


	// TODO - 사용하는곳 없음
	getToolIdByInlineToolIdsTest(inlineToolIds: number[]) { //getToolId
		let deferred = $q.defer(),
			promise: any,
			toolsByInlineToolIds: any[] = [],
			returnDeferred = $q.defer();

		deferred.resolve();
		promise = deferred.promise;

		for (let i = 0; i < inlineToolIds.length; i++) {
			promise = promise.then(() => {
				return this.mccModel.getToolsByInlineToolId(inlineToolIds[i]).customGET().then((res) => {
					toolsByInlineToolIds.push({
						inlineToolId: inlineToolIds[i],
						tools: res
					});
				});
			});
		}

		promise.finally(function () {
			returnDeferred.resolve(toolsByInlineToolIds);
		});

		return returnDeferred.promise;
	}

	getInLineToolsInGroup(param: any) {
		return this.mccModel.getInLineToolsInGroup(param.inlineToolId);
	}

	getLostCategorySummarize(inlineToolId: number, timePeriod: any) {
		let params: any = {
			startDtts: timePeriod.from,
			endDtts: timePeriod.to
		};
		return this.mccModel.getInlineToolsProperties(inlineToolId, 'lostcategorysummarize', params);
	}

	

	

	getToolPerformanceIndex(inlineGroupId: number, filter: string) {
		return this.mccModel.getToolPerformanceIndex(inlineGroupId, filter);
	}

	getToolPerformanceTrend(inlineGroupId: number, filter: string) {
		return this.mccModel.getToolPerformanceTrend(inlineGroupId, filter);
	}

	

	

	getProcessTime(toolId: number, params: any) {
		return this.mccModel.getProcessTime(toolId, params);
	}

	

	getTools(inlineToolId: number) {
		return this.mccModel.getTools(inlineToolId);
	}
	*/

}
