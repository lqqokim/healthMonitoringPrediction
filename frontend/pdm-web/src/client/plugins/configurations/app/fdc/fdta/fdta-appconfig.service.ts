import { Injectable } from '@angular/core';
import { FdcModelService } from '../../../../../common';

@Injectable()
export class FdtaAppConigService {

    constructor(private fdcModel: FdcModelService ) {}

    getConfigList() {
        return this.fdcModel.getfdtaConfigList();
    }

    getConfigOptionList(requestData: any) {
        return this.fdcModel.getfdtaOptionList(requestData);
    }

    savefdtaOption(requestData: any) {
        return this.fdcModel.savefdtaOption(requestData);
    }
}
