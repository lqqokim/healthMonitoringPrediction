import { ContextMenuDataType } from './../pdm-modeler.interface';
import { WidgetConfigApi } from '../../../../common';
import { ContextMenuTemplateInfo } from '../../../../common/popup/context-menu/context-menu-templates';

export class PdmModelerChartConfig extends WidgetConfigApi {
    lineHealthChart: any;
    lineTrendChart: any;
    barChart: any;

    getChartConfig(type: string, info: any) {
        if (type === 'trend') {
            this.lineTrendChart = info;
            return this.getTrendChartConfig();
        } else if (type === 'analysis') {
            this.barChart = info;
            return this.getAnalysisChartConfig();
        } else if (type === 'health'){
            this.lineHealthChart = info;
            return this.getHealthChartConfig();

        } else {
            return undefined;
        }
    }

    setBuildHealthDate(data: ContextMenuDataType) {
        const pdmComp: any = this;
        pdmComp.setDate(data);
    }

    deleteAll(data: any) {
        const pdmComp: any = this;
        pdmComp.deleteOutlier(data);
    }

    copyPrevious(data: any) {
        const pdmComp: any = this;
        pdmComp.copyPreviousOutlier(data);
    }

    setA(data: ContextMenuDataType) {
        const pdmComp: any = this;
        pdmComp.setClassA(data);
    }

    setB(data: ContextMenuDataType) {
        const pdmComp: any = this;
        pdmComp.setClassB(data);
    }

    zoom(data: ContextMenuDataType) {
        const pdmComp: any = this;
        pdmComp.zoom(data);
    }

    // setParamInVariableImportance(params) {
    //     console.log(this);
    //     const pdmComp: any = this;
    //     pdmComp.setParamVariableImportance(params);
    // }

    private getTrendChartConfig() {
        return {
            chart: {
                selector: '',
                uid: '',
                size: {
                    width: 0,
                    height: 0
                },
                margin: {
                    left: 50,
                    right: 50,
                    top: 10,
                    bottom: 100
                },
                data: undefined,
            },
            axis: [
                {
                    axisClass: 'NumericAxis',
                    type: 'y',
                    field: undefined,
                    format: null,
                    orient: 'left',
                    visible: true,
                    gridline: true,
                    title: undefined,
                    tickInfo: { }
                },

                {
                    axisClass: 'DateTimeAxis',
                    type: 'x',
                    field: undefined,
                    format: null,
                    orient: 'bottom',
                    visible: true,
                    gridline: false,
                    title: undefined,
                    tickInfo: {
                        rotate: 65,
                        format: '%Y-%m-%d'
                    }
                }
            ],
            series: [],
            plugin: [
                {
                    pluginClass: 'MultiBrushPlugin',
                    direction: 'x',
                    orient: 'bottom',
                    callback: selectionEnd.bind(this),
                    disable: false,
                    count: 1,
                    outerClickCallback: outerClick.bind(this)
                },
                {
                    pluginClass: 'DragBase',
                    direction: 'both',
                    disable: true,
                    callback: dragEnd.bind(this)
                }
            ],
            legend: {
                selector: '#div_02',
                orient: 'right',
                series: undefined
            }
        };
    }
    private getHealthChartConfig() {
        return {
            chart: {
                selector: '',
                uid: '',
                size: {
                    width: 0,
                    height: 0
                },
                margin: {
                    left: 50,
                    right: 50,
                    top: 10,
                    bottom: 100
                },
                data: undefined,
            },
            axis: [
                {
                    axisClass: 'NumericAxis',
                    type: 'y',
                    field: undefined,
                    format: null,
                    orient: 'left',
                    visible: true,
                    gridline: true,
                    title: undefined,
                    tickInfo: { }
                },

                {
                    axisClass: 'DateTimeAxis',
                    type: 'x',
                    field: undefined,
                    format: null,
                    orient: 'bottom',
                    visible: true,
                    gridline: false,
                    title: undefined,
                    tickInfo: {
                        rotate: 65,
                        format: '%Y-%m-%d'
                    }
                }
            ],
            series: [],
            plugin: [
                {
                    pluginClass: 'MultiBrushPlugin',
                    direction: 'x',
                    orient: 'bottom',
                    callback: selectionEndMulti.bind(this),
                    outerClickCallback: buildHealthOuterClick.bind(this)
                }
            ]
        };
    }

