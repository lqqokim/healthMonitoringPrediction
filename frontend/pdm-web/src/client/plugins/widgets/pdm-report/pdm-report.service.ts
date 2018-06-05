import { Injectable } from '@angular/core';

import { SessionStore } from '../../../sdk';

import { PdmCommonService } from '../../../common/service/pdm-common.service';

export const REPORT_STATUS_NAME = {
    CREATED: '발생',
    CONFIRMED: '확인',
    REQUESTED: '조치요청',
    COMPLETE: '조치완료'
};

export const REPORT_STATUS = {
    CREATED: '0',
    CONFIRMED: '1',
    REQUESTED: '2',
    COMPLETE: '3'
};

@Injectable()
export class PdmReportService {
    constructor( private _pdmService: PdmCommonService, private sessionStore: SessionStore ) {}

    getPlants() {
        return this._pdmService.getPlants();
    }

    // TODO: design the data structure
    getReports(plantId, from, to) {
        return this._pdmService.getReports(plantId, from, to);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         let data = [
        //             {
        //                 eqpId: 111,
        //                 eqpName: 'D/L#1',
        //                 score: 95,
        //                 occurDate: 1496823717799,
        //                 writeDate: 1496823717799,
        //                 status: '발생',
        //                 requestDate: null,
        //                 completeDate: null,
        //                 requestUser: '홍길동',
        //                 completeUser: '강감찬',
        //                 cause1: 'test cause1',
        //                 cause2: 'test cause2',
        //                 cause3: 'test cause3',
        //                 causeUpdate: null,
        //                 measurementId: 2631985,
        //                 reportContent: null
        //             },
        //             {
        //                 eqpId: 111,
        //                 eqpName: 'D/L#2',
        //                 score: 95,
        //                 occurDate: 1496823717799,
        //                 writeDate: 1496823717799,
        //                 status: '발생',
        //                 requestDate: null,
        //                 completeDate: null,
        //                 requestUser: '홍길동',
        //                 completeUser: '강감찬',
        //                 cause1: 'test cause1',
        //                 cause2: 'test cause2',
        //                 cause3: 'test cause3',
        //                 causeUpdate: null,
        //                 measurementId: 2631985,
        //                 reportContent: null
        //             }
        //         ];
        //         resolve(data);
        //     }, 500);
        // });
    }

    getEqpInfo(plantId, eqpId) {
        return this._pdmService.getEqpInfo(plantId, eqpId);
    }

    updateReport(plantId, updated) {
        return this._pdmService.updateReport(plantId, Object.assign({
            eqpId: null,
            occurDtts: null,
            writeDtts: null,
            stateCd: null,
            requestDtts: null,
            completeDtts: null,
            requestUserId: null,
            completeUserId: null,
            causeUpdate: null,
            reportContent: null
        }, updated));
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
		return this._pdmService.getTrendMultipleSpec(plantId, areaId, eqpId, paramId, from, to);
	}

    getSpectra(plantId, eqpId, measurementId) {
        return this._pdmService.getSpectra(plantId, 0, eqpId, measurementId);
    }

    getPpt(img: string) {
        return this._pdmService.getPpt(img);
    }

    savePpt(img: string, fileName: string) {
        this._getReportPpt(img).then((blob) => {
            if (blob) {
                if(this._detectIE()) {
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    let objUrl = window.URL || (window as any).webkitURL;
                    var url = objUrl.createObjectURL(blob);
                    var pom = document.createElement('a');
                    pom.href = url;
                    pom.download = fileName;
                    pom.click();
                    objUrl.revokeObjectURL(url);

                    $(pom).remove();
                }
            }
        });
    }

    getModelMeasurement(plantId, eqpId, measurementId) {
        return this._pdmService.getModelMeasurement(plantId, 0, eqpId, measurementId);
    }

    getAnalysis(plantId,eqpId,measurementId) {
		return this._pdmService.getAnalysis(plantId,0,eqpId,measurementId);
    }

    getMeasureRPM(plantId,eqpId,measurementId) {
		return this._pdmService.getMeasureRPM(plantId,0,eqpId,measurementId);
	}

    private _getReportPpt(img) {
        return new Promise<any>((resolve, reject) => {
            let xhr: any;
            xhr = new XMLHttpRequest;

            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let blob = new Blob([this.response], {type: 'application/vnd.ms-powerpoint'});
                    resolve(blob);
                }
            };

            let _reject = (e) => {
                reject(e);
            };
            xhr.addEventListener('error', _reject, false);
            xhr.addEventListener('abort', _reject, false);

            xhr.open('POST', A3_CONFIG.PROD.API_CONTEXT+'service/pdm/report/ppt', true);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.setRequestHeader('Accept', 'application/vnd.ms-powerpoint');
            let token = this.sessionStore.getToken();
            xhr.setRequestHeader('authorization', `${token.token_type} ${token.access_token}`);

            xhr.send(JSON.stringify({
                data: img
            }));
        });
    }

    private _detectIE() {
        let ua = window.navigator.userAgent;

        let msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        let trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        let edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }
}
