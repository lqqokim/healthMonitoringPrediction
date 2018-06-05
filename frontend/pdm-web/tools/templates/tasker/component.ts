import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TaskerApi, TaskerRefreshType, OnSetup } from '../../../common';
import { NotifyService, Util } from '../../../sdk';
import { #NAME#Service } from './#FILE_NAME#.service';

@Component({
    moduleId: module.id,
    selector: 'div.a3-widget.widget-#FILE_NAME#',
    templateUrl: '#FILE_NAME#.component.html',
    styleUrls: ['#FILE_NAME#.component.css'],
    host: {
        'class': 'height-full'
    },
    encapsulation: ViewEncapsulation.None,
    providers: [#NAME#Service]
})
export class #NAME#Component extends TaskerApi implements OnSetup, OnDestroy {

    constructor(private service: #NAME#Service, private notify: NotifyService) {
        super();
    }

    ngOnSetup() {
        console.log('ngOnSetup');
        
    }

    ngOnDestroy() {
        console.log('ngOnDestroy');
        this.destroy();
    }

    /**
     * Implement abstract refresh method
     */
    // tslint:disable-next-line:no-unused-variable
    refresh({ type, data }: TaskerRefreshType) {
        //  justRefresh, applyConfig, syncInCondition
        if (type === A3_WIDGET.JUST_REFRESH) {
        } else if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
        }
        this._init();
    }

    _init() {
        this.setSearchComponent();
        // this._props = this.getProperties();
        // this._displayConfiguration();
        // this._timePeriodTo = this._props[CD.MANUAL_TIMELINE] ? this._props[CD.MANUAL_TIMELINE] : new Date().getTime();
        // this._timePeriodTo -= this._timePeriodTo % 1000;
        // this.displayedFilter = this._setDisplayedFilterStr(this.filteredItems);
    }

    //조회 selector setup
    private setSearchComponent() {
        this.showSpinner();
        this.service.getChamberTypes()
            .then((response: any) => {
                console.log('test getChamberTypes : ', response);
            }, (error: any) => {
                console.log(error);
                this.hideSpinner();
            });
    }

}
