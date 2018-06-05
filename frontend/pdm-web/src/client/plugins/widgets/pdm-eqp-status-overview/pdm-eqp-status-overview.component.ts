import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, ChangeDetectorRef} from '@angular/core';

import { WidgetRefreshType, WidgetApi, ContextMenuTemplateInfo, OnSetup } from '../../../common';
import { ContextMenuType, Translater } from '../../../sdk';
import { PdmEqpStatusOverviewService } from './pdm-eqp-status-overview.service';
import { PdmEqpStatusOverviewChartConfig } from './config/chart.config';

import * as wjcCore from 'wijmo/wijmo';
import * as wjGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.input';

import { PdmCommonService } from '../../../common/service/pdm-common.service';

@Component({
    moduleId: module.id,
    selector: 'pdm-eqp-status-overview',
    templateUrl: 'pdm-eqp-status-overview.html',
    styleUrls: ['pdm-eqp-status-overview.css'],
    providers: [PdmEqpStatusOverviewService, PdmEqpStatusOverviewChartConfig, PdmCommonService],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'height-ful'
    }
})
export class PdmEqpStatusOverviewComponent extends WidgetApi implements OnSetup, OnDestroy {

    areaColumn: string;
    data: any[];
    gridData: wjcCore.CollectionView;

    paramChartEqpId: number;

    paramChartData: any[];
    paramChartConfig: any;
    paramChartSpecLines: any[] = [];

    contourChartImage: string;
    showAnalysisColumns: boolean = false;

    // 단변량 (변화량) 관련 properties
    currentRow: any;
    lastedDtts: number;
    refreshTime = 60 * 60 * 1000;
    refreshTimer: any;
    parameterVariationPromise = [];
    parameterVariationDatas = [];
    isRefresh = false;

    @ViewChild('eqpGrid') eqpGrid: wjGrid.FlexGrid;
    @ViewChild('contourChartPopup') contourChartPopup: wjcInput.Popup;
    @ViewChild('paramChartPopup') paramChartPopup: wjcInput.Popup;
    @ViewChild('effectChartPopup') effectChartPopup: wjcInput.Popup;
    @ViewChild('errorChartPopup') errorChartPopup: wjcInput.Popup;
    @ViewChild('paramChart') chartEl: ElementRef;

    private _props: any;
    private _plant: any;
    private _plantId: string;
    private _areaId: number;
    private _timePeriod: any;
    private _healthIndexPeriod: number = 90;    // day

    constructor(private dataSvc: PdmEqpStatusOverviewService,
        private _pdmSvc: PdmCommonService,
        private translater: Translater,
        private elementref: ElementRef,
        private _chRef: ChangeDetectorRef,
        private _chartConfig: PdmEqpStatusOverviewChartConfig) {
        super();
        this.parameterVariationPromise = [];
        this.parameterVariationDatas = [];
        this.dataSvc = dataSvc;
        this.areaColumn = this.translater.instant('LABEL.PDM.AREA');
    }

