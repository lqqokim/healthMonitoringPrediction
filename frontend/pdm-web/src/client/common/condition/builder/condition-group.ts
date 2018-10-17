import { ConditionType } from '../condition.type';
import { ConditionApi } from '../condition.api';
import { ConditionControl } from './condition-control';
import { Util } from '../../../sdk';

export class ConditionGroup {

    private _conditionsMap: Map<string, ConditionControl | ConditionGroup>;
    private _name: string;
    private _formatter: any;

    constructor(conditionTypes: ConditionType[], groupName?: string, formatter?: any) {
        this._name = groupName;
        this._formatter = formatter;
        this._conditionsMap = new Map<string, ConditionControl | ConditionGroup>();
        this._createConditionControl(conditionTypes);
    }

    set conditionsMap(value: any) {
        this._conditionsMap = value;
    }

    get conditionsMap() {
        return this._conditionsMap;
    }

    get name() {
        return this._name;
    }

    get formatter() {
        return this._formatter;
    }

    private _createConditionControl(conditionTypes: ConditionType[]) {
        conditionTypes.forEach((conditionType: ConditionType) => {
            if (conditionType.isGroup) {
                const cg = new ConditionGroup(conditionType.value, conditionType.name, conditionType.formatter);
                this.conditionsMap.set(cg.name, cg);
            } else {
                const cc = new ConditionControl(conditionType);
                this.conditionsMap.set(cc.name, cc);
            }
        });
    }

    /**
     * JSON 객체 형태로 반환한다.
     * 2 Depth만을 지원한다.
     */
    getConditions(api: ConditionApi, isConditionType: boolean = false) {
        let conditions = {};
        this.conditionsMap.forEach((value: ConditionControl | ConditionGroup, key: string) => {
            if (value instanceof ConditionGroup) {
                this._getConditionGroup(value, api, conditions, isConditionType);
            } else {
                this._getConditionControl(value, value.groupName, api, conditions, isConditionType);
            }
        });
        return conditions;
    }

    private _getConditionGroup(conditionGroup: ConditionGroup, api: ConditionApi, conditions: any, isConditionType: boolean = false) {
        let subConditions = {};
        conditions[conditionGroup.name] = subConditions;
        conditionGroup.conditionsMap.forEach((value: ConditionControl, key: string) => {
            this._getConditionControl(value, conditionGroup.name, api, subConditions, isConditionType);
        });

        // conditionGroup에 formmater가 있는경우 conditions 값을 재정의 한다.
        if (conditionGroup.formatter && isConditionType) {
            let values: any = _.values(subConditions);
            conditions[conditionGroup.name] = new ConditionGroup(values, conditionGroup.name, conditionGroup.formatter);
        }
    }

    private _getConditionControl(
        conditionControl: ConditionControl,
        groupKey: string,
        api: ConditionApi,
        conditions: any,
        isConditionType: boolean = false
    ) {
        // widget Model에서 값을 가져온다.
        // TODO: 나중에 제거한다. 기존 값이 depth 1일 경우 대비한다.
        let value = api.getWithGroup(groupKey, conditionControl.name);
        if (groupKey && !value) {
            value = api.get(conditionControl.name);
        }
        conditionControl.value = value;

        // 객체에 담는다.
        if (isConditionType) {
            conditions[conditionControl.name] = conditionControl;
        } else {
            conditions[conditionControl.name] = conditionControl.value;
        }
    }

    /**
     * 새로운 Condition을 저장한다.
     * 2 Depth만을 지원한다.
     * 2 Depth일 경우 first depth인 group이 key로 올 수 없다.
     */
    setCondition(key: string, value?: any) {
        const newCondition = { key, value, isSetup: false };
        this.conditionsMap.forEach((value: ConditionControl | ConditionGroup, key: string) => {
            if (value instanceof ConditionGroup) {
                this._setConditionGroup(value, newCondition);
            } else {
                this._setConditionControl(value, newCondition);
            }
        });
    }

    private _setConditionGroup(conditionGroup: ConditionGroup, newCondition: { key: string, value?: any, isSetup: boolean }) {
        if (newCondition.isSetup) { return; }

        // 같은 그룹일 경우 값을 넣어 준다.
        if (newCondition.key === conditionGroup.name && Util.Data.isObject(newCondition.value)) {
            const conditionJson = newCondition.value;
            for (const conKey in conditionJson) {
                if (conditionJson.hasOwnProperty(conKey)) {
                    this._checkCondtionGroup(
                        conditionGroup,
                        {
                            key: conKey,
                            value: conditionJson[conKey],
                            isSetup: newCondition.isSetup
                        }
                    );
                }
            }
        }
    }

    private _checkCondtionGroup(conditionGroup: ConditionGroup, newCondition: { key: string, value?: any, isSetup: boolean }) {
        if (newCondition.isSetup) { return; }

        let isNew: boolean = true;
        conditionGroup.conditionsMap.forEach((value: ConditionControl, key: string) => {
            if (newCondition.key === key) {
                isNew = false;
                this._setConditionControl(value, newCondition);
                return;
            }
        });

        if (isNew) {
            const cc = new ConditionControl({ name: newCondition.key, value: newCondition.value });
            this.conditionsMap.set(cc.name, cc);
        }
        return;
    }

    private _setConditionControl(conditionControl: ConditionControl, newCondition: { key: string, value?: any, isSetup: boolean }) {
        if (newCondition.isSetup) { return; }

        if (conditionControl.name == newCondition.key) {
            newCondition.isSetup = true;
            conditionControl.value = newCondition.value;
        }
    }

    /**
     * condition에 대한 값이 required = true일 경우 검사한다.
     * 2 depth만을 지원한다.
     */
    isValid(api: ConditionApi) {
        let isValid: boolean = true;
        this.conditionsMap.forEach((value: ConditionControl | ConditionGroup, key: string) => {
            if (value instanceof ConditionGroup) {
                isValid = this._isValidConditionGroup(value, api);
                if (!isValid) { return; }
            } else {
                isValid = this._isValidConditionControl(value, undefined, api);
                if (!isValid) { return; }
            }
        });
        return isValid;
    }

    private _isValidConditionGroup(conditionGroup: ConditionGroup, api: ConditionApi) {
        let isValid: boolean = true;
        conditionGroup.conditionsMap.forEach((value: ConditionControl, key: string) => {
            if (!this._isValidConditionControl(value, conditionGroup.name, api)) {
                isValid = false;
                return;
            }
        });
        return isValid;
    }

    private _isValidConditionControl(conditionControl: ConditionControl, groupKey: string, api: ConditionApi) {

        // widget Model에서 값을 가져온다.
        // TODO: 나중에 제거한다. 기존 값이 depth 1일 경우 대비한다.
        let value = api.getWithGroup(groupKey, conditionControl.name);
        if (groupKey && !value) {
            value = api.get(conditionControl.name);
        }
        conditionControl.value = value;

        // checking if there is value
        if (conditionControl.required
            && !conditionControl.value) {
            return false;
        }

        // call validator function
        if (conditionControl.required
            && conditionControl.validator
            && typeof conditionControl.validator === 'function'
            && conditionControl.value ) {
            return conditionControl.validator(conditionControl.value);
        }

        return true;
    }

    clear() {
        if (this.conditionsMap) {
            this.conditionsMap.forEach((value: ConditionControl | ConditionGroup, key: string) => {
                if (value instanceof ConditionGroup) {
                    value.conditionsMap.clear();
                    value.conditionsMap = null;
                } else {
                    this.conditionsMap.clear();
                    this.conditionsMap = null;
                }
            });
        }
    }
}
