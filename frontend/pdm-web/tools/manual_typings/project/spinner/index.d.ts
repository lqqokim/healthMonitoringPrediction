interface ISPINNER {
	INIT: string;
	CHART_INIT: string;
	DATA: string;
	NODATA: string;
	NODATA_TRANSPARENT: string;
	ERROR: string;
	PROGRESSBAR: string;
	NONE: string;
	BGCOLOR_DARK: string;
	NOWORKSPACE: string;
	NOACUBEDNET: string;
	NONOTIFICATION: string;
    TYPE: {
        WIDGET: string,
        TASKER: string,
        COMPONENT: string,
        SIDE_BAR: string,
        ACUBED_NET: string,
        ACUBED_MAP: string
    }
}

declare var SPINNER: ISPINNER;
