declare let Plotly: any;

export const heatmapData = [
    {
        z: [
            [1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, -0.28450104679009447, 0.05668478156731673, 0.12653326420485955, 0, -0.26903285373764935, 0],
            [0, -0.28450104679009447, 1, -0.06135513946206992, -0.22566679272626808, 0, 0.9412617000199704, 0],
            [0, 0.05668478156731673, -0.06135513946206992, 1, -0.06085293318554101, 0, -0.15452179326925192, 0],
            [0, 0.12653326420485955, -0.22566679272626808, -0.06085293318554101, 1, 0, -0.14849398408602757, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, -0.26903285373764935, 0.9412617000199704, -0.15452179326925192, -0.14849398408602757, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 1]
        ],
        x: ["DATA_STATUS",
            "HOIST_AXIS_TORQUE",
            "FRONT_AXIS_TORQUE",
            "SLIDE_AXIS_TORQUE",
            "DRIVING_VELOCITY(MM/SEC)",
            "HOIST_VELOCITY(MM/SEC)",
            "REAR_AXIS_TORQUE",
            "HOIST_AXIS_TORQUE",],
        y: ["DATA_STATUS",
            "HOIST_AXIS_TORQUE",
            "FRONT_AXIS_TORQUE",
            "SLIDE_AXIS_TORQUE",
            "DRIVING_VELOCITY(MM/SEC)",
            "HOIST_VELOCITY(MM/SEC)",
            "REAR_AXIS_TORQUE",
            "HOIST_AXIS_TORQUE",],
        type: 'heatmap'
    }
];


const trace1 = {
    x: [52698, 43117],
    y: [53, 31],
    mode: 'markers',
    name: 'North America',
    text: ['United States', 'Canada'],
    marker: {
        color: 'rgb(164, 194, 244)',
        size: 12,
        line: {
            color: 'white',
            width: 0.5
        }
    },
    type: 'scatter'
};

const trace2 = {
    x: [39317, 37236, 35650, 27037, 34106, 27478, 30066, 29570, 27159, 23557, 21046, 18007],
    y: [33, 20, 13, 19, 27, 19, 49, 44, 38, 44, 40, 41],
    mode: 'markers',
    name: 'Europe',
    text: ['Germany', 'Britain', 'France', 'Spain', 'Italy', 'Czech Rep.', 'Greece', 'Poland'],
    marker: {
        color: 'rgb(255, 217, 102)',
        size: 12
    },
    type: 'scatter'
};

const trace3 = {
    x: [42952, 37037, 33106, 17478, 34106, 27478, 30066, 29570, 27159, 23557, 9813, 5253, 4692, 3899],
    y: [23, 42, 54, 89, 14, 99, 93, 70, 27, 19, 49, 44],
    mode: 'markers',
    name: 'Asia/Pacific',
    text: ['Australia', 'Japan', 'South Korea', 'Malaysia', 'China', 'Indonesia', 'Philippines', 'India'],
    marker: {
        color: 'rgb(234, 153, 153)',
        size: 12
    },
    type: 'scatter'
};

const trace4 = {
    x: [19097, 18601, 15595, 13546, 12026, 17478, 34106, 27478, 30066, 29570, 27159, 23557, 7434, 5419],
    y: [43, 47, 56, 99, 93, 70, 27, 80, 86, 93, 80, 13, 19, 27],
    mode: 'markers',
    name: 'Latin America',
    text: ['Chile', 'Argentina', 'Mexico', 'Venezuela', 'Venezuela', 'El Salvador', 'Bolivia'],
    marker: {
        color: 'rgb(142, 124, 195)',
        size: 12
    },
    type: 'scatter'
};

export const scatterData = [trace1, trace2, trace3, trace4];



