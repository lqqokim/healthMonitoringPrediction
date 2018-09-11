package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.pdm.std.master.STDParamMapper;
import com.bistel.a3.portal.dao.pdm.std.report.STDReportMapper;
import com.bistel.a3.portal.dao.pdm.std.summary.STDSummaryMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.master.ParamMapper;
import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.HealthInfo;
import com.bistel.a3.portal.domain.pdm.db.ParamFeatureTrx;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.bistel.a3.portal.domain.pdm.std.master.STDParam;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import sun.java2d.pipe.SpanShapeRenderer;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@ConditionalOnExpression("${run.standard}")
public class SummaryDataService implements ISummaryDataService {
    private static Logger logger = LoggerFactory.getLogger(SummaryDataService.class);


    @Autowired
    private TraceDataService overallService;

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private TraceDataService measureService;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private GlobalAWSpec globalAWSpec;

    @Value("${fab.list}")
    private String fabList;

    @Value("${fab.name.list}")
    private String fabNameList;

    @Value("${health.over.count}")
    private Integer overCount;

    @Autowired
    private MasterService codeService;




    @Override
    public List<AreaFaultCountSummary> getAlarmCountSummary(String fabId, Date fromdate, Date todate) {


        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);


        return stdSummaryMapper.selectStatusCountSummary(fromdate, todate);


    }


    @Override
    public List<AreaFaultCountSummary> getAlarmCountTrend(String fabId, Long areaId, Date fromdate, Date todate) {

        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd");

        Date end = DateUtils.addDays(DateUtils.truncate(todate, Calendar.DATE), -1);

        String sFrom=dtDate.format(fromdate);
        String sTo=dtDate.format(end);



        if(areaId==null)
        {
            return stdSummaryMapper.selectLineStatusTrend(fromdate, todate,sFrom,sTo);
        }
        else
        {
            return stdSummaryMapper.selectLineStatusTrendByAreaId(fromdate, todate, areaId, sFrom,sTo);
        }

    }

    @Override
    public List<AlarmClassification> getAlarmClassificationSummary(String fabId, Long areaId, Date fromdate, Date todate) {


        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sFromdate=dtDate.format(fromdate);
        String sTodate=dtDate.format(todate);

        if(areaId == null)
        {
            return stdSummaryMapper.selectAlarmClassificationSummary(sFromdate, sTodate);
        }
        else
        {
            return stdSummaryMapper.selectAlarmClassificationSummaryByAreaId(sFromdate, sTodate, areaId);
        }




    }

    @Override
    public List<AlarmHistory> getAlarmHistory(String fabId,Long areaId, Long eqpId, Date fromdate, Date todate) {


        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        if(areaId==null && eqpId == null)//전체
        {
            return stdSummaryMapper.selectAlarmHistoryAll(fromdate, todate);
        }
        else if(areaId!=null && eqpId==null)//Area기준
        {
            return stdSummaryMapper.selectAlarmHistoryByAreaId(fromdate, todate, areaId);
        }
        else if(eqpId!=null)//eqp기준
        {
            return stdSummaryMapper.selectAlarmHistoryByEqpId(fromdate, todate, null, eqpId);
        }

        return null;
    }


    //Done
    @Override
    public List<AreaFaultCountSummary> lineStatusSummary(String fabId, Date fromdate, Date todate) {

        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);


        return stdSummaryMapper.selectStatusCountSummary(fromdate, todate);
    }

    @Override
    public List<AreaFaultCountSummary> lineStatusTrend(String fabId, Long areaId, Date fromdate, Date todate) {

        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd");

        Date end = DateUtils.addDays(DateUtils.truncate(todate, Calendar.DATE), -1);

        String sFrom=dtDate.format(fromdate);
        String sTo=dtDate.format(end);


        if(areaId==null)
        {
            List<AreaFaultCountSummary> areaFaultCountSummary=stdSummaryMapper.selectLineStatusTrend(fromdate, todate, sFrom, sTo);
            return stdSummaryMapper.selectLineStatusTrend(fromdate, todate, sFrom, sTo);
        }
        else
        {
            return stdSummaryMapper.selectLineStatusTrendByAreaId(fromdate, todate, areaId, sFrom, sTo);
        }


    }
    @Override
    public List<FabMonitoringInfo> getFabMonitoringInfo(String fabId, Long eqp_id, String param_name, Date fromdate, Date todate){
        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        Double globalWarn=globalAWSpec.getNormalized_upper_warning_spec();
        return stdSummaryMapper.selectFabMonitoring(eqp_id, param_name, fromdate, todate, globalWarn);
    }

    @Override
    public List<WorstEquipmentList> worstEquipmentList(String fabId, Long areaId,Long eqpId, Date fromdate, Date todate) {

        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String start_dtts=dtDate.format(fromdate);
        String end_dtts=dtDate.format(todate);

        if (areaId==null)
        {
            List<WorstEquipmentList> worstEquipmentLists = stdSummaryMapper.selectWorstEquipmentList(start_dtts,end_dtts,eqpId);
            ArrayList<WorstEqupmentListChartData> worstEqupmentListChartData=stdSummaryMapper.selectWorstEqupmentListChartData(start_dtts,end_dtts, eqpId);


            WorstEqupmentListChartData worstEqupmentListChartData1=null;
            ArrayList<WorstEqupmentListChartData> worstEqupmentListChartDataArray=null;

            for (int i = 0; i < worstEquipmentLists.size(); i++)
            {

                Long eqpId1=worstEquipmentLists.get(i).getEqp_id();
                worstEqupmentListChartDataArray=new ArrayList<>();
                for (int j = 0; j < worstEqupmentListChartData.size(); j++)
                {
                    Long eqpId2=worstEqupmentListChartData.get(j).getEqp_id();

                    if (eqpId1.equals(eqpId2))
                    {
                        worstEqupmentListChartData1=worstEqupmentListChartData.get(j);
                        worstEqupmentListChartDataArray.add(worstEqupmentListChartData1);
                    }
                }
                worstEquipmentLists.get(i).setDatas(worstEqupmentListChartDataArray);
            }

            return worstEquipmentLists;
        }
        else
        {

            List<WorstEquipmentList> worstEquipmentLists = stdSummaryMapper.selectWorstEquipmentListByAreaId(start_dtts,end_dtts,areaId,eqpId);
            ArrayList<WorstEqupmentListChartData> worstEqupmentListChartData=stdSummaryMapper.selectWorstEqupmentListChartDataByAreaId(start_dtts,end_dtts,areaId,eqpId);

            WorstEqupmentListChartData worstEqupmentListChartData1=null;
            ArrayList<WorstEqupmentListChartData> worstEqupmentListChartDataArray=null;

            for (int i = 0; i < worstEquipmentLists.size(); i++)
            {

                Long eqpId1=worstEquipmentLists.get(i).getEqp_id();
                worstEqupmentListChartDataArray=new ArrayList<>();
                for (int j = 0; j < worstEqupmentListChartData.size(); j++)
                {
                    Long eqpId2=worstEqupmentListChartData.get(j).getEqp_id();

                    if (eqpId1.equals(eqpId2))
                    {
                        worstEqupmentListChartData1=worstEqupmentListChartData.get(j);
                        worstEqupmentListChartDataArray.add(worstEqupmentListChartData1);
                    }
                }
                worstEquipmentLists.get(i).setDatas(worstEqupmentListChartDataArray);
            }

            return worstEquipmentLists;
        }


    }


    public List<EqpHealthIndex> eqpHealthIndex(String fabId, Long areaId, Date fromdate, Date todate){

        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);
        STDParamMapper paramMapper= SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);

        Double globalWarning=globalAWSpec.getNormalized_upper_warning_spec();

        if(areaId==null)
        {
            List<EqpHealthIndex> eqpHealthIndexMasterEqpInfo = stdSummaryMapper.selectEqpHealthIndex(fromdate, todate, globalWarning);

            HashMap<Long,HashMap<Integer,HashMap<Long,List<EqpHealthIndex>>>> eqpLogicParam = new HashMap<>();
            for (int i = 0; i < eqpHealthIndexMasterEqpInfo.size(); i++) {
                EqpHealthIndex eqpHealthIndex = eqpHealthIndexMasterEqpInfo.get(i);
                if(eqpLogicParam.containsKey(eqpHealthIndex.getEqp_id())){
                    //logic
                    HashMap<Integer,HashMap<Long,List<EqpHealthIndex>>> logicParam = eqpLogicParam.get(eqpHealthIndex.getEqp_id());
                    if(logicParam.containsKey(eqpHealthIndex.getHealth_logic_id())){
                        HashMap<Long,List<EqpHealthIndex>> params = logicParam.get(eqpHealthIndex.getHealth_logic_id());
                        if(params.containsKey(eqpHealthIndex.getParam_id())){
                            List<EqpHealthIndex> eqpHealthIndices = params.get(eqpHealthIndex.getParam_id());
                            eqpHealthIndices.add(eqpHealthIndex);
                        }else{
                            List<EqpHealthIndex> eqpHealthIndices = new ArrayList<>();
                            eqpHealthIndices.add(eqpHealthIndex);
                            params.put(eqpHealthIndex.getParam_id(),eqpHealthIndices);
                        }

                    }else{//Logic 없음
                        HashMap<Long,List<EqpHealthIndex>> params = new HashMap<>();
                        List<EqpHealthIndex> eqpHealthIndices = new ArrayList<>();
                        eqpHealthIndices.add(eqpHealthIndex);
                        params.put(eqpHealthIndex.getParam_id(),eqpHealthIndices);
                        logicParam.put(eqpHealthIndex.getHealth_logic_id(),params);
                    }
                }else{ //eqp 없음

                    HashMap<Long,List<EqpHealthIndex>> params = new HashMap<>();
                    List<EqpHealthIndex> eqpHealthIndices = new ArrayList<>();
                    eqpHealthIndices.add(eqpHealthIndex);
                    params.put(eqpHealthIndex.getParam_id(),eqpHealthIndices);
                    HashMap<Integer,HashMap<Long,List<EqpHealthIndex>>> logicParam = new HashMap<>();
                    logicParam.put(eqpHealthIndex.getHealth_logic_id(),params);

                    eqpLogicParam.put(eqpHealthIndex.getEqp_id() ,logicParam);
                }
            }

            List<EqpHealthIndex> eqpHealthIndexes = new ArrayList<>();
            for(Long eqpId :eqpLogicParam.keySet()){
                EqpHealthIndex eqpHealthIndex = new EqpHealthIndex();
                eqpHealthIndex.setEqp_id(eqpId);
                HashMap<Integer,HashMap<Long,List<EqpHealthIndex>>> logicParam = eqpLogicParam.get(eqpId);
                for(Integer logic : logicParam.keySet())
                {
                    eqpHealthIndex.setHealth_logic_id(logic);
                    HashMap<Long,List<EqpHealthIndex>> params = logicParam.get(logic);
                    Double maxValue = null;
                    Long paramId = null;
                    String eqpName ="";
                    String paramName = "";
                    Float upperAlarmSpec = null;
                    Float upperWarningSpec = null;
                    Date sum_dtts=null;

                    if (logic==4){
                        for(Long param : params.keySet()){
                            for(EqpHealthIndex eqpHealthIndex1 :params.get(param)){
//                                EqpHealthIndex eqpHealthIndex1 =  params.get(param);
                                Double value = eqpHealthIndex1.getScore();
                                Date curDate=eqpHealthIndex1.getSum_dtts();


                                if(maxValue==null){
                                    maxValue = value;
                                    paramId = param;
                                    eqpName = eqpHealthIndex1.getEqp_name();
                                    paramName = eqpHealthIndex1.getParam_name();
                                    upperAlarmSpec = eqpHealthIndex1.getUpperAlarmSpec();
                                    upperWarningSpec = eqpHealthIndex1.getUpperWarningSpec();
                                    sum_dtts=eqpHealthIndex1.getSum_dtts();
                                }else if(sum_dtts.getTime()<curDate.getTime()){
                                    maxValue = value;
                                    paramId = param;
                                    eqpName = eqpHealthIndex1.getEqp_name();
                                    paramName = eqpHealthIndex1.getParam_name();
                                    upperAlarmSpec = eqpHealthIndex1.getUpperAlarmSpec();
                                    upperWarningSpec = eqpHealthIndex1.getUpperWarningSpec();
                                    sum_dtts=eqpHealthIndex1.getSum_dtts();

                                }

                                if(sum_dtts.getTime()==curDate.getTime() &&maxValue< value){
                                    maxValue = value;
                                    paramId = param;
                                    eqpName = eqpHealthIndex1.getEqp_name();
                                    paramName = eqpHealthIndex1.getParam_name();
                                    upperAlarmSpec = eqpHealthIndex1.getUpperAlarmSpec();
                                    upperWarningSpec = eqpHealthIndex1.getUpperWarningSpec();

                                }
                                eqpHealthIndex.setArea_id(eqpHealthIndex1.getArea_id());
                                eqpHealthIndex.setArea_name(eqpHealthIndex1.getArea_name());
                            }


                        }
//                        List<EqpHealthIndex> eqpHealthIndexList=new ArrayList<>();
//                        for(Long param : params.keySet()) {
//                            EqpHealthIndex eqpHealthIndex1 = params.get(param);
//                            eqpHealthIndexList.add(eqpHealthIndex1);
//                        }

                    }
                    else{
                        for(Long param : params.keySet()){
                            for(EqpHealthIndex eqpHealthIndex1 :params.get(param)) {
                                Double value = eqpHealthIndex1.getScore();

                                if (maxValue == null) {
                                    maxValue = value;
                                    paramId = param;
                                    eqpName = eqpHealthIndex1.getEqp_name();
                                    paramName = eqpHealthIndex1.getParam_name();
                                    upperAlarmSpec = eqpHealthIndex1.getUpperAlarmSpec();
                                    upperWarningSpec = eqpHealthIndex1.getUpperWarningSpec();
                                } else if (maxValue < value) {
                                    maxValue = value;
                                    paramId = param;
                                    eqpName = eqpHealthIndex1.getEqp_name();
                                    paramName = eqpHealthIndex1.getParam_name();
                                    upperAlarmSpec = eqpHealthIndex1.getUpperAlarmSpec();
                                    upperWarningSpec = eqpHealthIndex1.getUpperWarningSpec();

                                }

                                eqpHealthIndex.setArea_id(eqpHealthIndex1.getArea_id());
                                eqpHealthIndex.setArea_name(eqpHealthIndex1.getArea_name());
                            }
                        }

                    }

                    eqpHealthIndex.setEqp_name(eqpName);

                    eqpHealthIndex.setUpperAlarmSpec(1.0f);
                    eqpHealthIndex.setUpperWarningSpec(upperWarningSpec/upperAlarmSpec);

                    if(logic==1) {
                        eqpHealthIndex.setLogic1Param(paramId);
                        eqpHealthIndex.setLogic1(maxValue);
                        eqpHealthIndex.setLogic1param_name(paramName);

                    }else if(logic==2) {
                        eqpHealthIndex.setLogic2Param(paramId);
                        eqpHealthIndex.setLogic2(maxValue);
                        eqpHealthIndex.setLogic2param_name(paramName);

                    }else if(logic==3) {
                        eqpHealthIndex.setLogic3Param(paramId);
                        eqpHealthIndex.setLogic3(maxValue);
                        eqpHealthIndex.setLogic3param_name(paramName);

                    }else if(logic==4) {
                        eqpHealthIndex.setLogic4Param(paramId);
                        if (maxValue<0.0){
                            eqpHealthIndex.setLogic4(0.0);
                        }
                        else{

                            eqpHealthIndex.setLogic4(maxValue);
                        }

                        eqpHealthIndex.setLogic4param_name(paramName);

                    }
                }
                Double maxValue = eqpHealthIndex.getLogic1();
                if(maxValue<eqpHealthIndex.getLogic2()){
                    maxValue=eqpHealthIndex.getLogic2();
                }
                if(maxValue<eqpHealthIndex.getLogic3()){
                    maxValue=eqpHealthIndex.getLogic3();
                }
                if(maxValue<eqpHealthIndex.getLogic4()){
                    maxValue=eqpHealthIndex.getLogic4();
                }
                eqpHealthIndex.setScore(maxValue);
                eqpHealthIndexes.add(eqpHealthIndex);
            }


            List<EqpHealthIndex> eqpHealthIndexesAlarmCount=stdSummaryMapper.selectEqpHealthAlarmCount(fromdate, todate);

            for (int i = 0; i < eqpHealthIndexes.size(); i++) {

                Long eqpId=eqpHealthIndexes.get(i).getEqp_id();

                for (int j = 0; j <eqpHealthIndexesAlarmCount.size(); j++) {
                    Long alarmEqpId=eqpHealthIndexesAlarmCount.get(j).getEqp_id();
                    
                    if (eqpId.equals(alarmEqpId))
                    {
//                      Long alarmAreaId=eqpHealthIndexesAlarmCount.get(j).getArea_id();
//                      String alarmAreaName=eqpHealthIndexesAlarmCount.get(j).getArea_name();
                        int alarmCount=eqpHealthIndexesAlarmCount.get(j).getAlarm_count();
                        
//                      eqpHealthIndexes.get(i).setArea_id(alarmAreaId);
//                      eqpHealthIndexes.get(i).setArea_name(alarmAreaName);
                        eqpHealthIndexes.get(i).setAlarm_count(alarmCount);
                    }

                }


            }

            Collections.sort(eqpHealthIndexes, new Comparator<EqpHealthIndex>() {
                @Override
                public int compare(EqpHealthIndex o1, EqpHealthIndex o2) {
                    if (o1.getScore() < o2.getScore())
                    {
                        return 1;
                    }
                    else if(o1.getScore() > o2.getScore())
                    {
                        return -1;
                    }
                    return 0;
                }
            });

            return eqpHealthIndexes;
        }
        else
        {
        	// 현재 사용하지 않음.
            return stdSummaryMapper.selectEqpHealthIndexByAreaId(fromdate, todate, areaId);
        }


    }


    public EqpStatisticsData eqpHealthTrendChartWithAVG(String fabId, Date previous, Date from, Date to, Long paramId, List<List<Object>> eqpHealthFeatureData, List<List<Object>> eqpHealthTraceData){

        EqpStatisticsData eqpStatisticsData=new EqpStatisticsData();
        eqpStatisticsData.setEqpHealthTrendData(eqpHealthFeatureData);

        STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        SimpleDateFormat simpleDateFormat= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String fromDate=simpleDateFormat.format(from);
        String toDate=simpleDateFormat.format(to);




        EqpStatisticsData diffData=stdSummaryMapper.selectPreviousPeriod(fromDate,toDate,paramId);

        eqpStatisticsData.setPrevious_date(diffData.getPrevious_date());
        eqpStatisticsData.setPeriod_avg(diffData.getPeriod_avg());
        eqpStatisticsData.setPrevious_avg(diffData.getPrevious_avg());
        eqpStatisticsData.setScore(diffData.getScore());
        eqpStatisticsData.setSigma(diffData.getSigma());
        eqpStatisticsData.setParam_id(diffData.getParam_id());
        eqpStatisticsData.setParam_name(diffData.getParam_name());

        return eqpStatisticsData;
    }

    @Override
    public EqpHealthRUL eqpHealthTrendChartWithRUL(String fabId, Date from, Date to, Long paramId, List<List<Object>> eqpHealthFeatureData) {



        STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);
