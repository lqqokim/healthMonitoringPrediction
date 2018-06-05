// tslint:disable-next-line:max-line-length
import { Component, Input, Output, ViewEncapsulation, ViewChild, OnDestroy, OnInit, OnChanges, SimpleChanges, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { Translater, NotifyService, SpinnerComponent } from '../../../../sdk';
import { PdmReportService, REPORT_STATUS } from '../pdm-report.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as math from 'mathjs';
import * as html2canvas from 'html2canvas';

import { PdmCommonService } from '../../../../common/service/pdm-common.service';

@Component({
    moduleId: module.id,
    selector: 'pdm-report-content',
    templateUrl: 'pdm-report-content.html',
    styleUrls: ['pdm-report-content.css'],
    providers: [PdmReportService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmReportContentComponent implements OnInit, OnChanges, OnDestroy {

    @Input() report: any;
    @Input() plantId: string;
    @Output() complete: EventEmitter<any> = new EventEmitter();
    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() update: EventEmitter<any> = new EventEmitter();

    @ViewChild('reportContent') reportContent: ElementRef;
    @ViewChild('trendChart') trendChart: any;
    @ViewChild('spinner') spinner: SpinnerComponent;

    eqpInfo: any = {};
    comment: string;
    writeDtts: number;
    completeUserId: string = null;

    plantName: string = '';
    shopName: string = '';

    trendMultiple: any;
    trendMultipleConfig: any;
    trendMultipleData: any;
    trendMultipleSpecLines: any;
    spectrumOld: any;
    spectrumRecent: any;

    printImage: any = '';

    modelDtts: any = '';

    trendRecentDay: number = 30;

    imageData: any;

    constructor(public domSanitizer: DomSanitizer,
                private dataSvc: PdmReportService,
                private translater: Translater,
                private elementref: ElementRef,
                private _pdmSvc: PdmCommonService,
                private _chRef: ChangeDetectorRef,
                private _notify: NotifyService) {
        this.dataSvc = dataSvc;

        // this.trendMultiple = {
        //     data: [],
        //     config: this._getTrendMultipleConfig(),
        //     specLines: []
        // };

        this.trendMultipleConfig = this._getTrendMultipleConfig();
        this.trendMultipleData = [[]];
        this.trendMultipleSpecLines = [];

        this.spectrumOld = {
            data: [],
            config: this._getSpectrumOldConfig(),
            x1Lines: []
        };

        this.spectrumRecent = {
            data: [],
            config: this._getSpectrumRecentConfig(),
            x1Lines: []
        };
    }

    ngOnInit() {
        this._init();
    }

    // tslint:disable-next-line:no-empty
    ngOnDestroy() {}

    ngOnChanges(changes: SimpleChanges) {
        console.log('ngOnChanges : ', changes['report']);
        if (!changes['report']['currentValue']) {
            return;
        }
        if (this.report.writeDtts === null) {
            this.writeDtts = Date.now();
        } else {
            this.writeDtts = this.report.writeDtts;
        }
        setTimeout(() => {
            this.spinner.showSpinner();
        }, 300);
        this.dataSvc.getEqpInfo(this.plantId, this.report.eqpId).then(eqpInfo => {
            // const mime = eqpInfo.eqpImage.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
            // console.log('getEqpInfo : ', mime);
            // test
            // tslint:disable-next-line:max-line-length
            // eqpInfo.eqpImage = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyNTAgMjUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNTAgMjUwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojREQwMDMxO30NCgkuc3Qxe2ZpbGw6I0MzMDAyRjt9DQoJLnN0MntmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxnPg0KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMTI1LDMwIDEyNSwzMCAxMjUsMzAgMzEuOSw2My4yIDQ2LjEsMTg2LjMgMTI1LDIzMCAxMjUsMjMwIDEyNSwyMzAgMjAzLjksMTg2LjMgMjE4LjEsNjMuMiAJIi8+DQoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMjUsMzAgMTI1LDUyLjIgMTI1LDUyLjEgMTI1LDE1My40IDEyNSwxNTMuNCAxMjUsMjMwIDEyNSwyMzAgMjAzLjksMTg2LjMgMjE4LjEsNjMuMiAxMjUsMzAgCSIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMjUsNTIuMUw2Ni44LDE4Mi42aDBoMjEuN2gwbDExLjctMjkuMmg0OS40bDExLjcsMjkuMmgwaDIxLjdoMEwxMjUsNTIuMUwxMjUsNTIuMUwxMjUsNTIuMUwxMjUsNTIuMQ0KCQlMMTI1LDUyLjF6IE0xNDIsMTM1LjRIMTA4bDE3LTQwLjlMMTQyLDEzNS40eiIvPg0KPC9nPg0KPC9zdmc+DQo=';
            let mime = 'image/jpeg';
            if (eqpInfo.eqpImage.charAt(0) === '/') {
                mime =  'image/jpeg';
            } else if(eqpInfo.eqpImage.charAt(0) === 'R') {
                mime =  'image/gif';
            } else if(eqpInfo.eqpImage.charAt(0) === 'P') {
                mime =  'image/svg+xml';
            } else if(eqpInfo.eqpImage.charAt(0) === 'i') {
                mime =  'image/png';
            } else if(eqpInfo.eqpImage.charAt(0) === 'A') {
                mime =  'image/x-wmf';
            } else {
                mime =  'image/bmp';
            }
            eqpInfo.eqpImage = `data:${mime};base64,` + eqpInfo.eqpImage;
            this.eqpInfo = eqpInfo;
            let shopFullNameArr = eqpInfo.shopFullName.split('>');
            this.plantName = shopFullNameArr.shift();
            this.shopName = shopFullNameArr.join(' ');
            this.completeUserId = this.report.completeUserId;
        });

        this.setTrendMultiple(this.trendRecentDay).then(() => {
            this.dataSvc.getModelMeasurement(this.plantId, this.report.eqpId, this.report.measureTrxId).then(modelMeasurement => {
                this.modelDtts = modelMeasurement.measureDtts;
                console.log('getModelMeasurement : ', modelMeasurement);
                if( modelMeasurement.measurementId ) {
                    this.dataSvc.getSpectra(this.plantId, this.report.eqpId, modelMeasurement.measurementId).then(spectrumOldData => {
                        console.log('getSpectra : ', spectrumOldData);
                        this.spectrumOld.data = [spectrumOldData];
                    });
                }
            });
            this.dataSvc.getAnalysis(this.plantId, this.report.eqpId, this.report.measureTrxId).then(analysisData => {
                let calls = [
                    this.dataSvc.getMeasureRPM(this.plantId, this.report.eqpId, this.report.measureTrxId),
                    this.dataSvc.getSpectra(this.plantId, this.report.eqpId, this.report.measureTrxId)
                ];
                Promise.all(calls).then(([rpmData, spectrumRecentData]) => {
                    this._setX1Lines(analysisData.causes, rpmData);
                    this.spectrumRecent.data = [spectrumRecentData];
                    setTimeout(() => {
                        this.spinner.hideSpinner();
                    }, 500);
                });
            });
            this.comment = this.report.causeUpdate;
        });
    }

    clickOk() {
        let updated = {
            stateCd: this.report.stateCd,
            causeUpdate: this.comment,
            writeDtts: this.report.writeDtts,
            completeUserId: null,
            completeDtts: null,
            content: null,
            occurDtts: this.report.occurDtts
        };

        if (this.report.stateCd === REPORT_STATUS.CREATED) {
            updated = Object.assign(updated, {
                stateCd: REPORT_STATUS.CONFIRMED,
                writeDtts: Date.now()
            });
        }

        if (this.report.stateCd === REPORT_STATUS.REQUESTED && this.completeUserId) {
            updated = Object.assign(updated, {
                stateCd: REPORT_STATUS.COMPLETE,
                completeUserId: this.completeUserId,
                completeDtts: Date.now()
            });
        }

        this._getImage().then(img => {
            updated.content = img.toString().substring(22);
            this.report.content = updated.content;
            this._updateStatus(updated).then(() => {
                this._notify.success('MESSAGE.GENERAL.SAVE_SUCCESS');
                this.report.stateCd = updated.stateCd;
                this.report.causeUpdate = updated.causeUpdate;
                this.report.writeDtts = updated.writeDtts;
                this.report.completeUserId = updated.completeUserId;
                this.report.completeDtts = updated.completeDtts;
                this._emitComplete();
                this._clear();
            }).catch(() => {
                this._notify.error('MESSAGE.GENERAL.SAVE_ERROR');
            });
        });
    }

    clickCancel() {
        this._emitCancel();
        this._clear();
    }

    convertDate(time) {
        if (time) {
            return moment(time).format('YYYY/MM/DD');
        }
        return '';
    }

    print(ev) {
        this._getImage().then(img => {
            this.printImage = img;
            setTimeout(() => {
                window.print();
            });
        });
    }

    private _setX1Lines(causes, rpmData) {
        if (!Array.isArray(causes)) {
            return;
        }
        this.spectrumRecent.x1Lines = [];
        let rpmscombo: Array<any> = [];
        if (rpmData.part1x !== null) {
            let keys = Object.keys(rpmData.part1x);
            for (let i = 0; i < keys.length; i++) {
                let keyData = rpmData.part1x[keys[i]];
                rpmscombo.push({ key: rpmData.partName[keys[i]], value: keyData});
            }
        }
        causes.forEach(cause => {
            let firstX =cause.split(/'/)[2].split(':')[0].trim();

            rpmscombo.forEach((data) => {
                if(data.key === firstX || (data.value !== null  && Object.keys(data.value).indexOf(firstX)>=0) ) {
                    let pmId = data.key;
                    let subData = data.value;
                    let subKeys = Object.keys(subData);
                    for (let iSub = 0; iSub < subKeys.length; iSub++) {
                        let key = subKeys[iSub];
                        let value = subData[key];

                        this.spectrumRecent.x1Lines.push({
                            show: true,
                            name: pmId,
                            type: 'line',
                            axis: 'xaxis',
                            //background: true,
                            fill: true,
                            fillStyle: 'rgba(0, 0, 255, .5)',
                            line: {
                                name: `${key} - 1x (${value.toFixed(2)})`,
                                show: true, // default : false
                                value: value,
                                color: '#ff0000',
                                width: 1,       // default : 1
                                adjust: 0,      // default : 0
                                pattern: null,  // default : null
                                shadow: false,  // default : false
                                eventDistance: 3,   // default : 3
                                offset: {       // default : 0, 0
                                    top: 0,
                                    left: 0,
                                },
                                tooltip: {
                                    show: true,
                                    formatter: () => {
                                        return `${key} - 1x (${value.toFixed(2)})`;
                                    }
                                },
                                draggable: {
                                    show: false
                                },
                                label: {
                                    show: false,         // default : false
                                    formatter: null,    // default : null (callback function)
                                    classes: '',        // default : empty string (css class)
                                    style: '',          // default : empty string (be able object or string)
                                    position: 'n',      // default : n
                                    offset: {           // default : 0, 0
                                        top: 0,
                                        left: 0
                                    }
                                }
                            }
                        });
                    }
                }
            });
        });
    }

    // tslint:disable-next-line:no-empty
    private _init() {}

    private setTrendMultiple(recentDay) {
        let calls = [
            // tslint:disable-next-line:max-line-length
            this.dataSvc.getTrendMultiple(this.plantId, 0, this.report.eqpId, this.report.paramId, this.report.occurDtts - 86400000*recentDay, this.report.occurDtts),
            this._pdmSvc.getParamDetail(this.plantId, this.report.paramId)
        ];

        return Promise.all(calls).then(([trendMultipleData, paramDetail]) => {
            let dataMax = Math.max.apply(null, trendMultipleData.map(item => {
                return item[1];
            }));

            let to = moment(moment().format('YYYY-MM-DD')).format('x') * 1 - 1;
            let from = to - 86400000 * 90 + 1;
            this.dataSvc.getTrendMultipleSpec(this.plantId, 0, this.report.eqpId, this.report.paramId, from, to).then(spec => {
                // this.trendMultiple.config = this._getTrendMultipleConfig();
                this.trendMultipleConfig = this._getTrendMultipleConfig();
                this.spectrumOld.config = this._getSpectrumOldConfig();
                this.spectrumRecent.config = this._getSpectrumRecentConfig();

                // this.trendMultiple.config.axes.yaxis.label = paramDetail.eu;
                this.trendMultipleConfig.axes.yaxis.label = paramDetail.eu;

                this.spectrumOld.config.axes.yaxis.label = paramDetail.eu;
                this.spectrumRecent.config.axes.yaxis.label = paramDetail.eu;

                // TODO: remove temp spec
                let values = trendMultipleData.map(item => item[1]);
                let target = math.mean(values);
                let std = math.std(values);
                let warning = target + 2 * std;
                let alarm = target + 3 * std;

                spec = {
                    target: target,
                    warning: warning,
                    alarm: alarm
                };

                let yMax = Math.max(dataMax, spec.target, spec.warning, spec.alarm);
                // this.trendMultiple.config.axes.yaxis.max = yMax * 1.02;
                this.trendMultipleConfig.axes.yaxis.max = yMax * 1.02;
                // this.trendMultiple.data = trendMultipleData.length ? [trendMultipleData] : [];
                this.trendMultipleData = trendMultipleData.length ? [trendMultipleData] : [];
                this.trendMultipleConfig['series'] = [];

                if (trendMultipleData.length > 0) {
                    this.trendMultipleConfig['series'].push({
                        showLine: true,
                        showMarker: false,
                        renderer: $.jqplot.LineRenderer,
                        rendererOptions: {
                            pointLabels: {
                                show: true
                            }
                        }
                    });
                }
                this.trendMultipleData = this.trendMultipleData.concat([]);
                // this.trendMultiple.config.eventLine.events = [
                this.trendMultipleSpecLines = [];
                this.trendMultipleSpecLines.push({
                    name: `목표 (${spec.target.toFixed(2)})`,
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    label: {
                        show: true
                    },
                    tooltip: {
                        show: true
                    },
                    line: {
                        width: 1,
                        color: '#000',
                        show: true,
                        tooltip: {
                            show: true,
                            formatter: () => {
                                return `목표 (${spec.target.toFixed(2)})`;
                            }
                        },
                        label: {
                            show: true
                        },
                        value: spec.target,
                    }
                });
                this.trendMultipleSpecLines.push({
                    name: `주의 (${spec.warning.toFixed(2)})`,
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    label: {
                        show: true
                    },
                    tooltip: {
                        show: true
                    },
                    line: {
                        width: 1,
                        color: '#ffa500',
                        show: true,
                        tooltip: {
                            show: true,
                            formatter: () => {
                                return `주의 (${spec.warning.toFixed(2)})`;
                            }
                        },
                        label: {
                            show: true
                        },
                        value: spec.warning,
                    }
                });
                this.trendMultipleSpecLines.push({
                    name: `경고 (${spec.alarm.toFixed(2)})`,
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    label: {
                        show: true
                    },
                    tooltip: {
                        show: true
                    },
                    line: {
                        width: 1,
                        color: '#ff0000',
                        show: true,
                        tooltip: {
                            show: true,
                            formatter: () => {
                                return `경고 (${spec.alarm.toFixed(2)})`;
                            }
                        },
                        label: {
                            show: true
                        },
                        value: spec.alarm,
                    }
                });
                // bistel chart bug : event line canvas가 series canvas 보다 뒤에 있음.
                setTimeout(() => {
                    let tempEl = null;
                    const childNodes = this.trendChart.chartEl.childNodes;
                    for ( let i: number = 0; i < childNodes.length; i++ ) {
                        if (childNodes[i].className === 'jqplot-eventline-canvas') {
                            tempEl = childNodes[i];
                            break;
                        }
                    }
                    if (tempEl) {
                        // this.trendChart.chartEl.appendChild(tempEl);
                        const childIndex = this.trendChart.chartEl.childNodes.length;
                        this.trendChart.chartEl.insertBefore(tempEl, this.trendChart.chartEl.childNodes[childIndex - 4]);
                    }
                    // $('.jqplot-eventline-canvas')
                }, 300);
            });
        });
    }

    private _emitComplete() {
        this.complete.emit(this.report);
    }

    private _emitCancel() {
        this.cancel.emit();
    }

    // tslint:disable-next-line:no-unused-variable
    private _emitUpdate() {
        this.update.emit();
    }

    private _updateStatus(updated) {
        return this.dataSvc.updateReport(this.plantId, this._getUpdateReport(updated));
    }

    private _getUpdateReport(updated) {
        return Object.assign({
            eqpId: this.report.eqpId,
            occurDtts: this.report.occurDtts
        }, updated);
    }

    private _getTrendMultipleConfig() {
        return {
            legend: {
                show: false
            },
            eventLine: {
                show: true,
                tooltip: {  // default line tooltip options
                    show: false,         // default : true
                    adjust: 5,          // right, top move - default : 5
                    formatter: null,    // content formatting callback (must return content) - default : true
                    style: '',          // tooltip container style (string or object) - default : empty string
                    classes: ''         // tooltip container classes - default : empty string
                },
                events: []
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    showGridline: false,
                    rendererOptions: {
                        dataType: 'date'
                    },
                    autoscale: true
                },
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    showGridline: false,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            },
            series: [
                // {
                //     showLine: true,
                //     showMarker: false,
                //     renderer: $.jqplot.LineRenderer,
                //     rendererOptions: {
                //         pointLabels: {
                //             show: true
                //         }
                //     }
                // }
            ]
        };
    }

    private _getSpectrumOldConfig() {
        return {
            legend: {
                show: false
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    autoscale: true,
                    label: 'Hz'
                },
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            }
        };
    }

    private _getSpectrumRecentConfig() {
        return {
            legend: {
                show: false
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    autoscale: true,
                    label: 'Hz'
                },
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            },
            eventLine: {
                show: true,
                events: []
            }
        };
    }

    private _getImage() {
        return new Promise<any[]>((resolve, reject) => {
            let elem = this.reportContent.nativeElement;
            html2canvas(elem, {
                onrendered: function(canvas) {
                    let img = canvas.toDataURL();
                    resolve(img);
                }
            });
        });
    }

    private _clear() {
        // this.trendMultiple.data = [];
        this.trendMultipleData = [];
        this.spectrumOld.data = [];
        this.spectrumOld.x1Lines = [];
        this.spectrumRecent.data = [];
        this.spectrumRecent.x1Lines = [];
    }
}
