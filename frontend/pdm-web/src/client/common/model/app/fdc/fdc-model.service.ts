import { Injectable } from '@angular/core';
import { ModelCommonService } from "../../model-common.service";
import { Observable } from 'rxjs/Observable';


@Injectable()
export class FdcModelService extends ModelCommonService {

    constructor() { super() }

	/* TODO:
	getSites() {
		return this.restful.GET('fdc/toolstatus/equipments/sites');
	}

	getFabs(site: string) {
		return this.restful.GET('fdc/toolstatus/equipments/sites/' + site + '/fabs');
	}

	getLines(site: string, fab: string) {
		return this.restful.GET('fdc/toolstatus/equipments/sites/' + site + '/fabs/' + fab + '/lines');
	}

	getAreas(site: string, fab: string, line: string) {
		return this.restful.GET('fdc/toolstatus/equipments/sites/' + site + '/fabs/' + fab + '/lines/' + line + '/areas');
	}

	getModels(site: string, fab: string, line: string, area: string) {
		return this.restful.GET('fdc/toolstatus/equipments/sites/' + site + '/fabs/' + fab + '/lines/' + line + '/areas/' + area + '/models');
	}

	getModelVersions(site: string, fab: string, line: string, area: string, model: string) {
		return this.restful.GET('fdc/toolstatus/equipments/sites/' + site + '/fabs/' + fab + '/lines/' + line + '/areas/' + area + '/models/' + model + '/modelversions');
	} */

    getProducts(params: any) {
        return this.POST({
            uriPath: 'fdcplus/faults/products',
            params: params
        });
    }

    getFaults(params: any) {
        return this.POST({
            uriPath: 'fdcplus/faults',
            params: params
        });
    }

    getFaultDetails(param: any) {
        return this.rxPOST({
            uriPath: `fdcplus/faults/details/`,
            params: param
        });
    }

    getFaultDetailsConfig(param: any) {
        return this.POST({
            uriPath: `fdcplus/faults/details/fdtaconfig`,
            params: param
        });
    }

    getFaultDetailsByType(param: any, faultType: string) {
        faultType = faultType.toUpperCase();

        return this.rxPOST({
            uriPath: `fdcplus/faults/details/${faultType}`,
            params: param
        });
    }

    getFaultDetailsAnnotations(param: any, faultType: string) {
        faultType = faultType.toUpperCase();

        return this.POST({
            uriPath: `fdcplus/faults/details/${faultType}/anotations`,
            params: param
        });
    }

    getSpcCharts(param: any, rawId?: number) {
        if (rawId === undefined) {
            return this.POST({
                uriPath: `spc/charts`,
                params: param
            });
        } else {
            return this.GET({
                uriPath: `spc/charts/${rawId}`,
                querystring: param
            });
        }
    }

    getTraceParamsWithModelInfo(param: any) {
        return this.POST({
            uriPath: `eesdata/getTraceParamsWithModelInfo`,
            params: param
        });
    }
    getTraceParamsWithModelInfoAnalysis(param: any) {
        return this.POST({
            uriPath: `eesdata/getTraceParamsWithModelInfoAnalysis`,
            params: param
        });
    }

    getTraceParamData(param: any) {
        return this.POST({
            uriPath: `eesdata/getTraceParamData`,
            params: param
        });
    }
    getTraceParamDataAnalysis(param: any) {
        return this.POST({
            uriPath: `eesdata/getTraceParamDataAnalysis`,
            params: param
        });
    }

    getfdtaParameters(param: any) {
        return this.POST({
            uriPath: `fdcplus/fdta/parameters`,
            params: param
        });
    }

    getfdtaWafers(param: any) {
        return this.POST({
            uriPath: `fdcplus/fdta/wafers`,
            params: param
        });
    }

    getSpcModels(param: any) {
        return this.POST({
            uriPath: `fdcplus/faults/spc/models`,
            params: param
        });
    }

    getSpcChartByType(param: any, chartType: string) {
        return this.POST({
            uriPath: `fdcplus/faults/spc/chart/${chartType}`,
            params: param
        });
    }

    getSpcChartTypes() {
        return this.GET({
            uriPath: `apps/FDC/codecategories/SPCChartType/codes?used=true`
        });
    }

    getTraceChartModels(param: any) {
        return this.POST({
            uriPath: `fdcplus/faults/trace/models`,
            params: param
        });
    }

    getTraceChart(param: any) {
        return this.POST({
            uriPath: `fdcplus/faults/trace/chart`,
            params: param
        });
    }
    getTraceTrendChart(param: any): Observable<any> {
        return this.rxPOST({
            uriPath: `chart/trace`,
            params: param
        });
    }
    getSummaryTrendChart(param: any): Observable<any> {
        return this.rxPOST({
            uriPath: `chart/summary`,
            params: param
        });
    }

    getFdtaModels(param: any) {
        return this.POST({
            uriPath: `fdcplus/faults/fdta/models`,
            params: param
        });
    }

    getParameterRecipeStep(param: any) {
        return this.POST({
            uriPath: `fdcplus/fdta/score/parameterrecipestep`,
            params: param
        });
    }

    getFdtaSubstrates(param: any) {
        return this.POST({
            uriPath: `fdcplus/faults/fdta/substrates`,
            params: param
        });
    }

    getTraceChartWithRefWafers(param: any) {
        return this.POST({
            uriPath: `fdcplus/faults/fdta/chartwithrefwafers`,
            params: param
        });
    }

    getDFDContextTypeCodes() {
        return this.GET({
            uriPath: `apps/FDC/codecategories/ContextType/codes`
        });
    }

    getfdtaConfigList() {
        return this.GET({
            uriPath: `fdcplus/fdta/configuration/list`
        });
    }