//        STDParamMapper stdParamMapper= SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        EqpHealthRUL eqpHealthRULData=stdSummaryMapper.selectRUL(from,to,paramId);

        //Allen trace_spec_mst_pdm제거작업(2018-08-24)
//        Spec spec =stdParamMapper.selectSpec(paramId);


        EqpHealthRUL eqpHealthRUL = new EqpHealthRUL();
        eqpHealthRUL.setEqpHealthTrendData(eqpHealthFeatureData);

        Double intercept=eqpHealthRULData.getIntercept();
        Double slope=eqpHealthRULData.getSlope();
        Long xValue=eqpHealthRULData.getxValue();
        Double yValue=intercept+(slope*xValue);

        //Allen trace_spec_mst_pdm제거작업(2018-08-24)
        //yValue = yValue/spec.getAlarm();

        if (slope<0) //기울기가 음수일 경우  모두 null
        {
            slope=null;
            xValue=null;
            yValue=null;
            intercept=null;
        }

        eqpHealthRUL.setRulEndTime(xValue);
        eqpHealthRUL.setRulEndValue(yValue);
//        eqpHealthRUL.setRulEndTime(xValue);
//        eqpHealthRUL.setRulEndValue(yValue);

        Date start=DateUtils.addDays(from, -7);
//        Long lStart_Dtts=start.getTime();
//        eqpHealthRUL.setRulStartTime(lStart_Dtts);
        Long lStart_Dtts= (Long) eqpHealthRUL.getEqpHealthTrendData().get(0).get(0);
        eqpHealthRUL.setRulStartTime(lStart_Dtts);

        //
