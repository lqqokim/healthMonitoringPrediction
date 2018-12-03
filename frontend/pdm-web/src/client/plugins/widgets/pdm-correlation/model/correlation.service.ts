import { Injectable } from '@angular/core';
import { ModelCommonService } from './../../../../common/model/model-common.service';
import { PdmModelService } from './../../../../common/model/app/pdm/pdm-model.service';
import { Observable } from 'rxjs';

@Injectable()
export class CorrelationService {

    constructor(private pdmModelService: PdmModelService) {
    }

    getHeatmap(request): Observable<any> {
        return this.pdmModelService.getHeatmap(request);
    }

    getHeatmapCorrelation(request): Observable<any> {
        return this.pdmModelService.getHeatmapCorrelation(request);
    }
}