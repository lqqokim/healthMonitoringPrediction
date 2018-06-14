interface ILABEL {
	MIN: string;
	MAX: string;
	MEDIAN: string;
	QUANTILE1: string;
	QUANTILE3: string;
	VALUE: string;
	DATE: string;
	RPT: string;
	USL: string;
	UCL: string;
	LSL: string;
	LCL: string;
	MODEL_RPT: string;
	MODULE_TYPE_NAME: string;
	TOOL: string;
	BOTTLENECK_CAUSE: string;
	LOST_TIME: string;
	FROM: string;
	TO: string;
	LOT_COUNT: string;
	CLUSTER: string;
	PPID: string;
	LOT: string;
	TIME_PERIOD: string;
	LOST_CATEGORY_NAME: string;
	WAFERCOUNT: string;
	MODULE: string;
	INLINE_GROUP_NAME: string;
	INLINE_GROUP: string;
	NAME: string;
	WAFER: string;
	YAXIS: string;
	XAXIS: string;
	STDEV: string;
	AVERAGE: string;
	UNIT: string;
	UNITGROUP: string;
	STEP: string;
	COUNTANDTOTAL: string;
	ADDER_WAFERCOUNT: string;
	CARRYOVER_WAFERCOUNT: string;
	SELECTED_DATE: string;
	PERCENTAGE: string;
	COMMUNICATION: string;
	LOCATIONS: string;
	TOOLS: string;
	TOOL_MODEL: string;
	EXCLUDE_PARAMETERS: string;
	RECIPE: string;
	DATETIME: string;
	TIME_SLOT: string;
	SEQUENCE: string;
	SCORE: string;
	WAFER_SCORE: string;
    STEP_SCORE: string;
	PARAMETER: string;
	SVID: string;
	FAULTCOUNT: string;
	RECIPECOUNT: string;
	RECIPESTEP: string;
	FAULT_STATUS: string;
	SUBSTRATE: string;
	START_DTTS: string;
	END_DTTS: string;
	SELECTED_WAFERCOUNT: string;
	OPERATION: string;
	PRODUCT: string;
	RSD05: string;
	RSD06: string;
	CASSETTE_SLOT: string;
	TIME: string;
	TAKTTIMEFROM: string;
	TAKTTIMETO: string;
	PROCTIMEFROM: string;
	PROCTIMETO: string;
	PROCESSSTATUS: string;
	GOOD_WAFERCOUNT: string;
	JEOPARDY_WAFERCOUNT: string;
	BAD_WAFERCOUNT: string;
	TARGET_VALUE: string;
	EQUATION: string;
	AUTO_REFRESH: string;
	MANUAL_TIMELINE: string;
	ALIAS: string;
	COUNT: string;
	FDTA_WAFER_RELIABLE: string;
	ALARM_OCCURDTTS: string;
	ALARM_CLEARDTTS: string;
	TOOL_ALIAS : string;
	ALARM_CODE : string;
	ALARM_TEXT : string;
	STATUS: string;
	SPEC_THRESHOLD: string;
	CONTROL_THRESHOLD: string;
	START_SEQUENCE: string;
	END_SEQUENCE: string;
	START_TIME_SLOT: string;
	END_TIME_SLOT: string;

	PLANT: string;
	PLANT_NAME: string;
	AREA: string;
	AREA_NAME: string;
	EQP: string;
	EQP_NAME: string;
	PARAM: string;
	PARAM_NAME: string;
	HEALTH_INDEX: string;
	RADAR_TYPE: string;
	ANALYSIS_SPEC: string;
	ANALYSIS_SPEC_VISIBLE: string;
	WORST_TOP: string;
	MONITORING: string;
	MONITORING_NAME: string;	

	STEP_DRIFT: string;
	STEP_DOWN_TREND: string;
	STEP_POSITIVE_MAXEND: string;
	STEP_NEGATIVE_MAX: string;
	STEP_MEAN: string;
	STEP_UPTREND: string;
	STEP_MAX: string;
	STEP_SLOPE: string;
	STEP_RANGE: string;
	STEP_COUNT: string;
	STEP_POSITIVE_SUM: string;
	STEP_NEGATIVE_MAXEND: string;
	STEP_MIN: string;
	STEP_MEDIAN: string;
	STEP_DURATION: string;
	STEP_POSITIVE_MAXSTART: string;
	STEP_START_INDEX: string;
	STEP_START_TIME: string;
	STEP_L1_NORM: string;
	STEP_STDEV: string;
	STEP_POSITIVE_MAX: string;
	STEP_NEGATIVE_MAXSTART: string;
	STEP_NEGATIVE_SUM: string;
	STEP_INDEX_MAX: string;
	STEP_END_INDEX: string;
	STEP_END_TIME: string;
	STEP_INDEX_MIN: string;

	REFERENCE_COUNT: string;
}

declare var LB: ILABEL;