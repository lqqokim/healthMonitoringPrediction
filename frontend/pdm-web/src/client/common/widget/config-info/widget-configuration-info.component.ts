import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { ContextMenuService, InjectorUtil, Translater } from "../../../sdk";

import { ConditionControl } from "../../condition/builder/condition-control";
import { ConditionGroup } from "../../condition/builder/condition-group";

@Component({
    moduleId: module.id,
    selector: 'a3p-widget-configuration-info',
    templateUrl: 'widget-configuration-info.html'
})
export class WidgetConfigurationInfoComponent implements OnInit, OnChanges {

    @Input() configuarationInfo: any;
    displayInfo: string;

    constructor(
        private contextMenu: ContextMenuService, 
        private translater: Translater
    ) {}

    ngOnInit() {}

    ngOnChanges(changes: any) {
        let current = changes['configuarationInfo'].currentValue;
        if (current) {
            this._setDisplayInfo(current);
        }
    }

    private _setDisplayInfo(data: any) {
        let filter = this._filterContextData(data);
        let info = this._parseContents(filter);
        this.displayInfo = info;
    }

    private _filterContextData(data: any, result: any = null): any {
        let ro = result || [];
        for (let key of Object.keys(data)) {
            if (data[key] instanceof ConditionGroup) {
                ro.push(data[key]);
            }
            else if (data[key] instanceof ConditionControl) {
                ro.push(data[key]);
            }
            else if (data[key] instanceof Object) {
                ro = this._filterContextData(data[key], ro);
            }
        }
        return ro;
    }

    private _parseContents(data: any) {
        let ro: any = [];
        for (let item of data) {
            if (item instanceof ConditionGroup) {
                ro.push(this._parseConditionGroup(item))
            } else {
                ro.push(this._formatter(item));
            }
        }
        return ro.join(', ');
    }

    private _parseConditionGroup(cg: ConditionGroup) {
        let map: any = {};
        cg.conditionsMap.forEach((cc: ConditionControl, key: string) => {
            map[cc.name] = this._formatter(cc);
        });
        return cg.formatter.fn(map);
    }

    private _translate(key: string): any {
        return this.translater.instant(key);
    }

    private _formatter(item: any): any {
        if (item.formatter && item.formatter.fn) {
            return item.formatter.fn(item.value, item.formatter.format || null)
        }
        return item.value;
    }

    displayInfoClick(event: any) {
        // let text: string = event.target.textContent;
        // let index: number = text.indexOf('...');
        // if (index > -1) {
        //     this._openTooltip(event);
        // }
        this._openTooltip(event);
    }

    private _openTooltip(event: any) {
        let config: any = {
            type: A3_CONFIG.TOOLTIP.TYPE.PLAIN,
            event: event,
            options: {
                content: this.displayInfo
            }
        };
        this.contextMenu.openTooltip(config);
    }
}
