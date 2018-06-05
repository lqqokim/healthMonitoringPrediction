import { Component, OnInit, OnChanges, OnDestroy, Input, ViewChild, ViewContainerRef, ComponentRef, EventEmitter } from '@angular/core';

import { ConfigurationBuilderService } from './configuration-builder.service';
import { WijmoApi } from "../../common";
import { Subscription } from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'div.a3-configuration-builder',
    template: `<div class="configuration-builder" style="height: 100%;">
        <ng-template #children></ng-template>
    </div>`,
    providers: [ConfigurationBuilderService],
    // host: {
    //     'style': 'height: 100%;width: 100%;'
    // }
})
export class ConfigurationBuilderComponent extends WijmoApi implements OnChanges, OnDestroy {

    @Input() configuration: any;
    @Input() updateAppConfig: EventEmitter<any>;
    @ViewChild('children', { read: ViewContainerRef }) container: ViewContainerRef;
    private _beforeConfigComponent: any;
    private _subscription: Subscription;

    constructor(
        private configBuilder: ConfigurationBuilderService
    ) {
        super();
    }

    ngOnChanges(changes: any) {
        const currentConfiguration = changes['configuration'].currentValue;
        if (currentConfiguration) {
            // console.log('ngOnChanges - propertyName = ', currentConfiguration);
            this._show(currentConfiguration);
        }
    }

    /**
     * When Wijmo Grid is resized, it should be resized.
     */
    ngAfterViewInit() {
        $('.configuration-builder').resize(this.getLazyLayout());
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        if (this.updateAppConfig) {
            this._subscription = this.updateAppConfig.subscribe((cmd: string) => {
                if (cmd === 'close' && this._beforeConfigComponent) {
                    this._beforeConfigComponent.destroy();
                }
            });
        }
    }

    _show(currentConfiguration: any) {
        this._clearConfigPanel();
        // create Appliation configuration
        this.configBuilder
            .createConfiguration(currentConfiguration, this.container)
            .then((component: ComponentRef<any>) => {
                this._beforeConfigComponent = component;
            });
    }

    _clearConfigPanel() {
        if (this._beforeConfigComponent) {
            this._beforeConfigComponent.destroy();
        }
    }

    ngOnDestroy() {
        if (this._beforeConfigComponent) {
            this._beforeConfigComponent.destroy();
        }

        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
