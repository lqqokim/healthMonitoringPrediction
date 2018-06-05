import { Injectable } from '@angular/core';
import { ModelCommonService } from "../../model-common.service";

@Injectable()
export class MccModelService extends ModelCommonService {

	constructor() { super() }

	//mcc/tools
	getProcessTime( toolId: number, param: any ){
		return this.POST({
			uriPath: `mcc/tools/${toolId}/processtime`,
			params: param
		});
	}

	getPpidsOfProcessSummarize( param: any ) {
		return this.POST({
			uriPath: `mcc/tools/ppids/processsummarize`,
			params: param
		});
	}

	getProcessSummarize( toolId: number, param: any ) {
		return this.POST({
			uriPath: `mcc/tools/${toolId}/processsummarize`,
			params: param
		});
	}

	getToolModel( toolId: number ) {
		return this.GET({
			uriPath: `mcc/tools/${toolId}/toolmodel`
		});
	}

	// getToolProcessNames( toolId: number ) {
	// 	return this.GET({
	// 		uriPath: `mcc/tools/${toolId}/processnames/?processType=LOT`
	// 	});
	// }

	// getModuleProcessNames( toolId: number, moduleId: number ){
	// 	return this.GET({
	// 		uriPath: `mcc/tools/${toolId}/modules/${moduleId}/processnames/?processType=WAFER`
	// 	});
	// }

	getToolProcessNames(  toolId: number, params:any ) {
		return this.GET({
			uriPath: `mcc/tools/${toolId}/processnames/`,
			querystring: params
		});
	}

	getModuleProcessNames( toolId: number, moduleId: number, params:any ){
		return this.GET({
			uriPath: `mcc/tools/${toolId}/modules/${moduleId}/processnames`,
			querystring: params
		});
	}

	// getProcessnames( toolId: number, moduleId: number, params: any ) {
	// 	return this.GET({
	// 		uriPath: `mcc/tools/${toolId}/modules/${moduleId}/processnames`,
	// 		querystring: params
	// 	});
	// }

	// getEventProcessNames(toolId: number, moduleId: number) {
	// 	return this.GET({
	// 		uriPath: `mcc/tools/${toolId}/modules/${moduleId}/processnames/?processType=EVENT`
	// 	});
	// }

	getModuleProcessTime( toolId: number, moduleId: number, params: any ){
		return this.POST({
			uriPath: `mcc/tools/${toolId}/modules/${moduleId}/processtime`,
			params: params
		});
	}

	getModulesByModuleType( toolId: number, moduleType: string ) {
		return this.GET({
			uriPath: `mcc/tools/${toolId}/modules/?moduleTypeName=${moduleType}`
		});
	}

