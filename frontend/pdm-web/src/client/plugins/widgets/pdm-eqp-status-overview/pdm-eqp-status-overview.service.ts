import { Injectable } from '@angular/core';

import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { ModelCommonService } from '../../../common/model/model-common.service';

@Injectable()
export class PdmEqpStatusOverviewService extends ModelCommonService {
	// tslint:disable-next-line:no-unused-variable
	private _tempData: any[] = [
		['HV12',2,63,65,1493650800000,1496329199999],
		['HV12',2,63,69,1493650800000,1496329199999],
		['HV12',2,63,71,1493650800000,1496329199999]
	];
	// tslint:disable-next-line:no-unused-variable
	private _tempIndex: number = 0;

    constructor( private _pdmService: PdmCommonService ) {
		super();
	}

	getParameterVariations(plantId, areaId, eqpId, currentTime) {
		return this.GET({
			uriPath: `pdm/fabs/${plantId}/areas/${areaId}/eqps/${eqpId}/univariatevariation`,
			querystring: {
				time: currentTime
			}
        });
	}

    getPlants() {
		return this._pdmService.getPlants();
	}

	getShopStatus(plantId, from, to) {
        return this._pdmService.getAreaStatus(plantId, from, to);
	}

    getEqpStatus(plantId, areaId, from, to) {
		return this._pdmService.getEqpStatus(plantId, areaId, from, to);
	}

	getParamStatus(plantId, areaId, eqpId, from, to) {
		return this._pdmService.getParamStatus(plantId, areaId, eqpId, from, to);
	}

	getHealthIndex(plantId, eqpId, from, to) {
		// let temp = this._tempData[this._tempIndex];
		// this._tempIndex = (this._tempIndex + 1) % 3;

		// return this._pdmService.getTrendMultiple.apply(this._pdmService, temp).then(data=>{
		// 	return data.length ? [data] : [];
		// });
		return this._pdmService.getHealthIndex(plantId, 0, eqpId, from, to);
	}

	getMeasurements(plantId, areaId, eqpId, paramId, from, to) {
		return this._pdmService.getMeasurements(plantId, areaId, eqpId, paramId, from, to);
	}

	getTimewave(plantId, areaId, eqpId, measurementId) {
		// TODO: use new service
		return this._pdmService.getTimewave(plantId, areaId, eqpId, measurementId);
	}

	getSpectra(plantId, areaId, eqpId, measurementId) {
		// TODO: use new service
		return this._pdmService.getSpectra(plantId, areaId, eqpId, measurementId);
	}

	getTrendMultiple(plantId, areaId, eqpId, paramId, from, to) {
		// TODO remove temp date
		// from = moment('2017-06-01').format('x')*1;
		// to = moment('2017-06-02').format('x')*1-1;
		return this._pdmService.getTrendMultiple(plantId, areaId, eqpId, paramId, from, to);

        // return new Promise<any[]>((resolve, reject) => {
		// 	let yesterday = Date.now() - 86400000;
        //     setTimeout(()=>{
        //         let series = [];
        //         for (let i=0; i<500; i++) {
        //             series.push([i+yesterday, Math.random()*2]);
        //         }
        //         resolve([
        //             series
        //         ]);
        //     }, 200);
        // });
    }

	getTrendMultipleSpec(plantId, areaId, eqpId, paramId, from, to) {
		// TODO remove temp date
		// from = moment('2017-01-02').format('x')*1;
		// to = moment('2017-01-05').format('x')*1-1;
		return this._pdmService.getTrendMultipleSpec(plantId, areaId, eqpId, paramId, from, to);

		// return new Promise<any>((resolve, reject) => {
        //     setTimeout(()=>{
        //         resolve({
		// 			target: 1,
		// 			warning: 4,
		// 			alarm: 5
		// 		});
        //     });
        // });
	}

	getContourChart(plantId, areaId, eqpId, from, to) {
        return this._pdmService.getContourChart(plantId, areaId, eqpId, from, to);
    }
}
