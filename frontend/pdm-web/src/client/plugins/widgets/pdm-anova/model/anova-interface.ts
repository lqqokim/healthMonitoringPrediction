export interface Response {
    correlationOutput: Array<Array<number>>;
    paramNames: Array<string>;
    paramSeq: Array<number>;

    correlationInput: null;
    correlationScatter: Array<Array<number>>;
    correlationTrend: Array<Array<number>>;
    regression: {
        end_xValue: number;
        end_yValue: number;
        intercept: number;
        r2: number;
        slope: number;
        start_xValue: number;
        start_yValue: number;
    };
}

const results = [
    {
        catVar: 'Equipment',
        contVar: 'RMS3',
        pValue: 6.6643
    },
    {
        catVar: 'Equipment',
        contVar: 'RMS4',
        pValue: 6.1647
    },
    {
        catVar: 'Equipment',
        contVar: 'M_speed',
        pValue: 5.6343
    },
    {
        catVar: 'Equipment',
        contVar: 'HOIST_AXIS_TORQUE',
        pValue: 4.0433
    },
    {
        catVar: 'Equipment',
        contVar: 'MODING_SPEED',
        pValue: 3.6645
    },
    {
        catVar: 'Equipment',
        contVar: 'SLIDE_AXIS_TORQUE',
        pValue: 3.6224
    },
    {
        catVar: 'Equipment',
        contVar: 'HOIST_AXIS_SPEED',
        pValue: 2.4351
    },
    {
        catVar: 'Equipment',
        contVar: 'RMS3',
        pValue: 1.0023
    },
    {
        catVar: 'Equipment',
        contVar: 'RMS3',
        pValue: 0.0333
    },
    {
        catVar: 'Equipment',
        contVar: 'M_speed',
        pValue: 5.6343
    },
    {
        catVar: 'Equipment',
        contVar: 'HOIST_AXIS_TORQUE',
        pValue: 4.0433
    },
    {
        catVar: 'Equipment',
        contVar: 'MODING_SPEED',
        pValue: 3.6645
    },
    {
        catVar: 'Equipment',
        contVar: 'M_speed',
        pValue: 5.6343
    },
    {
        catVar: 'Equipment',
        contVar: 'HOIST_AXIS_TORQUE',
        pValue: 4.0433
    },
    {
        catVar: 'Equipment',
        contVar: 'MODING_SPEED',
        pValue: 3.6645
    },
    {
        catVar: 'Equipment',
        contVar: 'M_speed',
        pValue: 5.6343
    },
    {
        catVar: 'Equipment',
        contVar: 'HOIST_AXIS_TORQUE',
        pValue: 4.0433
    },
    {
        catVar: 'Equipment',
        contVar: 'MODING_SPEED',
        pValue: 3.6645
    },
    {
        catVar: 'Equipment',
        contVar: 'RMS3',
        pValue: 6.6643
    },
    {
        catVar: 'Equipment',
        contVar: 'RMS4',
        pValue: 6.1647
    },
    {
        catVar: 'Equipment',
        contVar: 'M_speed',
        pValue: 5.6343
    },
    {
        catVar: 'Equipment',
        contVar: 'HOIST_AXIS_TORQUE',
        pValue: 4.0433
    },
    {
        catVar: 'Equipment',
        contVar: 'MODING_SPEED',
        pValue: 3.6645
    },
    {
        catVar: 'Equipment',
        contVar: 'SLIDE_AXIS_TORQUE',
        pValue: 3.6224
    }
];

export default results;