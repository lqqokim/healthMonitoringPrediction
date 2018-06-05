interface IA3_CONFIG {
	INFO: {
		TITLE: string,
		GNB_LOGO: string,
		LOGIN_LOGO: string
	};

	DEV: {
		API_CONTEXT: string,
		APP_BASE: string
	};

	PROD: {
		API_CONTEXT: string,
		APP_BASE: string
	};

	WEBSOCKET: {
		URL: string
	};

	PDM: {
		URL: string
	};

	DFD: {
        FDC : string,
        SPC : string
	};	

	TOOLTIP: {
		EVENT: {
			SHOW: string,
			CLOSE: string
		},
		EVENT_TYPE: {
			CLICK: string,
			OVER: string
		},
		TYPE: {
			PLAIN: string,
			CHART: string,
			MENU: string
		},
		REQUESTER: {
			DELETE_WORKSPACE: string,
			SHARE_WORKSPACE: string,
			GO_TASKER: string,
			SCHEDULE_TASKER: string,
			DELETE_TASKER: string
		}
	};

	MODAL: {
		TYPE: {
			SHARE_DASHBOARD: string,
			SHARE_WORKSPACE: string
		}
	};

	DASHBOARD_PATH: string;

}

interface IA3_CODE {
	WIDGET: {
		AUTO_REFRESH_TIME: any,
        TIME_LINE: {
            NOW: string,
            MANUAL: string
        }
	};

	DFD: {
		PERIOD_TYPE: any[],
		CATEGORY: any[],
		RELIABLE: any[],
		COUNT_TYPE: any[],
		COUNT_TYPE_AXIS: any[],
		PARAMETER_NONE_PRIORITY: any
	};
}

declare var A3_CONFIG: IA3_CONFIG;
declare var A3_CODE: IA3_CODE;
