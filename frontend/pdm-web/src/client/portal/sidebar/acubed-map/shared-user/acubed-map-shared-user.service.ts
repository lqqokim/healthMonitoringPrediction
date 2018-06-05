import { Injectable } from '@angular/core';
import { MapModelService, SessionService } from '../../../../common';

@Injectable()
export class AcubedMapSharedUserService {

    constructor(
        private session: SessionService,
        private mapModel: MapModelService
    ) {}

    getMapShareUsers() {
        return this.mapModel.getMapShareUsers();
    } 

}
