import { ContextMenuRequester } from '../../../common/popup/context-menu/context-menu-requester';
import { ContextMenuModel } from '../../../common/app-state/context-menu/context-menu.type';
export class ContextMenuSupport {

    private CONTEXT_WIDTH: number = 272; // context width(250px) + tip(2px) + padding(20px);
    private CONTEXT_HEIGHT: number = 384; // context height(320px) + button box(64px);
    private CONTEXT_MIN_HEIGHT: number = 170; // 컨텐츠 없을경우 최소 사이즈(144px) + padding(16px) + arrow(10px);
    private CONTEXT_GAP: number = 5;
    private _config: any;

    get config(): any {
        return this._config;
    }

    initConfig(config: any) {
        this._config = config;
    }

    getOption(): any {
        switch (this._config.type) {
            case A3_CONFIG.TOOLTIP.TYPE.PLAIN: return Object.assign({}, this._getPlainOption());
            case A3_CONFIG.TOOLTIP.TYPE.CHART: return Object.assign({}, this._getChartOption());
            case A3_CONFIG.TOOLTIP.TYPE.MENU: return Object.assign({}, this._getMenuOption());
            default: return {};
        }
    }

    private _getPlainOption(): any {
        return {
            overwrite: false,
            position: this._getPositions(),
            style: {
                classes: 'a3-tooltip'
            },
            content: '',
            events: {
                hide: function (event: any, api: any) {
                    api.destroy();
                }
            }
        }
    }

    private _getChartOption(): any {
        let requester: ContextMenuRequester = this._config.requester;
        return {
            overwrite: true,
            position: this._getPositions(),
            style: {
                classes: 'a3p-popover-drilldown-menu'
            },
            content: '',
            events: {
                hide: function (event: any, api: any) {
                    if (requester) requester.destroyContext();
                    api.destroy(true);
                }
            }
        };
    }

    private _getMenuOption(): any {
        return {
            overwrite: true,
            position: this._getPositions(),
            style: {
                classes: 'a3p-popover-drilldown-menu'
            },
            content: '',
            events: {
                hide: function (event: any, api: any) {
                    api.destroy(true);
                }
            }
        };
    }

    calcContextMaxHeight(config: any): string {
        this.initConfig(config);
        let maxHeight: number = this._getMaxHeight();
        return maxHeight + "px";
    }

    private _getMaxHeight(): number {
        let height: number;
        let rect = $("[a3p-portal]")[0];
        let rect_w = rect.clientWidth;
        let rect_h = rect.clientHeight;
        let event = this._config.event || null;
        let position = this._getEventXY(event);
        let y = position[1];
        let at = this._getMyAt().at;
        let e_h = this._elementHeight(rect_h);
        let min: number = event.type == 'click' ? this.CONTEXT_MIN_HEIGHT + 50 : this.CONTEXT_MIN_HEIGHT;

        height = event.type == 'click' ? e_h - this.CONTEXT_MIN_HEIGHT - 50 : e_h - this.CONTEXT_MIN_HEIGHT;

        // if (at && at.indexOf('top') > -1) height = y - min;
        // else if (at && at.indexOf('center') > -1) height = rect_h - Math.abs((rect_h / 2) - y) - min;
        // else if (at && at.indexOf('bottom') > -1) height = rect_h - y - min;

        return height;
    }

    private _getPositions(): any {
        let event = this._config.event || null;
        let myat = this._getMyAt();
        let target = this._getEventXY(event);
        return {
            my: myat.my,
            at: myat.at,
            target: this._calcTargetPadding(target, myat.at),
            container: $("[a3p-portal]")
        }
    }

    private _calcTargetPadding(target: any, at: string) {
        let event = this._config.event || {};
        let x: number = target[0];
        let y: number = target[1];
        let gap: number = event.type == 'click' ? this.CONTEXT_GAP : 0;
        // // x
        // if (at && at.indexOf('left') > -1) x -= gap;
        // else if (at && at.indexOf('right') > -1) x += gap;
        // // y
        // if (at && at.indexOf('top') > -1) y -= gap;
        // else if (at && at.indexOf('bottom') > -1) y += gap;
        //
        return [x, y];
    }

