//Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef, HostListener, OnInit } from '@angular/core';

//MI import
import { WidgetRefreshType, WidgetApi, ContextMenuTemplateInfo, OnSetup } from '../../../common';
import { Translater, ContextMenuType, SpinnerComponent } from '../../../sdk';

import { FabInfo } from '../../configurations/global/pdm/fabmonitoring/component/fab-editor/fabInfo';
import { FabEditorComponent } from '../../configurations/global/pdm/fabmonitoring/component/fab-editor/fab-editor.component';

// import { FabEditorComponent } from '../../configurations/global/pdm/fabmonitoring/component/fab-editor/fab-editor.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-fab-monitoring',
    templateUrl: './pdm-fab-monitoring.html',
    styleUrls: ['./pdm-fab-monitoring.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmFabMonitoringComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {

    private _props: any;
    selectedMonitoring:FabInfo=new FabInfo();
    @ViewChild("fabMonitoring") fabMonitoring:FabEditorComponent;


    searchTimePeriod = {
        from: null,
        to: null
    }

    constructor() {
        super();
    }

    ngOnSetup() {
        this.showSpinner();
        this._init();
    }

    ngOnInit() {
        let fromDate = new Date();
        fromDate.setHours(fromDate.getHours() - 3);
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
        if(this.selectedMonitoring==null) return;
        
        setTimeout(()=>{
            this.fabMonitoring.initLayout()},500);
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
    getMonitoringInfo(){
        let locationDatas = this.fabMonitoring.getLocationStatusSimul();
        this.fabMonitoring.setLocationActions(locationDatas);
        setTimeout(()=>{
            this.fabMonitoring.setLocationActions(locationDatas);
        });
        setTimeout(()=>{
            this.fabMonitoring.setLocationActions(locationDatas);
        },500);
    }
}