    gridInit(flex: wjGrid.FlexGrid, e: wjcCore.EventArgs) {
        console.log('gridInit');
        // this._pdmSvc.bindColumnGroups(flex, this._columnGroups);
        // return;
        // merge headers
        let colHdrs = flex.columnHeaders;
        flex.allowMerging = wjGrid.AllowMerging.ColumnHeaders;

        let groupRow = new wjGrid.Row();
        colHdrs.rows.push(groupRow);

        // merge horizontally
        for (var r = 0; r < colHdrs.rows.length; r++) {
            colHdrs.rows[r].allowMerging = true;
        }

        // merge vertically
        for (var c = 0; c < colHdrs.columns.length; c++) {
            colHdrs.columns[c].allowMerging = true;
        }

        // for (var c = 0; c < this._columnGroupHeaders.length; c++) {
        //     let hdr = this._columnGroupHeaders[c];
        //     if (!hdr) {
        //         hdr = colHdrs.getCellData(1, c);
        //     }
        //     colHdrs.setCellData(0, c, hdr);
        // }

        // fill empty cells with content from cell above
        for (let c = 0; c < colHdrs.columns.length; c++) {
            for (let r = 1; r < colHdrs.rows.length; r++) {
                let hdr = colHdrs.getCellData(r, c, true);
                if (colHdrs.columns[c].name) {
                    hdr = colHdrs.columns[c].name;
                }
                colHdrs.setCellData(r - 1, c, hdr);
            }
        }

        // handle top-left panel
        for (let c = 0; c < flex.topLeftCells.columns.length; c++) {
            flex.topLeftCells.columns[c].allowMerging = true;
        }

        flex.formatItem.addHandler((s, e: any) => {
            if (e.panel === flex.columnHeaders) {
                if (e.row === 1) {
                    if (e.cell.innerText.search('경고') > -1) {
                        $(e.cell).addClass('dangerous');
                    } else if (e.cell.innerText.search('주의') > -1) {
                        $(e.cell).addClass('warning');
                    } else if (e.cell.innerText.search('정상') > -1) {
                        $(e.cell).addClass('safe');
                    } else if (e.cell.innerText.search('변화량') > -1) {
                        // $(e.cell).addClass('safe');
                    } else if (e.cell.innerText.search('비가동') > -1) {
                        $(e.cell).addClass('inactive');
                    }
                }
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
				wjcCore.setCss(e.cell, {
                	display: 'table',
                    tableLayout: 'fixed'
				});
                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                });
            } else if (e.panel.cellType === wjGrid.CellType.Cell && e.col === 2) {
                let row = this.gridData.items[e.row];
                if (row) {
                    if (row.type === 'EQP' && row.score >= .9) {
                        $(e.cell).addClass('dangerous-font');
                    } else if (row.type === 'EQP' && row.score >= .8) {
                        $(e.cell).addClass('warning-font');
                    }
                }
            }
        });

        // select column groups by clicking the merged headers
        flex.allowDragging = wjGrid.AllowDragging.None;
        flex.addEventListener(flex.hostElement, 'click', function (e) {
            var ht = flex.hitTest(e);
            if (ht.panel === flex.columnHeaders) {
                // var rng = flex.getMergedRange(flex.columnHeaders, ht.row, ht.col, false) || ht.range;
                // flex.select(new wjGrid.CellRange(0, rng.col, flex.rows.length - 1, rng.col2));
                e.preventDefault();
            }
        });
    }

    ngOnSetup() {
        this.showSpinner();
        this._init();
    }

    /**
     * TODO
     * refresh 3가지 타입에 따라서 data를 통해 적용한다.
     *  justRefresh, applyConfig, syncInCondition
     */
    refresh({ type, data }: WidgetRefreshType) {
        if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            this._timePeriod = data[CD.TIME_PERIOD];
            this._plant = data[CD.PLANT];
            this._plantId = data[CD.PLANT][CD.PLANT_ID];
            this._areaId = data[CD.AREA_ID];
            // this.gridData = [];
            this.gridData = new wjcCore.CollectionView();
        } else {
            this.hideSpinner();
        }

        if (this._plantId !== null && this._areaId !== null) {
            this._getData(this._plantId, this._areaId);
        }
    }

    ngAfterViewInit() {
        console.log('');
        this.hideSpinner();
    }


    ngOnDestroy() {
        console.log('PDM EQP Status Overview Widget ngOnDestroy');
        if (this.refreshTimer) {
            clearInterval( this.refreshTimer );
            this.refreshTimer = null;
        }
        this.destroy();
    }

    toggleParameters(row, $event) {
        if (row.paramVisible) {
            row.paramVisible = false;
            this._hideParameters(row);
        } else {
            row.paramVisible = true;
            this._showParameters(row);
        }
    }

    showContourChart(eqpId, ev) {
        this.paramChartEqpId = eqpId;
        this.contourChartImage = null;
        this.dataSvc.getContourChart(this._plantId, 0, eqpId, this._timePeriod[CD.FROM], this._timePeriod[CD.TO]).then(imgData => {
            if (imgData.data) {
                this.contourChartImage = `data:image/png;base64,${imgData.data}`;
            } else {
                this.contourChartImage = 'none';
            }
        });
        this._showPopup(this.contourChartPopup);
    }

    selectMultiVariant(row, ev) {
        let dsCd: any = this.getViewData('displayContext');
        dsCd[LB.EQP_NAME] = row.eqpName;

        let outCd = this.getOutCondition('config');

        outCd[CD.PLANT] = this._plant;
        outCd[CD.AREA_ID] = this._areaId;
        outCd[CD.EQP_ID] = row.eqpId;
        outCd[CD.EQP_NAME] = row.eqpName;

        let context: ContextMenuType = {
            tooltip: {
                event: ev
            },
            template: {
                title: '다변량분석',
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action: [
                // {
                //     labelI18n: 'Contour 차트',
                //     data: { eqpId: row.eqpId, event: ev },
                //     callback: (data:any) => {
                //         this.showContourChart(data.eqpId, data.event);
                //     }
                // },
                {
                    labelI18n: '분석',
                    data: { eqpId: row.eqpId, event: ev },
                    callback: (data:any) => {
                        this._syncMultiVariant(data.eqpId);
                    }
                }]
            },
            contextMenuAction : {
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };
        // show context menu
        this.showContextMenu(context);
    }

    showParamChart(param, eqpId, paramId, ev) {
        this._showPopup(this.paramChartPopup);
        setTimeout( () => {
            this.paramChartData = [];
            this.paramChartConfig = this._chartConfig.getParamChartConfig();
            this._updateParamChart(param, eqpId, paramId, ev);
        }, 500);
    }

    selectVariant(row, ev) {
        let dsCd: any = this.getViewData('displayParamContext');
        dsCd[LB.EQP_NAME] = row.eqpName;
        dsCd[LB.PARAM_NAME] = row.paramName;

        let outCd = this.getOutCondition('config');

        outCd[CD.PLANT_ID] = this._plantId;
        outCd[CD.AREA_ID] = this._areaId;
        outCd[CD.EQP_ID] = row.eqpId;
        outCd[CD.EQP_NAME] = row.eqpName;

        let context: ContextMenuType = {
            tooltip: {
                event: ev
            },
            template: {
                title: '단변량분석',
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action: {
                    labelI18n: '경향 차트',
                    data: { eqpId: row.eqpId, paramId: row.paramId, event: ev },
                    callback: (data:any) => {
                        this.showParamChart(row, data.eqpId, data.paramId, data.event);
                    }
                }
            },
            contextMenuAction : {
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };

        // show context menu
        this.showContextMenu(context);
    }

    closeContourChartPopup() {
        this._closePopup(this.contourChartPopup);
    }

    closeParamChartPopup() {
        this._closePopup(this.paramChartPopup);
    }

    closeEffectChartPopup() {
        this._closePopup(this.effectChartPopup);
    }

    closeErrorChartPopup() {
        this._closePopup(this.errorChartPopup);
    }

    onSortingColumn(ev) {
        let params = this.gridData.items.filter(row => {
            row.paramVisible = false;
            return row.type === 'PARAM';
        });
        params.forEach(param => {
            this.gridData.remove(param);
        });
        params = null;
        this.eqpGrid.refresh(true);
    }

    toFixed(num, position=2, exStr='-') {
        return _.isNumber(num) && !isNaN(num) ? num.toFixed(position) * 1 : exStr;
    }

    validImage(imageString) {
        return typeof imageString === 'string' && imageString !== 'none' && imageString.length > 0;
    }

    toggleAnalysisColumns(show) {
        this.showAnalysisColumns = show;
        var columns = this.eqpGrid.columns;
        columns.forEach(column => {
            if(/^(다변량분석|단변량분석|전문업체)$/.test(column.name)) {
                column.visible = this.showAnalysisColumns;
            }
        });

        this.eqpGrid.refresh();
    }

    toOX(val) {
        return val > 0 ? 'O' : '-';
    }

    toFixed100(num, position=2, exStr='-') {
        if (_.isNumber(num) && !isNaN(num)) {
            num = num * 100;
            return num.toFixed(position) * 1;
        } else {
            return exStr;
        }
    }

    convertDate(time) {
        if (time) {
            return moment(time).format('MM/DD HH:mm');
        }
        return '';
    }

    paramChartComplete(event: any) {
        console.log('paramChartComplete : ', event);
    }

    private _init() {
        // [EX]
        //  widget properties는 primitive가 아니라 Object를 사용한다
        this._props = this.getProperties();

        this._plantId = this._props.plantId;
        this._areaId = this._props.areaId;
        this._timePeriod = this.getProp(CD.TIME_PERIOD);

        this.paramChartConfig = this._chartConfig.getParamChartConfig();
        this.paramChartData = [];
        this.paramChartSpecLines = [];
    }

    private _getData(plantId, areaId) {
        this.showSpinner();
        this.dataSvc.getEqpStatus(plantId, areaId, this._timePeriod[CD.FROM], this._timePeriod[CD.TO]).then(data => {
            //let maxScore = Math.max.apply(null,data.map(item=>item.score));
            //let targetScore:number = maxScore + 10 - (maxScore%10)
            this.data = data;
            data.forEach(row => {
                row.type = 'EQP';
                row.chartData = [];
                row.chartConfig = this._chartConfig.getHealthIndexChartConfig();
                row.specLines = this._chartConfig.getHelathIndexSpecLines(row.alarmSpec, row.warningSpec);
                row.chartEvents = {
                    jqplotDataClick: (event, seriesIndex, pointIndex, data) => {
                        this._showHealthTooltip(event, row, data);
                    }
                };
                row.paramVisible = false;
                row.parameters = null;
            });

            // this._getHealthIndexChartData(data.concat([]));
            this.gridData = new wjcCore.CollectionView(data);

            this.hideSpinner();
        }).catch(e => {
            this.hideSpinner();
            this.showError('There is a proplem for getting the data.');
        });
    }

    private _getHealthIndex(eqpId) {
        // tslint:disable-next-line:max-line-length
        return this.dataSvc.getHealthIndex(this._plantId, eqpId, this._timePeriod.to - this._healthIndexPeriod * 86400000, this._timePeriod.to);
    }

    private _getHealthIndexChartData(data: any, index: number = 0) {
        this._getHealthIndex(data[index].eqpId).then(healthIndex => {
            setTimeout(() => {
                if (Array.isArray(healthIndex.data)) {
                    data[index].chartData = [healthIndex.data];
                }

                if (index < data.length - 1) {
                    this._getHealthIndexChartData(data, index + 1);
                } else {
                    this.hideSpinner();
                }
            }, 1000);
        });
    }

    private _getVariations = (currentTime: number) => {
        if (this.parameterVariationPromise.length) {
            this.parameterVariationPromise.forEach((d) => {
                d.currentTime = currentTime;
                this.dataSvc.getParameterVariations(d.fabId, d.areaId, d.eqpId, currentTime).then((variation) => {
                    const dataSize = this.data.length;
                    for ( let i = 0; i < dataSize; i++ ) {
                        if(this.data[i].eqpId === d.eqpId) {
                            this.data[i].lastedDtts = this.lastedDtts;
                            if (this.data[i].parameters) {
                                this.data[i].parameters.forEach(param => {
                                    let tempVariation = 0;
                                    for(let j: number = 0; j < variation.length; j++ ) {
                                        if ( param.paramId === variation[j].paramId ) {
                                            tempVariation = variation[j].variation.toFixed(0);
                                            if (tempVariation + '' === '-0') {
                                                tempVariation = 0;
                                            }
                                            param.variation = tempVariation;
                                            break;
                                        }
                                    }
                                });
                            }
                            break;
                        }
                    }
                }, error => {
                    console.log('getVariationData Error : ', error, d);
                });
            });
            this.eqpGrid.refresh(true);
        }
    }

    private _showParameters(row) {
        console.log('_showParameters : ', row);
        if (!row.parameters) {
            const currentDt = new Date().getTime();
            this.currentRow = row;
            this.showSpinner();
            // tslint:disable-next-line:max-line-length
            this.dataSvc.getParamStatus(this._plantId, this._areaId, row.eqpId, this._timePeriod[CD.FROM], this._timePeriod[CD.TO]).then(params => {
                row.parameters = params;
                if (params.length) {
                    params.forEach(param => {
                        param.eqpId = row.eqpId;
                        param.areaName = row.areaName;
                        param.score = '-';
                        param.multiVariant = {
                            alarm: '-',
                            warning: '-',
                            normal: '-'
                        };
                        param.type = 'PARAM';
                        param.eqpName = row.eqpName;
                        param.reson = [
                                '-',
                                '-',
                                '-'
                            ];
                        param.healthChange = '-';
                        param.measurements = null;
                        param.timewaves = null;
                        param.spectra = null;
                        param.paramVisible = false;
                        param.parameters = null;
                    });

                    let data = this.gridData.items;
                    let index = data.indexOf(row);
                    let afterArr = data.splice(index + 1);
                    this.gridData = new wjcCore.CollectionView(data.concat(params, afterArr));
                }
                // this.eqpGrid.refresh(true);
                this._addParameterVariationSvc(this._plantId, this._areaId, row.eqpId, currentDt, this.currentRow);
                if ( !this.isRefresh ) {
                    this.isRefresh = true;
                    this.refreshTimer = setInterval( () => {
                        this.data = this.gridData.sourceCollection;
                        const currentDt = new Date().getTime();
                        this.lastedDtts = this.convertDate(currentDt);
                        this._getVariations(currentDt);
                    }, this.refreshTime );
                }
                this.hideSpinner();
            }).catch(e => {
                this.hideSpinner();
            });
        } else {
            const currentDt = new Date().getTime();
            this._addParameterVariationSvc(this._plantId, this._areaId, row.eqpId, currentDt, this.currentRow);
            if ( !this.isRefresh ) {
                this.isRefresh = true;
                this.refreshTimer = setInterval( () => {
                    this.data = this.gridData.sourceCollection;
                    this.lastedDtts = this.convertDate(currentDt);
                    this._getVariations(currentDt);
                }, this.refreshTime );
            }
            let data = this.gridData.items;
            let index = data.indexOf(row);
            let afterArr = data.splice(index+1);
            this.gridData = new wjcCore.CollectionView(data.concat(row.parameters, afterArr));
            data = null;
        }
    }

    private _hideParameters(row) {
        let selectedIndex = this.eqpGrid.selectedRows[0].index;
        let scrollPosition = this.eqpGrid.scrollPosition;
        let data = this.gridData.items;
        let index = data.indexOf(row);
        if (index >= 0 && row.parameters.length > 0) {
            this._removeParameterVariationSvc(this._plantId, this._areaId, row.eqpId, row);
            row.lastedDtts = null;
            data.splice(index+1, row.parameters.length);
            this.gridData = new wjcCore.CollectionView(data);
            data = null;
        }
        setTimeout(()=>{
            this.eqpGrid.select(selectedIndex,this.eqpGrid.selection.col,selectedIndex,this.eqpGrid.selection.col2,false);
            this.eqpGrid.scrollPosition = scrollPosition;
        },500);
    }

    // parameter list 가져올 시에 variation promise 를 setup 한다.
    private _addParameterVariationSvc(fabId, areaId, eqpId, currentTime, row) {
        let selectedIndex = this.eqpGrid.selectedRows[0].index;
        let scrollPosition = this.eqpGrid.scrollPosition;
        this.lastedDtts = this.convertDate(currentTime);
        this.parameterVariationPromise.push( {
            'fabId': fabId,
            'areaId': areaId,
            'eqpId': eqpId,
            'currentTime': currentTime
            // 'svc': this.dataSvc.getParameterVariations(fabId, areaId, eqpId, currentTime)
        } );
        this.dataSvc.getParameterVariations(fabId, areaId, eqpId, currentTime)
                    .then((response) => {
                        row.lastedDtts = this.lastedDtts;
                        row.parameters.forEach(param => {
                            let tempVariation = 0;
                            for(let i: number = 0; i < response.length; i++ ) {
                                if ( param.paramId === response[i].paramId ) {
                                    tempVariation = response[i].variation.toFixed(0);
                                    if (tempVariation + '' === '-0') {
                                        tempVariation = 0;
                                    }
                                    param.variation = tempVariation;
                                    break;
                                }
                            }
                        });
                        this.eqpGrid.refresh(true);
                        setTimeout(()=>{
                            this.eqpGrid.select(selectedIndex,this.eqpGrid.selection.col,selectedIndex,this.eqpGrid.selection.col2,false);
                            this.eqpGrid.scrollPosition = scrollPosition;
                        },500);
                    }, error => {
                        console.log('_addParameterVariationSvc.getParameterVariations error : ', error);
                    });
    }

    // variation api 삭제
    private _removeParameterVariationSvc(plantId, areaId, eqpId, row) {
        let deleteIndex = -1;
        for ( let i: number = 0; i < this.parameterVariationPromise.length; i++ ) {
            if (this.parameterVariationPromise[i].eqpId === eqpId) {
                deleteIndex = i;
                break;
            }
        }
        if ( deleteIndex > -1 ) {
            this.parameterVariationPromise = this.parameterVariationPromise.splice(deleteIndex, 1);
        }
        if ( !this.parameterVariationPromise.length ) {
            this.isRefresh = false;
            clearInterval( this.refreshTimer );
        }
    }

    private _syncMultiVariant(eqpId) {
        let outCd = this.getOutCondition('config');

        outCd[CD.PLANT] = this._plant;
        outCd[CD.AREA_ID] = this._areaId;
        outCd[CD.EQP_ID] = eqpId;
        outCd[CD.TIME_PERIOD] = this._timePeriod;

        this.syncOutCondition(outCd);
    }

    private _updateParamChartSpec(spec) {
        this.paramChartSpecLines = [];
        // this.paramChartConfig.eventLine.events = [
        // this.paramChartSpecLines = [
         this.paramChartSpecLines.push({
                name: `목표 (${spec.target.toFixed(2)})`,
                show: true,
                type: 'line',
                axis: 'yaxis',
                label: {
                    show: true,
                    position: 'n'
                },
                tooltip: {
                    show: true
                },
                line: {
                    width: .5,
                    color: '#0000ff',
                    show: true,
                    tooltip: {
                        show: true,
                        formatter: (line, val, plot) => {
                            return `목표 (${spec.target.toFixed(2)})`;
                        }
                    },
                    label: {
                        show: true
                    },
                    value: spec.target,
                }
            });
            this.paramChartSpecLines.push({
                name: `주의 (${spec.warning.toFixed(2)})`,
                show: true,
                type: 'line',
                axis: 'yaxis',
                label: {
                    show: true,
                    position: 's'
                },
                tooltip: {
                    show: true
                },
                line: {
                    width: .5,
                    color: '#ffa500',
                    show: true,
                    tooltip: {
                        show: true,
                        formatter: (line, val, plot) => {
                            return `주의 (${spec.warning.toFixed(2)})`;
                        }
                    },
                    label: {
                        show: true
                    },
                    value: spec.warning,
                }
            });
            this.paramChartSpecLines.push({
                name: `경고 (${spec.alarm.toFixed(2)})`,
                show: true,
                type: 'line',
                axis: 'yaxis',
                label: {
                    show: true,
                    position: 'n'
                },
                tooltip: {
                    show: true
                },
                line: {
                    width: .5,
                    color: '#ff0000',
                    show: true,
                    tooltip: {
                        show: true,
                        formatter: (line, val, plot) => {
                            return `경고 (${spec.alarm.toFixed(2)})`;
                        }
                    },
                    label: {
                        show: true
                    },
                    value: spec.alarm,
                }
            });
            this.paramChartSpecLines.push({
                name: `평균 (${spec.mean.toFixed(2)})`,
                show: true,
                type: 'line',
                axis: 'yaxis',
                label: {
                    show: true,
                    position: 's'
                },
                tooltip: {
                    show: true
                },
                line: {
                    width: .5,
                    color: '#2d0687', // 00ff00
                    show: true,
                    tooltip: {
                        show: true,
                        formatter: (line, val, plot) => {
                            return `평균 (${spec.mean.toFixed(2)})`;
                        }
                    },
                    label: {
                        show: true
                    },
                    value: spec.mean,
                }
            });
        // ];
        setTimeout(() => {
            let tempEl = null;
            const eventCanvasList = [];
            const currentChartEl = ( this.chartEl as any).chartEl;
            const childNodes = currentChartEl.childNodes;
            for ( let i: number = 0; i < childNodes.length; i++ ) {
                if ((childNodes[i] as any).className === 'jqplot-eventline-canvas') {
                    tempEl = childNodes[i];
                    eventCanvasList.push(childNodes[i]);
                    break;
                }
            }
            const childIndex = childNodes.length;
            if (tempEl) {
                currentChartEl.insertBefore(tempEl, currentChartEl.childNodes[childIndex - 4]);
            }
        }, 500);
    }

    // tslint:disable-next-line:no-unused-variable
    private _standardDeviation(values) {
        var avg = this._average(values);
        var squareDiffs = values.map(function(value) {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });
        var avgSquareDiff = this._average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }

    private _average(values) {
        return values.reduce((p, c)=>p+c)/values.length;
    }

    private _updateParamChart(param, eqpId, paramId, ev) {
        let to = this._timePeriod[CD.TO];
        let from = this._timePeriod[CD.FROM];
        let calls = [
            this.dataSvc.getTrendMultiple(this._plantId, this._areaId, eqpId, paramId, from, to),
            this._pdmSvc.getParamDetail(this._plantId, paramId)
        ];
        Promise.all(calls).then(([data, paramDetail]) => {
            this.paramChartData = data.length ? [data] : [];
            let dataMax = Math.max.apply(null, data.map(item => {
                return item[1];
            }));

            let from = to - 86400000*30+1;
            this.dataSvc.getTrendMultipleSpec(this._plantId, this._areaId, eqpId, paramId, from, to).then(spec => {
                this.paramChartConfig = this._chartConfig.getParamChartConfig();

                this.paramChartConfig.axes.yaxis.label = paramDetail.eu;

                // TODO: remove temp spec
                let values = data.map(item=>item[1]);
                if (values.length) {
                    spec.mean = this._average(values);

                    let yMax = Math.max(dataMax, spec.target, spec.warning, spec.alarm);
                    this.paramChartConfig.axes.yaxis.max = yMax * 1.02;

                    // TODO: remove temp spec (end)

                    this._updateParamChartSpec(spec);
                }
            });
        });
    }

    private _showPopup(dlg: wjcInput.Popup) {
        if (dlg) {
            dlg.modal = true;
            dlg.hideTrigger = wjcInput.PopupTrigger.Blur;
            dlg.show();
        }
    };

    private _closePopup(dlg: wjcInput.Popup) {
        dlg.hide();
    }

    private _showHealthTooltip(ev, eqpInfo, pointData) {
        let dsCd: any = this.getViewData('displayEffectContext');
        let time = pointData[0];
        dsCd[LB.EQP_NAME] = eqpInfo.eqpName;
        dsCd[LB.TIME] = time;
        dsCd[LB.HEALTH_INDEX] = pointData[1];

        let outCd = this.getOutCondition('config');

        let context: ContextMenuType = {
            tooltip: {
                event: ev
            },
            template: {
                title: 'Health Index Chart',
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action:[{
                    labelI18n: 'Parameter 영향도',
                    data: { eqpId: eqpInfo.eqpId, time: time },
                    callback: (data:any) => {
                        this._showEffectChart(data.eqpId, data.time);
                    }
                }, {
                    labelI18n: '모델 유효성',
                    data: { eqpId: eqpInfo.eqpId, time: time },
                    callback: (data:any) => {
                        this._showErrorChart(data.eqpId, data.time);
                    }
                }]
            },
            contextMenuAction : {
                // invisible?: boolean;
                // disableCommnet?: boolean;
                // invisibleComment?: boolean;
                // disableAppList?: boolean;
                // invisibleAppList?: boolean;
                // disableDetailView?: boolean;
                // invisibleDetailView?: boolean;
                // disableSync?: boolean;
                // invisibleSync?: boolean;
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };

        // show context menu
        this.showContextMenu(context);
    }

    private _showEffectChart(eqpInfo, time) {
        this._showPopup(this.effectChartPopup);
    }

    private _showErrorChart(eqpInfo, time) {
        this._showPopup(this.errorChartPopup);
    }
}
