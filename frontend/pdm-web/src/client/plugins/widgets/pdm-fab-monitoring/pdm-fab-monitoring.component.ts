//Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef, HostListener, OnInit } from '@angular/core';

//MI import
import { WidgetRefreshType, WidgetApi, ContextMenuTemplateInfo, OnSetup } from '../../../common';
import { Translater, ContextMenuType, SpinnerComponent, NotifyService } from '../../../sdk';

import { FabInfo } from '../../configurations/global/pdm/fabmonitoring/component/fab-editor/fabInfo';
import { FabEditorComponent } from '../../configurations/global/pdm/fabmonitoring/component/fab-editor/fab-editor.component';

import { PdmModelService } from '../../../common/model/app/pdm/pdm-model.service';

// import { FabAreaEqpParamTreeComponent } from '../../../../../../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';
import { FabAreaEqpParamTreeComponent } from '../../../plugins/common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';


@Component({
    moduleId: module.id,
    selector: 'pdm-fab-monitoring',
    templateUrl: './pdm-fab-monitoring.html',
    styleUrls: ['./pdm-fab-monitoring.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmFabMonitoringComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {

    private _props: any;
    selectedMonitoring: FabInfo = new FabInfo();
    @ViewChild("fabMonitoring") fabMonitoring: FabEditorComponent;
    @ViewChild('tree') tree: FabAreaEqpParamTreeComponent;

    eqpId: number;
    param_name: string;
    searchTimePeriod = {
        from: null,
        to: null
    }

    constructor(
        private _pdmSvc: PdmModelService,
        private notify: NotifyService) {
        super();
    }

    ngOnSetup() {
        this.showSpinner();
        this._init();
    }

    ngOnInit() {
        let fromDate = new Date();
        // fromDate.setHours(fromDate.getHours() - 3);
        fromDate.setMinutes(fromDate.getMinutes() - 5);
        this.searchTimePeriod.from = fromDate.getTime();
        this.searchTimePeriod.to = new Date().getTime();
    }

    refresh({ type, data }: WidgetRefreshType) {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === A3_WIDGET.JUST_REFRESH) {
            this.showSpinner();
            this._props = data;
            console.log('Apply config props', this._props);
            this.setConfig();
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }
    }

    setConfig(): void {
        this.selectedMonitoring = this._props.monitoring;
        if (this.selectedMonitoring == null) return;

        setTimeout(() => {
            this.fabMonitoring.initLayout()
        }, 500);
        this.hideSpinner();
    }

    private _init(): void {
        this._props = this.getProperties();
        console.log('init props', this._props);
        this.setConfig();
    }

    ngOnDestroy() {

    }
    fromToChange(data: any) {
        this.searchTimePeriod = data;
    }
    getMonitoringInfo() {
        if (!this.param_name) {
            this.notify.info("PDM.NOTIFY.INFO.NOT_EXIST_PARAMETER");
            return;
        }

        this.showSpinner();
        let fabId = this.tree.selectedFab.fabId;
        // let conditionParamId = this.modelChart.getConditionParamId();


        console.log(`getFabMonitoring Request => [fabId] ${fabId} [timePeriod] ${JSON.stringify(this.searchTimePeriod)} [paramName] ${this.param_name} [eqpId] ${this.eqpId}`);
        this._pdmSvc.getFabMonitoring(fabId, this.searchTimePeriod.from, this.searchTimePeriod.to, this.param_name, this.eqpId)
            .then((datas) => {
                console.log('getFabMonitoring Response => ', datas);
                this.hideSpinner();
                if (datas.length == 0) {
                    this.fabMonitoring.clearLocationAction();
                    return;
                }
                let locationDatas = datas;
                this.fabMonitoring.setLocationActions(locationDatas);
                setTimeout(() => {
                    this.fabMonitoring.setLocationActions(locationDatas);
                });
                setTimeout(() => {
                    this.fabMonitoring.setLocationActions(locationDatas);
                }, 500);
            }).catch((err) => {
                this.hideSpinner();
                this.notify.error("MESSAGE.GENERAL.ERROR");
                // alert(JSON.stringify(err));
            })

        // let locationDatas = this.fabMonitoring.getLocationStatusSimul();
        // this.fabMonitoring.setLocationActions(locationDatas);
        // setTimeout(()=>{
        //     this.fabMonitoring.setLocationActions(locationDatas);
        // });
        // setTimeout(()=>{
        //     this.fabMonitoring.setLocationActions(locationDatas);
        // },500);
    }

    nodeClick(ev) {
        console.log('nodeClick', ev);
        if (ev.length) {
            const paramNode = ev[0];
            if (paramNode.nodeType === 'eqp') { return; }

            this.eqpId = paramNode.eqpId;

            let node = this.tree.getSelectedNodes();
            let param_name = "";
            for (let index = 0; index < node.length; index++) {
                const element = node[index];
                if (element.nodeType == 'parameter') {
                    param_name = element.name;
                    break;
                }
            }

            this.param_name = param_name;
        }
    }
}

