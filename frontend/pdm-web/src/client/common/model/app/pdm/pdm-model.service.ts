import { Injectable } from '@angular/core';
import { ModelCommonService } from '../../model-common.service';
import * as pdmI from '../../../../plugins/widgets/pdm-modeler/pdm-modeler.interface';
import * as pdmRadarI from '../../../../plugins/widgets/pdm-radar/model/pdm-radar.interface';
import { Observable } from 'rxjs';



@Injectable()
export class PdmModelService extends ModelCommonService {

	constructor() { super(); }

	getPlants() {
		return this.GET({
			uriPath: `pdm/fabs`
		});
	}

	getAreaStatus(plantId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areastatus`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getEqpStatus(plantId, areaId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqpstatus`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getParamStatus(plantId, areaId, eqpId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/paramstatus`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getMeasurements(plantId, areaId, eqpId, paramId, from, to) {
		console.log({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/${paramId}/measuretrx`,
			querystring: {
				fromdate: from,
				todate: to
			},

		});
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/${paramId}/measuretrx`,
			querystring: {
				fromdate: from,
				todate: to
			},

		});
	}
	getMaintenance(plantId, areaId, eqpId, from, to) {
		console.log({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/maintenance`,
			querystring: {
				fromdate: from,
				todate: to
			},

		});
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/maintenance`,
			querystring: {
				fromdate: from,
				todate: to
			},

		});
	}
	getParamInfoByEqpId(plantId, areaId, eqpId) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/paramInfo`,
			querystring: {
			},

		});
	}

	// getTimewaves(plantId, areaId, eqpId, measurementId) {
	// 	return this.GET({
	// 		uriPath: `pdm//fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/measuretrxbin/${measurementId}/timewave`
	// 	})
	// }

	// getSpectra(plantId, areaId, eqpId, measurementId) {
	// 	return this.GET({
	// 		uriPath: `pdm//fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/measuretrxbin/${measurementId}/spectrum`
	// 	})
	// }

	getNodeTree(plantId) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/tree`
		});
	}

	getHealthIndex(plantId, areaId, eqpId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/healthindex`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getContribute(plantId, areaId, eqpId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/contribute`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}
	//  getMeasurements(plantId,areaId,eqpId,paramId,from,to){
	// 	return this.GET({
	// 		uriPath: `pdm//fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/{paramId}/measuretrx?from=`+from+` to=`+to
	// 	});
	// }

	getTimewave(plantId, areaId, eqpId, key) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/measuretrxbin/${key}/timewave`
		});
	}

	getSpectrum(plantId, areaId, eqpId, key) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/measuretrxbin/${key}/spectrum`
		});
	}

	getMeasureRPM(plantId, areaId, eqpId, key) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/measuretrxbin/${key}/rpm`
		});
	}

	getElectricCurrent(plantId, areaId, eqpId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/electriccurrent`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getAnalysis(plantId, areaId, eqpId, key) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/measuretrxbin/${key}/analysis`
		});
	}
	getAnalysisInfo(plantId, areaId, eqpId, paramId, fromDate, toDate, rate) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/${paramId}/analysisInfo?fromdate=${fromDate}&todate=${toDate}&rate=${rate}`
		});
	}

	getModelMeasurement(plantId, areaId, eqpId, key) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/measuretrxbin/${key}/modelmeasuretrx`
		});
	}

	/*
	getTracedata() {
		return this.restful.GET('pdm/tracedata');
	}

	getTraceSummaryParameters() {
		return this.restful.GET('pdm/tracesummaryparameters');
	}

	getTraceSummaryData() {
		return this.restful.GET('pdm/tracesummarydata');
	}

	getEffectdata() {
		return this.restful.GET('pdm/effectdata');
	}

	getEqpDownEvent() {
		return this.restful.GET('pdm/eqpdownevent');
	}

	getHealthIndex() {
		return this.restful.GET('pdm/healthindex');
	}

	getHealthIndexSimulation() {
		return this.restful.GET('pdm/healthindexsimulation');
	}
	*/

	getReports(plantId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/reportalarm`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getEqpInfo(plantId, eqpId) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/eqps/${eqpId}/eqpinfo`
		});
	}

	updateReport(plantId, report) {
		return this.PUT({
			uriPath: `pdm/fabs/${plantId}/reportalarm`,
			params: report
		});
	}

	getTrendMultiple(plantId, areaId, eqpId, paramId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/${paramId}/overallminute`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}


	getTrendMultipleWithRUL(plantId, areaId, eqpId, paramId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/eqps/${eqpId}/params/${paramId}/overall`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getTrendMultipleSpec(plantId, areaId, eqpId, paramId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/${paramId}/overallminutespec`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getTrendMultipleSpecConfig(plantId, areaId, eqpId, paramId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/${paramId}/overallminutespecconfig`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getModels(plantId) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/healthmodels`
		});
	}

	getPpt(img: string) {
		return this.binaryPOST({
			header: {
				responseType: 'blob',
				Accept: 'application/vnd.ms-powerpoint'
			},
			uriPath: 'pdm/report/ppt',
			params: {
				data: img
			}
		});
	}

	getContourChart(plantId, areaId, eqpId, from, to) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/contourchart`,
			querystring: {
				fromdate: from,
				todate: to
			}
		});
	}

	getParamDetail(plantId, areaId, eqpId, paramId) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/params/${paramId}/detail`
		});
	}
	createFeature(from, toDay) {
		return this.GET({
			uriPath: `pdm/manual/createfeature`,
			querystring: {
				date: from,
				day: toDay
			}
		});
	}


	/**************************************/
	/************* Pdm apis ***************/
	/**************************************/

	getPdmAnalysis(param: pdmI.PcaDataRequestParam): any {
		return this.rxGET({
			uriPath: `pdm/fabs/${param.fab}/ServerAnalysis?a_fromdate=${param.a_fromdate}&a_todate=${param.a_todate}&b_fromdate=${param.b_fromdate}&b_todate=${param.b_todate}&dataId=${param.dataId}`
		})
	}

	getPdmAnalysisData(param: pdmI.AnalysisDataRequestParam): Observable<any> {
		return this.rxGET({
			uriPath: `pdm/fabs/${param.fab}/eqps/${param.eqpid}/ServerAnalysisData?fromdate=${param.fromdate}&todate=${param.todate}`
		})
	}

	getBuildAndHealthData(param: pdmI.BuildAndHealthDataRequestParam): Observable<any> {
		// const fab: string = 'fab1';
		return this.rxPOST({
			uriPath: `pdm/fabs/${param.fab}/eqps/${param.eqpId}/ServerBuildAndHealth?fromdate=${param.fromdate}&todate=${param.todate}&width=${param.width}&height=${param.height}&dataId=${param.dataId}`,
			params: {
				parameters: param.params.parameters
			}
		})
		// return this.rxPOST({
		//     uriPath: `pdm/fabs/fab1/buildAndHealthByData?fromdate=1490972400000&todate=1491015600000`,
		//     params: {
		//         datas: param.params.datas,
		//         model_params: param.params.model_params
		//     }
		// })
	}

	getPcaData(param: pdmI.PcaDataRequestParam): Observable<any> {
		// const fab: string = 'fab1';
		return this.rxGET({
			uriPath: `pdm/fabs/${param.fab}/ServerPCA?a_fromdate=${param.a_fromdate}&a_todate=${param.a_todate}&b_fromdate=${param.b_fromdate}&b_todate=${param.b_todate}&dataId=${param.dataId}`
		})
	}

	// getHealthByData(param: pdmI.HealthByDataRequestParam): Observable<any> {
	// 	return this.rxPOST({
	// 		uriPath: `pdm/fabs/${param.fab}/healthByData`,
	// 		params: {
	// 			datas: param.params.datas,
	// 			model: param.params.model
	// 		}
	// 	})
	// }

	getHealthModel(param: pdmI.HealthModelRequestParam): Observable<any> {
		return this.rxGET({
			uriPath: `pdm/fabs/${param.fab}/eqps/${param.eqpId}/healthmodel`
		});
	}

	saveEqp(param: pdmI.SaveEqpRequestParam): Observable<any> {
		const requestParams = {
			guid: param.guid
		};
		return this.rxPOST({
			uriPath: `pdm/modeller/model/eqps/${param.eqpid}`,
			params: requestParams
		})
	}

	deleteEqp(param: pdmI.DeleteEqpRequestParam): Observable<any> {
		return this.rxDELETE({
			uriPath: `pdm/modeller/model/eqps/${param.eqpid}`
		})
	}
	saveModel(plantId, eqpId, dataId: any): Observable<any> {
		return this.rxPOST({
			uriPath: `pdm/fabs/${plantId}/eqps/${eqpId}/ServerSaveModel?dataId=${dataId}`,
			params: {}
		})
	}

	getChartAnalysis(param: pdmI.ChartAnalysisRequestParam): Observable<any> {
		return this.rxPOST({
			uriPath: `pdm/fabs/${param.fab}/ServerChart?fromdate=${param.fromdate}&todate=${param.todate}&charttype=${param.charttype}&width=${param.width}&height=${param.height}&dataId=${param.dataId}`,
			params: {
				parameters: param.params.parameters
			}
		})
	}

	getOutLier(param: pdmI.OutlierRequestParam): Observable<any> {
		return this.rxPOST({
			uriPath: `pdm/fabs/${param.fab}/ServerOutlier?fromdate=${param.fromdate}&todate=${param.todate}&charttype=${param.charttype}&outliertype=${param.outliertype}&width=${param.width}&height=${param.height}&startX=${param.startX}&endX=${param.endX}&startY=${param.startY}&endY=${param.endY}&dataId=${param.dataId}`,
			params: {
				parameters: param.params.parameters
			}
		})
	}

	healthIndexZoom(param: pdmI.HealthIndexZoomRequestParam): Observable<any> {
		return this.rxPOST({
			uriPath: `pdm/fabs/${param.fab}/ServerHealthIndexChart?fromdate=${param.fromdate}&todate=${param.todate}&charttype=${param.charttype}&width=${param.width}&height=${param.height}&dataId=${param.dataId}`,
			params: {
				parameters: param.params.parameters
			}
		})
	}

	healthIndexChartByModel(param: pdmI.HealthByDataRequestParam): Observable<any> {
		return this.rxGET({
			uriPath: `pdm/fabs/${param.fab}/eqps/${param.eqpId}/ServerHealthIndexChartByModel?fromdate=${param.fromdate}&todate=${param.todate}&charttype=${param.charttype}&width=${param.width}&height=${param.height}&dataId=${param.dataId}`
		})
	}

	getRadarEqps(param: pdmRadarI.RadarEqpsRequestParam): Promise<any> {
		return this.GET({
			uriPath: `pdm/fabs/${param.fabId}/radareqps`,
			querystring: {
				fromdate: param.params.fromDate,
				todate: param.params.toDate,
				type: param.params.radarType,
				numberOfWorst: param.params.numberOfWorst === undefined ? 0 : param.params.numberOfWorst

			}
		});
	}

	getRadarParams(param: pdmRadarI.RadarParamsRequestParam): Promise<any> {
		return this.GET({
			uriPath: `pdm/fabs/${param.fabId}/eqps/${param.eqpId}/radar`,
			params: {
				fromdate: param.params.fromDate,
				todate: param.params.toDate
			}
		});
	}

	getRadarTypeInfo(): any[] {
		const radarTypeInfo: any[] = [
			{ typeId: 'AW', typeName: 'Alarm-Warning' },
			{ typeId: 'G5', typeName: 'Good Variation' },
			{ typeId: 'B5', typeName: 'Bad Variation' }
		];

		return radarTypeInfo;
	}

	getTraceData(param): Promise<any> {
		return this.GET({
			uriPath: `pdm/fabs/${param.fabId}/areas/1/eqps/${param.eqpId}/tracedata`,
			params: {
				fromdate: param.params.fromDate,
				todate: param.params.toDate,
				normalizeType: param.params.normalizeType
			}
		});
	}
}
