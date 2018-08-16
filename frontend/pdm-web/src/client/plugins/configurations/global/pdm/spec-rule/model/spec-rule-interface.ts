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
    condition: Condition[];
    expression: string;
}

export interface RuleReqParams extends Rule{
    parameter: Parameter[];
}

export interface FormData {
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
    param_id: number;
    param_name: string;
    alarm_spec: number;
    warning_spec: number;
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