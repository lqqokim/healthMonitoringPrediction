import { Component, OnDestroy, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { PdmModelerService } from './pdm-modeler.service';
import {
    ModalAction,
    ModalApplier,
    ModalRequester,
    OnSetup,
    SessionService,
    WidgetApi,
    WidgetRefreshType,
} from '../../../common';
import { MultiSelectorConfigType } from '../../../sdk';
import { ErrorModalModule } from './partial/modal/pdm-error-modal/error-modal.module';
import { Subscription } from 'rxjs/Subscription';
import { Ng2NoUiSliderInterface } from './partial/ng2-nouislider/ng2-nouislider.interface';
import { DateFormatService } from './partial/ng2-nouislider/formatter/date-format.service';
import { Subject } from 'rxjs/Subject';
import * as pdmI from './pdm-modeler.interface';
import { ContourChartComponent } from './partial/chart/contour-chart/contour-chart.component';
import { MiChartRootComponent } from './partial/chart/mi-chart/mi-chart-root.component';
import { Ng2NoUiSliderComponent } from './partial/ng2-nouislider/ng2-nouislider.component';
import { NotifyService } from '../../../sdk/popup/notify/notify.service';
import { MultiSelectorComponent } from '../../../sdk/forms/multi-selector/multi-selector.component';
import { SpinnerComponent } from '../../../sdk/popup/spinner/spinner.component';
import { CookieService } from 'angular2-cookie/core';

@Component({
    moduleId: module.id,
    selector: 'pdm-modeler',
    templateUrl: 'pdm-modeler.component.html',
    styleUrls: ['pdm-modeler.component.css'],
    host: {
        class: 'height-full'
    },
    encapsulation: ViewEncapsulation.None,
    providers: [PdmModelerService, DateFormatService],
})
export class PdmModelerComponent extends WidgetApi implements OnSetup, OnDestroy {

    @ViewChild('lineTrendChartBody') lineTrendChartBody: MiChartRootComponent;
    @ViewChild('lineHealthChartBody') lineHealthChartBody: MiChartRootComponent;
    @ViewChild('barAnalysisChartBody') barAnalysisChartBody: MiChartRootComponent;
    @ViewChild('contourChartBody') contourChartBody: ContourChartComponent;
    @ViewChild('nouisliderTrend') nouislider_trend: Ng2NoUiSliderComponent;
    @ViewChild('nouisliderHealth') nouislider_health: Ng2NoUiSliderComponent;
    @ViewChild('trendMulti') trend_multi: MultiSelectorComponent;
    @ViewChild('groupMulti') group_multi: MultiSelectorComponent;
    @ViewChild('componentSpinner') spinner: SpinnerComponent;
    @ViewChild('tabContents') tab_contents: ElementRef;

    dataId: string;
    selectedParameter: string = 'raw';
    multiSelectorDatas: Array<any> = [];
    configTrendMultiSelector: MultiSelectorConfigType;
    configModelParameterMultiSelector: MultiSelectorConfigType;
    selectedTrend: Array<any>;
    selectedTrendParameterNames: Array<string> = [];
    selectedModelParameter: Array<any>;
    selectedModelParameterNames: Array<string> = [];
    isSettingClassSetA: boolean = false;
    classAObject: any = {};
    isSettingClassSetB: boolean = false;
    classBObject: any = {};
    isShowHistogram: boolean = false;
    sliderTrendConfig: Ng2NoUiSliderInterface;
    sliderHealthConfig: Ng2NoUiSliderInterface;
    pdmType: string = 'trend';
    pdmTabChanger: Subject<string>;
    self: any;
    globalGuid: string;
    _isTrendZoomed: boolean = false;
    _isHealthZoomed: boolean = false;
    healthModel: any;
    analysisResponse: any;
    isOutlierChecked: boolean = false;
    selectedParamsVariableImportance: string = '';
    isPrevSetting: boolean = false;
    isShowBuildModel: boolean = true;
    _localForage: any;
    plantName: string;
    isBuildHealthzoom: boolean = false;
    fromToTooltip: string;
    dataResponse: any;
    trendResponse: any;
    buildResponse: any;
    // showHealthResponse: any;
    isSettingBuildHealthDate: boolean = false;
    initDate: number = 30;
    _loginUser: string;

    timePeriod: pdmI.TimePeriod = {
        from: undefined,
        to: undefined
    };

    alanysisDataParam: pdmI.AnalysisDataRequestParam = {
        fab: undefined,
        eqpid: undefined,
        fromdate: undefined,
        todate: undefined
    };

    chartAnalysisParam: pdmI.ChartAnalysisRequestParam = {
        fab: undefined,
        width: undefined,
        dataId: undefined,
        height: undefined,
        charttype: undefined,
        fromdate: undefined,
        todate: undefined,
        params: {
            parameters: undefined
        }
    };
    buildAndHealthDataParam: pdmI.BuildAndHealthDataRequestParam = {
        fab: undefined,
        params: {
            parameters: undefined
        },
        fromdate: undefined,
        todate: undefined,
        eqpId: undefined,
        width: undefined,
        height: undefined,
        dataId: undefined
    };

    analysisPcaDataParam: pdmI.PcaDataRequestParam = {
        fab: undefined,
        a_fromdate: undefined,
        a_todate: undefined,
        b_fromdate: undefined,
        b_todate: undefined,
        dataId: undefined
    };

    healthByDataParam: pdmI.HealthByDataRequestParam = {
        fab: undefined,
        fromdate: undefined,
        todate: undefined,
        charttype: undefined,
        width: undefined,
        height: undefined,
        dataId: undefined,
        eqpId: undefined
    };

    outlierDataParam: pdmI.OutlierRequestParam = {
        fromdate: undefined,
        todate: undefined,
        charttype: undefined,
        outliertype: undefined,
        width: undefined,
        height: undefined,
        startX: undefined,
        endX: undefined,
        startY: undefined,
        endY: undefined,
        dataId: undefined,
        params: {
            parameters: undefined
        },
        fab: undefined
    };

    healthIndexZoomParam: pdmI.HealthIndexZoomRequestParam = {
        fab: undefined,
        fromdate: undefined,
        todate: undefined,
        charttype: undefined,
        width: undefined,
        height: undefined,
        dataId: undefined,
        params: {
            parameters: undefined
        }
    };

    private _subscription: Subscription;
    private _pdmSubscription: Subscription;
    private _trendZoomSubscription: Subscription;
    private _healthZoomSubscription: Subscription;
    private _trendCreationSubscription: Subscription;
    private _healthCreationSubscription: Subscription;
    private _props: any;
    private _plant: any;
    private _plantId: any;
    private _eqpId: any;
    private _areaId: any;
    private _planName: any;
    private _eqpName: any;
    private _shopName: any;
    private _buildHealthTiemData: any;
    private _trendTimeData: any;
    private _trendZoomTimeData: any;
    private _imgChartSize: any;

    constructor(
        private pdmS: PdmModelerService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
        private applier: ModalApplier,
        private dateFormatS: DateFormatService,
        private notify: NotifyService,
        private cookieS: CookieService,
        private sessionS: SessionService

    ) {
        super();
        this.pdmTabChanger = new Subject();
    }

    ngOnSetup() {
        this.self = this;
        this._loginUser = this.sessionS.getUserId();
        this.hideSpinner();
        this._defaultDateSetting();
        this._setConfig();
        this._subsPdmTypeChange();
        this._subsZoomEnd();
        this._subsChartCreationEnd();
        this._setTrendSlider();
        this._setHealthSlider();
        this.pdmTabChanger.next('trend');
        this._props = this.getProperties();
        this._setProperties(this._props);
        this.disableConfigurationBtn(true);
    }

    initializeConfigs() {
        this.selectedTrendParameterNames = [];
        this.pdmTabChanger.next('trend');
        this.isShowBuildModel = true;
        if (this.lineTrendChartBody && this.lineHealthChartBody) {
            this.lineTrendChartBody.clearChart();

            this.lineHealthChartBody.clearChart();
            this.cancelClassA();
            this.cancelClassB();
            this._cancelBuildHealthParam()
        }
        if (this.contourChartBody) {
            this.contourChartBody.clearChart();
        }
        if (this.barAnalysisChartBody) {
            this.barAnalysisChartBody.clearChart();
        }
    }

    _setContentsSize() {
        if (this.pdmType === 'trend') {
            this._imgChartSize = {
                width: this.tab_contents.nativeElement.offsetWidth - 100,
                height: this.tab_contents.nativeElement.offsetHeight - 100 - 110
            }
        } else {
            this._imgChartSize = {
                width: this.tab_contents.nativeElement.offsetWidth - 100,
                height: this.tab_contents.nativeElement.offsetHeight - 110
            }
        }
    }

    _setProperties(props) {
        this._plant = props[CD.PLANT];
    }

    _init() {
        if (this._plant) {
            this._plantId = this._plant[CD.PLANT_ID];
        }
        if (this._plantId) {
            const healthModelRequestParam: pdmI.HealthModelRequestParam = {
                fab: this._plantId,
                eqpId: this._eqpId
            };
            this.pdmS.getHealthModel(healthModelRequestParam).subscribe((health_model: any) => {
                this.healthModel = health_model;
                if (this.healthModel.result === 'success') {
                    this.isPrevSetting = true;
                    this.fromToTooltip = `${moment(this.healthModel.data.model.model_fromDate).format('YYYY/MM/DD')} ~ ${moment(this.healthModel.data.model.model_toDate).format('YYYY/MM/DD')}`;
                } else {
                    this.isPrevSetting = false;
                }
            })
        }
    }

    // TODO
    modelLoad() {
        this.healthByDataParam.fab = this._plantId;
        this.dataLoad(this._modelLoadCallback);
    }

    _modelLoadCallback = () => {
        if (this.healthModel) {
            setTimeout(() => {
                this.selectedModelParameterNames = this.dataResponse.data.parameters;
                const selectedIdValues: Array<number> = this.pdmS.findIdByNameInArray(this.multiSelectorDatas, this.selectedModelParameterNames);
                this.group_multi.setSelectedValue(selectedIdValues);
            }, 10);
            this.spinner.showSpinner('Loading Health Index Chart');
            this.pdmTabChanger.next('health');
            this.healthByDataParam.fab = this._plantId;
            this.healthByDataParam.eqpId = this._eqpId;
            this.healthByDataParam.dataId = this.dataId;
            this.healthByDataParam.width = this._imgChartSize.width;
            this.healthByDataParam.height = this._imgChartSize.height;
            this.healthByDataParam.charttype = 'normal';
            if (this.selectedParameter === 'scale') {
                this.healthByDataParam.charttype = 'scale';
            }
            this.healthByDataParam.fromdate = this.timePeriod.from;
            this.healthByDataParam.todate = this.timePeriod.to;

            if (!this.pdmS.checkRequestParams(this.healthByDataParam)) {
                this.notify.error('parameter not matched');
                this.spinner.hideSpinner();
                return;
            }

            this.pdmS.healthIndexChartByModel(this.healthByDataParam).subscribe(
                (res: any) => {
                    if (res.result === 'success') {
                        this.buildResponse = res;
                        // this.showHealthResponse = res;
                        this.isShowBuildModel = false;
                        this.buildAndHealthDataParam.fromdate = this.timePeriod.from;
                        this.buildAndHealthDataParam.todate = this.timePeriod.to;
                        this.lineHealthChartBody.setData('health', res.data, [], []);
                        this._buildHealthTiemData = [res.data.xMin, res.data.xMax];
                        this._resetSlider([this._buildHealthTiemData[0], this._buildHealthTiemData[1]]);
                        this.spinner.hideSpinner();
                    } else {
                        this.openModal(res.data, 'Load Model');
                        this.spinner.hideSpinner();
                    }
                },
                (err: any) => {
                    this.openModal(`Error `, 'Load Model');
                    this.spinner.hideSpinner();
                }
            )
        }
    }

    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        this._defaultDateSetting();
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
            this._props = data;
            this._setProperties(this._props);
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            this._setConfig();
            this._plant = data[CD.PLANT];
            this.plantName = this._plant[CD.PLANT_NAME];
            this._eqpId = data[CD.EQP_ID];
            this._areaId = data[CD.AREA_ID];
            this._plantId = this._plant[CD.PLANT_ID];
            this.pdmS.getEqpInfo(this._plantId, this._eqpId).then(eqpInfo => {
                this._shopName = eqpInfo.shopFullName;
                this._eqpName = eqpInfo.eqpName;
            });
            this._setProperties(this._props);
            this.initializeConfigs();

        } else {
            this._props = this.getProperties();
            this._setProperties(this._props);
        }
        this._init();
        this.hideSpinner();
        this.spinner.hideSpinner();
    }

    setBarChart(event: any) {
        this.spinner.hideSpinner();
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        if (this._pdmSubscription) {
            this._pdmSubscription.unsubscribe();
        }

        if (this._trendZoomSubscription) {
            this._trendZoomSubscription.unsubscribe();
        }

        if (this._healthZoomSubscription) {
            this._healthZoomSubscription.unsubscribe();
        }

        if (this._trendCreationSubscription) {
            this._trendCreationSubscription.unsubscribe();
        }

        if (this._healthCreationSubscription) {
            this._healthCreationSubscription.unsubscribe();
        }

        this.destroy();
    }

    setDate(data: pdmI.ContextMenuDataType) {
        this.isSettingBuildHealthDate = true;
        this.buildAndHealthDataParam.fromdate = new Date(data.date[0]).getTime();
        this.buildAndHealthDataParam.todate = new Date(data.date[1]).getTime();
    }

    _subsZoomEnd() {
        if (this.lineTrendChartBody ) {
            this._trendZoomSubscription = this.lineTrendChartBody.miChart.chart.zoomEnd$.subscribe(() => {
                if (this.pdmType === 'trend') {
                    this._isTrendZoomed = false;
                    this.isOutlierChecked = false;
                    this._resetSlider([this._trendTimeData[0], this._trendTimeData[1]]);
                    this.draw();
                }
            });
        }

        if (this.lineHealthChartBody) {
            this._healthZoomSubscription = this.lineHealthChartBody.miChart.chart.zoomEnd$.subscribe(() => {
                if (this.pdmType === 'health') {
                    this._isHealthZoomed = false;
                    this._resetSlider([+this._buildHealthTiemData[0], +this._buildHealthTiemData[1]]);
                    this.cancelClassA();
                    this.cancelClassB();
                    this.buildHealthZoom(+this._buildHealthTiemData[0],+this._buildHealthTiemData[1]);
                }
            });
        }
    }

    // execute when mi chart create complete
    _subsChartCreationEnd() {
        if (this.lineTrendChartBody) {
            this._trendCreationSubscription = this.lineTrendChartBody.miChart.chart.creationEnd$.subscribe(() => {
                this.nouislider_trend.slider.removeAttribute('disabled');
            });
        }

        if (this.lineHealthChartBody) {
            this._healthCreationSubscription = this.lineHealthChartBody.miChart.chart.creationEnd$.subscribe(() => {
                this.nouislider_health.slider.removeAttribute('disabled');
            });
        }
        this.spinner.hideSpinner();
    }

    _subsPdmTypeChange() {
        this._pdmSubscription = this.pdmTabChanger.subscribe((type: string) => {
            this.pdmType = type;
            this._setContentsSize();
        });
    }

    _defaultDateSetting() {
        const dateFromCookie = this.cookieS.get(this._loginUser);
        if (dateFromCookie) {
            this.initDate = +dateFromCookie;
        }
    }


    // init config
    _setConfig() {
        const currentDate = new Date();
        this.timePeriod.to = currentDate.getTime();
        this.timePeriod.from = currentDate.setDate(currentDate.getDate() - this.initDate);
        this.configTrendMultiSelector = {
            key: 'trend',
            title: 'Trend Parameter',
            setItem: null,
            isMultiple: true,
            isShowSelectedList: true,
            idField: 'mid',
            initValue: [],      //값 리스트에 배정될 기본 List,
            labelField: 'name'
        };
        this.configModelParameterMultiSelector = {
            key: 'modelParameter',
            title: 'Model Parameter',
            setItem: null,
            isMultiple: true,
            isShowSelectedList: true,
            idField: 'mid',
            initValue: [],      //값 리스트에 배정될 기본 List
            labelField: 'name'
        };

    }

    _setTrendSlider() {
        this.sliderTrendConfig = {
            range: {
                'min': this.timePeriod.from,
                'max': this.timePeriod.to
            },
            step: this.dateFormatS.getDateStep(1),
            start: [this.timePeriod.from, this.timePeriod.to],
            connect: [false, true, false],
            tooltips: [true, true],
            behaviour: 'drag',
            slideEvent: [

                {
                    eventName: 'end',
                    uiSlideCallback: this.endSomething
                }
            ],
            format: {
                to: this.dateFormatS.toDateFormat, // default (2000/01/01)
                from: Number
            },
            pips: {
                mode: 'steps',
                density: 3,
                filter: this.dateFormatS.dateFilter, // default 1 day is show
                format: {
                    to: this.dateFormatS.toDateFormat,
                    from: Number
                }
            }
        };
    }

    _setHealthSlider() {
        this.sliderHealthConfig = {
            range: {
                'min': this.timePeriod.from,
                'max': this.timePeriod.to
            },
            step: this.dateFormatS.getDateStep(1),
            start: [this.timePeriod.from, this.timePeriod.to],
            connect: [false, true, false],
            tooltips: [true, true],
            behaviour: 'drag',
            slideEvent: [

                {
                    eventName: 'end',
                    uiSlideCallback: this.endSomething
                }
            ],
            format: {
                to: this.dateFormatS.toDateFormat, // default (2000/01/01)
                from: Number
            },
            pips: {
                mode: 'steps',
                density: 3,
                filter: this.dateFormatS.dateFilter, // default 1 day is show
                format: {
                    to: this.dateFormatS.toDateFormat,
                    from: Number
                }
            }
        };
    }

    // slider interaction callback function
    endSomething = (values: Array<any>) => {
        let fromDate = new Date(values[0]+" 00:00:00").getTime();
        let toDate =this.addDays(new Date(values[1]+" 00:00:00"),1).getTime();
        
        if (this.pdmType === 'trend') {
            this._isTrendZoomed = true;
            this.lineTrendChartBody.clearChart();
            this.draw(fromDate,toDate );
        } else {
            this._isHealthZoomed = true;
            this.cancelClassA();
            this.cancelClassB();
            this.lineHealthChartBody.clearChart();
            this.buildHealthZoom(fromDate,toDate);
        }
    };
    // Util
    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    } 

    _resetSlider(date: Array<any>) {
        const options = {
            range: {
                min: date[0],
                max: date[1]
            },
            start: [date[0], date[1]],
            format: {
                to: this.dateFormatS.toDateFormat,
                from: Number
            },
            pips: {
                mode: 'steps',
                density: 3,
                filter: this.dateFormatS.dateToggleFilter, // default 1 day is show
                format: {
                    to: this.dateFormatS.toDateFormat,
                    from: Number
                }
            }
        };
        if (this.pdmType === 'trend') {
            this.nouislider_trend.slider.noUiSlider.updateOptions(options);
        } else {
            this.nouislider_health.slider.noUiSlider.updateOptions(options);
        }
    }

    _setSliderDate(changeDate: Array<any>) {
        const setDate: Array<any> = [this.dateFormatS.timestamp(changeDate[0]), this.dateFormatS.timestamp(changeDate[1])];
        if (this.pdmType === 'trend') {
            this.nouislider_trend.slider.noUiSlider.set(setDate);
        } else {
            this.nouislider_health.slider.noUiSlider.set(setDate);
        }
    }

    _cancelBuildHealthParam() {
        this.buildAndHealthDataParam.fromdate = undefined;
        this.buildAndHealthDataParam.todate = undefined;
    }


    // eqp select modal
    openModal(errorMsg: string, title: string) {
        this.modalAction.showConfiguration({
            module: ErrorModalModule,
            requester: this.modalRequester,
            info: {
                title: title,
                errorData: errorMsg,
                applier: this.applier
            }
        });
        this._listenApplied();
    }

    _listenApplied() {
        this._subscription = this.applier
            .listenApplySuccess()
            .subscribe((response) => {
                if (response.type === 'APPLIED') {
                    this.spinner.hideSpinner();
                    this.modalRequester.destroy();
                } else if (response.type === 'FAILED') {
                    alert('Failed');
                    this.spinner.hideSpinner();
                }
            },
            (err) => {
                console.log('Apply exception', err.getMessage());
            });
    }

    fromToChange(fromToData: pdmI.TimePeriod) {
        this.timePeriod = fromToData;
        const from: number = this.timePeriod.from;
        const to: number = this.timePeriod.to;
        var sec: number = new Date(to).getTime() - new Date(from).getTime();
        var diffDay: number = Math.floor( sec / (1000 * 60 * 60 * 24) );
        if (diffDay !== this.initDate && diffDay > 0) {
            this.cookieS.put(this._loginUser, diffDay+'');
        }
    }

    dataLoad(callback?: Function) {
        this.spinner.showSpinner('Loading Data');
        this.initializeConfigs();
        this.pdmTabChanger.next('trend');

        // this.healthModel.data.model.model_fromDate

        if(this.timePeriod.from>this.healthModel.data.model.model_fromDate){
            this.timePeriod.from=this.healthModel.data.model.model_fromDate;
        }
        if(this.timePeriod.to<this.healthModel.data.model.model_toDate){
            this.timePeriod.to=this.healthModel.data.model.model_toDate;    
        }


        this.alanysisDataParam = {
            fab: this._plantId,
            eqpid: this._eqpId,
            fromdate: this.timePeriod.from,
            todate: this.timePeriod.to
        };

        if (!this.pdmS.checkRequestParams(this.alanysisDataParam)) {
            this.notify.error('parameter not matched');
            this.spinner.hideSpinner();
            return;
        }

        this.pdmS.getAnalysisData(this.alanysisDataParam).subscribe(
            (res: any) => {
                if (res.result !== 'fail') {
                    this.dataResponse = res;
                    this.dataId = res.data.dataId;
                    const parameters: Array<any> = this._getParameterNames(res.data.parameters);
                    this._resetMultiselectConfig(parameters);
                    this._cancelBuildHealthParam();
                    this.spinner.hideSpinner();
                    if (callback) {
                        callback();
                    }
                } else {
                    this.openModal(res.data, 'Load Data');
                }
            },
            (err: any) => {
                this.openModal('Request Error', 'Load Data');
            }
        );
    }


    outlierPluginChange() {
        if (this.isOutlierChecked === false) {
            this.lineTrendChartBody.miChart.chart.baseChart.disabledPlugin('MultiBrushPlugin');
            this.lineTrendChartBody.miChart.chart.baseChart.enabledPlugin('DragBase');
            this.isOutlierChecked = true;
            this._cancelBuildHealthParam();
        } else {
            this.lineTrendChartBody.miChart.chart.baseChart.enabledPlugin('MultiBrushPlugin');
            this.lineTrendChartBody.miChart.chart.baseChart.disabledPlugin('DragBase');
            this.isOutlierChecked = false;
        }
    }

    deleteOutlier(data: any) {
        this.setOutLierConfig(data.data, 'delete');
        this.outLier();
    }

    copyPreviousOutlier(data: any) {
        this.setOutLierConfig(data.data, 'copy');
        this.outLier();
    }

    setOutLierConfig(data: any, type: string) {
        this.outlierDataParam.fab = this._plantId;
        this.outlierDataParam.fromdate = this._trendTimeData[0];
        this.outlierDataParam.todate = this._trendTimeData[1];
        if(this._isTrendZoomed){
            this.outlierDataParam.fromdate = this._trendZoomTimeData[0];
            this.outlierDataParam.todate = this._trendZoomTimeData[1];
        }
        this.outlierDataParam.charttype = 'normal';
        if (this.selectedParameter === 'scale') {
            this.outlierDataParam.charttype = 'scale';
        }
        this.outlierDataParam.width = this._imgChartSize.width;
        this.outlierDataParam.height = this._imgChartSize.height;
        this.outlierDataParam.startX = new Date(data[0].startX).getTime();
        this.outlierDataParam.endX = new Date(data[0].endX).getTime();
        this.outlierDataParam.startY = data[0].startY;
        this.outlierDataParam.endY = data[0].endY;
        this.outlierDataParam.dataId = this.dataId;
        this.outlierDataParam.params.parameters = this.selectedTrendParameterNames;
        this.outlierDataParam.outliertype = type;
    }

    outLier() {
        this.spinner.showSpinner('Loading Trend Chart');
        if (!this.pdmS.checkRequestParams(this.outlierDataParam)) {
            this.notify.error('parameter not matched');
            this.spinner.hideSpinner();
            return;
        }
        this.pdmS.getOutLier(this.outlierDataParam).subscribe((res: any) => {
            this.trendResponse = res;
            this.lineTrendChartBody.setData('trend', res.data, this.selectedTrendParameterNames, this.dataResponse.data.parameters, false);
            if (this._isTrendZoomed === false) {
                this._trendTimeData = [res.data.xMin, res.data.xMax];
                this._resetSlider([this._trendTimeData[0], this._trendTimeData[1]]);
            }
            this.cancelClassA();
            this.cancelClassB();
            this._cancelBuildHealthParam();
            this.spinner.hideSpinner();
        })
    }

    // radio button click for change scale.
    radioBtnClick(radioSelected: string) {
        this.selectedParameter = radioSelected;
        if (this.selectedParameter === 'scale') {
            this.isOutlierChecked = false;
        }
    }

    // selected params in trend multi selector
    selectedItemInTrend(data: any) {
        this.selectedTrend = data.item;
        if (this.selectedTrend[0]) {
            this.selectedTrendParameterNames = this.selectedTrend.map((p: any) => {
                return p['name'];
            });
        }
    }

    removedItemsInTrend(data: any) {
        if (data.remains.length === 0) {
            this.selectedTrendParameterNames.length = 0;
        }
    }

    // draw trend chart.
    draw(from?: number, to?: number) {
        this.spinner.showSpinner('Loading Trend Chart');
        this.chartAnalysisParam.charttype = 'normal';
        if (this.selectedParameter === 'scale') {
            this.chartAnalysisParam.charttype = 'scale';
        }
        this.chartAnalysisParam.dataId = this.dataId;
        this.chartAnalysisParam.fromdate = this.timePeriod.from;
        this.chartAnalysisParam.todate = this.timePeriod.to;
        if (from && to) {
            this.chartAnalysisParam.fromdate = from;
            this.chartAnalysisParam.todate = to;
        }
        this.chartAnalysisParam.fab = this._plantId;
        this.chartAnalysisParam.width = this._imgChartSize.width;
        this.chartAnalysisParam.height = this._imgChartSize.height;
        this.chartAnalysisParam.params.parameters = this.selectedTrendParameterNames;

        if (!this.pdmS.checkRequestParams(this.chartAnalysisParam)) {
            this.notify.error('parameter not matched');
            this.spinner.hideSpinner();
            return;
        }

        this.pdmTabChanger.next('trend');
        this.pdmS.getChartAnalysis(this.chartAnalysisParam).subscribe(
            (res: any) => {
                if (res.result === 'success') {
                    // this.lineTrendChartBody.clearChart();
                    this.trendResponse = res;
                    this.lineTrendChartBody.setData('trend', res.data, this.selectedTrendParameterNames, this.dataResponse.data.parameters);
                    if (this._isTrendZoomed === false) {
                        this._trendTimeData = [res.data.xMin, res.data.xMax];
                        this._resetSlider([this._trendTimeData[0], this._trendTimeData[1]]);
                    }else{
                        this._trendZoomTimeData =[res.data.xMin,res.data.xMax];
                    }
                    this.cancelClassA();
                    this.cancelClassB();
                    this._cancelBuildHealthParam();
                    this.spinner.hideSpinner();
                } else {
                    this.openModal(res.data, 'Trend Chart');
                }
            },
            (err: any) => {
                this.openModal('Error' , 'Trend Chart');
            }
        );
    }

    // selected params in group multi selector
    selectedItemInModelParameter(data: any) {
        this.selectedModelParameter = data.item;
        if (this.selectedModelParameter[0]) {
            this.selectedModelParameterNames = this.selectedModelParameter.map((p: any) => {
                return p['name'];
            });
        }
    }

    removedItemsInModelParameter(data: any) {
        if (data.remains.length === 0) {
            this.selectedModelParameterNames.length = 0;
        }
    }

    // draw health chart.
    buildHealth(from?: number, to?: number) {
        this.spinner.showSpinner('Loading Health Index Chart');
        this.pdmTabChanger.next('health');
        this.buildAndHealthDataParam.fab = this._plantId;
        this.buildAndHealthDataParam.eqpId = this._eqpId;
        this.buildAndHealthDataParam.dataId = this.dataId;
        this.buildAndHealthDataParam.width = this._imgChartSize.width;
        this.buildAndHealthDataParam.height = this._imgChartSize.height;
        this.buildAndHealthDataParam.params.parameters = this.selectedModelParameterNames;
        if (from && to) {
            this.buildAndHealthDataParam.fromdate = from;
            this.buildAndHealthDataParam.todate = to;
        }

        if (!this.pdmS.checkRequestParams(this.buildAndHealthDataParam)) {
            this.notify.error('parameter not matched');
            this.spinner.hideSpinner();
            return;
        }
        this.pdmS.getBuildAndHealthData(this.buildAndHealthDataParam).subscribe(
            (res: any) => {
                if (res.result !== 'fail') {
                    this.buildResponse = res;
                    // this.showHealthResponse = res;
                    // this.isShowBuildModel = false;
                    this.lineHealthChartBody.setData('health', res.data, [], []);
                    this._buildHealthTiemData = [res.data.xMin, res.data.xMax];
                    this._resetSlider([this._buildHealthTiemData[0], this._buildHealthTiemData[1]]);
                    this.spinner.hideSpinner();
                    this.cancelClassA();
                    this.cancelClassB();
                    this.barAnalysisChartBody.clearChart();
                    this.contourChartBody.clearChart();
                } else {
                    this.openModal(res.data, 'Build Health');
                }
            },
            (err: any) => {
                this.openModal('Error ' , 'Build Health');
            }
        );
    }

    buildHealthZoom(from: number, to: number) {
        this.spinner.showSpinner('Loading Health Index Chart');
        this.pdmTabChanger.next('health');
        this.healthIndexZoomParam.fab = this._plantId;
        this.healthIndexZoomParam.dataId = this.dataId;
        this.healthIndexZoomParam.width = this._imgChartSize.width;
        this.healthIndexZoomParam.height = this._imgChartSize.height;
        this.healthIndexZoomParam.params.parameters = this.selectedModelParameterNames;
        this.healthIndexZoomParam.charttype = 'normal';
        if (this.selectedParameter === 'scale') {
            this.healthIndexZoomParam.charttype = 'scale';
        }
        this.healthIndexZoomParam.fromdate = from;
        this.healthIndexZoomParam.todate = to;
        if (!this.pdmS.checkRequestParams(this.healthIndexZoomParam)) {
            this.notify.error('parameter not matched');
            this.spinner.hideSpinner();
            return;
        }
        this.pdmS.healthIndexChartZoom(this.healthIndexZoomParam).subscribe(
            (res: any) => {
                if (res.result === 'success') {
                    this.isBuildHealthzoom = true;
                    this.lineHealthChartBody.setData('health', res.data, [], []);
                    // this._resetSlider([res.data.xMin, res.data.xMax]);
                    this.barAnalysisChartBody.clearChart();
                    this.contourChartBody.clearChart();
                    this.spinner.hideSpinner();
                } else {
                    this.openModal(res.data, 'HealthIndex Chart Zoom');
                }
            },
            (err: any) => {
                this.openModal(`Request Error`, 'HealthIndex Chart Zoom');
            }
        )

    }

    // showHealth() {
    //     this.spinner.showSpinner('Show Previous Health Index Chart');
    //     this.pdmTabChanger.next('health');

    //     if (this.showHealthResponse) {
    //         setTimeout(() => {
    //             this.lineHealthChartBody.setData('health', this.showHealthResponse.data, [], []);
    //             this._buildHealthTiemData = [this.showHealthResponse.data.xMin, this.showHealthResponse.data.xMax];
    //             this._resetSlider([+this._buildHealthTiemData[0], +this._buildHealthTiemData[this._buildHealthTiemData.length - 1]]);
    //             this.spinner.hideSpinner();
    //         }, 0)
    //     }
    // }

    cancelClassA() {
        this.isSettingClassSetA = false;
        this.analysisPcaDataParam.a_fromdate = undefined;
        this.analysisPcaDataParam.a_todate = undefined;
        if (this.classAObject.uid && this.lineHealthChartBody) {
            this.lineHealthChartBody.miChart.chart.baseChart.removeFromUid('brush', this.classAObject.uid);
        }
    }

    cancelClassB() {
        this.isSettingClassSetB = false;
        this.analysisPcaDataParam.b_fromdate = undefined;
        this.analysisPcaDataParam.b_todate = undefined;
        if (this.classBObject.uid && this.lineHealthChartBody) {
            this.lineHealthChartBody.miChart.chart.baseChart.removeFromUid('brush', this.classBObject.uid);
        }
    }


    // draw contour chart.
    analysisPca() {
        this.spinner.showSpinner('Loading PCA Chart');

        this.analysisPcaDataParam.fab = this._plantId;
        this.analysisPcaDataParam.dataId = this.dataId;
        if (!this.pdmS.checkRequestParams(this.analysisPcaDataParam)) {
            this.notify.error('parameter not matched');
            this.spinner.hideSpinner();
            return;
        }

        this.pdmTabChanger.next('pca');
        this.pdmS.getPcaData(this.analysisPcaDataParam).subscribe(
            (res: any) => {
                if (res.result !== 'fail') {
                    this.contourChartBody.clearChart();
                    this.contourChartBody.setData('pca', res.data);
                    this.spinner.hideSpinner();
                } else {
                    this.openModal(res.data, 'PCA');
                }
            },
            (err: any) => {
                this.openModal('Error ' , 'PCA');
            }
        );
    }

    histogramChange() {
        this.isShowHistogram = !this.isShowHistogram;
    }


    // draw analysis chart
    analysis() {
        this.spinner.showSpinner('Loading variable Importance Chart');
        this.analysisPcaDataParam.fab = this._plantId;
        this.analysisPcaDataParam.dataId = this.dataId;

        if (!this.pdmS.checkRequestParams(this.analysisPcaDataParam)) {
            this.notify.error('parameter not matched');
            this.spinner.hideSpinner();
            return;
        }

        this.pdmTabChanger.next('VariableImportance');
        this.pdmS.getAnalysisAandB(this.analysisPcaDataParam).subscribe(
            (res: any) => {
                if (res.result !== 'fail') {
                    this.analysisResponse = res;
                    this.barAnalysisChartBody.setData('analysis', this.analysisResponse.data, [], []);
                    this.spinner.hideSpinner();
                } else {
                    this.openModal(res.data, 'constiable Importance');
                }
            },
            (err: any) => {
                this.openModal('Request Error', 'constiable Importance');
            }
        );
    }

    setClassA(data: pdmI.ContextMenuDataType) {
        this.isSettingClassSetA = true;
        this.classAObject = {
            uid: data.uid,
            date: data.date,
            ruid: data.ruid
        };
        this.analysisPcaDataParam.a_fromdate = new Date(data.date[0]).getTime();
        this.analysisPcaDataParam.a_todate = new Date(data.date[1]).getTime();

        this.lineHealthChartBody.miChart.chart.baseChart.removeBrushRectEvent('brush', this.classAObject.uid);
        this.lineHealthChartBody.miChart.chart.baseChart.removeUid(this.classAObject.ruid);
    }

    setClassB(data: pdmI.ContextMenuDataType) {
        this.isSettingClassSetB = true;
        this.classBObject = {
            uid: data.uid,
            date: data.date,
            ruid: data.ruid
        };
        this.analysisPcaDataParam.b_fromdate = new Date(data.date[0]).getTime();
        this.analysisPcaDataParam.b_todate = new Date(data.date[1]).getTime();

        this.lineHealthChartBody.miChart.chart.baseChart.removeBrushRectEvent('brush', this.classBObject.uid);
        this.lineHealthChartBody.miChart.chart.baseChart.removeUid(this.classBObject.ruid);
    }

    isValidRequest(): boolean {
        if (this.isSettingClassSetA && this.isSettingClassSetB) {
            return false;
        } else {
            return true;
        }
    }

    zoom(data: pdmI.ContextMenuDataType) {
        this._setSliderDate(data.date);
        if (data.type === 'trend') {
            // this.lineTrendChartBody.clearChart();
            this._isTrendZoomed = true;
            this.draw(new Date(data.date[0]).getTime(), new Date(data.date[1]).getTime());
        } else {
            this._isHealthZoomed = true;
            this.cancelClassA();
            this.cancelClassB();
            // this.lineHealthChartBody.clearChart();
            this.buildHealthZoom(new Date(data.date[0]).getTime(), new Date(data.date[1]).getTime());
        }
    }

    saveModel() {
        this.pdmS.saveModel(this._plantId, this._eqpId, this.dataId).subscribe(
            (res: any) => {
                if (res.result !== 'fail') {
                    this.openModal('Success to save Model', 'Save Model');
                } else {
                    this.openModal(res.data, 'Save Model');
                }
            },
            (err: any) => {
                this.openModal('Request Error', 'Save Model');
            }
        );
    }

    setParamVariableImportance(params: Array<string>) {
        this.selectedParamsVariableImportance = params.join(', ');
    }

    applyParameters() {
        const selectedParamValues: Array<string> = this.selectedParamsVariableImportance.split(', ');
        const selectedIdValues: Array<number> = this.pdmS.findIdByNameInArray(this.multiSelectorDatas, selectedParamValues);
        this.trend_multi.setSelectedValue(selectedIdValues);
        this.group_multi.setSelectedValue(selectedIdValues);
    }

    removeAllInBrush() {
        this.lineHealthChartBody.miChart.chart.baseChart.removeOtherBrush();
    }

    _getParameterNames(data: any) {
        const parameters: Array<any> = [];
        const parameterDatas: Array<any> = data;
        parameterDatas.map((data: any, i: number) => {
            const obj = {
                mid: i,
                name: data
            };
            parameters.push(obj);
        });
        return parameters;
    }

    // multiselector reset.
    _resetMultiselectConfig(data: any) {
        this.multiSelectorDatas = data;
        this.configTrendMultiSelector = {
            key: 'trend',
            title: 'Trend Parameter',
            setItem: null,
            isMultiple: true,
            isShowSelectedList: true,
            idField: 'mid',
            initValue: data,
            labelField: 'name'
        };

        this.configModelParameterMultiSelector = {
            key: 'modelParameter',
            title: 'Model Parameter',
            setItem: null,
            isMultiple: true,
            isShowSelectedList: true,
            idField: 'mid',
            initValue: data,
            labelField: 'name',
            isDefaultAllChecked: true
        };
    }
}

