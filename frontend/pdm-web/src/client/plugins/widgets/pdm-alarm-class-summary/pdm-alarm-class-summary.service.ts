import { Injectable } from '@angular/core';
import { PdmCommonService } from '../../../common/service/pdm-common.service';

@Injectable()
export class PdmWostEqpListService {
    constructor( private _pdmService: PdmCommonService ) {}

    getPlants() {
        return this._pdmService.getPlants();
    }

    getAreaStatus(plantId, from, to) {
        return this._pdmService.getAreaStatus(plantId, from, to);
    }
}
