package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.common.FilterCriteriaData;
import com.bistel.a3.portal.domain.common.FilterTraceRequest;
import com.bistel.a3.portal.domain.common.HeadDatas;
import com.bistel.a3.portal.domain.pdm.CauseAnalysisResult;
import com.bistel.a3.portal.domain.pdm.EqpParamDatas;
import com.bistel.a3.portal.domain.pdm.ManualClassification;
import com.bistel.a3.portal.domain.pdm.RpmWithPart;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.db.STDTraceTrx;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public interface ITraceDataService {
    List<MeasureTrx> getMeasureTrxData(String fabId, Long paramId, Long fromdate, Long todate);

    List<MeasureTrx> getMeasureTrxData(String fabId, Long paramId, Date from, Date to);

    MeasureTrx getLastMeasureTrx(String fabId, Long paramId, Long fromdate, Long todate);

    RpmWithPart getRpmData(String fabId, Long measureTrxId);

    CauseAnalysisResult getCauseAnalysis(String fabId, ParamWithCommon paramWithComm, Long measureTrxId);

    List<CauseAnalysisResult> getCauseAnalysisByParamId(String fabId, Long paramId, Date fromdate, Date todate, Double rate);

    String createMeasureData(HttpServletRequest request, String fabId, Long eqpId, Date start, Date end);

    MeasureTrx getModelMeasureTrx(String fabId, Long measurementId);

    List<MeasureTrx> getMeasureTrxData(String fabId, Date from, Date to);

    List<String> manualClassification(ManualClassification request);

    List<List<Object>> getOverallMinuteTrx(String fabId, Long paramId, Long fromdate, Long todate);

    List<HashMap<String,Object>> getFilterTraceData(String fabId, List<Long> eqpIds, List<String> paramNames, Date from, Date to);

    List<HashMap<String,Object>> getEqpIdsParamIdsInFilterTraceData(String fabId,List<Long> eqpIds,List<String> paramNames,Date from,Date to,List<FilterCriteriaData> filterDatas);

    List<STDTraceTrx> getFilterTraceDataByEqpIdParamNames(String fabId, Long eqpId, List<Long> paramIds, Date from, Date to);
    List<STDTraceTrx> getFilterTraceDataByEqpIdParamId(String fabId, Long eqpId, Long paramId, Date from, Date to, FilterTraceRequest filterTraceRequest);

    List<EqpParamDatas> getFilterTraceDataByEqpIdParamIds(String fabId, Long eqpId,String eqpName, List<Long> paramIds, List<String> paramNames, Date from, Date to, FilterTraceRequest bodyData);
}
