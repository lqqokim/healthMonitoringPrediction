interface IWIDGET {
	JUST_REFRESH: string;
    SHOW_PROPERTIES: string;
    CLOSE_PROPERTIES: string;
    APPLY_CONFIG_REFRESH: string;
    SYNC_INCONDITION_REFRESH: string;

    LINK_INCONDITION_REFRESH: string;

    ADD_COMMENT: string,
    SHOW_APP_LIST: string,
    SHOW_DETAIL_VIEW: string,
    SYNC_OUTCONDITION_REQUEST: string;
    SYNC_TRANS_CALLBACK_REQUEST: string;
    DESTROY_CONTEXT_REQUEST: string;
    CONTEXT_TICK_CLICK: string;

    INTERNAL_ACTION: string;

    TOOGLE_SLIDING_SETUP: string;

    UPDATE_WIDGET: string;
    REMOVE_WIDGET: string;
}

declare var A3_WIDGET: IWIDGET;
