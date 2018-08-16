//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';

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

    plants: IRule.Plant[];
    models: IRule.Model[];
    rules: IRule.Rule[];
    parametersByRule: IRule.Parameter[];

    selectedPlant: IRule.Plant;
    selectedModel: IRule.Model;
    selectedRule: IRule.Rule;
    ruleFormData: IRule.FormData;

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
        this.getAllPrametersByModelEQP();
    }

    getAllPrametersByModelEQP(): void {

    }

    getPlants(): void {
        this._pdmModelService.getPlants()
            .then((plants: IRule.Plant[]) => {
                if (!this.selectedPlant) this.selectedPlant = plants[0];
                this.plants = plants;
                this.getModels();
            }).catch((err) => {

            });
    }

    getModels(): void {
        // this._pdmConfigService.getModels(this.selectedPlant.fabId)
        //     .then((models: IRule.Model[]) => {
        //         if(!this.selectedModel) this.selectedModel = models[0];
        //         this.models = models;
        //         this.getRules();
        //     }).catch((err) => {

        //     });

        this.models = DATA.MODELS;
        this.selectedModel = this.models[0];
        this.getRules();
    }

    getRules(): void {
        //api call
        // this._pdmConfigService.getModelRules(this.selectedPlant.fabId, this.selectedModel.model_name)
        //     .then((rules: IRule.Rule[]) => {
        //         if(!this.selectedRule) this.selectedRule = rules[0];
        //         this.rules = rules;
        //         this.getParams();
        //     }).catch((err) => {

        //     });

        this.rules = DATA.RULES;
        this.selectedRule = this.rules[0];
        this.getParams();
    }

    getParams(): void {
        //api call
        // this._pdmConfigService.getParamsByModelRule(this.selectedPlant.fabId, this.selectedModel.model_name, this.selectedRule.rule_id)
        //     .then((parameters: IRule.Parameter[]) => {
        //         this.parameters = parameters;
        //     }).catch((err) => {

        //     });
        for (let i = 0; i < DATA.PARAMETERS.length; i++) {
            let param_name = DATA.PARAMETERS[i].param_name;
            param_name = param_name.toLowerCase();
        }

        this.parametersByRule = DATA.PARAMETERS;
    }

    changeSelectedPlant(plant: IRule.Plant): void {
        this.selectedPlant = plant;
        this.getModels();
    }

    changeSelectedModel(model: IRule.Model): void {
        this.selectedModel = model;
        this.getRules();
    }

    selectRow(grid: wjcGrid.FlexGrid): void {
        this.selectedRule = grid.selectedItems[0];
        console.log('selectRow', this.selectedRule)
    }

    controlRule(status: string): void {
        console.log('controlRule', status);
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
                rule_name: '',
                condition: [{
                    param_name: '',
                    operand: '',
                    param_value: null
                }],
                parameter: this.parametersByRule
            };

            this.ruleFormData = ruleFormData;
        } else if (status === this.STATUS.MODIFY) {
            let ruleFormData: IRule.FormData = {
                rule_name: this.selectedRule.rule_name,
                condition: [],
                parameter: this.parametersByRule
            };

            this.selectedRule.condition.map((condition: IRule.Condition, index: number) => {
                ruleFormData.condition.push({
                    param_name: condition.param_name.toLowerCase(),
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