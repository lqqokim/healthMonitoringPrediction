import { Injectable } from '@angular/core';

import { PdmCommonService } from '../../../common/service/pdm-common.service';

@Injectable()
export class PdmEqpParamAnalysisService {

	constructor(private _pdmService: PdmCommonService) { }

	getNodeTree(plant) {
		return this._pdmService.getNodeTree(plant);
	}

	getHealthIndex(plantId, areaId, eqpId, from, to) {
		return this._pdmService.getHealthIndex(plantId, areaId, eqpId, from, to);
	}

	getContribute(plantId, areaId, eqpId, from, to) {
		// console.log('getContribute', plantId, areaId, eqpId, from, to);
		return this._pdmService.getContribute(plantId, areaId, eqpId, from, to);
	}

	getMeasurements(plantId, areaId, eqpId, paramId, from, to) {
		return this._pdmService.getMeasurements(plantId, areaId, eqpId, paramId, from, to);
	}

	getMaintenance(plantId, areaId, eqpId, from, to) {
		return this._pdmService.getMaintenance(plantId, areaId, eqpId, from, to);
	}

	getParamInfoByEqpId(plantId, areaId, eqpId) {
		return this._pdmService.getParamInfoByEqpId(plantId, areaId, eqpId);
	}

	getTrendMultiple(plantId, areaId, eqpId, paramId, from, to) {
		return this._pdmService.getTrendMultiple(plantId, areaId, eqpId, paramId, from, to);
	}

	getTimewave(plantId, areaId, eqpId, key) {
		return this._pdmService.getTimewave(plantId, areaId, eqpId, key);
	}

	getSpectrum(plantId, areaId, eqpId, key) {
		return this._pdmService.getSpectra(plantId, areaId, eqpId, key);
	}

	getMeasureRPM(plantId, areaId, eqpId, key) {
		return this._pdmService.getMeasureRPM(plantId, areaId, eqpId, key);
	}

	getElectricCurrent(plantId, areaId, eqpId, from, to) {
		return this._pdmService.getElectricCurrent(plantId, areaId, eqpId, from, to);
	}

	getAnalysis(plantId, areaId, eqpId, key) {
		return this._pdmService.getAnalysis(plantId, areaId, eqpId, key);
	}
	getAnalysisInfo(plantId, areaId, eqpId, paramId,fromDate,toDate,rate) {
		return this._pdmService.getAnalysisInfo(plantId, areaId, eqpId, paramId,fromDate,toDate,rate);
	}

	getModelMeasurement(plantId, areaId, eqpId, key) {
		return this._pdmService.getModelMeasurement(plantId, areaId, eqpId, key);
	}

	getSpectrumSpecConfig(plantId, areaId, eqpId, paramId, from, to) {
		return this._pdmService.getTrendMultipleSpecConfig(plantId, areaId, eqpId, paramId, from, to);
	}

	searchTree(field, data, value) { // Search data about eqpId
		if (data[field] === value) {
			return data;
		}
		if (data.children && data.children.length > 0) {
			for (let i = 0; i < data.children.length; i++) {
				const node = this.searchTree(field, data.children[i], value);
				if (node !== null) {
					return node;
				}
			}
		}
		return null;
	}

	reduceTreeData(datas) {
		for (let i = 0; i < datas.length; i++) {
			if (datas[i].children !== undefined && datas[i].children.length > 0) {
				datas[i]['isFolder'] = true;
				this.reduceTreeData(datas[i].children);
			}
		}
	}
}
