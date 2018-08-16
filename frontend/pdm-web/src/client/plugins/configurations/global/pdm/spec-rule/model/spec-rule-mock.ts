import * as IRule from './spec-rule-interface';

export const MODELS: IRule.Model[] = [
    {
        model_name: 'TOHS',
    },
    {
        model_name: 'STK',
    },
    {
        model_name: 'OHS',
    },
    {
        model_name: 'LAMI',
    }
];

export const RULES: IRule.Rule[] = [
    {
        "rule_id": 21300,
        "rule_name": "TOHS_7001",
        "condition": [
            { "param_name": "barcode", "operand": ">", "param_value": 20.3 },
            { "param_name": "speed", "operand": "<=", "param_value": 1.0 }
        ],
        "expression": "barcode=7002.0 AND speed<=10.0",
    },
    {
        "rule_id": 21301,
        "rule_name": "TOHS_7002",
        "condition": [
            { "param_name": "rms03", "operand": "like", "param_value": 702.0 },
            { "param_name": "speed", "operand": "<=", "param_value": 110.0 }
        ],
        "expression": "barcode=7002.0 AND speed<=10.0",
    },
    {
        "rule_id": 21302,
        "rule_name": "TOHS_7003",
        "condition": [
            { "param_name": "rms2", "operand": "<", "param_value": 2.0 },
            { "param_name": "speed", "operand": "<=", "param_value": 15.0 }
        ],
        "expression": "barcode=7002.0 AND speed<=10.0",
    },
    {
        "rule_id": 21302,
        "rule_name": "TOHS_7004",
        "condition": [
            { "param_name": "barcode", "operand": ">=", "param_value": 73.0 },
            { "param_name": "speed", "operand": "<=", "param_value": 10.0 }
        ],
        "expression": "barcode=7002.0 AND speed<=10.0",
    }
];

export const PARAMETERS: IRule.Parameter[] = [
    {
        "param_id": 132231,
        "param_name": "barcode",
        "alarm_spec": 15.2,
        "warning_spec": 60.1
    },
    {
        "param_id": 132231,
        "param_name": "speed",
        "alarm_spec": 10.2,
        "warning_spec": 10.1
    },
    {
        "param_id": 132231,
        "param_name": "rms3",
        "alarm_spec": 5.2,
        "warning_spec": 1.1
    },
    {
        "param_id": 132231,
        "param_name": "rms1",
        "alarm_spec": 5.2,
        "warning_spec": 1.1
    },
    {
        "param_id": 132231,
        "param_name": "rms2",
        "alarm_spec": 51.2,
        "warning_spec": 1.1
    },
    {
        "param_id": 132231,
        "param_name": "rms03",
        "alarm_spec": 35.2,
        "warning_spec": 41.1
    }
];