//        if (eqpHealthRUL.getEqpHealthTrendData().size()>0 && eqpHealthRUL.getEqpHealthTrendData().get(0).get(0).equals(lStart_Dtts))
        if (eqpHealthRUL.getEqpHealthTrendData().size()>0 )
        {
            Double dStart_value =(Double)eqpHealthRUL.getEqpHealthTrendData().get(0).get(1);
            eqpHealthRUL.setRulStartValue(dStart_value);

        }

        return eqpHealthRUL;

    }

    @Override
    public Long eqpHealthIndexGetWorstParam(String fabId, Long eqpId, Date from, Date to) { //장비에서 가장 상태가 않좋은 Param_id return

        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);

        Double globalWarn=globalAWSpec.getNormalized_upper_warning_spec();
        List<ParamClassificationData> paramList = mapper.selectRadar(eqpId, from, to, globalWarn);

        //avg_with_aw기준으로 paramList정렬 --> 가장 큰값(Worst)을 찾기위해서
        Collections.sort(paramList, new Comparator<ParamClassificationData>() {
            @Override
            public int compare(ParamClassificationData o1, ParamClassificationData o2) {
                if (o1.getAvg_with_aw() < o2.getAvg_with_aw())
                {
                    return 1;
                }
                else if(o1.getAvg_with_aw() > o2.getAvg_with_aw())
                {
                    return -1;
                }
                return 0;
            }
        });


        Long worstParamId= paramList.get(0).getParam_id();

        return worstParamId;
    }

    @Override
    public EqpHealthSPC eqpHealthTrendChartWithSPC(String fabId, Long paramId, Long fromdate, Long todate, List<List<Object>> eqpHealthTrendData) {


        EqpHealthSPC eqpHealthSPC=new EqpHealthSPC();
        eqpHealthSPC.setEqpHealthTrendData(eqpHealthTrendData);

//하드코딩~~~~
//        List<List<Object>> specPeriodList=new ArrayList<>();
//
//        SPCPeriod spcPeriod1=new SPCPeriod();
//        SPCPeriod spcPeriod2=new SPCPeriod();
//        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String a1="2018-07-16 21:00:00";
//        String b1="2018-07-16 21:10:00";
//
//        String a2="2018-07-16 21:16:00";
//        String b2="2018-07-16 21:18:00";
//
//        Date a1Date=new Date();
//        Date b1Date=new Date();
//
//        Date a2Date=new Date();
//        Date b2Date=new Date();
//
//        try {
//            a1Date=simpleDateFormat.parse(a1);
//            b1Date=simpleDateFormat.parse(b1);
//            a2Date=simpleDateFormat.parse(a2);
//            b2Date=simpleDateFormat.parse(b2);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//        spcPeriod1.setStart_dtts(a1Date);
//        spcPeriod1.setEnd_dtts(b1Date);
//
//        spcPeriod2.setStart_dtts(a2Date);
//        spcPeriod2.setEnd_dtts(b2Date);
//
//
//        specPeriodList.add(Arrays.asList(spcPeriod1.getStart_dtts().getTime(), spcPeriod1.getEnd_dtts().getTime()));
//        specPeriodList.add(Arrays.asList(spcPeriod2.getStart_dtts().getTime(), spcPeriod2.getEnd_dtts().getTime()));
//        eqpHealthSPC.setScpPeriod(specPeriodList);
//하드코딩~~~~~~~
        return eqpHealthSPC;
    }




    public List<List<Object>> getSummaryDataForHealth(String fabId, Long paramId, Long lHealthLogic, Date fromdate, Date todate) {
        STDSummaryMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);
        List<BasicData> data = null;

        Double globalWarningSpec=globalAWSpec.getNormalized_upper_warning_spec();

        data = mapper.selectParamHealthTrx(paramId, lHealthLogic, fromdate, todate, globalWarningSpec);

        return changeList(data);
    }

    @Override
    public Object getSummaryData(String fabId,Long paramId, Long fromdate, Long todate, List<String> adHocFucntions) {
        STDSummaryMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);
        List<ParamFeatureTrx> datas = mapper.selectSummaryData(paramId, new Date(fromdate), new Date(todate));