	//mcc/inlinetools
	getDailyCauses( inlineToolId: number, param: any ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/bottleneckanalysis/intellimine/dailycauses`,
			querystring: param
		});
	}

	getToolsByModelType( inlineToolId: number, modelType: string ) {
		// modelType: TRACK, SCANNER
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/tools?toolModelType=${modelType}`
		});
	}

	getInlineToolMaintanance( inlineToolId: number, param: any ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/maintanance`,
			querystring: param
		});
	}

	getToolsByToolType( inlineToolId: number, tool: string ) {
		// inlineToolId: TRACK, SCANNER
		let modelType: string = undefined;
		if(tool == 'CLUSTER' || tool == 'PRE_EXPOSURE' || tool == 'POST_EXPOSURE') {
			modelType = 'TRACK';
		} else if(tool == 'SCANNER') {
			modelType = 'SCANNER';
		}
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/tools?toolModelType=${modelType}`
		});
	}

	getInlineToolLostDailySummary(inlineToolId: number, params: any) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/lostcategorydailysummarize`,
			querystring: params
		});
	}

    getLostCategorySummarize(inlineToolId: number, timePeriod: any) {
        let param: any = {
            startDtts: timePeriod.from,
            endDtts: timePeriod.to
        };
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/lostcategorysummarize`,
			querystring: param
		});
    }

	getInlineToolLostTime(inlineToolId: number, params: any ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/losttime`,
			querystring: params
		});
	}

	getInlineToolRecipeThroughput(inlineToolId: number, params: any) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/recipethroughput`,
			querystring: params
		});
	}

	getEffects( inlinetoolId: number, params: any ){
		return this.GET({
			uriPath: `mcc/inlinetools/${inlinetoolId}/bottleneckanalysis/intellimine/effects`,
			querystring : params
		})
	}

	getCauses( inlinetoolId: number, effect: string, params: any ){
		return this.GET({
			uriPath: `mcc/inlinetools/${inlinetoolId}/bottleneckanalysis/intellimine/effects/${effect}/causes`,
			querystring : params
		})
	}

	getCauseData( inlineToolId: number, effect: string, cause: string, causeDataType: string, params: any ){
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/bottleneckanalysis/intellimine/effects/${effect}/causes/${cause}/data/${causeDataType}`,
			querystring : params
		})
	}

	getModulesGroupProcesssummarize( inlineToolId: number, moduleGroupId: number, params: any ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/modulegroups/${moduleGroupId}/processsummarize`,
			querystring : params
		});
	}

	getModulesGroupWaferProcesssummarize( inlineToolId: number, moduleGroupId: number, params: any ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/modulegroups/${moduleGroupId}/modules/waferprocesssummary`,
			querystring : params
		});
	}

	//mcc/inlinegroups
	getToolPerformanceTrend( inlineGroupId: number, params: any ) {
		return this.GET({
			uriPath: `mcc/inlinegroups/${inlineGroupId}/toolperformancetrend`,
			querystring : params
		});
	}

	getToolPerformanceIndex( inlineGroupId: number, params: any ) {
		return this.GET({
			uriPath: `mcc/inlinegroups/${inlineGroupId}/toolperformanceindex`,
			querystring : params
		});
	}

	//mcc/toolconstantcompare
	getToolConstantCompare( param: any) {
		return this.POST({
			uriPath: `mcc/toolconstantcompare`,
			params: param
		});
	}

	getWaferTracking( inlineToolId: number, params: any ) {
		//filter ==> ?startDtts={startDtts}&endDtts={endDtts}&lot=80&ppid={ppid}
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/wafertracking/`,
			querystring: params
		})

	}

	getModuleGroups( inlineToolId: number ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/modulegroups`
		})

	}

	getModuleGroup( inlineToolId: number, moduleGroupId: number ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/modulegroups/${moduleGroupId}`
		})

	}

	getModuleTypes( inlineToolId: number, moduleGroupId: number ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/modulegroups/${moduleGroupId}/moduletypes`
		})

	}

	getModulesBlock( inlineToolId: number, moduleGroupId: number ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/modulegroups/${moduleGroupId}/modules`
		})

	}

	getInlineToolsThreshold( inlineToolId: number, params: any ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/threshold`,
			querystring: params
		});
	}

	getToolsByInlineToolId( inlineToolId: number ) {
		return this.GET({
			uriPath: `mcc/inlinetools/${inlineToolId}/tools`
		});
	}

	//lithoshot
	getContexts( moduleId: number, from: number, to: number, ppid: string ) {
		return this.GET({
			uriPath: `lithoshot/contexts/?moduleId=${moduleId}&startDtts=${from}&endDtts=${to}&ppid=${ppid}`
		});
	}

	getParameters( moduleId: number, from: number, to: number, ppid: string ) {
		return this.GET({
			uriPath: `lithoshot/parameters/?moduleId=${moduleId}&startDtts=${from}&endDtts=${to}&ppid=${ppid}`
		});
	}

	getLithoShotData( moduleId: number, substrate: any, from: number, to: number, parameter: any ) {
		return this.GET({
			uriPath: `lithoshot/paramdata/?moduleId=${moduleId}&substrate=${substrate}&startDtts=${from}&endDtts=${to}&parameter=${parameter}`
		});
	}

	// move app-model.service by jwhong
	// getInlineToolsRoot() {
	// 	return this.GET({
	// 		uriPath: `mcc/inlinetools`
	// 	})
	// }

	// move app-model.service by jwhong
	// getInLineToolsInGroup(inlinetoolId: number) {
	// 	return this.GET({
	// 		uriPath: `mcc/inlinetools/${inlinetoolId}/tools`
	// 	})
	// }

	// move app-model.service by jwhong
	// Performnace Index, RPT  = Report, Trend
	// getInlineGroups() {
	// 	return this.GET({
	// 		uriPath: `mcc/inlinegroups`
	// 	})
	// }

	/*
	getModuleGroupData(inlineToolId: number, moduleGroupId: number) {
		let moduleGroup: string = String(moduleGroupId || '');
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/modulegroups/' + moduleGroup);
	}

	

	

	

	getModulesWaferprocesssummary(inlineToolId: number, moduleGroupId: number, params: any) {
		var filter = '?startDtts=' + params.startDtts + '&endDtts=' + params.endDtts + '&ppid=' + params.ppid;
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/modulegroups/' + moduleGroupId + '/modules/waferprocesssummary' + filter);
	}

	getModelGroupThroughput(inlineToolId: number, moduleGroupId: number, params: any) {
		//filter ==> ?startDtts={startDtts}&endDtts={endDtts}&threshold=80&ppid={ppid|null}
		var filter = '?startDtts=' + params.startDtts + '&endDtts=' + params.endDtts + '&threshold=' + params.threshold + '&ppid=' + params.ppid;
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/modulegroups/' + moduleGroupId + '/throughput' + filter);
	}

	getModelGroupThroughputsummaries(inlineToolId: number, moduleGroupId: number, param: any) {
		var filter = '';
		filter += '?cutoffType=' + param.cutoffType;
		filter += '&period=' + param.period;
		filter += '&threshold=' + param.threshold;
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/modulegroups/' + moduleGroupId + '/throughputsummaries' + filter);
	}

	getWaferProcessTime() {
		return this.restful.GET('mcc/toolprocesstimestats');
	}

	getEqpPerformanceIndex() {
		return this.restful.GET('mcc/toolperformanceindex');
	}

	getProcessTimeTrend() {
		return this.restful.GET('mcc/toolprocesstime');
	}

	

	getModuleProcessTime(toolId: number, moduleId: number) {
		return this.restful.GET('mcc/tools/' + toolId + '/modules/' + moduleId + '/processtime');
	}

	getLogEventTime() {
		return this.restful.GET('mcc/logleveleventtime');
	}

	getContexts(moduleId: number, from: number, to: number) {
		return this.restful.GET('lithoshot/contexts/?moduleId=' + moduleId + '&startDtts=' + from + '&endDtts=' + to);
	}

	getParameters(moduleId: number, from: number, to: number) {
		return this.restful.GET('lithoshot/parameters/?moduleId=' + moduleId + '&startDtts=' + from + '&endDtts=' + to);
	}

	getLithoShotData(moduleId: number, substrate: string, from: number, to: number, parameter: string) {
		return this.restful.GET('lithoshot/paramdata/?moduleId=' + moduleId + '&substrate=' + substrate + '&startDtts=' + from + '&endDtts=' + to + '&parameter=' + parameter);
	}

	getTraceAnalyticResult() {
		return this.restful.GET('mcc/traceanalyticresult');
	}

	getToolProcessTimeTrend() {
		return this.restful.GET('mcc/toolprocesstimetrend');
	}

	getToolsTrend(toolId: number) {  //method 1
		return this.restful.GET('mcc/tools/' + toolId);
	}

	getModules(toolId: number) {
		return this.restful.GET('mcc/tools/' + toolId + '/modules');
	}

	getModule(toolId: number, moduleId: number) {
		return this.restful.GET('mcc/tools/' + toolId + '/modules/' + moduleId);
	}

	getModulesByModuleType(toolId: number, moduleType: string) {
		return this.restful.GET('mcc/tools/' + toolId + '/modules/?moduleTypeName=' + moduleType);
	}




	getInlineToolLostTime(inlineToolId: number) {
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/losttime');
	}

	getInlineToolLostDailySummary(inlineToolId: number) {
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/lostcategorydailysummarize');
	}



	getInlineTools() {
		return this.restful.GET('mcc/inlinetools');
	}



	getInlineToolsProperties(inlineToolId: number, propertyCode: string, params: any = {}) {
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/' + propertyCode, params);
	}

	

	

	getModuleProcessNames(toolId: number, moduleId: number) {
		return this.restful.GET('mcc/tools/' + toolId + '/modules/' + moduleId + '/processnames/?processType=WAFER');
	}

	













	getProcessTime(toolId: number, params: any = {}) {
		return this.restful.GET('mcc/tools/' + toolId + '/processtime', params);
	}



	getTools(inlineToolId: number) { //method 2
		return this.restful.GET('mcc/inlinetools/' + inlineToolId + '/tools');
	}

	getEffects(inlinetoolId: number, params: any) {
		var filter = '?startDtts=' + params.startDtts + '&endDtts=' + params.endDtts;
		// console.log(filter);
		return this.restful.GET('/mcc/inlinetools/' + inlinetoolId + '/bottleneckanalysis/intellimine/effects' + filter);
	}

	getCauses(inlineToolId: number, effectName: string, params: any) {
		var filter = '?startDtts=' + params.startDtts + '&endDtts=' + params.endDtts + '&effect.descriptors=' + params.effectDescriptors;
		return this.restful.GET('/mcc/inlinetools/' + inlineToolId + '/bottleneckanalysis/intellimine/effects/' + effectName + '/causes' + filter);
	}

	getCauseData(inlineToolId: number, effectName: string, causeName: string, causeDataType: string, params: any) {
		var filter = '?startDtts=' + params.startDtts + '&endDtts=' + params.endDtts + '&effect.descriptors=' + params.effectDescriptors + '&cause.descriptors=' + params.causeDescriptors;
		return this.restful.GET('/mcc/inlinetools/' + inlineToolId + '/bottleneckanalysis/intellimine/effects/' + effectName + '/causes/' + causeName + '/data/' + causeDataType + filter);
	}
	*/

}
