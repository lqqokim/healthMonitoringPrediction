import { ConditionType, ConditionValueType } from '../condition.type';
import { compose } from '../util/condition-dic.util';
import { CommonConditionDic } from './common-condition.dic';

export class ToolConditionDic {

    static inline_group_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.INLINE_GROUP_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static inline_group( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.INLINE_GROUP,
            {
                isGroup: true,
                value: [
                    ToolConditionDic.inline_group_id(),
                    CommonConditionDic.common_name()
                ]
            },
            newCondition);
    }

    static inline_groups( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.INLINE_GROUPS,
            {
                type: 'any',
                required: true
            },
            newCondition);
    }

    static inline_tool( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.INLINE_TOOL,
            {
                isGroup: true,
                value: [
                    ToolConditionDic.inline_tool_id(),
                    CommonConditionDic.common_name()
                ]
            },
            newCondition);
    }

    static tool( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.TOOL,
            {
                isGroup: true,
                value: [
                    ToolConditionDic.tool_id(),
                    CommonConditionDic.common_name(),
                    CommonConditionDic.common_alias()
                ],
                required: false
            },
            newCondition);
    }

    static tools( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.TOOLS,
            {
                type: 'any',
                isGroup: false,
				required: false
            },
            newCondition);
    }

    static tool_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.TOOL_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static inline_tool_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.INLINE_TOOL_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static golden_tool_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.GOLDEN_TOOL_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static inline_tool_label(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.INLINE_TOOL_LABEL,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static tools_info( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.TOOLS_INFO,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static ppid( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PPID,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static ppids( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PPIDS,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static lot(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.LOT,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static lots(newCondition: ConditionValueType = {}): ConditionType {
        return compose(
            CD.LOTS,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static lot_ids(newCondition: ConditionValueType = {}) : ConditionType {
        return compose(
            CD.LOT_IDS,
            {
                type: 'any',
                required: true
            },
            newCondition);
    }

    static lost_category( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.LOST_CATEGORY,
            {
                type: 'any',
                required: true
            },
            newCondition);
    }

    static lost_time( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.LOST_TIME,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static cluster_group( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.CLUSTER_GROUP,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }
    static cluster( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.CLUSTER,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static wafercount( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.WAFERCOUNT,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static tool_model ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.TOOL_MODEL,
            {
                isGroup: true,
				required: false,
                value: [
					CommonConditionDic.common_name(),
					ToolConditionDic.tool_model_id()
				]
            },
            newCondition);
    }

    static tool_model_id ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.TOOL_MODEL_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static module_id ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MODULE_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static module ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MODULE,
            {
                isGroup: true,
                value: [
                    ToolConditionDic.module_id(),
                    CommonConditionDic.common_name(),
                    CommonConditionDic.common_alias()
                ],
                required: false
            },
            newCondition);
    }

    static modules ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MODULES,
            {
                type:'any',
                required: false
            },
            newCondition);
    }

    static module_group_id ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MODULE_GROUP_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static module_group ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MODULE_GROUP,
            {
                isGroup: true,
                value: [
                    ToolConditionDic.module_group_id(),
                    CommonConditionDic.common_name()
                ]
            },
            newCondition);
    }

    static module_type_id ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MODULE_TYPE_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static module_type ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MODULE_TYPE,
            {
                isGroup: true,
                value: [
                    ToolConditionDic.module_type_id(),
                    CommonConditionDic.common_name()
                ]
            },
            newCondition);
    }

    static fdta_counts ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.FDTA_COUNTS,
            {
                isGroup: true,
                value: [
                    ToolConditionDic.fdc_oos_count(),
                    ToolConditionDic.spc_ooc_count(),
                    ToolConditionDic.fdta_l_oos_count(),
                    ToolConditionDic.fdta_w_oos_count()
                ]
            },
            newCondition);
    }

    static fdc_oos_count ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.FDC_OOS_COUNT,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static spc_ooc_count ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.SPC_OOC_COUNT,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static fdta_l_oos_count ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.FDTA_L_OOS_COUNT,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static fdta_w_oos_count ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.FDTA_W_OOS_COUNT,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static wafer_id ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.WAFER_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static parameters ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PARAMETERS,
            {
                required: true
            },
            newCondition);
    }

    static parameter_category ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PARAMETER_CATEGORY,
            {
                required: true
            },
            newCondition);
    }

    static exclude_parameters ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.EXCLUDE_PARAMETERS,
            {
                required: false
            },
            newCondition);
    }

    static substrates ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.SUBSTRATES,
            {
                required: true
            },
            newCondition);
    }

    static operation ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.OPERATION,
            {
                required: true
            },
            newCondition);
    }

    static products ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PRODUCTS,
            {
                required: true
            },
            newCondition);
    }

    static spec ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.SPEC,
            {
                required: true,
                isGroup: true,
                value: [
                    CommonConditionDic.ucl(),
                    CommonConditionDic.usl()
                ]
            },
            newCondition);
    }

    static tool_type ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.TOOL_TYPE,
            {
                required: true
            },
            newCondition);
    }

    static reference_threshold ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.REFERENCE_THRESHOLD,
            {
                required: false
            },
            newCondition);
    }

    static count_type ( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.COUNT_TYPE,
            {
                required: true
            },
            newCondition);
    }

    static plant( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PLANT,
            {
                required: true
            },
            newCondition);
    }

    static plant_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PLANT_ID,
            {
                type: 'string',
                required: true
            },
            newCondition);
    }

    static area( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.AREA,
            {
                required: true
            },
            newCondition);
    }

    static area_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.AREA_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static eqp( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.EQP,
            {
                required: true
            },
            newCondition);
    }

    static eqp_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.EQP_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static param( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PARAM,
            {
                required: true
            },
            newCondition);
    }

    static param_id( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.PARAM_ID,
            {
                type: 'number',
                required: true
            },
            newCondition);
    }

    static reliable( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.RELIABLE,
            {
                type: 'any',
                required: false
            },
            newCondition);
    }

    static recipe( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.RECIPE,
            {
                type: 'any',
                required: false
            },
            newCondition);
    }

    static radar_type( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.RADAR_TYPE,
            {
                required: true
            },
            newCondition);
    }

    static analysis_spec( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.ANALYSIS_SPEC,
            {
                required: true
            },
            newCondition);
    }

    static analysis_spec_visible( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.ANALYSIS_SPEC_VISIBLE,
            {
                required: true
            },
            newCondition);
    }

    static worst_top( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.WORST_TOP,
            {
                required: true
            },
            newCondition);
    }

    static monitoring( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MONITORING,
            {
                required: true
            },
            newCondition);
    }

    static max_param_count( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.MAX_PARAM_COUNT,
            {
                required: true
            },
            newCondition);
    }

    static spectrum_count( newCondition: ConditionValueType = {} ): ConditionType {
        return compose(
            CD.SPECTRUM_COUNT,
            {
                required: true
            },
            newCondition);
    }
}
