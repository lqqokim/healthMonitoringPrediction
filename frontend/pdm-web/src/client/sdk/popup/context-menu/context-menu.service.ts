import { Injectable } from "@angular/core";
import { ContextMenuSupport } from "./context-menu.support";
import { Util } from "../../utils/utils.module";

@Injectable()
export class ContextMenuService extends ContextMenuSupport {

    private _context: any;
    private _tooltip: any;

	openContextMenu(config: any) {
        if (this._context) {
            this._context.destroy(true);
        }
	    this.initConfig(config);
        this._context = this._getApi(config);
        return this._context;
	}

    openTooltip(config: any) {
        if (this._tooltip) {
            this._tooltip.destroy(true);
        }
        this.initConfig(config);
        this._tooltip = this._getApi(config);
        setInterval(() => {this._tooltip.show();}, 100);

        return this._tooltip;
    }

    closeTooltip() {
        if (this._tooltip) {
            this._tooltip.destroy(true);
        }
    }

    private _getApi(config: any): any {
        let option = this._makeOption();
        let target = Util.Context.getTarget(config);
        let element = target.qtip(option);
        let api = $(element).qtip('api');
        return api;
    }

	private _makeOption() {
		let option = this.getOption();
		if (this.config.options) {
			option = Util.Data.mergeDeep(option, this.config.options);
		}
		// console.log('ContextMenuService _makeOption', option);
		return option;
	}
}
