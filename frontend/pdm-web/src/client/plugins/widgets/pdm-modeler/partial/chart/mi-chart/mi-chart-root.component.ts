import { MIChartComponent } from './component/mi-chart.component';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartConfiguration } from './model/chart.interface';

@Component({
    moduleId: module.id,
    selector: 'a3-mi-chart',
    templateUrl: 'mi-chart-root.component.html',


})
export class MiChartRootComponent implements OnInit {
    @ViewChild('michart') miChart: MIChartComponent;
    @Input() mainComponentInstance: any;
    chartConfig: ChartConfiguration;
    preConfig: ChartConfiguration;
    chartOriginalData: Array<any> | any = [];
    chartData: Array<any> = [];
    chartModels: Array<any> | any = [];
    drawedChartInfo: any;
    xFields: any;
    yFields: any;
    yFieldsArray: Array<any> = [];

    constructor(

    ) {

    }

    ngOnInit() {
    }

    setData(type: string ,data: any, params: Array<string>, originalParams: Array<string>, isInit: boolean = true) {
        this._initChartInfos();
        if ( type === 'health' ) {
            this.preConfig = this._getChartConfig(type);
            this.chartModels = data;
            this._makeHealthField();
            this._domainChange();
            this._setAxisConfig();
            this._setSeriesConfig(type);
            if (!isInit) {
                this.preConfig = this.setOutlierPluginDefault(this.preConfig);
            }
        } else if (type === 'trend'){
            this.preConfig = this._getChartConfig(type);
            this.chartModels = data;
            this._makeTrendField(params, originalParams);
            this._setAxisConfig();
            this._setSeriesConfig(type);
            if (!isInit) {
                this.preConfig = this.setOutlierPluginDefault(this.preConfig);
            }
        } else {
            this.preConfig = this._getChartConfig(type);
            this.chartModels = data;
            this._parseVariableImportanceData();
        }
        this.chartConfig = this.preConfig;
    }

    _initChartInfos() {
        this.preConfig = undefined;
        this.chartOriginalData = [];
        this.chartData = [];
        this.chartConfig = undefined;
        this.xFields = undefined;
        this.yFields = undefined;
        this.yFieldsArray = [];
        this.chartModels = [];
    }

    _getChartConfig(type: string): any {
        return this.mainComponentInstance.getChartConfigInstance().getChartConfig(type, this);
    }

    _makeHealthField() {
        this.xFields = 'time';
        this.yFields = 'health';
        this.yFieldsArray.push('health');
    }
    _parseHealthData() {
        const healthValue: Array<any> = this.chartOriginalData.health;
        const timeValue: Array<any> = this.chartOriginalData.time;


        for (let i = 0; i < healthValue.length; i++) {
            const tempObj = {
                time: undefined,
                health: undefined
            };
            tempObj.time = +timeValue[i];
            tempObj.health = +healthValue[i];
            this.chartData.push(tempObj);
        }
    }

    _makeTrendField(params: Array<any>, original: Array<any>) {
        this.xFields = 'time';
        original.map((data: any, i: number) => {
            if (params.includes(data)) {
                this.yFieldsArray.push(data);
            }
        });

        this.yFields = this.yFieldsArray.join(',');
    }

    _parseTrendData() {
        const valueTemp: Array<any> = [];
        const keyTemp: Array<any> = [];


        this.chartOriginalData.map((data: any) => {
            valueTemp.push(data.values);
            keyTemp.push(data.name);
        });

        for (let i = 0; i< valueTemp[0].length ; i++) {
            const tempObj = {};
            for(let j = 0; j < keyTemp.length ; j++) {
                tempObj[keyTemp[j]] = +valueTemp[j][i];
            }
            this.chartData.push(tempObj);
        }
    }

    _domainChange() {
        const specValue = this.chartModels.alarmSpec;
        this.chartModels.yMin = 90 * this.chartModels.yMin / specValue;
        this.chartModels.yMax = 90 * this.chartModels.yMax / specValue;
    }

    _setAxisConfig() {
        const axisTempConfigs: Array<any> = this.preConfig.axis;
        const axisConfigs: Array<any> = [];
        axisTempConfigs.map((d: any) => {
            if (d.type === 'y') {
                d.field = this.yFields;
                d.domain = [this.chartModels.yMin, this.chartModels.yMax];
            } else {
                d.field = this.xFields;
                d.domain = [this.chartModels.xMin, this.chartModels.xMax];
            }
            axisConfigs.push(d);
        });
        this.preConfig.axis = axisConfigs;
    }

