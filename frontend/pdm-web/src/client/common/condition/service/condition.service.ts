import { Injectable } from '@angular/core';

import { StateManager } from '../../app-state/state-manager.service';
import { CommonCondition } from '../../condition/common-condition';
import { ConfigModelService } from '../../model/platform/config-model.service';

@Injectable()
export class ConditionService {

    constructor(
        private stateManager: StateManager,
        private model: ConfigModelService
    ) {}

    makeWidgetConditions(widgetId: number, properties: any, syncOutCondition: CommonCondition) {
        let conditions: any = [];

        _.mapObject(properties, (value: any, key: any) => {
            if (key !== 'communication') {
                if (key === 'location') {
                    _.each(value, (location: any) => {
                        if (location.locationId) {
                            conditions.push({
                                'key': location.locationTypeName,
                                'value': location.locationId
                            });
                        } else {
                            console.log('location.locationTypeName is ', location.locationTypeName, ', location.locationId is undefined or null');
                        }
                    });
                } else {
                    if (this._isNotNull(value)) {
                        conditions.push({
                            'key': key,
                            'value': value
                        });
                    } else {
                        console.log('key is ', key, ', value is undefined or null');
                    }
                }
            }
        });

        _.mapObject(syncOutCondition.data, (value: any, key: any) => {
            // widget config의 properties의 내용보다 선택한 아이템의 키값이 우선시 된다.
            let isUpdate = false;
            _.each(conditions, (condition: any) => {
                if (condition.key === key) {
                    condition.value = value;
                    isUpdate = true;
                    return;
                }
            });

            if (this._isNotNull(value)) {
                if (!isUpdate) {
                    conditions.push({
                        'key': key,
                        'value': value
                    });
                }
            } else {
                console.log('key is ', key, ', value is undefined or null');
            }
        });

        conditions.push({
            'key': 'widget',
            'value': this.stateManager.getWidgetSimple(widgetId)
        });
        return conditions;
    }

    makeTaskerConditions(workspaceId: number, taskerId: number, syncOutCondition: CommonCondition) {
        let conditions: any = [];
        let tasker = this.stateManager.getTasker(workspaceId, taskerId);

        if (tasker.originConditions) {
            conditions = _.filter(tasker.originConditions, (condition: any) => {
                if (condition.key !== 'widget' && condition.key !== 'tasker') {
                    return condition;
                }
            });
        }

        _.mapObject(syncOutCondition.data, (value: any, key: any) => {
            // update value of key.
            let isUpdate = false;
            _.each(conditions, (condition: any) => {
                if (condition.key === key) {
                    condition.value = value;
                    isUpdate = true;
                    return;
                }
            });

            if (this._isNotNull(value)) {
                if (!isUpdate) {
                    conditions.push({
                        'key': key,
                        'value': value
                    });
                }
            } else {
                console.log('key is ', key, ', value is undefined or null');
            }
        });

        conditions.push({
            'key': 'tasker',
            'value': this.stateManager.getTaskerSimple(workspaceId, taskerId)
        });
        return conditions;
    }

    list(workspaceId: number, taskerId: number) {
        return this.model.getConditions(workspaceId, taskerId);
    }

    get(workspaceId: number, taskerId: number, key: any) {
        return this.model.getConditionKey(workspaceId, taskerId, key);
    }

    create(workspaceId: number, taskerId: number, requests: any) {
        // TODO remove temp logic
        let index = _.findIndex(requests, { key: 'syncContent' });
        if (index > -1) {
            requests = requests.concat([]);
            requests.splice(index, 1);
        }
        return this.model.createConditions(workspaceId, taskerId, requests);
    }

    update(workspaceId: number, taskerId: number, request: any) {
        return this.model.updateConditionKey(workspaceId, taskerId, request, request.key);
    }

    remove(workspaceId: number, taskerId: number, key: any) {
        return this.model.deleteConditionKey(workspaceId, taskerId, key);
    }

    _isNotNull(value: any) {
        // if(angular.isArray(value)) {
        //     if(value.length > 0) {
        //         return true;
        //     } else {
        //         false
        //     }
        // } else {
        if ((value !== undefined) && (value !== '')) {
            return true;
        } else {
            return false;
        }
        // }
    }
}
