//Angular
import { Component, OnInit, OnDestroy, OnChanges, ViewChild, Input, SimpleChange, SimpleChanges } from '@angular/core';

//MIP
import { ModalAction, ModalRequester, RequestType } from '../../../../../../../common';
import { NotifyService, Translater } from '../../../../../../../sdk';

//Service
import { PdmModelService } from './../../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from './../../../model/pdm-config.service';

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
    templateUrl: './master-spec-rule.html',
    styleUrls: ['./master-spec-rule.css'],
    providers: [PdmConfigService, PdmModelService]
})
export class MasterSpecRuleComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('RuleGrid') RuleGrid: wjcGrid.FlexGrid;
    @Input() specCondition: any;

    fabId: IRule.SpecCondition['fabId'];
    eqp: IRule.SpecCondition['eqp'];
    model: IRule.SpecCondition['model'];

    plants: IRule.Plant[];
    models: IRule.Model[];
    rules: IRule.Rule[];

    selectedPlant: IRule.Plant;
    selectedModel: IRule.Model;
    selectedRule: IRule.Rule;
    ruleFormData: IRule.FormData;

    paramsBySeletedRule: IRule.ParameterByRule[];
    editParameters: IRule.ParameterByRule[];
    tempParameters: IRule.ParameterByRule[];

    isRuleUse: boolean = false;
    isEditGird: boolean = false;
    modalTitle: string;

    isUpDisabled: boolean = false;
    isDownDisabled: boolean = false;
    isOnOrder: boolean = false;

    readonly TYPE: IRule.Type = { MODEL: 'MODEL', EQP: 'EQP' };
    readonly STATUS: IRule.Status = { CREATE: 'create', MODIFY: 'modify', DELETE: 'delete' };

    constructor(
        private _pdmConfigService: PdmConfigService
    ) {

    }

    ngOnChanges(changes: any) {
        const currentValue = changes.specCondition.currentValue;
        this.fabId = currentValue.fabId;
        this.eqp = currentValue.eqp;
        this.model = currentValue.model;
        this.getRules();
    }

    ngOnInit() {

    }

    getRules(): void {
        this._pdmConfigService.getEqpRules(this.fabId, this.eqp.eqpId)
            .then((ruleResponse: IRule.RuleResponse[]) => {
                console.log('getRules', ruleResponse);

                this.rules = this.setRules(ruleResponse);

                if (this.rules.length) {
                    this.selectFirstRule();
                } else {
                    if (this.paramsBySeletedRule) {
                        this.paramsBySeletedRule = [];
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    setRules(ruleResponse: IRule.RuleResponse[]): IRule.Rule[] {
        let rules: IRule.Rule[] = [];

        ruleResponse.map((rule: IRule.RuleResponse, index: number) => {
            let condition: IRule.Condition[] = rule.condition ? JSON.parse(rule.condition.replace(new RegExp(/\\/g), '')) : null;
            let expresssion: string = condition ? this.conditionToExpression(condition) : null;

            rules.push({
                rule_id: rule.rule_id,
                rule_name: rule.rule_name,
                model_name: rule.model_name,
                condition: condition,
                expression: expresssion,
                used_yn: rule.used_yn,
                // ordering: rule.ordering
                ordering: index + 1
            });
        });

        return rules;
    }

    selectFirstRule(): void {
        setTimeout(() => {
            if (this.RuleGrid.itemsSource && this.RuleGrid.itemsSource.length > 0) {
                this.selectedRule = this.RuleGrid.itemsSource[0];
                console.log('selectFirstRule', this.RuleGrid)
                this.getParamsByEqpRule();
            }
        });
    }

    // rule을 클릭해서 가져오는 parameter
    getParamsByEqpRule(): void {
        this._pdmConfigService.getParamsByEqpRule(this.fabId, this.eqp.eqpId, this.selectedRule.rule_id)
            .then((params: IRule.ParameterResponse[]) => {
                console.log('getParamsByRule', params);
                let parameters: IRule.ParameterByRule[] = [];
                params.map((param: IRule.ParameterResponse) => {
                    parameters.push({
                        eqp_spec_link_mst_rawid: param.eqp_spec_link_mst_rawid,
                        param_id: param.param_id,
                        param_name: param.param_name,
                        param_value: param.param_value,
                        operand: param.operand,
                        alarm_spec: param.type === this.TYPE.EQP ? param.eqp_upper_alarm_spec : param.model_upper_alarm_spec,
                        warning_spec: param.type === this.TYPE.EQP ? param.eqp_upper_warning_spec : param.model_upper_warning_spec,
                        used_yn: param.used_yn,
                        type: param.type
                    });
                });

                this.paramsBySeletedRule = parameters;
            }).catch((err) => {
                console.log(err);
            });
    }

    conditionToExpression(conditions: IRule.Condition[]): string {
        let expression: string = '';

        conditions.map((condition: IRule.Condition, index: number) => {
            let appendStr: string = `${condition.param_name}${condition.operand}${condition.param_value} AND `;
            if (index === conditions.length - 1) {
                appendStr = appendStr.replace(' AND ', '');
            }

            expression = expression.concat(appendStr);
        });

        // console.log('conditionToExpression', expression);
        return expression;
    }

    selectRule(grid: wjcGrid.FlexGrid): void {
        this.selectedRule = grid.selectedItems[0];

        if(this.isOnOrder) {
            this.isOnOrder = false;
            return;
        }

        let selectedIndex: number = this.rules.indexOf(this.selectedRule);
        if(selectedIndex === 0) {
            this.isUpDisabled = true;
            this.isDownDisabled = false;
        } else if(selectedIndex === this.RuleGrid.itemsSource.length - 1) {
            this.isDownDisabled = true;
            this.isUpDisabled = false;
        } else {
            this.isDownDisabled = false;
            this.isUpDisabled = false;
        }

        
        this.getParamsByEqpRule();
    }

    editRuleGrid(isEdit: boolean): void {
        this.RuleGrid.collectionView.refresh();
        console.log('editRuleGrid', isEdit);
    }

    cancelEditRule(isEdit: boolean): void {
        console.log('cancelEditRule', isEdit);
        this.isUpDisabled = false;
        this.isDownDisabled = false;
    }

    saveEditRule(): void {

    }

    openEditModal(status: string): void {
        const rule: IRule.Rule = this.selectedRule;
        let ruleFormData: IRule.FormData = {
            model_name: this.model,
            rule_name: rule && rule.rule_name ? rule.rule_name : null,
            condition: rule && rule.condition ? rule.condition : null,
            parameter: this.paramsBySeletedRule
        };

        // if (this.selectedRule && this.selectedRule.condition) {
        //     rule.condition.map((condition: IRule.Condition, index: number) => {
        //         ruleFormData.condition.push({
        //             param_name: condition.param_name,
        //             operand: condition.operand,
        //             param_value: condition.param_value
        //         });
        //     });
        // }

        console.log('ruleFormData', ruleFormData);
        this.ruleFormData = ruleFormData;
        this.editParameters = JSON.parse(JSON.stringify(ruleFormData.parameter));
        this.tempParameters = JSON.parse(JSON.stringify(this.editParameters)); //Wijmo 수정 취소시, Rollback을 위해
        this._showModal(true, status);
    }

    saveRule(ruleForm: NgForm): void {
        let ruleFormData = this.ruleFormData;
        console.log('ruleFormData', this.ruleFormData);

        // const params: IRule.RuleReqParams = {
        //     rule_id: status === 'create' ? null : rule.rule_id,
        //     rule_name: rule.rule_name,
        //     expression: rule.expression,
        //     condition: rule.condition,
        //     parameter: this.parameters
        // };


    }

    updateOrder(): void {
        // this._pdmConfigService.updateModelRule(this.selectedPlant.fabId, params)
        //     .then((res) => {

        //     }).catch((err) => {

        //     });
    }

    onUpOrder(): void {
        this.isOnOrder = true;
        if(this.isDownDisabled) this.isDownDisabled = false;
        let selectedIndex: number = this.rules.indexOf(this.selectedRule);
        // console.log('index ==> ', selectedIndex);
        if (selectedIndex === 0) {
            // this.isUpDisabled = true;
            return;
        }

        // Row switching
        let temp = this.rules[selectedIndex];
        this.rules[selectedIndex] = this.rules[selectedIndex - 1];
        this.rules[selectedIndex - 1] = temp;

        // Reset code order
        const rulesSize: number = this.rules.length;
        for (let i = 0; i < rulesSize; i++) {
            this.rules[i].ordering = i + 1;
            // console.log('order ==> ', this.rules[i].ordering);
        }

        // Wijmo refresh
        this.RuleGrid.collectionView.refresh();

        setTimeout(() => {
            this.RuleGrid.selection = new wjcGrid.CellRange(selectedIndex - 1, 0, selectedIndex, 2);
            if (selectedIndex === 1) {
                this.isUpDisabled = true;
            }
        });
    }

    onDownOrder(): void {
        this.isOnOrder = true;
        if(this.isUpDisabled) this.isUpDisabled = false;
        let selectedIndex: number = this.rules.indexOf(this.selectedRule);
        if (selectedIndex === this.RuleGrid.itemsSource.length - 1) {
            this.isDownDisabled = true;
            return;
        }

        // Row switching
        let temp = this.rules[selectedIndex];
        this.rules[selectedIndex] = this.rules[selectedIndex + 1];
        this.rules[selectedIndex + 1] = temp;

        // Reset code order
        const rulesSize: number = this.rules.length;
        for (let i = 0; i < rulesSize; i++) {
            this.rules[i].ordering = i + 1;
        }

        // Wijmo refresh
        this.RuleGrid.collectionView.refresh();

        setTimeout(() => {
            this.RuleGrid.selection = new wjcGrid.CellRange(selectedIndex + 1, 0, selectedIndex, 2);
            if (selectedIndex === this.RuleGrid.itemsSource.length - 2) {
                this.isDownDisabled = true;
            }
    
        });
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