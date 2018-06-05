import { Injectable } from '@angular/core';

import { DashboardModelService, StateManager } from '../../../common';

@Injectable()
export class WidgetListService {

    constructor(
        private _model: DashboardModelService,
        private _stateManager: StateManager
    ) { }

    getList() {
        return this._model
            .getWidgetList()
            .then((widgetTypes: any) => {
                this._stateManager.setWidgetTypes(widgetTypes);
                return widgetTypes;
            });
    }

    getWidgetType(widgetTypeId: number) {
        return this._model.getWidgetType(widgetTypeId);
    }
}