    private _getEventXY(event: any): any {
        // TODO : event type check 로직 변경, jqeury event 체크를 위해 pageX가 존재 하는지 여부로 판단하고 있음
        if (event) {
            if (!isNaN(Number(event.pageX))) {
                return [event.pageX, event.pageY];
            }
            // javascript event
            else if (!isNaN(Number(event.clientX))) { //event.hasOwnProperty('clientX'))
                return [event.clientX + 1, event.clientY - 1];
            }
        }
        return {};
    }

    private _getMyAt(): any {
        // return this._getMyAtByTarget();
        return this._config.target ? this._getMyAtByTarget() : this._getMyAtByEvent();
    }

    private _getMyAtByTarget(): any {
        let rv = {};
        let targetRect = this._config.target.getBoundingClientRect();
        let x = targetRect.right - (targetRect.width / 2)
        let y = targetRect.top - (targetRect.height / 2);
        let element = this._config.element;
        let e_w = this.CONTEXT_WIDTH; //300; //element.clientWidth;
        let e_h = this.CONTEXT_HEIGHT; //300; //element.clientHeight;
        let rect = $("[a3p-portal]")[0];
        let rect_w = rect.clientWidth;
        let rect_h = rect.clientHeight;
        let position = this._getDefaultPosition();

        if (x > (rect_w - e_w)) {
            rv = position.right;
        }
        else {
            rv = position.left;
        }

        return rv;
    }

    private _getMyAtByEvent(): any {
        let rv = {};
        let rect = $("[a3p-portal]")[0];
        let rect_w = rect.clientWidth;
        let rect_h = rect.clientHeight;
        let event = this._config.event || {};
        let x = event.pageX ? event.pageX : event.clientX;
        let y = event.pageY ? event.pageY : event.clientY;
        let e_w = this.CONTEXT_WIDTH; //300; //element.clientWidth;
        let e_h = this._elementHeight(rect_h) + this.CONTEXT_MIN_HEIGHT; //this.CONTEXT_HEIGHT; //300; //element.clientHeight;
        let position = this._getDefaultPosition();
        let yPosition = this._yPosition(rect_h, y);

        // if (x > (rect_w - e_w)) {
        //     if (y < (e_h / 2)) rv = position.right_top;
        //     else if (y > (rect_h - (e_h / 2))) rv = position.right_bottom;
        //     else rv = position.right;
        // }
        // else {
        //     if (y < (e_h / 2)) rv = position.left_top;
        //     else if (y > (rect_h - (e_h / 2))) rv = position.left_bottom;
        //     else rv = position.left;
        // }

        if (x > (rect_w - e_w)) {
            if (yPosition == 'top') rv = position.right_top;
            else if (yPosition == 'bottom') rv = position.right_bottom;
            else rv = position.right;
        }
        else {
            if (yPosition == 'top') rv = position.left_top;
            else if (yPosition == 'bottom') rv = position.left_bottom;
            else rv = position.left;
        }

        return rv;
    }

    private _elementHeight(rect_h: number): number {
        // let one: number = rect_h / 3;
        // let half: number = rect_h / 2;
        // let height: number = one * 2;
        // let gap: number = 20;
        // if (one > y) {
        //     // button
        //     height = height + (y / 2) - gap;
        // } else if (one * 2 < y) {
        //     // top
        // } else {
        //     // center
        //     height = height + (y / 2) - gap;
        // }
        // return one * 2;
        return rect_h / 3 * 2;
    }

    private _yPosition(rect_h: number, y: number) {
        let one: number = rect_h / 3;
        let gap: number = 20;
        let position: string;

        if (one > y) position = 'top';
        else if (one * 2 < y) position = 'bottom';
        else position = 'center';

        return position;
    }

    private _getDefaultPosition(): any {
        // tip의 위치를 기준으로 정의
        return {
            left_top: {my: 'top left', at: 'bottom right', x: 0, y: 0},
            left: {my: 'center left', at: 'center right', x: 0, y: 0},
            left_bottom: {my: 'bottom left', at: 'top right', x: 0, y: 0},
            right_top: {my: 'top right', at: 'bottom left', x: 0, y: 0},
            right: {my: 'center right', at: 'center left', x: 0, y: 0},
            right_bottom: {my: 'bottom right', at: 'top left', x: 0, y: 0}
        };
    }
}