    private getAnalysisChartConfig() {
        return {
            chart: {
                selector: '',
                uid: '',
                size: {
                    width: 0,
                    height: 0
                },
                margin: {
                    left: 200,
                    right: 10,
                    top: 10,
                    bottom: 100
                },
                data: undefined,
            },
            axis: [
                {
                    axisClass: 'CategoryAxis',
                    type: 'y',
                    field: 'parameter',
                    format: null,
                    orient: 'left',
                    visible: true,
                    gridline: true,
                    title: 'parameter'
                },
                {
                    axisClass: 'NumericAxis',
                    type: 'x',
                    field: 'values',
                    format: null,
                    orient: 'bottom',
                    visible: true,
                    gridline: false,
                    title: 'values'
                }
            ],
            series: [
                {
                    seriesClass: 'BarSeries',
                    xField: 'values',
                    yField: 'parameter',
                    visible: true,
                    displayName: 'parameter',
                    textLabel: {
                       show: false
                   }
                }
            ],
            plugin: [
                {
                    pluginClass: 'SplitLinePlugin',
                    xField: {
                        type: 'x',
                        field: 'values',
                        orient: 'bottom',
                        direction: 'vertical',
                        axisKinds: 'numeric'
                    },
                    yField: {
                        type: 'y',
                        field: 'parameter',
                        orient: 'left',
                        direction: 'horizontal',
                        axisKinds: 'category'
                    },
                    baseField: 'x',
                    displayName: 'parameter',
                    color: 'red',
                    callback: splitLineEnd.bind(this)
                }
            ],
            legend: {
                selector: '#div_02',
                orient: 'right',
                series: undefined
            }
        };
    }

}

function selectionEnd(date: Array<any>, event: any, uid: number) {
    this._widgetApi.setDate({uid: uid, date: date});

    const context = {
        tooltip: {
            event: event
        },
        template: {
            type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
            data: undefined,
            action: [
                {
                    buttonStyle: 'ai-detail-view',
                    labelI18n: 'Zoom',
                    data: {
                        uid: uid,
                        date: date,
                        type: 'trend',

                    },
                    callback: this.zoom
                }
            ]
        }
    };

    this.getWidgetApi().showContextMenu(context);
}

function outerClick() {
    this._widgetApi._cancelBuildHealthParam();
}

function buildHealthOuterClick() {
    console.log('outer buildHealth');
    /// TODO 모두 제거 그러나 removeuid 없는 것 만.
    this._widgetApi.removeAllInBrush();
}

function dragEnd(data: any, event: any) {
    const context = {
        tooltip: {
            event: event
        },
        template: {
            type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
            data: undefined,
            action: []
        }
    };

    context.template.action = [
        {
            buttonStyle: 'ai-detail-view',
            labelI18n: 'Delete',
            data: {
                data: data
            },
            callback: this.deleteAll
        },
        {
            buttonStyle: 'ai-detail-view',
            labelI18n: 'Copy Previous data',
            data: {
                data: data
            },
            callback: this.copyPrevious
        }
    ];

    this.getWidgetApi().showContextMenu(context);
}

function selectionEndMulti(date: Array<any>, event: any, uid: number , removeUid: number) {
    const context = {
        tooltip: {
            event: event
        },
        template: {
            type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
            data: undefined,
            action: []
        }
    };

    if (!this._widgetApi.isSettingClassSetA && !this._widgetApi.isSettingClassSetB) {
        context.template.action =
            [
                {
                    buttonStyle: 'ai-detail-view',
                    labelI18n: 'Set Class A',
                    data: {
                        uid: uid,
                        date: date,
                        ruid: removeUid
                    },
                    callback: this.setA
                },
                {
                    buttonStyle: 'ai-detail-view',
                    labelI18n: 'Set Class B',
                    data: {
                        uid: uid,
                        date: date,
                        ruid: removeUid
                    },
                    callback: this.setB
                },
                {
                    buttonStyle: 'ai-detail-view',
                    labelI18n: 'Zoom',
                    data: {
                        uid: uid,
                        date: date,
                        type: 'health'
                    },
                    callback: this.zoom
                }
            ];
    } else if (this._widgetApi.isSettingClassSetA && !this._widgetApi.isSettingClassSetB) {
        context.template.action = [
            {
                buttonStyle: 'ai-detail-view',
                labelI18n: 'Set Class B',
                data: {
                    uid: uid,
                    date: date,
                    ruid: removeUid
                },
                callback: this.setB
            },
            {
                buttonStyle: 'ai-detail-view',
                labelI18n: 'Zoom',
                data: {
                    uid: uid,
                    date: date,
                    type: 'health'
                },
                callback: this.zoom
            }
        ];
    } else if (!this._widgetApi.isSettingClassSetA && this._widgetApi.isSettingClassSetB) {
        context.template.action = [
            {
                buttonStyle: 'ai-detail-view',
                labelI18n: 'Set Class A',
                data: {
                    uid: uid,
                    date: date,
                    ruid: removeUid
                },
                callback: this.setA
            },
            {
                buttonStyle: 'ai-detail-view',
                labelI18n: 'Zoom',
                data: {
                    uid: uid,
                    date: date,
                    type: 'health'
                },
                callback: this.zoom
            }
        ];
    } else {
        context.template.action = [
            {
                buttonStyle: 'ai-detail-view',
                labelI18n: 'Zoom',
                data: {
                    uid: uid,
                    date: date,
                    type: 'health'
                },
                callback: this.zoom
            }
        ];
    }
    this.getWidgetApi().showContextMenu(context);
}

function splitLineEnd(params) {
    this._widgetApi.setParamVariableImportance(params);
}
