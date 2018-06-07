import { time_period } from './configs/common/time-period-form.cfg';
import { communication } from './configs/common/communication-form.cfg';
import { location } from './configs/common/location-form.cfg';
import { location_model_param } from './configs/common/location-model-param-form.cfg';
import { product } from './configs/common/product-form.cfg';
import { spec_alarming } from './configs/common/spec-alarming-form.cfg';
import { threshold } from './configs/common/threshold-form.cfg';
import { score } from './configs/common/score-form.cfg';
import { auto_refresh } from './configs/common/auto-refresh-form.cfg';
import { manual_timeline } from './configs/common/manual-timeline-form.cfg';
import { date_type } from './configs/common/date-type-form.cfg';

import { inline_tool } from './configs/tool/inline-tool-form.cfg';
import { cluster_group } from './configs/tool/cluster-group-form.cfg';
import { location_fdc_analysis_model_param } from './configs/common/location-fdc-analysis-model-form.cfg';
import { plant } from './configs/pdm/plant-form.cfg';
import { radar_type } from './configs/pdm/radar-type.cfg';
import { analysis_spec } from './configs/pdm/analysis-spec.cfg';
import { analysis_spec_visible } from './configs/pdm/analysis-spec-visible.cfg';
import { worst_top } from './configs/pdm/worst-top.cfg';
import { monitoring } from './configs/pdm/monitoring.cfg';

export const Formcfg: any = {
    Tool: {
        inline_tool,
        cluster_group
    },
    Common: {
        time_period,
        communication,
        location,
        location_model_param,
        location_fdc_analysis_model_param,
        product,
        spec_alarming,
        threshold,
        score,
        auto_refresh,
        manual_timeline,
        date_type
    },
    Factory: {
        plant,
        radar_type,
        analysis_spec,
        analysis_spec_visible,
        worst_top,
        monitoring
    }
};
