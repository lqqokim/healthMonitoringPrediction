import { TimePeriod } from './../../../../../../dist/dev/plugins/widgets/pdm-modeler/pdm-modeler.interface.d';
//Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, OnChanges, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';

//MIP
import { WidgetRefreshType, WidgetApi, OnSetup, RequestType } from './../../../../common';
import { PdmEqpParamAnalysisService } from './../../pdm-eqp-param-analysis/pdm-eqp-param-analysis.service';
import { PdmCommonService } from './../../../../common/service/pdm-common.service';

import { ModelingTreeComponent } from './../../../common/modeling-tree/modeling-tree.component';
import { ConditionType } from '../pdm-spectrum-data-analysis-widget.component';

export interface ChartDataType {
    data: any[];
    layout: any;
}

export interface Fab {
    fabId: number;
    fabName: string;
}

export interface TimePeriod {
    from: number;
    to: number;
}

export interface NodeType {
    FAB: number;
    AREA: number;
    EQP: number;
    PARAMETER: number;
}

@Component({
    moduleId: module.id,
    selector: 'spectrum-data-analysis',
    templateUrl: './spectrum-data-analysis.html',
    styleUrls: ['./spectrum-data-analysis.html'],
    providers: [PdmEqpParamAnalysisService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class SpectrumDataAnalysisComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('tree') tree: ModelingTreeComponent;
    @Input() condition: ConditionType;

    protected fab: Fab;
    protected timePeriod: TimePeriod;
    protected graph: ChartDataType = {
        data: undefined,
        layout: undefined
    };

    protected searchTimePeriod: TimePeriod = {
        from: undefined,
        to: undefined
    }

    private nodeType: number;
    private readonly NODE_TYPE: NodeType = {
        FAB: 0,
        AREA: 1,
        EQP: 2,
        PARAMETER: 100
    };

    constructor(private _analysisService: PdmEqpParamAnalysisService) {

    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('ngOnChanges', changes);
        if (changes['condition'] !== null && changes['condition']['currentValue']) {
            let currentValue = changes['condition']['currentValue'];

            this.fab = currentValue['fab'];
            this.timePeriod = currentValue['timePeriod'];
            this.setChartData();
        }
    }

    ngOnInit() {

    }

    setChartData(): void {
        let datas: any[] = [];

        for (var i = 0; i < 20; i++) {
            let x = [];
            let y = [];
            let z = [];

            for (let j = 0; j < 100; j++) {
                x.push(i);
                y.push(j);

                if (j > 20 && j < 30) {
                    z.push(randomRange(10, 20) / 10);
                } else {
                    z.push(randomRange(1, 3) / 10);
                }
            }

            const data: any = {
                x: x,
                y: y,
                z: z,
                mode: 'lines',
                marker: {
                    color: '#1f77b4',
                    size: 12,
                    symbol: 'circle',
                    line: {
                        color: 'rgb(0,0,0)',
                        width: 0
                    }
                },
                line: {
                    color: '#1f77b4',
                    width: 1
                },
                type: 'scatter3d'
            };

            datas.push(data);
        };

        const layout: any = {
            title: '3D Line Plot',
            autosize: false,
            showlegend: false,
            width: 1000,
            height: 500,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 65
            },
            scene: {
                aspectratio: {
                    x: 1, y: 2, z: 0.1
                },
                camera: {
                    eye: { x: 1.9896227268277047, y: 0.0645906841396725, z: 0.5323776223386583 }
                }
            }
        };

        this.graph.data = datas;
        this.graph.layout = layout;

        function randomRange(min, max) {
            return Math.floor(Math.random() * ((max - min) + 1) + min);
        }
    }

    nodeClick(node: any): void {
        if (node.treeview) {
            let areaId: number;
            let eqpId: number;
            let paramId: number;
            let eqpName: string;
            let areaName: string;

            if (node.treeview.nodeType.toString().toUpperCase() == 'AREA') {
                this.nodeType = this.NODE_TYPE.AREA;
            } else if (node.treeview.nodeType.toString().toUpperCase() == 'EQP') {
                this.nodeType = this.NODE_TYPE.EQP;
            } else if (node.treeview.nodeType.toString().toUpperCase() == 'PARAMETER') {
                this.nodeType = this.NODE_TYPE.PARAMETER;
            } else {
                this.nodeType = node.treeview.nodeType;
            }
            if (this.nodeType === this.NODE_TYPE.EQP) {
                eqpId = node.treeview.nodeId;
                areaId = node.treeview.parentnode.nodeId;
                eqpName = node.treeview.nodeName;
                areaName = node.treeview.parentnode.nodeName;
            } else if (this.nodeType > this.NODE_TYPE.EQP) {
                eqpId = node.treeview.parentnode.nodeId;
                areaId = node.treeview.parentnode.parentnode.nodeId;
                paramId = node.treeview.nodeId;
                eqpName = node.treeview.parentnode.nodeName;
                areaName = node.treeview.parentnode.parentnode.nodeName;
            } else {
                // this.healthIndexData = [];
                // this.healthIndexContributeData = [];
                // this.trendData = [];
                // this.spectrumData = [];
                // this.timeWaveData = [];
                return;
            }

            console.log('nodeType => ', this.nodeType, 'areaId => ', areaId, 'eqpId => ', eqpId, 'paramId => ', paramId);
            // this.nodeData(this.nodeType, areaId, eqpId, paramId);
            // from: 1531666800000 to: 1531823570904

            if (paramId) {
                this.getParamInfoData(areaId, eqpId, paramId);
                // this.getMeasurements(200, 2190, 2163);
            }
        }
    }

    getParamInfoData(areaId: number, eqpId: number, paramId: number): void {
        this._analysisService.getParamInfoByEqpId(this.fab.fabId, areaId, eqpId)
            .then((res) => {
                console.log('ParameterInfo data => ', res);
            }).catch((err) => {

            });
    }

    getMeasurements(areaId: number, eqpId: number, paramId: number): void {
        this._analysisService.getMeasurements(this.fab.fabId, areaId, eqpId, paramId, this.timePeriod.from, this.timePeriod.to)
            .then((res) => {
                console.log('Measurements data => ', res);
            }).catch((err) => {

            });
    }

    getSpectrum(areaId: number, eqpId: number, measurementId: number): void {
        this._analysisService.getSpectrum(this.fab.fabId, areaId, eqpId, measurementId)
            .then((res) => {
                console.log('Spectrum data => ', res);
            }).catch((err) => {

            });
    }

    fromToChange(ev: any): void {
        console.log('fromToChange', ev);
    } 

    search(): void {

    }

    ngOnDestroy() {

    }
}