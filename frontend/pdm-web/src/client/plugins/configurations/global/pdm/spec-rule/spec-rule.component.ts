//Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

//MIP
import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater } from '../../../../../sdk';

//Service
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../model/pdm-config.service';

//Interface
import * as IRule from './model/spec-rule-interface';
import * as DATA from './model/spec-rule-mock';

//Wijmo
import { CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid'
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'spec-rule',
    templateUrl: './spec-rule.html',
    styleUrls: ['./spec-rule.css'],
    providers: [PdmConfigService, PdmModelService]
})
export class SpecRuleComponent implements OnInit, OnDestroy {
    @ViewChild('RuleGrid') RuleGrid: wjcGrid.FlexGrid;
    @ViewChild('ParamGrid') ParamGrid: wjcGrid.FlexGrid;

    status: string;
    modalTitle: string;
    plants: IRule.Plant[];
    models: IRule.Model[];
    rules: IRule.Rule[];

    paramsBySelectedRule: IRule.ParameterResponse[]; // rule이 있을 경우, rule로 가져온 parameters
    paramsByselectedModel: IRule.ParameterResponse[]; // rule이 없을 경우, model로 가져온 parameters

    selectedPlant: IRule.Plant;
    selectedModel: IRule.Model;
    selectedRule: IRule.Rule;
    ruleFormData: IRule.FormData; // modal form에 binding 하기 위한 form data

    // parameters: IRule.ParameterResponse[];
    editParameters: IRule.ParameterResponse[];
    tempParameters: IRule.ParameterResponse[]; // wijmo grid item 수정 취소 시, rollback을 위한 copy parameters

    readonly DEFAULT_NAME: string = 'DEFAULT';
    readonly STATUS: IRule.Status = { CREATE: 'create', MODIFY: 'modify', DELETE: 'delete' };
    readonly operands: IRule.Operand[] = [
        { display: '=', value: 'equal' },
        { display: '<', value: 'lessthan' },
        { display: '>', value: 'greaterthan' },
        { display: '<=', value: 'lessthanequal' },
        { display: '>=', value: 'greaterthanequal' },
        { display: 'like', value: 'like' }
    ];


    constructor(
        private _pdmConfigService: PdmConfigService,
        private _pdmModelService: PdmModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater) {

    }

    ngOnInit() {
        this.getPlants();
    }

    getPlants(): void {
        this._pdmModelService.getPlants()
            .then((plants: IRule.Plant[]) => {
                if (plants && plants.length) {
                    this.plants = plants;
                    this.selectedPlant = plants[0];
                    this.getModels();
                }
            }).catch((err) => {

            });
    }

