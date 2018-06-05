import { Subscription } from 'rxjs/Subscription';
import { RequestOptions, Headers } from '@angular/http';
import { Component, OnDestroy, ViewEncapsulation, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewInit, ContentChildren } from '@angular/core';
import { ModalAction, ModalApplier, ModalRequester, WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';
import { NotifyService, Util } from '../../../sdk';

import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'div.a3-widget.widget-pdm-test',
    templateUrl: './pdm-test.html',
    styleUrls: ['./pdm-test.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmTestComponent extends WidgetApi implements OnSetup, OnDestroy {

    private _subscription: Subscription;

    constructor(
        private notify: NotifyService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
        private applier: ModalApplier
    ) {
        super();
    }

    ngOnSetup() {
        this.hideSpinner();
        this.disableConfigurationBtn(true);
    }

    refresh({ type, data }: WidgetRefreshType) {

    }

    ngOnDestroy() {
        this.destroy();
    }
}

