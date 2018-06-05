// /**
//  * Created by airnold on 2017. 9. 4..
//  */
// export class ScaleConvert {
//
//     rangeMin: number = 0;
//     rangeMax: number = 1;
//     domainMin: number;
//     domainMax: number;
//     originalData: Array<number>;
//     scale: any;
//
//     constructor(original?: Array<any>) {
//         this.scale = d3.scale.linear();
//         if (original) {
//             this.originalData = [...original];
//         }
//     }
//
//     getScaledValue(input: number) {
//         return this.scale(input);
//     }
//
//     setRange(min: number, max: number) {
//         this.rangeMin = min;
//         this.rangeMax = max;
//         this.scale.range([min, max]);
//     }
//
//     setDomain(min: number, max: number) {
//         this.scale.domain([0, max]);
//     }
// }

export class ScaleConvert {

    rangeMin: number = 0;
    rangeMax: number = 1;
    domainMin: number;
    domainMax: number;
    originalData: Array<number>;

    constructor(original?: Array<any>) {
        if (original) {
            this.originalData = [...original];
        }
    }

    getScaledValue(input: number) {
        if (this.domainMin && this.domainMin) {
            const percent: number = (input - this.domainMin) / (this.domainMax - this.domainMin);
            return percent * (this.rangeMax - this.rangeMin) + this.rangeMin;
        } else {
            return 0;
        }
    }

    setRange(min: number, max: number) {
        this.rangeMin = min;
        this.rangeMax = max;
    }

    setDomain(min: number, max: number) {
        this.domainMin = min;
        this.domainMax = max;
    }
}