    //선택된 Fab에 대한 Models 정보를 가져온다.
    getModels(): void {
        this._pdmConfigService.getModels(this.selectedPlant.fabId)
            .then((models: IRule.Model[]) => {
                console.log('getModels', models);
                if (models && models.length) {
                    this.models = models;
                    this.selectedModel = models[0];
                    this.getParamsByModel();
                    this.getRules();
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    //Model군에 속한 장비의 Parmeters 정보를 가져온다.
    getParamsByModel(): void {
        this._pdmConfigService.getAllParamsByModel(this.selectedPlant.fabId, this.selectedModel.model_name)
            .then((params: IRule.ParameterResponse[]) => {
                console.log('getParamsByModel', params);
                this.paramsByselectedModel = params;
            }).catch((err) => {
                console.log(err);
            });
    }

    //선택된 Model에 대한 Rules 정보를 가져온다.
    getRules(): void {
        this._pdmConfigService.getModelRules(this.selectedPlant.fabId, this.selectedModel.model_name)
            .then((rules: IRule.RuleResponse[]) => {
                console.log('getRules', rules);

                this.unionExpression(rules);
                this.rules = rules;

                if (this.rules.length) {
                    this.selectFirstRule();
                } else {
                    if (this.paramsBySelectedRule) {
                        this.paramsBySelectedRule = [];
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    //Rule 목록에서 보여줄 Condition을 위해 expression과 expression_values를 조합한다.
    unionExpression(rules: IRule.RuleResponse[]): void {
        rules.map((rule: IRule.RuleResponse) => {
            if (rule.rule_name !== this.DEFAULT_NAME) {
                if (rule.expression && rule.expression_values) {
                    const splitExpression: string[] = rule.expression.split('AND');
                    const expressionValues: string[] = rule.expression_values;

                    for (let i = 0; i < splitExpression.length; i++) {
                        splitExpression[i] = splitExpression[i].replace(`p${i + 1}`, expressionValues[i]);
                    }

                    rule.expression = splitExpression.join().replace(',', 'AND');
                }
            }
        });
    }

    //Rule 목록의 첫번째 Row를 선택한다.
    selectFirstRule(): void {
        setTimeout(() => {
            if (this.RuleGrid.itemsSource && this.RuleGrid.itemsSource.length > 0) {
                this.selectedRule = this.RuleGrid.itemsSource[0];
                this.getParamsByRule();
            }
        });
    }

    // rule을 클릭해서 가져오는 parameter
    getParamsByRule(): void {
        this._pdmConfigService.getParamsByModelRule(this.selectedPlant.fabId, this.selectedModel.model_name, this.selectedRule.rule_id)
            .then((params: IRule.ParameterResponse[]) => {
                console.log('getParamsByRule', params);

                params.map((param: IRule.ParameterResponse) => {
                    param.used_yn = param.model_param_spec_mst_rawid ? true : false;
                });

                this.paramsBySelectedRule = params;
            }).catch((err) => {
                console.log(err);
            });
    }

    //Fab 변경시, Models 정보를 가져온다.
    changeSelectedPlant(plant: IRule.Plant): void {
        this.selectedPlant = plant;
        this.getModels();
    }

    //Model 변경시, Parameters와 Rules 정보를 가져온다.
    changeSelectedModel(model: IRule.Model): void {
        this.selectedModel = model;
        this.getParamsByModel();
        this.getRules();
    }

    //Rule 목록에서 Row를 선택하면 호출
    selectRule(grid: wjcGrid.FlexGrid): void {
        this.selectedRule = grid.selectedItems[0];
        this.getParamsByRule();
    }

    //CRUD에 대한 분기
    controlRule(status: string): void {
        if (status === this.STATUS.DELETE) {
            this.openDeletePopup();
        } else {
            this.openEditModal(status);
        }
    }

    openDeletePopup(): void {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.selectedRule.rule_name,
                confirmMessage: this.translater.get("MESSAGE.PDM.MANAGEMENT.REMOVE_ITEM", { itemName: this.selectedRule.rule_name })['value']
            },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                this.deleteRule();
            }
        });
    }

    deleteRule(): void {
        this._pdmConfigService.deleteModelRule(this.selectedPlant.fabId, this.selectedRule.rule_id)
            .then((res) => {
                console.log('deleteRule res', res);
                this.getParamsByModel();
                this.getRules();
            }).catch((err) => {
                console.log(err);
            });
    }

    //수정, 등록시에 호출
    openEditModal(status: string): void {
        let ruleFormData: IRule.FormData;
        const rules: IRule.Rule[] = this.rules;
        this.status = status;

        //Create: Model로 가져온 Parameter를 Modal에 나타낸다.
        if (status === this.STATUS.CREATE) {
            if (rules && rules.length) {
                ruleFormData = {
                    model_name: this.selectedModel.model_name,
                    rule_name: '',
                    condition: [{ param_name: '', operand: '', param_value: null }],
                    parameter: this.paramsByselectedModel
                };
            } else {
                ruleFormData = {//'DEFAULT' Rule은 Form에서 보여주면 안되기 때문에 Condition 필드 제거
                    model_name: this.selectedModel.model_name,
                    rule_name: this.DEFAULT_NAME,
                    parameter: this.paramsByselectedModel
                };
            }

            //Modify: 선택된 Rule에 대한 Parameter를 Modal에 나타낸다.
        } else if (status === this.STATUS.MODIFY) {
            ruleFormData = {
                model_name: this.selectedModel.model_name,
                rule_name: this.selectedRule.rule_name,
                condition: [],
                parameter: this.paramsBySelectedRule
            };

            /*
                1. String인 Condition을 JSON으로 파싱
                2. JSON 형태의 Condition을 Modal Form Data에 세팅
            */
            if (this.selectedRule && this.selectedRule.condition) {
                const conditionsStr: string = this.selectedRule.condition.replace(new RegExp(/\\/g), '');
                const conditions: IRule.Condition[] = JSON.parse(conditionsStr);
                conditions.map((condition: IRule.Condition) => {
                    ruleFormData.condition.push({
                        param_name: condition.param_name,
                        operand: condition.operand,
                        param_value: condition.param_value
                    });
                });
            }
        }

        this.ruleFormData = ruleFormData;
        this.editParameters = JSON.parse(JSON.stringify(ruleFormData.parameter));
        this.tempParameters = JSON.parse(JSON.stringify(this.editParameters)); //Wijmo 수정 취소시, Rollback을 위해
        this._showModal(true, status);
    }

    //Modal창에서 Save를 누르면 호출
    saveRule(ruleForm: NgForm): void {
        let ruleFormData = this.ruleFormData;
        console.log('ruleFormData', this.ruleFormData);

        //Rule update를 위한 Request Param, default는 condition, expression, expression_value가 null이다
        let ruleRequest: IRule.RuleRequest = {
            rule_id: this.status === this.STATUS.CREATE ? null : this.selectedRule.rule_id,
            rule_name: ruleFormData.rule_name,
            model_name: this.selectedModel.model_name,
            condition: ruleFormData.condition ? this.conditionToString(ruleFormData.condition) : null,
            expression: ruleFormData.condition ? this.conditionToExpression(ruleFormData.condition) : null,
            expression_value: ruleFormData.condition ? this.conditionToExpressionValue(ruleFormData.condition) : null,
            parameter: this.setRuleRequestParameters(this.editParameters)
        };

        console.log('ruleRequest', ruleRequest);
        this.updateRule(ruleRequest);
        this._showModal(false);

    }

    updateRule(params): void {
        this._pdmConfigService.updateModelRule(this.selectedPlant.fabId, params)
            .then((res) => {
                console.log('updateRule res', res);
                this.getParamsByModel();
                this.getRules();
            }).catch((err) => {
                console.log(err);
            });
    }

    //Update할 Rule의 Parameter 세팅
    setRuleRequestParameters(parameters: IRule.ParameterResponse[]): IRule.Parameter[] {
        const ruleRequestParameters: IRule.Parameter[] = [];

        parameters.map((parameter: IRule.ParameterResponse) => {
            ruleRequestParameters.push({
                model_param_spec_mst_rawid: parameter.model_param_spec_mst_rawid,
                param_name: parameter.param_name,
                upper_alarm_spec: parameter.upper_alarm_spec,
                upper_warning_spec: parameter.upper_warning_spec,
                used_yn: parameter.used_yn
            });
        });

        return ruleRequestParameters;
    }

    conditionToString(conditions: IRule.Condition[]): string {
        const toJsonStr = JSON.stringify(conditions);
        const condition: string = toJsonStr.toString().replace(/"/g, '\\"');

        console.log('conditionToString', condition);
        return condition;
    }

    conditionToExpression(conditions: IRule.Condition[]): string {
        let expression: string = '';
        conditions.map((condition: IRule.Condition, index: number) => {
            let appendStr: string = `p${index + 1}${condition.operand}${condition.param_value} AND `;

            if (index === conditions.length - 1) {
                appendStr = appendStr.replace(' AND ', '');
            }

            expression = expression.concat(appendStr);
        });

        console.log('conditionToExpression', expression);
        return expression;
    }

    conditionToExpressionValue(conditions: IRule.Condition[]): string {
        let expressionValue: string = '';
        conditions.map((condition: IRule.Condition, index: number) => {
            let appendStr: string = condition.param_name + ',';

            if (index === conditions.length - 1) {
                appendStr = condition.param_name;
            }

            expressionValue = expressionValue.concat(appendStr);
        });

        console.log('conditionToExpressionValue', expressionValue);
        return expressionValue;
    }

    addCondition(): void {
        this.ruleFormData.condition.push({
            param_name: '',
            operand: '',
            param_value: null
        });
        // this.filterCriteriaDatas.push({ operator: 'AND', fieldName: '-none-', functionName: 'count', condition: 'equal', value: '' });
    }



    removeCondition(index: number): void {
        this.ruleFormData.condition.splice(index, 1);
    }

    closeModal(): void {
        // this.editParameters = this.tempParameters;
        this._showModal(false);
    }

    private _showModal(isShow: boolean, status?: string): void {
        if (isShow) {
            this.modalTitle = this._firstCharUpper(status);
            $('#ruleModal').modal({
                backdrop: false,
                show: true
            });
        } else {
            $('#ruleModal').modal('hide');
        }
    }

    private _firstCharUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    ngOnDestroy() {
        console.log('spec ngOnDestroy');
    }
}