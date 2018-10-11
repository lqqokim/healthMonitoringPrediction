export const ConditionConstant = {
	TOOL_MODEL_ID: 'toolModelId',
	TOOL_MODEL_IDS: 'toolModelIds',
	TOOL_MODEL: 'toolModel',
	TOOL_MODEL_VERSION: 'toolModelVersion',
	TOOL_ID: 'toolId',
	TOOL_IDS: 'toolIds',
	TOOLS: 'tools',
	TOOL: 'tool',
	ALIAS: 'alias',
	NAME: 'name',
	MODULE: 'module',
	MODULE_ID: 'moduleId',
	MODULE_NAME: 'moduleName',
	MODULE_IDS: 'moduleIds',
	MODULE_GROUP_ID: 'moduleGroupId',
	MODULE_GROUP: 'unitGroup',
	MODULE_TYPE: 'moduleType',
	MODULE_TYPE_ID: 'moduleTypeId',
	MODULE_TYPE_NAME: 'unitType',
	UNIT_NAME: 'unit',
	MODULES: 'modules',
	LOT_ID: 'lotId',
	LOT_IDS: 'lotIds',
	WAFER_ID: 'waferId',
	SUBSTRATE_ID: 'substrateId',
	PPID: 'ppid',
	SYNC_CONTENT: 'syncContent',
	PRODUCTS: 'products',
	OPERATIONS: 'operations',
	OPERATION:  'operation',
	RECIPES: 'recipes',
	RECIPE: 'recipe',
	FROM: 'from',
	TO: 'to',
	START_DTTS: 'startDtts',
	END_DTTS: 'endDtts',
	TAKT_TIME_FROM: 'taktTimeFrom',
	TAKT_TIME_TO: 'taktTimeTo',
	PROC_TIME_FROM: 'procTimeFrom',
	PROC_TIME_TO: 'procTimeTo',
	PROCESS_STATUS: 'processStatus',

	// location
	LOCATION: 'location',
	LOCATION_ID: 'locationId',
	LOCATION_NAME: 'locationName',
	LOCATION_TYPE_NAME: 'locationTypeName',

	// Cluster Group
	CLUSTER_GROUP: 'clusterGroup',

	// from ~ to (uni: long)
	TIME_PERIOD: 'timePeriod',
	TIME_PERIODS: 'timePeriods',

	// not use yet
	PROCESS_NAME: 'processName',
	PROCESS_TYPE: 'processType',

	// Shot View
	SUBSTRATES_PER_MODULE_IDS: 'substratesPerModuleIds',

	// Trace Data View -> Adhoc summary -> pdm
	// Adhoc summary: not use yet
	SUMMARY_TYPES: 'summaryTypes',
	PARAMETERS: 'parameters',

	// PDM
	SUMMARY_PARAMETERS: 'summaryParameters',
	SUMMARY_CATEGORY: 'summaryCategory',

	//TA
	FOCUS: 'focus',
	FOCUS_VALUE: 'devisionLine',

	// INLINE TOOL
	INLINE_TOOL: 'inlineTool',
	INLINE_TOOLS: 'inlineTools',
	INLINE_TOOL_LABEL: 'inlineToolLabel',
	INLINE_TOOL_ID: 'inlineToolId',
	INLINE_TOOL_IDS: 'inlineToolIds',

	//INLINE TOOL NAME
	INLINE_TOOL_NAME: 'Cluster',

	// INLlNE GROUP
	INLINE_GROUP: 'inlineGroup',
	INLINE_GROUPS: 'inlineGroups',
	INLINE_GROUP_ID: 'inlineGroupId',
	INLINE_GROUP_NAME: 'inlineGroupName',

	// Maintanance
	MAINTANANCE_NAME: 'maintananceName',
	TOOL_ALIAS: 'toolAlias',
	TOOL_STATE_TYPE: 'toolStateType',
	TOOL_STATE: 'toolState',
	STATE_IN_DTTS: 'stateInDtts',
	STATE_OUT_DTTS: 'stateOutDtts',
	EVENT_NOTES: 'eventNotes',

	// Throughput
	PERIOD_TYPE: 'period_type',
	THRESHOLD: 'threshold',
	CONTROLTHROUGHPUT: 'controlThroughput',
	REALTHROUGHPUT: 'realThroughput',
	STANDARDTHROUGHPUT: 'standardThroughput',
	THROUGHPUT: 'Throughput',
	TOOLS_INFO: 'toolsInfo',//실제 설비 정보
	WAFERCOUNT: 'WaferCount',
	CLUSTER: 'Cluster',
	CLUSTER_RECIPE: 'ClusterRecipe',

	// Takt Time Report
	GOLDEN_TOOL_ID: 'goldenTool',
	TARGET_TOOLS: 'targetTools',

	// loss Time Report
	TOOL_NAME: 'toolName',
	VALUE: 'value',
	STATUS_NAME: 'statusName',
	STATUS_VALUE: 'statusValue',
	STATUS_RATIO: 'statusRatio',
	LOT: 'lot',
	LOTS: 'lots',
	LOT_START_DTTS: 'startTime',
	LOT_END_DTTS: 'EndTime',
	INLINE_RECIPE: 'inlineRecipe', // ClusterRecipe
	LOST_TIME: 'lostTime',
	CUTOFF_TYPE: 'cutoffType',
	DAY_PERIOD: 'dayPeriod',

	//Lost Category Daily Summarize
	PERCENTAGE: 'percentage',

	// Trend Chart
	WAFER_COUNT: 'selectedWafercount',
	LOT_COUNT: 'selectedLotCount',
	PPIDS: 'ppids',
	TIME: 'Time',
	PROCESS_TIME: 'processTime',
	SUBSTRATE: 'Substrate',
	UCL: 'ucl',
	USL: 'usl',
	RPT: 'rpt',

	//
	LOST_CATEGORY: 'lostCategory',
	LOST_CATEGORY_ID: 'lostCategoryId',
	LOST_CATEGORY_NAME: 'lostCategoryName',

	//bottleneck block chart
	OOS_COUNT: 'oosCount',
	OOC_COUNT: 'oocCount',
	WAFER_TAKT_TIME_AVERAGE: 'average',
	WAFER_TAKT_TIME_MIN: 'min',
	WAFER_TAKT_TIME_MAX: 'max',
	WAFER_TAKT_TIME_STDEV: 'stdev',

	//sync param
	CLUSTER_GROUP_PERFORMANCE_TREND_PARAM: 'cluster_group_performance_trend_param',
	CLUSTER_GROUP_PERFORMANCE_INDEX_PARAM: 'cluster_group_performance_index_param',
	RECIPE_TREND_PARAM: 'recipe_trend_param',
	RPT_REPORT_PARAM: 'rpt_report_param',
	RPT_TREND_PARAM: 'rpt_trend_param',
	LOST_TIME_PARAM: 'lost_time_param',
	LOST_CATEGORY_SUMMARY_PARAM: 'lost_category_summary_param',
	LOST_RATE_CATEGORY_PARAM: 'lost_rate_category_param',

	RESULT: 'result',
	DATA_SET: 'dataSet',
	COLUMNS: 'columns',
	ROWS: 'rows',

	//Lot RPT Chart
	MODEL_RPT: 'modelRpt',
	STANDARD_TIME: 'standardTime',

	//Non-Scanner Bottleneck Report
	IS_NON_SCANNER_BOTTLENECK: 'isNonScannerBottleneck',
	SUBSTRATES: 'substrates',

	//FDTA Item code
	FAULT: 'fault',
	OOC: 'ooc',
	OCAP: 'ocap',
	FDTA_LOT: 'fdtaLot',
	FDTA_WAFER: 'fdtaWafer',
	FDTA_WAFER_RELIABLE: 'fdtaWaferReliable',
	FDTA_WAFER_UNRELIABLE: 'fdtaWaferUnreliable',
	FDTA_LOT_SCORE: 'fdtaLotScore',
    FDTA_WAFER_SCORE: 'fdtaWaferScore',
    RELIABLE: 'reliable',

	//FDTA
	FAULT_COUNT: 'alarmCount',
	SCORE: 'score',
	PARAMETER_COUNT: 'selectedParameterCount',

	PARAMETER_CATEGORY: 'parameterCategory',

	// FDTA COUNT
	FDTA_COUNTS: 'fdtaCounts',
	FDC_OOS_COUNT: 'fdcOosCount',
	SPC_OOC_COUNT: 'spcOocCount',
	SPC_OCAP_COUNT: 'spcOcapCount',
	FDTA_L_OOS_COUNT: 'fdtaLOosCount',
	FDTA_W_OOS_COUNT: 'fdtaWOosCount',

	CATEGORY: 'category',

	EXCLUDE_PARAMETERS: 'excludeParameters',

	COMMUNICATION: 'communication',
	SPEC: 'spec',

	// RPT Trend
	TOOL_TYPE: 'toolType',		//TRACK or SCANNER

	REFERENCE_THRESHOLD: 'referenceThreshold',
	COUNT_TYPE: 'countType',

	// Form
	MANUAL_TIMELINE: 'manualTimeline',
	DATE_TYPE: 'dateType',

	// PDM
	PLANT: 'plant',
	// PLANT_ID: 'plantId',
	// PLANT_NAME: 'plantName',
	PLANT_ID: 'fabId',
	PLANT_NAME: 'fabName',
	AREA: 'area',
	AREA_ID: 'areaId',
	AREA_NAME: 'areaName',
	AREA_PATH_NAME: 'areaPathName',
	EQP: 'eqp',
	EQP_ID: 'eqpId',
	EQP_NAME: 'eqpName',
	PARAM: 'param',
	PARAM_ID: 'paramId',
	PARAM_NAME: 'paramName',
	MULTI_VARIANT: 'multiVariant',
	VARIANT: 'variant',
	RADAR_TYPE: 'type',
	RADAR_TYPE_ID: 'typeId',
	RADAR_TYPE_NAME: 'typeName',
	ANALYSIS_SPEC: 'analysisSpec',
	ANALYSIS_SPEC_VISIBLE: 'analysisSpecVisible',
	WORST_TOP: 'worstTop',
	MONITORING: 'monitoring',
	MONITORING_ID: 'rawId',
	MONITORING_NAME: 'name',
	MAX_PARAM_COUNT: 'maxParamCount',
	SPECTRUM_COUNT: 'spectrumCount',
	JEOPARDY_THRESHOLD: 'jeopardyThreshold',
	GOOD_THRESHOLD: 'goodThreshold', 
	

	TIME_PERIOD_30: 'timePeriod30',
	CUTOFF_TYPE_DAY: 'cutoffTypeDay',
	DAY_PERIOD_30: 'dayPeriod30',

	STEP_DRIFT: 'stepDrift',
	STEP_DOWN_TREND: 'stepDownTrend',
	STEP_POSITIVE_MAXEND: 'stepPositiveMaxEnd',
	STEP_NEGATIVE_MAX: 'stepNegativeMax',
	STEP_MEAN: 'stepMean',
	STEP_UPTREND: 'stepUpTrend',
	STEP_MAX: 'stepMax',
	STEP_SLOPE: 'stepSlope',
	STEP_RANGE: 'stepRange',
	STEP_COUNT: 'stepCount',
	STEP_POSITIVE_SUM: 'stepPositiveSum',
	STEP_NEGATIVE_MAXEND: 'stepNegativeMaxEnd',
	STEP_MIN: 'stepMin',
	STEP_MEDIAN: 'stepMedian',
	STEP_DURATION: 'stepDuration',
	STEP_POSITIVE_MAXSTART: 'stepPositiveMaxStart',
	STEP_START_INDEX: 'stepStartIndex',
	STEP_START_TIME: 'stepStartTime',
	STEP_L1_NORM: 'stepL1Norm',
	STEP_STDEV: 'stepSTDEV',
	STEP_POSITIVE_MAX: 'stepPositiveMax',
	STEP_NEGATIVE_MAXSTART: 'stepNegativeMaxStart',
	STEP_NEGATIVE_SUM: 'stepNegativeSum',
	STEP_INDEX_MAX: 'stepIndexMax',
	STEP_END_INDEX: 'stepEndIndex',
	STEP_END_TIME: 'stepEndTime',
	STEP_INDEX_MIN: 'stepIndexMin',

	REFERENCE_COUNT: 'referenceCount'
};
