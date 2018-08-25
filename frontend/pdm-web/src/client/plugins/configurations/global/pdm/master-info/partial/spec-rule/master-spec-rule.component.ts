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
    @ViewChild('ParamGrid') ParamGrid: wjcGrid.FlexGrid;
    @Input() specCondition: any;

    fabId: IRule.SpecCondition['fabId'];
    eqp: IRule.SpecCondition['eqp'];
    model: IRule.SpecCondition['model'];

    plants: IRule.Plant[];
    models: IRule.Model[];
    rules: IRule.Rule[];

    selectedRule: IRule.Rule;
    ruleFormData: IRule.FormData;

    paramsBySeletedRule: IRule.ParameterByRule[];
    editParameters: IRule.ParameterByRule[];
    tempParameters: IRule.ParameterByRule[];

    tempSpecRules: IRule.Rule[];

    isRuleUse: boolean = false;
    isEditGird: boolean = false;
    modalTitle: string;

    isUpDisabled: boolean = false;
    isDownDisabled: boolean = false;

    readonly DEFAULT_NAME: string = 'DEFAULT';
    readonly TYPE: IRule.Type = { MODEL: 'MODEL', EQP: 'EQP' };
    readonly STATUS: IRule.Status = { CREATE: 'create', MODIFY: 'modify', DELETE: 'delete' };

    constructor(
        private _pdmConfigService: PdmConfigService,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater,
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

    //조회한 Rules 파싱
    setRules(ruleResponse: IRule.RuleResponse[]): IRule.Rule[] {
        let rules: IRule.Rule[] = [];

        ruleResponse.map((rule: IRule.RuleResponse, index: number) => {
            let condition: IRule.Condition[] = rule.condition ? JSON.parse(rule.condition.replace(new RegExp(/\\/g), '')) : null;
            let expresssion: string = condition ? this.conditionToExpression(condition) : null;

            rules.push({
                eqp_spec_link_mst_rawid: rule.eqp_spec_link_mst_rawid,
                rule_id: rule.rule_id,
                rule_name: rule.rule_name,
                model_name: rule.model_name,
                condition: condition,
                expression: expresssion,
                used_yn: rule.eqp_spec_link_mst_rawid ? true : false,
                // ordering: rule.ordering
                ordering: index + 1
            });
        });

        return rules;
    }

    //Rule Grid에서 첫번째 Row 선택
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
                        eqp_lower_alarm_spec: param.eqp_lower_alarm_spec,
                        eqp_lower_warning_spec: param.eqp_lower_warning_spec,
                        used_yn: param.used_yn,
                        type: param.type
                    });
                });

                this.paramsBySeletedRule = parameters;
            }).catch((err) => {
                console.log(err);
            });
    }

    conditionToString(conditions: IRule.Condition[]): string {
        const toJsonStr = JSON.stringify(conditions);
        const condition: string = toJsonStr.toString().replace(/"/g, '\\"');
        return condition;
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

        return expression;
    }

    //Rule Grid에서 Row 선택시 호출
    selectRule(grid: wjcGrid.FlexGrid): void {
        this.selectedRule = grid.selectedItems[0];

        if (this.isEditGird) {
            return;
        }

        let selectedIndex: number = this.rules.indexOf(this.selectedRule);
        if (selectedIndex === 0) {
            this.isUpDisabled = true;
            this.isDownDisabled = false;
        } else if (selectedIndex === this.RuleGrid.itemsSource.length - 1) {
            this.isUpDisabled = false;
            this.isDownDisabled = true;
        } else {
            this._resetDisabled();
        }

        this.getParamsByEqpRule();
    }

    //Rule Grid에서 Rule 수정
    editRuleGrid(): void {
        //Rules 수정 취소시 Rollback을 위한 Copy
        this.tempSpecRules = JSON.parse(JSON.stringify(this.rules));

        //Up, Down Button Disabled 여부 체크
        this.selectedRule = this.RuleGrid.selectedItems[0];
        let selectedIndex: number = this.rules.indexOf(this.selectedRule);

        if (selectedIndex === 0) {
            this.isUpDisabled = true;
        } else if (selectedIndex === this.RuleGrid.itemsSource.length - 1) {
            this.isDownDisabled = true;
        }
    }

    //Rule Grid 수정 취소
    cancelEditRule(): void {
        this.rules = this.tempSpecRules;
        this._resetDisabled();
    }

    //Rule Grid에서 수정된 Rule 정보 저장
    saveEditRule(): void {
        let rules: IRule.Rule[] = this.rules;
        let ruleRequest: IRule.RuleRequest[] = [];
        rules.map((rule: IRule.Rule) => {
            ruleRequest.push({
                eqp_spec_link_mst_rawid: rule.eqp_spec_link_mst_rawid,
                rule_id: rule.rule_id,
                rule_name: rule.rule_name,
                model_name: this.model,
                condition: this.conditionToString(rule.condition),
                used_yn: rule.used_yn
            });
        });

        this.updateEqpRule(ruleRequest);
        this._showModal(false);
    }

    //Rule Grid에서 수정된 Rule 정보 저장을 위한 API 호출
    updateEqpRule(request: IRule.RuleRequest[]): void {
        this._pdmConfigService.updateEqpRule(this.fabId, this.eqp.eqpId, request)
            .then((res) => {
                console.log('updateEqpRule res', res);
                this.getRules();
                this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
            }).catch((err) => {
                console.log('updateEqpRule err', err);
                this.getRules();
                this.notify.error("MESSAGE.GENERAL.ERROR");
            });
    }

    //수정을 위한 Modal Open
    openEditModal(status: string): void {
        const rule: IRule.Rule = this.selectedRule;
        let ruleFormData: IRule.FormData = {
            model_name: this.model,
            rule_name: rule && rule.rule_name ? rule.rule_name : null,
            condition: rule && rule.condition ? rule.condition : null,
            parameter: this.paramsBySeletedRule
        };

        this.ruleFormData = ruleFormData;
        console.log('ruleFormData', ruleFormData);
        this.editParameters = JSON.parse(JSON.stringify(ruleFormData.parameter));
        this.tempParameters = JSON.parse(JSON.stringify(this.editParameters)); //Wijmo 수정 취소시, Rollback을 위해
        this._showModal(true, status);
    }

    //Modal에서 수정된 Rule의 Parameter 정보를 저장
    saveRule(grid: wjcGrid.FlexGrid): void {
        // this.ParamGrid.onCellEditEnded();
        // console.log('source', this.ParamGrid.itemsSource[0]);

        let parameters: IRule.ParameterByRule[] = this.editParameters;
        let paramRequest: IRule.ParamRequest[] = [];
        parameters.map((param: IRule.ParameterByRule) => {
            paramRequest.push({
                eqp_spec_link_mst_rawid: param.eqp_spec_link_mst_rawid,
                param_id: param.param_id,
                eqp_id: this.eqp.eqpId,
                rule_id: this.selectedRule.rule_id,
                eqp_upper_alarm_spec: param.alarm_spec,
                eqp_upper_warning_spec: param.warning_spec,
                eqp_lower_alarm_spec: param.eqp_lower_alarm_spec,
                eqp_lower_warning_spec: param.eqp_lower_warning_spec,
            });
        });

        this.updateEqpRuleParams(paramRequest);
        this._showModal(false);
    }

    //수정된 Rule의 Parameter 정보 저장을 위한 API 호출
    updateEqpRuleParams(request: IRule.ParamRequest[]): void {
        this._pdmConfigService.updateEqpRuleParams(this.fabId, request)
            .then((res) => {
                console.log('updateEqpRuleParams res', res);
                this.getRules();
                this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
            }).catch((err) => {
                console.log('updateEqpRuleParams err', err);
            });
    }

    //Rule Grid에서 Up 버튼 클릭
    onUpOrder(): void {
        if (this.isDownDisabled) this.isDownDisabled = false;
        let selectedIndex: number = this.rules.indexOf(this.selectedRule);
        if (selectedIndex === 0) {
            return;
        }

        // Row switching
        let temp = this.rules[selectedIndex];
        this.rules[selectedIndex] = this.rules[selectedIndex - 1];
        this.rules[selectedIndex - 1] = temp;

        // Reset row order
        const rulesSize: number = this.rules.length;
        for (let i = 0; i < rulesSize; i++) {
            this.rules[i].ordering = i + 1;
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

    // Rule Grid에서 Up 버튼 클릭
    onDownOrder(): void {
        if (this.isUpDisabled) this.isUpDisabled = false;
        let selectedIndex: number = this.rules.indexOf(this.selectedRule);
        if (selectedIndex === this.RuleGrid.itemsSource.length - 1) {
            this.isDownDisabled = true;
            return;
        }

        // Row switching
        let temp = this.rules[selectedIndex];
        this.rules[selectedIndex] = this.rules[selectedIndex + 1];
        this.rules[selectedIndex + 1] = temp;

        // Reset row order
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

    onCellEditEnded(grid, event) {
        console.log('onCellEditEnded => ', grid, event);
    }

    onCellEditEnding(grid, event) {
        console.log('onCellEditEnding => ', grid, event);
    }

    onItemsSourceChanged(grid, event) {
        console.log('onItemsSourceChanged => ', grid, event);
    }

    closeModal(): void {
        this._showModal(false);
    }

    // Up, Down 버튼 Disabled 여부 초기화
    private _resetDisabled(): void {
        if (this.isDownDisabled) {
            this.isDownDisabled = false;
        }

        if (this.isUpDisabled) {
            this.isUpDisabled = false;
        }
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