import { ChangeDetectorRef } from '@angular/core';

import { Translater, InjectorUtil, ContextMenuService, Util } from '../../../../sdk';

import { ContextMenuModel } from '../../../app-state/context-menu/context-menu.type';
import { ConditionControl } from '../../../condition/builder/condition-control';
import { ContextMenuRequester } from '../context-menu-requester';
// import { ContextMenuService } from './context-menu/context-menu.service';

export class ContextMenuWidgetApi {

	config: ContextMenuModel;
	requester: ContextMenuRequester;
	contents: any[];
	internalAction: any;
	translater: Translater;
    contextMenuService: ContextMenuService;
    maxHeight: string;

	constructor(
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.translater = InjectorUtil.getService(Translater);
		this.contextMenuService = InjectorUtil.getService(ContextMenuService);
	}

	setConfig(cm: ContextMenuModel) {
		this.config = cm;
		this.requester = cm.requester;
		this.contents = this._setContents(cm.template.data);
		this.internalAction = cm.template.action || {};
        this.maxHeight = this.contextMenuService.calcContextMaxHeight(this._contextMenuModelToConfig(cm));
		// TODO : 강제로 changeDetected 실행, 로직 검토 필요
		this.manualDetectChanges();
	}

	// setChangeDetector(cd: ChangeDetectorRef) {
	// 	this._changeDetectorRef = cd;
	// }

	translate(key: string): any {
		if (Util.Validate.isEmpty(key) || key === '') {
			return key;
		} else {
			return this.translater.instant(key);
		}
	}

	manualDetectChanges() {
		this.changeDetectorRef.detectChanges();
	}

    private _contextMenuModelToConfig(cm: ContextMenuModel): any {
        return {
            type: cm.tooltip.type,
            requester: cm.requester,
            event: cm.tooltip.event,
            eventType: cm.tooltip.eventType,
            target: cm.tooltip.target,
            options: cm.tooltip.options || {}
        };
    }

	private _setContents(data: any): any {
		let filter: any;
        if (data) {
			if (_.has(data,'indent')) {
				filter = {'indent':[]};
				for (let item of data.indent) {
					filter['indent'].push({
						title: this.translate(item.title),
						groups: this._parseIndentContents(item.groups)
					});
				}
				return filter;
			} else {
				filter = this._filterContextData(data);
				filter = this._parseContents(filter);
				return filter;
			}
        }
        return null;
	}

	private _filterContextData(data: any, result: any = null): any {
		let rv = result || [];
		for (let key of Object.keys(data)) {
			if (data[key] instanceof ConditionControl) {
                rv.push(data[key]);
			} else if (data[key] instanceof Object) {
				rv = this._filterContextData(data[key], rv);
			}
		}
		return rv;
	}

	private _parseContents(data: any) {
		let rv: any = [];
		for (let item of data) {
			rv.push({
				name: this.translate(item.i18n),
				value: this._formatter(item),
                invisibleName: item.invisibleName || false
			});
		}
		return rv;
	}

	private _parseIndentContents(data: any) {
		let rv: any = [];
		for (let item of data) {
			rv.push({
				name: this.translate(item.name),
				value: item.value
			});
		}
		return rv;
	}

	private _formatter(item: any): any {
		if (item.formatter && item.formatter.fn && !item.invisibleName) {
			return item.formatter.fn(item.value, item.formatter.format || null);
		}
		return item.value;
	}

}
