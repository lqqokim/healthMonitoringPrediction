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
    @ViewChild('wjRuleGrid') wjRuleGrid: wjcGrid.FlexGrid;

    plants: IRule.Plant[];
    models: IRule.Model[];
    rules: IRule.Rule[];
    paramsBySelectedRule: IRule.Parameter[];

    paramsByModelEqp: IRule.Parameter[];

    selectedPlant: IRule.Plant;
    selectedModel: IRule.Model;
    selectedRule: IRule.Rule;
    ruleFormData: IRule.FormData;

    protected readonly DEFAULT_NAME: string = 'Default';
    protected readonly STATUS: IRule.Status = { CREATE: 'create', MODIFY: 'modify', DELETE: 'delete' };
    protected readonly operands: IRule.Operand[] = [
        { display: '=', value: 'equal' },
        { display: '<', value: 'lessthan' },
        { display: '>', value: 'greaterthan' },
        { display: '<=', value: 'lessthanequal' },
        { display: '>=', value: 'greaterthanequal' },
        { display: 'like', value: 'like' }
    ];

    modalTitle: string;

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

    getModels(): void {
        this._pdmConfigService.getModels(this.selectedPlant.fabId)
            .then((models: IRule.Model[]) => {
                console.log('getModels', models);
                if (models && models.length) {
                    this.models = models;
                    this.selectedModel = models[0];
                    this.getRules();
                }
            }).catch((err) => {

            });
    }

    getAllParamsByModel(): void {
        this._pdmConfigService.getAllParamsByModel(this.selectedPlant.fabId, this.selectedModel.model_name)
            .then((params: IRule.Parameter[]) => {
                console.log('getAllParamsByModel', params);
            }).catch((err) => {

            });
    }

    getRules(): void {
        this._pdmConfigService.getModelRules(this.selectedPlant.fabId, this.selectedModel.model_name)
            .then((rules: IRule.Rule[]) => {
                console.log('getRules', rules);
                rules.map((rule: IRule.Rule) => {
                    const splitExpression: string[] = rule.expression.split('AND');
                    const expressionValues: string[] = rule.expression_values;

                    for(let i = 0; i < splitExpression.length; i++ ) {
                        splitExpression[i] = splitExpression[i].replace(`p${i + 1}`, expressionValues[i]);
                    }

                    rule.expression = splitExpression.join().replace(',', 'AND');
                });

                console.log('rules', rules);
                this.rules = rules;
                rules ? this.selectFirstRule() : this.getAllParamsByModel();
            }).catch((err) => {

            });
    }

    selectFirstRule(): void {
        this.selectedRule = this.wjRuleGrid.itemsSource[0];
        this.getParamsByRule();
    }

    getParamsByRule(): void { // rule을 클릭해서 가져오는 parameter
        const ruleId = this.selectedRule.rule_id;
        this._pdmConfigService.getParamsByModelRule(this.selectedPlant.fabId, this.selectedModel.model_name, 'PUMP_RULE_1')
            .then((params: IRule.Parameter[]) => {
                console.log('getParamsByRule', params);
                // params.map((param: IRule.Parameter) => {
                //     param.param_name = param.param_name.toLowerCase();
                // });

                this.paramsBySelectedRule = params;
            }).catch((err) => {

            });
    }

    changeSelectedPlant(plant: IRule.Plant): void {
        this.selectedPlant = plant;
        this.getModels();
    }

    changeSelectedModel(model: IRule.Model): void {
        this.selectedModel = model;
        this.getRules();
    }

    selectRule(grid: wjcGrid.FlexGrid): void {
        this.selectedRule = grid.selectedItems[0];
        this.getParamsByRule();
    }

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
                // this.deleteRule();
            }
        });
    }

    deleteRule(): void {
        this._pdmConfigService.deleteModelRule(this.selectedPlant.fabId, this.selectedModel.model_name, this.selectedRule.rule_id)
            .then((res) => {
                console.log('deleteRule res', res);
            }).catch((err) => {

            });
    }

    openEditModal(status: string): void {
        if (status === this.STATUS.CREATE) {
            let ruleFormData: IRule.FormData = {
                model_name: this.selectedModel.model_name,
                rule_name: this.rules.length ? '' : this.DEFAULT_NAME,
                condition: [{
                    param_name: '',
                    operand: '',
                    param_value: null
                }],
                parameter: this.paramsBySelectedRule
            };

            this.ruleFormData = ruleFormData;
        } else if (status === this.STATUS.MODIFY) {
            let ruleFormData: IRule.FormData = {
                model_name: this.selectedModel.model_name,
                rule_name: this.selectedRule.rule_name,
                condition: [],
                parameter: this.paramsBySelectedRule
            };

            const conditionsStr: string = this.selectedRule.condition.replace(new RegExp(/\\/g), '');
            console.log('conditionsStr', conditionsStr);
            const conditions: IRule.Condition[] = JSON.parse(conditionsStr);
            conditions.map((condition: IRule.Condition) => {
                ruleFormData.condition.push({
                    param_name: condition.param_name,
                    operand: condition.operand,
                    param_value: condition.param_value
                });
            });

            console.log('modify ruleFormData', ruleFormData);
            this.ruleFormData = ruleFormData;
        }

        this._showModal(true, status);
    }

    saveRule(form: NgForm): void {
        console.log('saveRule', form);

        // const rule: IRule.Rule = this.selectedRule;
        // const params: IRule.RuleReqParams = {
        //     rule_id: status === 'create' ? null : rule.rule_id,
        //     rule_name: rule.rule_name,
        //     expression: rule.expression,
        //     condition: rule.condition,
        //     parameter: this.parameters
        // };

        // this._pdmConfigService.updateModelRule(this.selectedPlant.fabId, params)
        //     .then((res) => {

        //     }).catch((err) => {

        //     });
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

    }
}