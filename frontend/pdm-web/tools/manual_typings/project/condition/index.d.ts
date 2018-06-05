interface ICONDITION {
	TOOL_MODEL_ID: string;
	TOOL_MODEL_IDS: string;
	TOOL_MODEL: string;
	TOOL_MODEL_VERSION: string;
	TOOL_ID: string;
	TOOL_IDS: string;
	TOOLS: string;
	TOOL: string;
	ALIAS: string;
	NAME: string;
	MODULE: string;
	MODULE_ID: string;
	MODULE_NAME: string;
	MODULE_IDS: string;
	MODULE_GROUP_ID: string;
	MODULE_GROUP: string;
	MODULE_TYPE: string;
	MODULE_TYPE_ID: string;
	MODULE_TYPE_NAME: string;
	UNIT_NAME: string;
	MODULES: string;
	LOT_ID: string;
	LOT_IDS: string;
	WAFER_ID: string;
	SUBSTRATE_ID: string;
	PPID: string;
	SYNC_CONTENT: string;
	PRODUCTS: string;
	OPERATIONS: string;
	OPERATION: string,
	RECIPES: string;
	RECIPE: string;
	FROM: string;
	TO: string;
	START_DTTS: string;
	END_DTTS: string;
	TAKT_TIME_FROM: string;
	TAKT_TIME_TO: string;
	PROC_TIME_FROM: string;
	PROC_TIME_TO: string;
	PROCESS_STATUS: string;

	// location
	LOCATION: string,
	LOCATION_ID: string,
	LOCATION_NAME: string,
	LOCATION_TYPE_NAME: string,

	// Cluster Group
	CLUSTER_GROUP: string;

	// from ~ to (unit: long)
	TIME_PERIOD: string;
	TIME_PERIODS: string;

	// not use yet
	PROCESS_NAME: string;
	PROCESS_TYPE: string;

	// Shot View
	SUBSTRATES_PER_MODULE_IDS: string;

	// Trace Data View -> Adhoc summary -> pdm
	// Adhoc summary: string;
	SUMMARY_TYPES: string;
	PARAMETERS: string;

	// PDM
	SUMMARY_PARAMETERS: string;
	SUMMARY_CATEGORY: string;

	//TA
	FOCUS: string;
	FOCUS_VALUE: string;

	// INLINE TOOL
	INLINE_TOOL: string;
	INLINE_TOOLS: string;
	INLINE_TOOL_LABEL: string;
	INLINE_TOOL_ID: string;
	INLINE_TOOL_IDS: string;

	//INLINE TOOL NAME
	INLINE_TOOL_NAME: string;

	// INLlNE GROUP
	INLINE_GROUP: string;
	INLINE_GROUPS: string;
	INLINE_GROUP_ID: string;
	INLINE_GROUP_NAME: string;

	// Maintanance
	MAINTANANCE_NAME: string;
	TOOL_ALIAS: string;
	TOOL_STATE_TYPE: string;
	TOOL_STATE: string;
	STATE_IN_DTTS: string;
	STATE_OUT_DTTS: string;
	EVENT_NOTES: string;

	// Throughput
	PERIOD_TYPE: string;
	THRESHOLD: string;
	CONTROLTHROUGHPUT: string;
	REALTHROUGHPUT: string;
	STANDARDTHROUGHPUT: string;
	THROUGHPUT: string;
	TOOLS_INFO: string;
	WAFERCOUNT: string;
	CLUSTER: string;
	CLUSTER_RECIPE: string;

	// Takt Time Report
	GOLDEN_TOOL_ID: string;
	TARGET_TOOLS: string;

	// loss Time Report
	TOOL_NAME: string;
	VALUE: string;
	STATUS_NAME: string;
	STATUS_VALUE: string;
	STATUS_RATIO: string;
	LOT: string;
	LOTS: string;
	LOT_START_DTTS: string;
	LOT_END_DTTS: string;
	INLINE_RECIPE: string;
	LOST_TIME: string;
	CUTOFF_TYPE: string;
	DAY_PERIOD: string;

	//Lost Category Daily Summarize
	PERCENTAGE: string;

	// Trend Chart
	WAFER_COUNT: string;
	LOT_COUNT: string;
	PPIDS: string;
	TIME: string;
	PROCESS_TIME: string;
	SUBSTRATE: string;
	UCL: string;
	USL: string;
	RPT: string;

	//
	LOST_CATEGORY: string;
	LOST_CATEGORY_ID: string;
	LOST_CATEGORY_NAME: string;

	//bottleneck block chart
	OOS_COUNT: string;
	OOC_COUNT: string;
	WAFER_TAKT_TIME_AVERAGE: string;
	WAFER_TAKT_TIME_MIN: string;
	WAFER_TAKT_TIME_MAX: string;
	WAFER_TAKT_TIME_STDEV: string;

	//sync param
	CLUSTER_GROUP_PERFORMANCE_TREND_PARAM: string;
	CLUSTER_GROUP_PERFORMANCE_INDEX_PARAM: string;
	RECIPE_TREND_PARAM: string;
	RPT_REPORT_PARAM: string;
	RPT_TREND_PARAM: string;
	LOST_TIME_PARAM: string;
	LOST_CATEGORY_SUMMARY_PARAM: string;
	LOST_RATE_CATEGORY_PARAM: string;

	RESULT: string;
	DATA_SET: string;
	COLUMNS: string;
	ROWS: string;

	//Lot RPT Chart
	MODEL_RPT: string;
	STANDARD_TIME: string;

	//Non-Scanner Bottleneck Report
	IS_NON_SCANNER_BOTTLENECK: string;
	SUBSTRATES: string;

	//FDTA Item code
	FAULT: string;
	OOC: string;
	OCAP: string;
	FDTA_LOT: string;
	FDTA_WAFER: string;
	FDTA_WAFER_RELIABLE: string;
	FDTA_WAFER_UNRELIABLE: string;
	FDTA_LOT_SCORE: string;
	FDTA_WAFER_SCORE: string;
    FDTA_WAFER_COUNT: string;
    RELIABLE: string;

	//FDTA
	FAULT_COUNT: string;
	SCORE: string;
    PARAMETER_COUNT: string;
    PARAMETER_CATEGORY: string;

	// FDTA COUNT
	FDTA_COUNTS: string;
	FDC_OOS_COUNT: string;
	SPC_OOC_COUNT: string;
	SPC_OCAP_COUNT: string;
	FDTA_L_OOS_COUNT: string;
	FDTA_W_OOS_COUNT: string;

	EXCLUDE_PARAMETERS: string;
	CATEGORY: string;

	// COMMUNICATION
	COMMUNICATION: string;
	SPEC: string;

	// RPT Trend
	TOOL_TYPE : string;

	REFERENCE_THRESHOLD : string;
	COUNT_TYPE : string;

	// FORM
	MANUAL_TIMELINE: string;
	DATE_TYPE: string;

	// PDM
	PLANT: string;
	PLANT_ID: string;
	PLANT_NAME: string;
	AREA: string;
	AREA_ID: string;
	AREA_NAME: string;
	AREA_PATH_NAME: string;
	EQP: string;
	EQP_ID: string;
	EQP_NAME: string;
	PARAM: string;
	PARAM_ID: string;
	PARAM_NAME: string;
	MULTI_VARIANT: string;
	VARIANT: string;
	RADAR_TYPE: string;
	RADAR_TYPE_ID: string;
	RADAR_TYPE_NAME: string;
	ANALYSIS_SPEC: string;
	ANALYSIS_SPEC_VISIBLE: string;
	WORST_TOP: string;

	TIME_PERIOD_30: string;
	CUTOFF_TYPE_DAY: string;
	DAY_PERIOD_30: string;
}

declare var CD: ICONDITION;