//        return changeList(data);

        HashMap<String,List<Object>>  retValus = new HashMap<>();

        String sumName = "";
        List<Object> sumData = new ArrayList<>();


        sumName = "Max";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getMax());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }

        sumName = "Min";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getMax());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }


        sumName = "Mean";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getMean());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }

        sumName = "STD DEV";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getStddev());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }

        sumName = "Q3";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getQ3());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }

        sumName = "Q1";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getQ1());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }

        sumName = "Median";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getMedian());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }

        sumName = "Count";
        if(adHocFucntions.contains(sumName)) {
            sumData = new ArrayList<>();
            for (int i = 0; i < datas.size(); i++) {
                List<Object> pointData = new ArrayList<>();
                pointData.add(datas.get(i).getEndDtts());
                pointData.add(datas.get(i).getCount());
                sumData.add(pointData);
            }
            retValus.put(sumName, sumData);
        }





        return retValus;
    }

    @Override
    public List<HealthInfo> getWorstEqpsByHealthIndex(String fabId, Date fromdate, Date todate,Integer numberOfWorst) {
        STDSummaryMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        Double globalWarn=globalAWSpec.getNormalized_upper_warning_spec();
        return mapper.selectWorstEqps(fromdate,todate,numberOfWorst, globalWarn);
    }

    @Override
    public List<EqpHealthIndexTrend> getEqpHealthIndexTrend(String fabId, Long area_id, Long eqp_id, Date fromdate, Date todate) {
        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);
        List<EqpHealthIndexTrend> eqpHealthIndexTrendInfo = stdSummaryMapper.selectEqpHealthIndexTrend(fromdate, todate, area_id, eqp_id);

        return eqpHealthIndexTrendInfo;
    }

    private List<List<Object>> changeList(List<BasicData> data) {
        List<List<Object>> result = new ArrayList<>();
        for(BasicData d : data) {
            result.add(Arrays.asList(d.getX().getTime(), d.getY() ,d.getUpper_alarm(),d.getUpper_warn() ));
        }
        return result;
    }


}


