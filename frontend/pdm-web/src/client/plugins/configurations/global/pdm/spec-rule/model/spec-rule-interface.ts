export interface Plant {
    fabId: number;
    fabName: string;
}

export interface Model {
    model_name: string;
}

export interface RuleResponse {
    rule_id: number;
    rule_name: string;
    used_yn: boolean;
    condition: string;
    expression: string;
    expression_value: string;
    expression_values: string[];

    description?: string;
    eqp_id?: number;
    eqp_spec_link_mst_rawid?: number;
    lower_alarm_spec?: number;
    lower_warning_spec?: number;
    model_name?: string;
    model_param_spec_mst_rawid?: number;
    operand?: string;
    ordering?: number;
    param_id?: number;
    param_name?: string;
    param_value?: number;
    parameter?: any;
    target?: any;
    upper_alarm_spec?: number;
    upper_warning_spec?: number;
    userName?: string;
}

export interface Rule {
    rule_id: number;
    rule_name: string;
    condition: string;
    expression: string;
    expression_values: string[];
}

export interface RuleRequest {
    rule_id: number;
    rule_name: string;
    model_name: string;
    condition: string;
    expression: string;
    expression_value: string;
    parameter: Array<Parameter>;
}

export interface FormData {
    model_name: string;
    rule_name: string;
    condition?: Condition[];//because DEFAULT form
    parameter: Array<Parameter>;
}

export interface Parameter {
    model_param_spec_mst_rawid: number;
    param_name: string;
    upper_alarm_spec: number;
    upper_warning_spec: number;
    used_yn: boolean;
}

export interface Condition {
    param_name: string;
    operand: string;
    param_value: string;
}

export interface ParameterResponse {
    model_param_spec_mst_rawid: number;
    param_name: string;
    upper_alarm_spec: number;
    upper_warning_spec: number;
    used_yn: boolean;

    rule_id?: number;
    model_name?: string;
    rule_name?: string;
    condition?: string;
    expression?: string;
    expression_value?: string;
    expression_values?: string;
    description?: string;
    param_id?: number;
    param_value?: number;
    operand?: string;
    lower_alarm_spec?: number;
    lower_warning_spec?: number;
    target?: any;
    orering?: number;
    userName?: string;
    parameter?: any
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