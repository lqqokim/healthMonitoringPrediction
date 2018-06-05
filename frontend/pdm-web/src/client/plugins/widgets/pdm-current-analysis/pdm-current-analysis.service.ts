import { Injectable } from '@angular/core';
import { PdmCommonService } from './../../../common/service/pdm-common.service';
import { ModelCommonService } from './../../../common/model/model-common.service';
import { Observable } from 'rxjs';

@Injectable()
export class PdmCurrentAnalysisService extends ModelCommonService {

    constructor(private _pdmService: PdmCommonService) {
        super();
    }

    currentPattern(window, nearcount, farcount, params) {
        return this.POST({
            uriPath: `pdm/currentpattern?window=${window}&nearcount=${nearcount}&farcount=${farcount}`,
            params: params
        });
    }
}