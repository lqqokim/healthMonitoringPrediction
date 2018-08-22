export interface Plant {
    fabId: number;
    fabName: string;
}

export interface Model {
    model_name: string;
}

export interface Rule {
    rule_id: number;
    rule_name: string;
    condition: string;
    expression: string;
    expression_values: string[];
}

export interface RuleReqParams extends Rule{
    parameter: Parameter[];
}

export interface FormData {
    model_name: string;
    rule_name: string;
    condition: Condition[];
    parameter: Parameter[];
}

export interface Condition {
    param_name: string;
    operand: string;
    param_value: number;
}

export interface Parameter {
    model_param_spec_mst_rawid: number,
    rule_id: number,
    model_name: string,
    rule_name: string,
    condition: string,
    expression: string,
    expression_value: string,
    expression_values: string,
    description: string,
    param_id: number,
    param_name: string,
    param_value: number,
    operand: string,
    upper_alarm_spec: number,
    upper_warning_spec: number,
    lower_alarm_spec: number,
    lower_warning_spec: number,
    target?: any,
    orering?: number,
    use_yn: boolean,
    userName?: string,
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