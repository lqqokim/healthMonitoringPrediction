import { PdmModelerModule } from './widgets/pdm-modeler/pdm-modeler.module';
import { PdmAreaStatusOverviewModule } from './widgets/pdm-area-status-overview/pdm-area-status-overview.module';
import { PdmEqpParamAnalysisModule } from './widgets/pdm-eqp-param-analysis/pdm-eqp-param-analysis.module';
import { PdmEqpStatusOverviewModule } from './widgets/pdm-eqp-status-overview/pdm-eqp-status-overview.module';
import { PdmModelingStatusModule } from './widgets/pdm-modeling-status/pdm-modeling-status.module';
import { PdmReportModule } from './widgets/pdm-report/pdm-report.module';
import { PdmCurrentAnalysisModule } from './widgets/pdm-current-analysis/pdm-current-analysis.module';
import { PdmTestModule } from './widgets/pdm-test/pdm-test.module';
import { PdmRadarWidgetModule } from './widgets/pdm-radar/pdm-radar-widget.module';
import { PdmRealTimeTrendModule } from './widgets/pdm-realtime-trend/pdm-realtime-trend.module';
import { PdmFabMonitoringModule } from './widgets/pdm-fab-monitoring/pdm-fab-monitoring.module';
import { PdmBarWidgetModule } from './widgets/pdm-bar/pdm-bar-widget.module';
import { PdmRealTimeParamTrendModule } from './widgets/pdm-realtime-param-trend/pdm-realtime-param-trend.module';
import { PdmWostEqpListModule } from './widgets/pdm-worst-eqp-list/pdm-worst-eqp-list.module';
import { PdmLineStatusSummaryWidgetModule } from './widgets/pdm-line-status-aummary/pdm-line-status-summary-widget.module';
import { PdmAlarmCountSummaryWidgetModule } from './widgets/pdm-alarm-count-summary/pdm-alarm-count-summary-widget.module';
import { PdmLineStatusTrendWidgetModule } from './widgets/pdm-line-status-trend/pdm-line-status-trend-widget.module';
import { PdmAlarmCountTrendWidgetModule } from './widgets/pdm-alarm-count-trend/pdm-alarm-count-trend-widget.module';
import { PdmGaugeWidgetModule } from './widgets/pdm-gauge/pdm-gauge-widget.module';

export const getWidgetClassInfo = (widgetName: string): any => {
    console.log('getWidgetClassInfo => ', widgetName);
    switch (widgetName) {
        case 'pdmModeler':
            return PdmModelerModule;
        case 'pdmAreaStatusOverview':
            return PdmAreaStatusOverviewModule;
        case 'pdmEqpParamAnalysis':
            return PdmEqpParamAnalysisModule;
        case 'pdmEqpStatusOverview':
            return PdmEqpStatusOverviewModule;
        case 'pdmModelingStatus':
            return PdmModelingStatusModule;
        case 'pdmReport':
            return PdmReportModule;
        case 'pdmCurrentAnalysis':
            return PdmCurrentAnalysisModule;
        case 'testChartWidget':
            return PdmTestModule;
        case 'pdmRadar':
            return PdmRadarWidgetModule;
        case 'pdmRealTimeTrend':
            return PdmRealTimeTrendModule;
        case 'pdmRealTimeParamTrend':
            return PdmRealTimeParamTrendModule;            
        case 'pdmFabMonitoring':
            return PdmFabMonitoringModule;
        case 'pdmWorstEqpList':
            return PdmWostEqpListModule;
        case 'pdmBar':
            return PdmBarWidgetModule;
        case 'pdmLineStatusSummary':
            return PdmLineStatusSummaryWidgetModule;
        case 'pdmAlarmCountSummary':
            return PdmAlarmCountSummaryWidgetModule;
        case 'pdmLineStatusTrend':
            return PdmLineStatusTrendWidgetModule;
        case 'pdmAlarmCountTrend':
            return PdmAlarmCountTrendWidgetModule;
        case 'pdmGauge':
            return PdmGaugeWidgetModule;
        default:
            // TODO: change Module Empty chart
            return PdmAreaStatusOverviewModule;
    }
}
