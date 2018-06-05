import { ConditionType, ConditionValueType } from '../condition.type';
import { labelCompose } from '../util/condition-dic.util';
import { Formatter } from '../../../sdk/formatter/formatter.module';

export class LabelConditionDic {

	static min(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.MIN,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.000' },
				i18n: 'DATA_LABEL.MIN'
			},
			newCondition);
	}

	static max(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.MAX,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.000' },
				i18n: 'DATA_LABEL.MAX'
			},
			newCondition);
	}

	static median(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.MEDIAN,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.000' },
				i18n: 'DATA_LABEL.MEDIAN'
			},
			newCondition);
	}

	static quantile1(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.QUANTILE1,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.000' },
				i18n: 'DATA_LABEL.QUANTILE1'
			},
			newCondition);
	}

	static quantile3(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.QUANTILE3,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.000' },
				i18n: 'DATA_LABEL.QUANTILE3'
			},
			newCondition);
	}

	static value(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.VALUE,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.VALUE'
			},
			newCondition);
	}

	static targetvalue(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TARGET_VALUE,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.TARGET'
			},
			newCondition);
	}

	static date(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.DATE,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD' },
				i18n: 'Date'
			},
			newCondition);
	}

	static rpt(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.RPT,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.RPT'
			},
			newCondition);
	}

	static usl(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.USL,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.USL'
			},
			newCondition);
	}

	static ucl(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.UCL,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.UCL'
			},
			newCondition);
	}

	static lcl(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.LCL,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.LCL'
			},
			newCondition);
	}

	static lsl(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.LSL,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.LSL'
			},
			newCondition);
	}

	static model_rpt(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.MODEL_RPT,
			{
				formatter: { fn: Formatter.Number.format, format: '0,0.0' },
				i18n: 'DATA_LABEL.MODEL_RPT'
			},
			newCondition);
	}

	static unit_type(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.MODULE_TYPE_NAME,
			{
				i18n: 'DATA_LABEL.MODULE_TYPE_NAME'
			},
			newCondition);
	}

	static tool(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TOOL,
			{
				i18n: 'DATA_LABEL.TOOL'
			},
			newCondition);
	}

	static bottleneck_cause(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TOOL,
			{
				i18n: 'DATA_LABEL.BOTTLENECK_CAUSE'
			},
			newCondition);
	}

	static lost_category_name(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.LOST_CATEGORY_NAME,
			{
				i18n: 'DATA_LABEL.LOST_CATEGORY'
			},
			newCondition);
	}


	static lost_time(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.LOST_TIME,
			{
				formatter: { fn: Formatter.Number.format, format: ',.2f' },
				i18n: 'DATA_LABEL.LOST_TIME'
			},
			newCondition);
	}

	static wafercount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.WAFERCOUNT,
			{
				i18n: 'DATA_LABEL.WAFERCOUNT'
			},
			newCondition);
	}

	static badwafercount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.BAD_WAFERCOUNT,
			{
				i18n: 'DATA_LABEL.BAD_WAFER_COUNT'
			},
			newCondition);
	}

	static jeopardywafercount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.JEOPARDY_WAFERCOUNT,
			{
				i18n: 'DATA_LABEL.JEOPARDY_WAFER_COUNT'
			},
			newCondition);
	}

	static goodwafercount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.GOOD_WAFERCOUNT,
			{
				i18n: 'DATA_LABEL.GOOD_WAFER_COUNT'
			},
			newCondition);
	}

	static time_period(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TIME_PERIOD,
			{
				isGroup: true,
				value: [
					LabelConditionDic.from(),
					LabelConditionDic.to()
				],
				formatter: {
					fn: (data: any) => {
						let returnDt = `${data[LB.FROM]} ~ ${data[LB.TO]}`;
						if (newCondition.config && newCondition.config.format) {
							const formatString = newCondition.config.format;
							returnDt = `${moment(data[LB.FROM]).format(formatString)} ~ ${moment(data[LB.TO]).format(formatString)}`;
						}
						return returnDt;
					}
				}
			},
			newCondition);
	}

	static from(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.FROM,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.FROM',
				groupName: CD.TIME_PERIOD
			},
			newCondition);
	}

	static to(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TO,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.TO',
				groupName: CD.TIME_PERIOD
			},
			newCondition);
	}

	static time(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TIME,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.TIME'
			},
			newCondition);
	}

	static ppid(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PPID,
			{
				i18n: 'DATA_LABEL.PPID'
			},
			newCondition);
	}

	static lot(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.LOT,
			{
				i18n: 'DATA_LABEL.LOT'
			},
			newCondition);
	}

	static lot_count(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.LOT_COUNT,
			{
				i18n: 'DATA_LABEL.LOT_COUNT'
			},
			newCondition);
	}

	static cluster(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.CLUSTER,
			{
				i18n: 'DATA_LABEL.CLUSTER'
			},
			newCondition);
	}

	static module(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.MODULE,
			{
				i18n: 'DATA_LABEL.MODULE'
			},
			newCondition);
	}

	static inline_group_label(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.NAME,
			{
				i18n: 'DATA_LABEL.INLINE_GROUP_NAME',
				groupName: CD.INLINE_GROUP
			},
			newCondition);
	}

	static inline_tool_label(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.NAME,
			{
				i18n: 'DATA_LABEL.INLINE_TOOL_NAME',
				groupName: CD.INLINE_TOOL
			},
			newCondition);
	}

	static inline_tool_alias(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ALIAS,
			{
				i18n: 'DATA_LABEL.TOOL_ALIAS',
				groupName: CD.INLINE_TOOL
			},
			newCondition);
	}

	static wafer(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.WAFER,
			{
				i18n: 'Wafer'
			},
			newCondition);
	}

	static yAxis(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.YAXIS,
			{
				i18n: 'yAxis'
			},
			newCondition);
	}
	static xAxis(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.XAXIS,
			{
				i18n: 'xAxis'
			},
			newCondition);
	}

	static stdev(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STDEV,
			{
				i18n: 'DATA_LABEL.STDEV'
			},
			newCondition);
	}
	static average(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.AVERAGE,
			{
				i18n: 'DATA_LABEL.AVERAGE'
			},
			newCondition);
	}
	static unit(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.UNIT,
			{
				i18n: 'DATA_LABEL.UNIT_NAME'
			},
			newCondition);
	}
	static unitGroup(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.UNITGROUP,
			{
				i18n: 'DATA_LABEL.MODULE_GROUP'
			},
			newCondition);
	}

	static step(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP,
			{
				i18n: 'DATA_LABEL.STEP'
			},
			newCondition);
	}

	static countAndTotal(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.COUNTANDTOTAL,
			{
				i18n: 'DATA_LABEL.COUNT_AND_TOTAL'
			},
			newCondition);
	}

	static adderWaferCount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ADDER_WAFERCOUNT,
			{
				type: 'number',
				i18n: 'DATA_LABEL.ADDER_WAFERCOUNT'
			},
			newCondition);
	}

	static carryOverWaferCount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.CARRYOVER_WAFERCOUNT,
			{
				type: 'Number',
				i18n: 'DATA_LABEL.CARRYOVER_WAFERCOUNT'
			},
			newCondition);
	}

	static selectedDate(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.SELECTED_DATE,
			{
				i18n: 'DATA_LABEL.SELECTED_DATE'
			},
			newCondition);
	}

	static percentage(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PERCENTAGE,
			{
				i18n: 'DATA_LABEL.PERCENTAGE'
			},
			newCondition);
	}

	static communication(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.COMMUNICATION,
			{
				i18n: 'DATA_LABEL.COMMUNICATION'
			},
			newCondition);
	}

	static recipe(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.RECIPE,
			{
				i18n: 'DATA_LABEL.RECIPE'
			},
			newCondition);
	}

	static datetime(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.DATETIME,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.DATETIME'
			},
			newCondition);
	}

	static datetimeToMilliSeconds(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.DATETIME,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss.SSS' },
				i18n: 'DATA_LABEL.DATETIME'
			},
			newCondition);
	}

	static score(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.SCORE,
			{
				i18n: 'DATA_LABEL.SCORE'
			},
			newCondition);
	}

	static waferScore(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.WAFER_SCORE,
			{
				i18n: 'DATA_LABEL.WAFER_SCORE'
			},
			newCondition);
	}

	static stepScore(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_SCORE,
			{
				i18n: 'DATA_LABEL.STEP_SCORE'
			},
			newCondition);
	}

	static parameter(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PARAMETER,
			{
				i18n: 'DATA_LABEL.PARAMETER'
			},
			newCondition);
	}

	static svid(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.SVID,
			{
				i18n: 'DATA_LABEL.SVID'
			},
			newCondition);
	}

	static faultCount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.FAULTCOUNT,
			{
				i18n: 'DATA_LABEL.FAULT_COUNT'
			},
			newCondition);
	}

	static recipeCount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.RECIPECOUNT,
			{
				i18n: 'DATA_LABEL.RECIPE_COUNT'
			},
			newCondition);
	}

	static recipeStep(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.RECIPESTEP,
			{
				i18n: 'DATA_LABEL.RECIPE_STEP'
			},
			newCondition);
	}

	static faultStatus(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.FAULT_STATUS,
			{
				i18n: 'DATA_LABEL.FAULT_STATUS'
			},
			newCondition);
	}

	static substrate(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.SUBSTRATE,
			{
				i18n: 'DATA_LABEL.SUBSTRATE'
			},
			newCondition);
	}

	static startDtts(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.START_DTTS,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.START_DTTS'
			},
			newCondition);
	}

	static endDtts(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.END_DTTS,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.END_DTTS'
			},
			newCondition);
	}

	static selectedWaferCount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.SELECTED_WAFERCOUNT,
			{
				i18n: 'DATA_LABEL.SELECTED_WAFERCOUNT'
			},
			newCondition);
	}

	static operation(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.OPERATION,
			{
				i18n: 'DATA_LABEL.OPERATION'
			},
			newCondition);
	}

	static product(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PRODUCT,
			{
				i18n: 'DATA_LABEL.PRODUCT'
			},
			newCondition);
	}

	static rsd05(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.RSD05,
			{
				i18n: 'DATA_LABEL.RSD05'
			},
			newCondition);
	}

	static rsd06(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.RSD06,
			{
				i18n: 'DATA_LABEL.RSD06'
			},
			newCondition);
	}

	static cassetteSlot(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.CASSETTE_SLOT,
			{
				i18n: 'DATA_LABEL.CASSETTE_SLOT'
			},
			newCondition);
	}

	static timeSlot(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TIME_SLOT,
			{
				i18n: 'DATA_LABEL.TIME_SLOT'
			},
			newCondition);
	}

	static sequence(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.SEQUENCE,
			{
				i18n: 'DATA_LABEL.SEQUENCE'
			},
			newCondition);
	}

	static taktTimeFrom(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TAKTTIMEFROM,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.TAKT_TIME_FROM'
			},
			newCondition);
	}
	static taktTimeTo(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TAKTTIMETO,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.TAKT_TIME_TO'
			},
			newCondition);
	}
	static procTimeFrom(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PROCTIMEFROM,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.PROC_TIME_FROM'
			},
			newCondition);
	}
	static procTimeTo(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PROCTIMETO,
			{
				formatter: { fn: Formatter.Date.format, format: 'YYYY/MM/DD HH:mm:ss' },
				i18n: 'DATA_LABEL.PROC_TIME_TO'
			},
			newCondition);
	}

	static processStatus(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PROCESSSTATUS,
			{
				i18n: 'DATA_LABEL.PROCESS_STATUS'
			},
			newCondition);
	}

	static equation(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.EQUATION,
			{
				i18n: 'Equation'
			},
			newCondition);
	}

	static count(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.COUNT,
			{
				i18n: 'Count'
			},
			newCondition);
	}

	static isFdtaWaferReliable(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.FDTA_WAFER_RELIABLE,
			{
				i18n: 'DATA_LABEL.FDTA_WAFER_RELIABLE',
				required: true
			},
			newCondition);
	}

	static alarmOccurDtts(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ALARM_OCCURDTTS,
			{
				i18n: 'AlarmOccurDtts'
			},
			newCondition);
	}

	static alarmClearDtts(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ALARM_CLEARDTTS,
			{
				i18n: 'AlarmClearDtts'
			},
			newCondition);
	}

	static toolAlias(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.TOOL_ALIAS,
			{
				i18n: 'ToolAlias'
			},
			newCondition);
	}

	static alarmCode(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ALARM_CODE,
			{
				i18n: 'AlarmCode'
			},
			newCondition);
	}

	static alarmText(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ALARM_TEXT,
			{
				i18n: 'AlarmText'
			},
			newCondition);
	}

	static status(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STATUS,
			{
				i18n: 'DATA_LABEL.STATUS'
			},
			newCondition);
	}

	static specThreshold(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.SPEC_THRESHOLD,
			{
				i18n: 'DATA_LABEL.SPEC_THRESHOLD'
			},
			newCondition);
	}

	static controlThreshold(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.CONTROL_THRESHOLD,
			{
				i18n: 'DATA_LABEL.CONTROL_THRESHOLD'
			},
			newCondition);
	}

	static startSequence(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.START_SEQUENCE,
			{
				i18n: 'DATA_LABEL.START_SEQUENCE'
			},
			newCondition);
	}

	static endSequence(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.END_SEQUENCE,
			{
				i18n: 'DATA_LABEL.END_SEQUENCE'
			},
			newCondition);
	}

	static startTimeSlot(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.START_TIME_SLOT,
			{
				i18n: 'DATA_LABEL.START_TIME_SLOT'
			},
			newCondition);
	}

	static endTimeSlot(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.END_TIME_SLOT,
			{
				i18n: 'DATA_LABEL.END_TIME_SLOT'
			},
			newCondition);
	}

	static plantName(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PLANT_NAME,
			{
				i18n: 'DATA_LABEL.PLANT_NAME',
				groupName: CD.PLANT,
				formatter: {
					fn: (data: any) => {
						return data ? `[ ${data} ]` : 'Unselected';
					}
				}
			},
			newCondition);
	}

	static areaName(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.AREA_NAME,
			{
				i18n: 'DATA_LABEL.AREA_NAME'
			},
			newCondition);
	}

	static eqpName(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.EQP_NAME,
			{
				i18n: 'DATA_LABEL.EQP_NAME'
			},
			newCondition);
	}

	static paramName(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.PARAM_NAME,
			{
				i18n: 'DATA_LABEL.PARAM_NAME'
			},
			newCondition);
	}

	static healthIndex(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.HEALTH_INDEX,
			{
				i18n: 'DATA_LABEL.HEALTH_INDEX'
			},
			newCondition);
	}

	static stepDrift(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_DRIFT,
			{
				i18n: 'DATA_LABEL.STEP_DRIFT'
			},
			newCondition);
	}

	static stepDownTrend(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_DOWN_TREND,
			{
				i18n: 'DATA_LABEL.STEP_DOWN_TREND'
			},
			newCondition);
	}

	static stepPositiveMaxEnd(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_POSITIVE_MAXEND,
			{
				i18n: 'DATA_LABEL.STEP_POSITIVE_MAXEND'
			},
			newCondition);
	}

	static stepNegativeMax(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_NEGATIVE_MAX,
			{
				i18n: 'DATA_LABEL.STEP_NEGATIVE_MAX'
			},
			newCondition);
	}

	static stepMean(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_MEAN,
			{
				i18n: 'DATA_LABEL.STEP_MEAN'
			},
			newCondition);
	}

	static stepUpTrend(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_UPTREND,
			{
				i18n: 'DATA_LABEL.STEP_UPTREND'
			},
			newCondition);
	}

	static stepMax(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_MAX,
			{
				i18n: 'DATA_LABEL.STEP_MAX'
			},
			newCondition);
	}

	static stepSlope(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_SLOPE,
			{
				i18n: 'DATA_LABEL.STEP_SLOPE'
			},
			newCondition);
	}

	static stepRange(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_RANGE,
			{
				i18n: 'DATA_LABEL.STEP_RANGE'
			},
			newCondition);
	}

	static stepCount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_COUNT,
			{
				i18n: 'DATA_LABEL.STEP_COUNT'
			},
			newCondition);
	}

	static stepPositiveSum(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_POSITIVE_SUM,
			{
				i18n: 'DATA_LABEL.STEP_POSITIVE_SUM'
			},
			newCondition);
	}

	static stepNegativeMaxEnd(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_NEGATIVE_MAXEND,
			{
				i18n: 'DATA_LABEL.STEP_NEGATIVE_MAXEND'
			},
			newCondition);
	}

	static stepMin(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_MIN,
			{
				i18n: 'DATA_LABEL.STEP_MIN'
			},
			newCondition);
	}

	static stepMedian(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_MEDIAN,
			{
				i18n: 'DATA_LABEL.STEP_MEDIAN'
			},
			newCondition);
	}

	static stepDuration(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_DURATION,
			{
				i18n: 'DATA_LABEL.STEP_DURATION'
			},
			newCondition);
	}

	static stepPositiveMaxStart(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_POSITIVE_MAXSTART,
			{
				i18n: 'DATA_LABEL.STEP_POSITIVE_MAXSTART'
			},
			newCondition);
	}

	static stepStartIndex(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_START_INDEX,
			{
				i18n: 'DATA_LABEL.STEP_START_INDEX'
			},
			newCondition);
	}

	static stepStartTime(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_START_TIME,
			{
				i18n: 'DATA_LABEL.STEP_START_TIME'
			},
			newCondition);
	}

	static stepL1Norm(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_L1_NORM,
			{
				i18n: 'DATA_LABEL.STEP_L1_NORM'
			},
			newCondition);
	}

	static stepSTDEV(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_STDEV,
			{
				i18n: 'DATA_LABEL.STEP_STDEV'
			},
			newCondition);
	}

	static stepPositiveMax(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_POSITIVE_MAX,
			{
				i18n: 'DATA_LABEL.STEP_POSITIVE_MAX'
			},
			newCondition);
	}

	static stepNegativeMaxStart(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_NEGATIVE_MAXSTART,
			{
				i18n: 'DATA_LABEL.STEP_NEGATIVE_MAXSTART'
			},
			newCondition);
	}

	static stepNegativeSum(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_NEGATIVE_SUM,
			{
				i18n: 'DATA_LABEL.STEP_NEGATIVE_SUM'
			},
			newCondition);
	}

	static stepIndexMax(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_INDEX_MAX,
			{
				i18n: 'DATA_LABEL.STEP_INDEX_MAX'
			},
			newCondition);
	}

	static stepEndIndex(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_END_INDEX,
			{
				i18n: 'DATA_LABEL.STEP_END_INDEX'
			},
			newCondition);
	}

	static stepEndTime(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_END_TIME,
			{
				i18n: 'DATA_LABEL.STEP_END_TIME'
			},
			newCondition);
	}

	static stepIndexMin(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.STEP_INDEX_MIN,
			{
				i18n: 'DATA_LABEL.STEP_INDEX_MIN'
			},
			newCondition);
	}

	static referenceCount(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.REFERENCE_COUNT,
			{
				i18n: 'DATA_LABEL.REFERENCE_COUNT'
			},
			newCondition);
	}

	static radarType(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.RADAR_TYPE,
			{
				i18n: 'DATA_LABEL.RADAR_TYPE'
			},
			newCondition);
	}

	static analysisSpec(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ANALYSIS_SPEC,
			{
				i18n: 'DATA_LABEL.ANALYSIS_SPEC'
			},
			newCondition);
	}

	static analysisSpecVisible(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.ANALYSIS_SPEC_VISIBLE,
			{
				i18n: 'DATA_LABEL.ANALYSIS_SPEC_VISIBLE'
			},
			newCondition);
	}

	static worstTop(newCondition: ConditionValueType = {}): ConditionType {
		return labelCompose(
			LB.WORST_TOP,
			{
				i18n: 'DATA_LABEL.WORST_TOP'
			},
			newCondition);
	}
}
