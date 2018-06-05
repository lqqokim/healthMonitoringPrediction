/**
 * Default Configuration
 *
 * Runtime은 assets/config/a3-config-runtime.json 파일을 사용한다.
 * @see assets/config/a3-config-runtime.json
 * by ysyun
 */
export const A3ConfigConstant = {
    TOOLTIP: {
        EVENT: {
            SHOW: 'A3_TOOLTIP_SHOW',
            CLOSE: 'A3_TOOLTIP_CLOSE'
        },
        EVENT_TYPE: {
            CLICK: 'CLICK',
            OVER: 'OVER'
        },
        TYPE: {
            PLAIN: 'PLAIN',
            CHART: 'CHART',
            MENU: 'MENU',
        },
        REQUESTER: {
            DELETE_WORKSPACE: 'DELETE_WORKSPACE',
            SHARE_WORKSPACE: 'SHARE_WORKSPACE',
            GO_TASKER: 'GO_TASKER',
            SCHEDULE_TASKER: 'SCHEDULE_TASKER',
            DELETE_TASKER: 'DELETE_TASKER',
        }
    },
    MODAL: {
        TYPE: {
            SHARE_DASHBOARD: 'SHARE_DASHBOARD',
            SHARE_WORKSPACE: 'SHARE_WORKSPACE'
        }
    },
    DASHBOARD_PATH: 'dashboards'
}

/**
 * assets/config/a3-config-runtime.json 내용을 바꾸면 runtime의 context를 바꿀 수 있다.
 * 단,
 * dev 모드이면 DEV_CONTEXT를 사용하고
 * prod 모드이면 PROD_CONTEXT를 사용한다.
 */
export const getA3ConfigConstant = () => {
    return jQuery.getJSON('<%=A3_CONFIGURATION%>');
}

export const getA3CodeConstant = () => {
    return jQuery.getJSON('<%=A3_CODE%>');
}

export const getMyJSON = () => {
    return jQuery.getJSON('/assets/config/my-config.json');
}
