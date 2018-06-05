interface ITASKER {
	JUST_REFRESH: string;
    APPLY_CONFIG_REFRESH: string;
    SYNC_INCONDITION_REFRESH: string;

    ADD_COMMENT: string,
    SHOW_APP_LIST: string,
    SHOW_DETAIL_VIEW: string,
    SYNC_OUTCONDITION_REQUEST: string;
    SYNC_TRANS_CALLBACK_REQUEST: string;
    CONTEXT_TICK_CLICK: string;

    INTERNAL_ACTION: string;

    TOOGLE_SLIDING_SETUP: string;

    UPDATE_TASKER: string;
    REMOVE_TASKER: string;
}

declare var A3_TASKER: ITASKER;
