import { Injectable } from '@angular/core';
import { WorkspaceModelService } from '../../../common';

@Injectable()
export class TaskerListService {

    constructor(private model: WorkspaceModelService) {}

    // sub_taskersbottleneck analysis경우 item 마다 drill down app list가 �릈다.
    // �� 감안�여 setCondtion7번째 params�로 'LOT', 'MODULE', 'WAFER'��받을 �게 �다.
    // 마일 7번째 �라미터륤정�� �으��기존 default �정�른
    getDrillDownInfo() {
        return {
            widgets: {
                eqpPerformanceIndex: ['equipmentConstantCompare'],
                waferProcessTime: ['equipmentConstantCompare'],
                throughput: ['toolAlarm'],
                lossTimeReport: ['bottleneck', 'bottleneckAnalysis'],
                lostCategorySummary: <any>[],
                lostRateCategory: <any>[],
                lostTimeDailySummary: <any>[],
                recipeTrend: ['bottleneckAnalysis', 'bottleneck'],
                rptReport: ['equipmentConstantCompare'],
                rptTrend: ['bottleneck', 'ganttTrend', 'toolAlarm'],
                clusterGroupPerformanceIndex: <any>[],
                clusterGroupPerformanceTrend: <any>[],
                bottleneckCauseCandidateReport: ['bottleneckCauseAnalysisResult'],
                lotRptChart: ['bottleneck', 'toolAlarm', 'ganttTrend'],
                nonScannerBottleneckReport: ['bottleneck', 'toolAlarm', 'ganttTrend'],
                waferQualityInventoryOverview: ['waferQualityInventory'],
                sub_widgets: {
                    faultDetail: {
                        FAULT: ['traceChart', 'faultDetailParameter'],
                        OOC: ['spcChart', 'faultDetailParameter'],
                        OCAP: ['spcChart', 'faultDetailParameter'],
                        FDTA: ['faultDetailParameter']
                    },
                    faultOverview: {
                        FAULT: ['traceChart', 'faultDetailParameter'],
                        OOC: ['spcChart', 'faultDetailParameter'],
                        OCAP: ['spcChart', 'faultDetailParameter'],
                        FDTA: ['faultDetailParameter']
                    },
                    rptTrend: {
                        GANTT: ['ganttTrend', 'toolAlarm']
                    },
                    lotRptChart: {
                        GANTT: ['toolAlarm', 'ganttTrend']
                    },
                    nonScannerBottleneckReport: {
                        GANTT: ['toolAlarm', 'ganttTrend']
                    },
                },
                chamberWidget : ['TQP','AnalysisSummaryTrend', 'AnalysisTraceTrend','Summary_TraceTrendSpark']
            },
            taskers: {
                traceAnalysis: <any>[],
                traceDataView: <any>[],
                pdm: ['traceDataView'],
                processTimeTrend: <any>[],
                eventLevel: ['shotDataView'],
                moduleLevel: ['shotDataView'],
                shotDataView: ['traceDataView', 'shotDataView'],
                // bottleneckAnalysis: ['shotDataView', 'waferTraffic', 'traceDataView'],
                bottleneck: ['waferTraffic', 'toolAlarm'],
                bottleneckCauseAnalysisResult: <any>[],
                waferTraffic: ['shotDataView'],
                equipmentConstantCompare: <any>[],
                recipeTrend: <any>[],
                traceChart: <any>[],
                faultDetailParameter: ['faultDetailWafer'],
                faultDetailWafer: ['faultDetailRaw'],
                ganttTrend: ['waferTraffic', 'toolAlarm'],
                sub_taskers: {
                    // bottleneckAnalysis: {
                    //     LOT: ['waferTraffic'],
                    //     MODULE: ['traceDataView', 'shotDataView', 'waferTraffic'],
                    //     WAFER: ['traceDataView', 'shotDataView', 'waferTraffic']
                    // },
                    bottleneck: {
                        // NOT: ['waferTraffic', 'toolAlarm'],
                        CHUCK: ['shotDataView', 'waferTraffic', 'toolAlarm'],
                        // MODULE: ['traceDataView', 'shotDataView', 'waferTraffic'],
                        // WAFER: ['traceDataView', 'shotDataView', 'waferTraffic']
                    },
                    ganttTrend: {
                        CHUCK: ['shotDataView', 'waferTraffic', 'toolAlarm']
                    }
                },
                AnalysisSummaryTrend : ['AnalysisTraceChart'],
                AnalysisTraceTrend : ['AnalysisTraceChart'],
                Summary_TraceTrendSpark: ['Summary_TraceTrendSpark']

            },
        };
    }

    get() {
        return this.model.getTaskerTypes();
    }

    getTaskerList(typeIds: any) {
        let promise: any = [];
        for (let i = 0; i < typeIds.length; i++) {
            promise.push(this.model.getTaskerType('widgetTypeId', typeIds[i]));
        }

        return Promise.all(promise).then((data: any) => {
            let returnData: any = [];
            for (let i = 0; i < data.length; i++) {
                let category: any = {};
                category.widgetName = typeIds[i];
                category.taskerList = [];

                for (let cnt = 0; cnt < data[i].length; cnt++) {
                    let tasker: any = {};
                    tasker.name = data[i][cnt].name;
                    tasker.taskerTypeId = data[i][cnt].taskerTypeId;
                    tasker.title = data[i][cnt].title;
                    tasker.description = data[i][cnt].description;
                    tasker.thumbnail = data[i][cnt].thumbnail;

                    category.taskerList.push(tasker);
                }
                if (category.taskerList.length > 0) {
                    returnData.push(category);
                }
            }
            return returnData;
        });
    }
}
