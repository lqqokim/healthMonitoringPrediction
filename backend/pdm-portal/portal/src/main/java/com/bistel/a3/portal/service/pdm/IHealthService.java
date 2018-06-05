package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.DataWithSpec;
import com.bistel.a3.portal.domain.pdm.EqpWithHealthModel;
import com.bistel.a3.portal.domain.pdm.db.HealthDaily;
import com.bistel.a3.portal.domain.pdm.db.HealthModel;
import com.bistel.a3.portal.domain.pdm.db.HealthStat;

import java.io.IOException;
import java.security.Principal;
import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public interface IHealthService {
    List<HealthModel> getModels(String fabId);

    List<List<Object>> getHealthByAlgo(String fabId, Long eqpId, Long fromdate, Long todate,HealthModel model) throws IOException, ParseException, ExecutionException, InterruptedException;
    DataWithSpec getDailyHealth(String fabId, Long eqpId, Long fromdate, Long todate) throws IOException, ParseException, ExecutionException, InterruptedException;

    void saveHealth(String fabId, HealthModel model, List<List<Object>> data);

    List<EqpWithHealthModel> getEqpsWithModel(String fabId);

    void saveHealthStatWithReport(String fabId, List<HealthStat> records);

    HealthStat getDailyScore(String fabId, Long eqpId, Date from, Date to, Date from90);

    HealthModel getModelByEqpId(String fabId, Long eqpId);

    List<HealthDaily> getHealth(String fabId, Long eqpId, Date from, Date to);

    Map<String, List<Object>> getContribution(String fabId, Long eqpId, Long fromdate, Long todate) throws IOException, ExecutionException, InterruptedException;

    HashMap<String,Object> autoModeler(Principal user, String fabId, Date fromDate, Date toDate, boolean isUnModeled, int monthRange);

    HashMap<String,Object> getModelDataByEqpId(String fabId, long eqpId);

    HashMap<String,Object> getServerAnalysisData(String fabId, Long eqpId, Date fromDate, Date toDate);

    HashMap<String,Object> getServerBuildAndHealth(String fabId,long eqpId,String dataId, long lFromDate, long lToDate,List<String> parameters,int width,int height);

    HashMap<String,Object> getServerPCA(String dataId, String fabId, long a_fromDate, long a_toDate, long b_fromDate, long b_toDate);

    HashMap<String,Object> saveSeverModel( String fabId, String userId,String dataId);

    HashMap<String,Object> getServerChart( String dataId, String chartType, long lFromDate, long lToDate, List<String> parameters, int width, int height);

    HashMap<String,Object> getServerOutlier( String dataId,String type, long lFromDate, long lToDate, List<String> parameters, int width, int height, long startX,long endX,double startY,double endY);

    HashMap<String,Object> getServerAnalysis(String dataId, long a_fromDate, long a_toDate, long b_fromDate, long b_toDate);

    HashMap<String, Object> getServerHealthIndexChart( String chartId, long lFromDate, long lToDate, int width, int height,Double yMin,Double yMax);

    HashMap<String,Object> getServerHealthIndexChartByModel(String fabId,Long eqpId, String dataId, long lFromDate, long lToDate, int width, int height);

    HashMap<String,Object> autoModelerStatus(Principal user, String fabId);
}