    getfdtaOptionList(param: any) {
        return this.POST({
            uriPath: `fdcplus/fdta/configuration/option/list`,
            params: param
        });
    }

    savefdtaOption(param: any) {
        return this.POST({
            uriPath: `fdcplus/fdta/configuration/save`,
            params: param
        });
    }


    /**************************************/
    /************* Analysis ***************/
    /**************************************/

    // /history/{guid}/{userid}/{moduleids}/{parameterids}/{steps}/{historytype}
    deleteHistory(guid): Observable<any> {
        let Url = `fdc/analysis/history/${guid}`;
        return this.rxDELETE({
            uriPath: Url
        })
    }

    getSummaryChamberTypes(fromdate: any, todate: any): Observable<any> {
        let chambertypeUrl = `fdc/analysis/summarychambertypes/${fromdate}/${todate}`;
        return this.rxGET({
            uriPath: chambertypeUrl
        })
    }

    getSummaryChambers(param: any): Observable<any> {
        // /service/fdc/chambers
        return this.rxPOST({
            uriPath: `fdc/analysis/summarychambers`,
            params: param
        })
    }

    getRecipes(param: any): Observable<any> {
        return this.rxPOST({
            uriPath: `fdc/analysis/recipes`,
            params: param
        })
    }

    getRecipeSteps(param: any): Observable<any> {
        return this.rxPOST({
            uriPath: `fdc/analysis/recipesteps`,
            params: param
        })
    }

    getSummaryParameters(param: any): Observable<any> {
        return this.rxPOST({
            uriPath: `fdc/analysis/summaryparams`,
            params: param
        })
    }

    getSummaryRecipes(guid: any): Observable<any> {
        return this.rxGET({
            uriPath: `fdc/analysis/summaryrecipes/${guid}`
        });
    }

    getSummaryRecipeSteps(guid: any): Observable<any> {
        return this.rxGET({
            uriPath: `fdc/analysis/summaryrecipesteps/${guid}`
        });
    }
    getSummaryRecipeAndSteps(guid: any): Observable<any> {
        return this.rxGET({
            uriPath: `fdc/analysis/summaryrecipeandsteps/${guid}`
        });
    }
    getSummaryRecipeAndStepsWithFile(guid: any, userId): Observable<any> {
        return this.rxGET({
            uriPath: `fdc/analysis/summaryrecipeandstepswithfile/${guid}/${userId}`
        });
    }
    getTraceRecipeAndStepsWithFile(guid: any, userId): Observable<any> {
        return this.rxGET({
            uriPath: `fdc/analysis/tracerecipeandstepswithfile/${guid}/${userId}`
        });
    }




    //Analysis Trace Trend
    getTraceChamberTypes(fromdate: any, todate: any): Observable<any> {
        let chambertypeUrl = `fdc/analysis/tracechambertypes/${fromdate}/${todate}`;
        return this.rxGET({
            uriPath: chambertypeUrl
        })
    }

    getTraceChambers(param: any): Observable<any> {
        // /service/fdc/chambers
        return this.rxPOST({
            uriPath: `fdc/analysis/tracechambers`,
            params: param
        })
    }

    getTraceParameters(param: any): Observable<any> {
        return this.rxPOST({
            uriPath: `fdc/analysis/traceparams`,
            params: param
        })
    }

    //Analysis common
    getAnalysisHistory(userId, historytype): Observable<any> {
        return this.rxGET({
            uriPath: `fdc/analysis/history/${userId}/${historytype}`
        });
    }




    /*
       // eesdata
       getTraceParamsWithModelInfo() {
           return this.restful.GET('eesdata/getTraceParamsWithModelInfo');
       }

       getTraceParamData() {
           return this.restful.GET('eesdata/getTraceParamData');
       }

       getSpcCharts() {
           return this.restful.GET('spc/charts');
       }

       getfdtaConfigList() {
           return this.restful.GET('fdcplus/fdta/configuration/list');
       }

       getfdtaOptionList() {
           return this.restful.GET('fdcplus/fdta/configuration/option/list');
       }

       savefdtaOption() {
           return this.restful.GET('fdcplus/fdta/configuration/save');
       }

       getfdtaParameters() {
           return this.restful.GET('fdcplus/fdta/parameters');
       }

       getfdtaWafers() {
           return this.restful.GET('fdcplus/fdta/wafers');
       }


       */

    getParamCategorySum(): Observable<any> {
        return this.rxGET({
            uriPath: `fdcplus/fdta/configuration/paramcategorysum`
        });
    }

    getParamCategories(selectedList: Array<any>): Observable<any> {
        return this.rxPOST({
            uriPath: `fdcplus/fdta/configuration/paramcategories`,
            params: selectedList
        });
    }

    updateParamCategories(params: any): Observable<any> {
        return this.rxPUT({
            uriPath: `fdcplus/fdta/configuration/paramcategories`,
            params: params
        });
    }

    paramcategoriesImport(params: any): Observable<any> {
        return this.rxPUT({
            uriPath: `fdcplus/fdta/configuration/paramcategoriesimport`,
            params: params
        });
    }

    getPrioriityCodes(): Observable<any> {
        return this.rxGET({
            uriPath: `fdc/prioritycodes`
        });
    }

    deletePrioritycodes(codeId: number): Observable<any> {
        return this.rxDELETE({
            uriPath: `fdc/prioritycodes/${codeId}`
        });
    }

    insertPrioritycodes(params: any): Observable<any> {
        return this.rxPUT({
            uriPath: `fdc/prioritycodes`,
            params: params
        });
    }

    updatePrioritycodes(params: any): Observable<any> {
        return this.rxPUT({
            uriPath: `fdc/prioritycodes`,
            params: params
        });
    }
}
