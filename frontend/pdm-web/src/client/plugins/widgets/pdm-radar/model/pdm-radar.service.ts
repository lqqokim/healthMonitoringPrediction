import { Observable } from 'rxjs/Observable';
import { Injectable, Component } from '@angular/core';
import { PdmModelService } from './../../../../common';

import * as pdmRadarI from './pdm-radar.interface';

@Injectable()
export class PdmRadarService {

    constructor(
        private _pdmModel: PdmModelService
    ) { }

    getSeriesColor() {
        const seriesColor: string[] = ['indianred', 'yellow', 'green', 'blue', 'olive', 'aqua'];
        return seriesColor;
    }

    getRadarTypeInfo() {
        return this._pdmModel.getRadarTypeInfo();
    }

    getRadarEqps(requestParam: pdmRadarI.RadarEqpsRequestParam): PromiseLike<any> {
        return this._pdmModel.getRadarEqps(requestParam);
    }

    getRadarParams(requestParam: pdmRadarI.RadarParamsRequestParam): Promise<any> {
        return this._pdmModel.getRadarParams(requestParam);
    }
}