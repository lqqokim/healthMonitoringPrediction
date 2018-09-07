export interface Plant {
    fabId: number;
    fabName: string;
}

export interface Model {
    model_name: string;
}

export interface RuleResponse {
    eqp_spec_link_mst_rawid: number;
    rule_id: number;
    model_name: string;
    rule_name: string;
    condition: string;
    used_yn: boolean;

    model_param_spec_mst_rawid?: number;
    expression?: string;
    expression_value?: string;
    expression_values?: string[];
    description: string;
    ordering?: number;
    param_id?: number;
    param_name?: string;
    param_value?: number;
    operand?: string;
    upper_alarm_spec?: number;
    upper_warning_spec?: number;
    model_upper_alarm_spec?: number;
    model_upper_warning_spec?: number;
    eqp_upper_alarm_spec?: number;
    eqp_upper_warning_spec?: number;
    lower_alarm_spec?: number;
    lower_warning_spec?: number;
    model_lower_alarm_spec?: number;
    model_lower_warning_spec?: number;
    eqp_lower_alarm_spec?: number;
    eqp_lower_warning_spec?: number;
    type?: number;
    target?: number;
    userName?: string;
    eqp_id?: number;
    parameter?: any;
}

export interface Rule {
    eqp_spec_link_mst_rawid: number;
    rule_id: number;
    rule_name: string;
    model_name: string;
    condition: Condition[];
    expression: string;
    used_yn: boolean;
    ordering?: number;
}

// export interface RuleRequest {
//     rule_id: number;
//     rule_name: string;
//     model_name: string;
//     condition: string;
//     expression: string;
//     expression_value: string;
//     parameter: Array<Parameter>;
// }

export interface RuleRequest {
    eqp_spec_link_mst_rawid: number;
    rule_id: number;
    rule_name: string;
    model_name: string;
    condition: string;
    used_yn: boolean;
    ordering: number;
}

export interface FormData {
    model_name: string;
    rule_name: string;
    condition?: Condition[];//because DEFAULT form
    parameter: Array<ParameterByRule>;
}

export interface Parameter {
    model_param_spec_mst_rawid: number;
    param_name: string;
    upper_alarm_spec: number;
    upper_warning_spec: number;
    used_yn: boolean;
}

export interface ParamRequest {
    eqp_spec_link_mst_rawid: number;
    param_id: number;
    eqp_id: number;
    rule_id: number;
    eqp_upper_alarm_spec: number;
    eqp_upper_warning_spec: number;
    eqp_lower_alarm_spec: number;
    eqp_lower_warning_spec: number;
    used_yn: boolean;
}

export interface Condition {
    param_name: string;
    operand: string;
    param_value: number;
}

export interface ParameterResponse {
    eqp_spec_link_mst_rawid: number;
    param_id: number;
    param_name: string;
    operand: string;
    param_value: number;
    ordering: number;
    model_upper_alarm_spec: number;
    model_upper_warning_spec: number;
    eqp_upper_alarm_spec: number;
    eqp_upper_warning_spec: number;
    type: string;
    used_yn: boolean;

    condition?: string;
    description?: string;
    eqp_id?: number;
    eqp_lower_alarm_spec?: number;
    eqp_lower_warning_spec?: number;
    expression?: string;
    expression_value?: number;
    expression_values?: number;
    lower_alarm_spec?: number;
    lower_warning_spec?: number;
    model_lower_alarm_spec?: number;
    model_lower_warning_spec?: number;
    model_name?: string;
    model_param_spec_mst_rawid?: number;
    parameter?: any;
    rule_id?: number;
    rule_name?: string;
    target?: any;
    upper_alarm_spec?: number;
    upper_warning_spec?: number;
    userName?: string;
}

export interface Operand {
    display: string;
    value: string;
}

export interface Status {
    CREATE: string;
    MODIFY: string;
    DELETE: string;
}

export interface SpecCondition {
    fabId: any;
    eqp: Eqp
    model: string;
}

export interface Eqp {
    eqpId: number;
    eqpName: string;
}

export interface ParameterByRule {
    eqp_spec_link_mst_rawid: number;
    param_id: number;
    param_name: string;
    param_value: number;
    operand: string;
    alarm_spec: number;
    warning_spec: number;
    used_yn: boolean;
    type: string;

    eqp_lower_alarm_spec : number;
    eqp_lower_warning_spec : number;
}

export interface Type {
    MODEL: string;
    EQP: string;
}