    _setSeriesConfig(type: string) {
        this.yFieldsArray.map((d: any) => {
            const seriesTempConfig: any = {
                seriesClass: 'ImageSeries',
                xField: this.xFields,
                yField: d,
                visible: true,
                displayName: d,
                imgData: this.chartModels.chartImage
            };
            const seriesInfoObj: any = this.chartModels.series.find((s) => s.name === d);
            if (seriesInfoObj) {
                seriesTempConfig.color = seriesInfoObj.color;
            }
            this.preConfig.series.push(seriesTempConfig);
        });
    }

    _parseVariableImportanceData() {
        let result = [];
        const keys = Object.keys(this.chartModels);
        for(let i=0;i<keys.length;i++){
            result.push(
                { parameter: keys[i], values: this.chartModels[keys[i]] }
            );
        }
        this.preConfig.chart.data = result;
    }

    _setSpecLinePlugin() {
        const alarm_spec = {
            pluginClass: 'SpecLinePlugin',
            value: this.chartModels.model_alarm_spec,
            color: 'red',
            orient: 'left',
            direction: 'horizontal',
            axisKinds: 'numeric',
            displayName: 'alarm'
        };

        const warning_spec = {
            pluginClass: 'SpecLinePlugin',
            value: this.chartModels.model_warning_spec,
            color: 'yellow',
            orient: 'left',
            direction: 'horizontal',
            axisKinds: 'numeric',
            displayName: 'warning'
        };

        const min_date_spec = {
            pluginClass: 'SpecLinePlugin',
            value: this.chartModels.model_fromDate,
            color: 'gray',
            orient: 'bottom',
            direction: 'vertical',
            axisKinds: 'datetime',
            displayName: 'min'
        };

        const max_date_spec = {
            pluginClass: 'SpecLinePlugin',
            value: this.chartModels.model_toDate,
            color: 'gray',
            orient: 'bottom',
            direction: 'vertical',
            axisKinds: 'datetime',
            displayName: 'max'
        };

        this.preConfig.plugin.push(alarm_spec);
        this.preConfig.plugin.push(warning_spec);
        this.preConfig.plugin.push(min_date_spec);
        this.preConfig.plugin.push(max_date_spec);
    }

    deleteOutlier(data: Array<any>) {
        let outlierConfig: ChartConfiguration;
        outlierConfig = $.extend(true, {}, this.preConfig);
        data.map((selected: any) => {
            const keyNames = Object.keys(selected)[0];
            const values: Array<any> = selected[keyNames];
            let i = 0;
            const removedIndex: Array<number> = [];
            this.chartData.map((d: any, index: number) => {
                if (i === values.length) {
                    return;
                }
                if (d.time === values[i].time) {
                    removedIndex.push(index);
                    i++;
                }
            });
            removedIndex.map((ri: number) => {
                this.chartData.splice(ri, 1);
                this.chartModels.splice(ri, 1);
            });
        });
        outlierConfig.chart.data = this.chartData;
        outlierConfig = this.setOutlierPluginDefault(outlierConfig);
        this.chartConfig = outlierConfig;
    }

    copyPreviousOutlier(data: Array<any>) {
        let outlierConfig: ChartConfiguration;
        outlierConfig = $.extend(true, {}, this.preConfig);
        data.map((selected: any) => {
            const keyNames = Object.keys(selected)[0];
            const values: Array<any> = selected[keyNames];
            let i = 0;
            let prevData: any;
            this.chartData.map((d: any) => {
                if (i === values.length) {
                    return;
                }
                if (d.time === values[i].time) {
                    d[keyNames] = prevData[keyNames];
                    i++;
                } else {
                    prevData = d;
                }
            });
            i = 0;
            prevData = undefined;
            this.chartModels.map((d: any) => {
                if (i === values.length) {
                    return;
                }
                if (d.time === values[i].time) {
                    d[keyNames] = prevData[keyNames];
                    i++;
                } else {
                    prevData = d;
                }
            });
        });
        outlierConfig.chart.data = this.chartData;
        outlierConfig = this.setOutlierPluginDefault(outlierConfig);
        this.chartConfig = outlierConfig;
    }

    setOutlierPluginDefault(config: ChartConfiguration) {
        config.plugin.map((plugin: any) => {
            if (plugin.pluginClass === 'MultiBrushPlugin') {
                plugin.disable = true;
            } else if (plugin.pluginClass === 'DragBase') {
                plugin.disable = false;
            }
        });
        return config;
    }

    clearChart() {
        if (this.miChart.chart.baseChart) {
            this.miChart.chart.baseChart.clear();
        }

        if (this.miChart.legend.legend) {
            this.miChart.legend.legend.clear();
        }
    }
}
