import { Subject } from 'rxjs/Subject';
import { RequestType } from '../../types/common.type';
import { CommonCondition } from '../../condition/common-condition';
import { ContextMenuType, InternalActionType } from '../../../sdk';
import { ContextMenuModel } from '../../../common';

export class ContextMenuRequester {

    private _outCondition: any;
    private _syncCallback: any;
    private _internalActionData: any;

    constructor(
        private requester: Subject<RequestType>,
        private cm: ContextMenuType
    ) {
        if (this.cm.outCondition) {
            this._outCondition = new CommonCondition(this.cm.outCondition.data, this.cm.outCondition.data.config);
            this._syncCallback = cm.outCondition.syncCallback;
            this._internalActionData = cm.template.action;
        }
	}

    /************************************************************************
     *
     * Widget & Tasker
     *
     ************************************************************************/
    syncCondition() {
        if (this._syncCallback) {
            // call syncCallback in widget.api
            let outCd = this._outCondition.data;
            outCd['config'] = this._outCondition.config;

            this.requester.next({
                type: A3_WIDGET.SYNC_TRANS_CALLBACK_REQUEST,
                data: {
                    callback: this._syncCallback,
                    data: outCd
                }
            });
        } else {
            // direct sync out-condition
            this.requester.next({
                type: A3_WIDGET.SYNC_OUTCONDITION_REQUEST,
                data: this._outCondition
            });
        }
    }

    /**
     * parameter에 data가 있으면 새롭게 데이터를 실어 보내주고, 없으면 뛰울때 위젯으로 부터 받은 데이터를 전달한다.
     */
    internalAction(internalUserData?: any) {
        if (internalUserData) {
            this.requester.next({
                type: A3_WIDGET.INTERNAL_ACTION,
                data: internalUserData
            });
        } else {
            this.requester.next({
                type: A3_WIDGET.INTERNAL_ACTION,
                data: this._internalActionData
            });
        }
    }

    /**
     * appListType is used in lot-rpt-chart.component.ts ex) appListType = 'GANTT'
     */
    showAppList(appListType?: string) {
        if (appListType) {
            this.requester.next({
                type: A3_WIDGET.SHOW_APP_LIST,
                data: {appListType, syncOutCondition: this._outCondition}
            });
        } else {
            this.requester.next({
                type: A3_WIDGET.SHOW_APP_LIST,
                data: {syncOutCondition: this._outCondition}
            });
        }
    }

    /**
     * Detail View
     */
    showDetailView() {
        this.requester.next({
            type: A3_WIDGET.SHOW_DETAIL_VIEW,
            data: {
                callback: this.cm.contextMenuOption.detailViewCallback,
                data: this._outCondition
            }
        });
    }

    addComment() {
        this.requester.next({
            type: A3_WIDGET.ADD_COMMENT
        });
    }

    /************************************************************************
     *
     * Acubed Map
     *
     ************************************************************************/
    deleteWorkspace(data: any) {
        this.requester.next({
            type: A3_CONFIG.TOOLTIP.REQUESTER.DELETE_WORKSPACE,
            data: data
        });
    }

    shareWorkspace(data: any) {
        this.requester.next({
            type: A3_CONFIG.TOOLTIP.REQUESTER.SHARE_WORKSPACE,
            data: data
        });
    }

    goTasker(data: any) {
        this.requester.next({
            type: A3_CONFIG.TOOLTIP.REQUESTER.GO_TASKER,
            data: data
        });
    }

    scheduleTasker(data: any) {
        this.requester.next({
            type: A3_CONFIG.TOOLTIP.REQUESTER.SCHEDULE_TASKER,
            data: data
        });
    }

    deleteTasker(data: any) {
        this.requester.next({
            type: A3_CONFIG.TOOLTIP.REQUESTER.DELETE_TASKER,
            data: data
        });
    }

    /************************************************************************
     *
     * Common
     *
     ************************************************************************/

    destroyContext() {
        this.requester.next({ type: A3_WIDGET.DESTROY_CONTEXT_REQUEST });
    }
}
