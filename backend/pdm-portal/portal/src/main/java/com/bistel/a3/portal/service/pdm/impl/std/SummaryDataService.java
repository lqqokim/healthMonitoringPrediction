package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.pdm.std.report.STDReportMapper;
import com.bistel.a3.portal.dao.pdm.std.summary.STDSummaryMapper;
import com.bistel.a3.portal.domain.pdm.*;
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

        if(areaId==null)
        {
            return stdSummaryMapper.selectLineStatusTrend(fromdate, todate);
        }
        else
        {
            return stdSummaryMapper.selectLineStatusTrendByAreaId(fromdate, todate, areaId);
        }


    }

    @Override
    public List<AlarmClassification> getAlarmClassificationSummary(String fabId, Long areaId, Date fromdate, Date todate) {


        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        if(areaId == null)
        {
            List<AlarmClassification> alarmClassifications = stdSummaryMapper.selectAlarmClassificationSummary(fromdate, todate);
            return stdSummaryMapper.selectAlarmClassificationSummary(fromdate, todate);
        }
        else
        {
            return stdSummaryMapper.selectAlarmClassificationSummaryByAreaId(fromdate, todate, areaId);
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

        if(areaId==null)
        {
            return stdSummaryMapper.selectLineStatusTrend(fromdate, todate);
        }
        else
        {
            return stdSummaryMapper.selectLineStatusTrendByAreaId(fromdate, todate, areaId);
        }


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
            ArrayList<WorstEqupmentListChartData> worstEqupmentListChartData=stdSummaryMapper.selectWorstEqupmentListChartData(start_dtts,end_dtts);


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

            List<WorstEquipmentList> worstEquipmentLists = stdSummaryMapper.selectWorstEquipmentListByAreaId(start_dtts,end_dtts,areaId);
            ArrayList<WorstEqupmentListChartData> worstEqupmentListChartData=stdSummaryMapper.selectWorstEqupmentListChartDataByAreaId(start_dtts,end_dtts,areaId);

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


        if(areaId==null)
        {
            List<EqpHealthIndex> eqpHealthIndexMasterEqpInfo = stdSummaryMapper.selectEqpHealthIndexMasterEqpInfo(fromdate, todate);

            HashMap<Long,HashMap<Integer,HashMap<Long,EqpHealthIndex>>> eqpLogicParam = new HashMap<>();
            for (int i = 0; i < eqpHealthIndexMasterEqpInfo.size(); i++) {
                EqpHealthIndex eqpHealthIndex = eqpHealthIndexMasterEqpInfo.get(i);
                if(eqpLogicParam.containsKey(eqpHealthIndex.getEqp_id())){
                    //logic
                    HashMap<Integer,HashMap<Long,EqpHealthIndex>> logicParam = eqpLogicParam.get(eqpHealthIndex.getEqp_id());
                    if(logicParam.containsKey(eqpHealthIndex.getHealth_logic_id())){
                        HashMap<Long,EqpHealthIndex> params = logicParam.get(eqpHealthIndex.getHealth_logic_id());
                        params.put(eqpHealthIndex.getParam_id(),eqpHealthIndex);
                    }else{//Logic 없음
                        HashMap<Long,EqpHealthIndex> params = new HashMap<>();
                        params.put(eqpHealthIndex.getParam_id(),eqpHealthIndex);
                        logicParam.put(eqpHealthIndex.getHealth_logic_id(),params);
                    }
                }else{ //eqp 없음

                    HashMap<Long,EqpHealthIndex> params = new HashMap<>();
                    params.put(eqpHealthIndex.getParam_id(),eqpHealthIndex);
                    HashMap<Integer,HashMap<Long,EqpHealthIndex>> logicParam = new HashMap<>();
                    logicParam.put(eqpHealthIndex.getHealth_logic_id(),params);

                    eqpLogicParam.put(eqpHealthIndex.getEqp_id() ,logicParam);
                }
            }

            List<EqpHealthIndex> eqpHealthIndexes = new ArrayList<>();
            for(Long eqpId :eqpLogicParam.keySet()){
                EqpHealthIndex eqpHealthIndex = new EqpHealthIndex();
                eqpHealthIndex.setEqp_id(eqpId);
                HashMap<Integer,HashMap<Long,EqpHealthIndex>> logicParam = eqpLogicParam.get(eqpId);
                for(Integer logic : logicParam.keySet()){
                    eqpHealthIndex.setHealth_logic_id(logic);
                    HashMap<Long,EqpHealthIndex> params = logicParam.get(logic);
                    Double maxValue = null;
                    Long paramId = null;
                    String eqpName ="";

                    for(Long param : params.keySet()){
                        EqpHealthIndex eqpHealthIndex1 =  params.get(param);
                        Double value = eqpHealthIndex1.getScore();
                        if(maxValue==null){
                            maxValue = value;
                            paramId = param;
                            eqpName = eqpHealthIndex1.getEqp_name();
                        }else if(maxValue< value){
                            maxValue = value;
                            paramId = param;
                            eqpName = eqpHealthIndex1.getEqp_name();
                        }
                    }
                    eqpHealthIndex.setEqp_name(eqpName);
                    if(logic==2) {
                        eqpHealthIndex.setLogic1Param(paramId);
                        eqpHealthIndex.setLogic1(maxValue);

                    }else if(logic==3) {
                        eqpHealthIndex.setLogic2Param(paramId);
                        eqpHealthIndex.setLogic2(maxValue);
                    }else if(logic==4) {
                        eqpHealthIndex.setLogic3Param(paramId);
                        eqpHealthIndex.setLogic3(maxValue);
                    }else if(logic==5) {
                        eqpHealthIndex.setLogic4Param(paramId);
                        eqpHealthIndex.setLogic4(maxValue);
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



//            for (int i = 0; i < eqpHealthIndexMasterEqpInfo.size(); i++) {
//                EqpHealthIndex eqpHealthIndex = eqpHealthIndexMasterEqpInfo.get(i);
//                if(eqpParamLogics.containsKey(eqpHealthIndex.getEqp_id())){
//                    //param
//                    HashMap<Long,HashMap<Integer,Double>> paramLogics = eqpParamLogics.get(eqpHealthIndex.getEqp_id());
//                    if(paramLogics.containsKey(eqpHealthIndex.getParam_id())){
//                        HashMap<Integer,Double> logics = paramLogics.get(eqpHealthIndex.getParam_id());
//                        logics.put(eqpHealthIndex.getHealth_logic_id(),eqpHealthIndex.getScore());
//                    }else{//Pram 없음
//                        HashMap<Integer,Double> logics = new HashMap<>();
//                        logics.put(eqpHealthIndex.getHealth_logic_id(),eqpHealthIndex.getScore());
//                        HashMap<Long,HashMap<Integer,Double>> ParamLogics = new HashMap<>();
//                        ParamLogics.put(eqpHealthIndex.getParam_id(),logics);
//                    }
//                }else{ //eqp 없음
//                    HashMap<Integer,Double> logics = new HashMap<>();
//                    logics.put(eqpHealthIndex.getHealth_logic_id(),eqpHealthIndex.getScore());
//                    HashMap<Long,HashMap<Integer,Double>> ParamLogics = new HashMap<>();
//                    ParamLogics.put(eqpHealthIndex.getParam_id(),logics);
//                    eqpParamLogics.put(eqpHealthIndex.getEqp_id() ,ParamLogics);
//                }
//            }








            //            List<EqpHealthIndex> eqpHealthIndexMasterParamInfo = stdSummaryMapper.selectEqpHealthIndexMasterParamInfo(fromdate, todate);
//            List<EqpHealthIndex> eqpHealthIndexInfo = stdSummaryMapper.selectEqpHealthIndexInfo(fromdate, todate);

//            for (int i = 0; i < eqpHealthIndexMasterEqpInfo.size(); i++) {
//
//                Long eqpId_Eqp=eqpHealthIndexMasterEqpInfo.get(i).getEqp_id();
//
//                for (int j = 0; j < eqpHealthIndexMasterParamInfo.size(); j++) {
//
//
//                    Long eqpId_Param=eqpHealthIndexMasterParamInfo.get(j).getEqp_id();
//                    Long paramId_Param=eqpHealthIndexMasterParamInfo.get(j).getParam_id();
//
//
//                    if(eqpId_Eqp.equals(eqpId_Param))
//                    {
//                        eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().add(eqpHealthIndexMasterParamInfo.get(j));
//
//                        for (int k = 0; k < eqpHealthIndexInfo.size(); k++) {
//
//                            Long paramId_Info=eqpHealthIndexInfo.get(k).getParam_id();
//                            int logic_number=eqpHealthIndexInfo.get(k).getHealth_logic_id();
//
//                            if(paramId_Param.equals(paramId_Info) && logic_number==2)
//                            {
//                                eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).getEqpHealthIndexInfo().add(eqpHealthIndexInfo.get(k));
//
////                                eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).setEqpHealthIndexInfo(eqpHealthIndexInfo);
//                            }
//                            else if(paramId_Param.equals(paramId_Info) && logic_number==3)
//                            {
//                                eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).getEqpHealthIndexInfo().add(eqpHealthIndexInfo.get(k));
//
////                                eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).setEqpHealthIndexInfo(eqpHealthIndexInfo);
//                            }
//                            else if(paramId_Param.equals(paramId_Info) && logic_number==4)
//                            {
//                                eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).getEqpHealthIndexInfo().add(eqpHealthIndexInfo.get(k));
//
//// eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).setEqpHealthIndexInfo(eqpHealthIndexInfo);
//                            }
//                            else if(paramId_Param.equals(paramId_Info) && logic_number==5)
//                            {
//                                eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).getEqpHealthIndexInfo().add(eqpHealthIndexInfo.get(k));
//
////                                eqpHealthIndexMasterEqpInfo.get(i).getEqpHealthIndexParam().get(j).setEqpHealthIndexInfo(eqpHealthIndexInfo);
//                            }
//
//
//                        }
//                    }
//
//                }
//
//            }





//            for (int i = 0; i < eqpHealthIndexMasterInfo.size(); i++) {
//
//
//                Long eqp_id_master=eqpHealthIndexMasterInfo.get(i).getEqp_id();
//
//                for (int j = 0; j < eqpHealthIndexInfo.size(); j++) {
//
//                    Long eqp_id_Info=eqpHealthIndexInfo.get(j).getEqp_id();
//                    int logic_number=eqpHealthIndexInfo.get(j).getHealth_logic_mst_rawid();
//
//
//                    if (eqp_id_master.equals(eqp_id_Info) && logic_number==2 )
//                    {
//                        eqpHealthIndexMasterInfo.get(i).setLogic1(eqpHealthIndexInfo.get(j).getScore());
//                    }
//                    else if (eqp_id_master.equals(eqp_id_Info) && logic_number==3 )
//                    {
//                        eqpHealthIndexMasterInfo.get(i).setLogic2(eqpHealthIndexInfo.get(j).getScore());
//                    }
//                    else if (eqp_id_master.equals(eqp_id_Info) && logic_number==4 )
//                    {
//                        eqpHealthIndexMasterInfo.get(i).setLogic3(eqpHealthIndexInfo.get(j).getScore());
//                    }
//                    else if (eqp_id_master.equals(eqp_id_Info) && logic_number==5 )
//                    {
//                        eqpHealthIndexMasterInfo.get(i).setLogic4(eqpHealthIndexInfo.get(j).getScore());
//                    }
//
//                }
//
//                ArrayList<Double> logics = new ArrayList<>();
//                double logic1=eqpHealthIndexMasterInfo.get(i).getLogic1();
//                double logic2=eqpHealthIndexMasterInfo.get(i).getLogic2();
//                double logic3=eqpHealthIndexMasterInfo.get(i).getLogic3();
//                double logic4=eqpHealthIndexMasterInfo.get(i).getLogic4();
//                logics.add(logic1);
//                logics.add(logic2);
//                logics.add(logic3);
//                logics.add(logic4);
//                Collections.sort(logics);
//                eqpHealthIndexMasterInfo.get(i).setHealth_index(logics.get(logics.size()-1));
//
//
//            }

            return eqpHealthIndexes;




        }
        else
        {
            return stdSummaryMapper.selectEqpHealthIndexByAreaId(fromdate, todate, areaId);
        }


    }


    public EqpStatisticsData eqpHealthTrendChartWithAVG(String fabId, Date previous, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData, List<List<Object>> eqpHealthTraceData){

        EqpStatisticsData eqpStatisticsData=new EqpStatisticsData();
        eqpStatisticsData.setEqpHealthTrendData(eqpHealthTrendData);

        STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);


        //90d일 평균
//        eqpStatisticsData.setPrevious_date(previous);
//
//        List<List<Object>> trendData=eqpStatisticsData.getEqpHealthTrendData();
//        Long lPrevious = previous.getTime();
//        Long lFrom = from.getTime() ;
//        Long lTo = to.getTime();
//
//        Double previous_sum=0.0;
//        int previous_count=0;
//        for (int i = 0; i < trendData.size(); i++)
//        { //90일 이전 평균구하기
//
//            Long time= (Long) trendData.get(i).get(0); //시간들
//
//            if (time>= lPrevious && time <=lFrom)
//            {
//                previous_sum+=(Double)trendData.get(i).get(1);
//                previous_count++;
//            }
//
//        }
//        Double previous_avg=previous_sum/previous_count;
//        eqpStatisticsData.setPrevious_avg(previous_avg);
//        //
//        //기간 평균구하기
//        Double period_sum=0.0;
//        int period_count=0;
//        for (int i = 0; i < trendData.size(); i++)
//        { //90일 이전 평균구하기
//
//            Long time= (Long) trendData.get(i).get(0); //시간들
//
//            if (time>= lFrom && time <=lTo)
//            {
//                period_sum+=(Double)trendData.get(i).get(1);
//                period_count++;
//            }
//        }
//        Double period_avg=period_sum/period_count;
//        eqpStatisticsData.setPeriod_avg(period_avg);
//
//        //sigma설정
//        eqpStatisticsData.setSigma(1665);

        return eqpStatisticsData;
    }

    @Override
    public EqpHealthRUL eqpHealthTrendChartWithRUL(String fabId, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData) {

        EqpHealthRUL eqpHealthRUL = new EqpHealthRUL();
        eqpHealthRUL.setEqpHealthTrendData(eqpHealthTrendData);




        //
        Long lStartDate=(Long)eqpHealthTrendData.get(0).get(0);
        Double dStartValue=(Double)eqpHealthTrendData.get(0).get(1);


        Date alarm_date= DateUtils.addDays(to, 45);
        Long lAlarmDate=alarm_date.getTime();
        Double dAlarmValue=(Double)eqpHealthTrendData.get(eqpHealthTrendData.size()-1).get(2);//마지막 알람값


        eqpHealthRUL.setRulStartTime(lStartDate);
        eqpHealthRUL.setRulStartValue(dStartValue);

        eqpHealthRUL.setRulEndTime(lAlarmDate);
        eqpHealthRUL.setRulEndValue(dAlarmValue);
        //
        return eqpHealthRUL;





    }

    @Override
    public Long eqpHealthIndexGetWorstParam(String fabId, Long eqpId, Date from, Date to) { //장비에서 가장 상태가 않좋은 Param_id return

        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        List<ParamClassificationData> paramList = mapper.selectRadar(eqpId, from, to);

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
        List<List<Object>> specPeriodList=new ArrayList<>();

        SPCPeriod spcPeriod1=new SPCPeriod();
        SPCPeriod spcPeriod2=new SPCPeriod();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String a1="2018-07-16 21:00:00";
        String b1="2018-07-16 21:10:00";

        String a2="2018-07-16 21:16:00";
        String b2="2018-07-16 21:18:00";

        Date a1Date=new Date();
        Date b1Date=new Date();

        Date a2Date=new Date();
        Date b2Date=new Date();

        try {
            a1Date=simpleDateFormat.parse(a1);
            b1Date=simpleDateFormat.parse(b1);
            a2Date=simpleDateFormat.parse(a2);
            b2Date=simpleDateFormat.parse(b2);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        spcPeriod1.setStart_dtts(a1Date);
        spcPeriod1.setEnd_dtts(b1Date);

        spcPeriod2.setStart_dtts(a2Date);
        spcPeriod2.setEnd_dtts(b2Date);


        specPeriodList.add(Arrays.asList(spcPeriod1.getStart_dtts().getTime(), spcPeriod1.getEnd_dtts().getTime()));
        specPeriodList.add(Arrays.asList(spcPeriod2.getStart_dtts().getTime(), spcPeriod2.getEnd_dtts().getTime()));
        eqpHealthSPC.setScpPeriod(specPeriodList);
//하드코딩~~~~~~~
        return eqpHealthSPC;
    }




    public List<List<Object>> getSummaryData(String fabId, Long paramId, Long fromdate, Long todate) {
        STDSummaryMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);
        List<BasicData> data = mapper.selectSummaryData(paramId, new Date(fromdate), new Date(todate));
        return changeList(data);
    }

    private List<List<Object>> changeList(List<BasicData> data) {
        List<List<Object>> result = new ArrayList<>();
        for(BasicData d : data) {
            result.add(Arrays.asList(d.getX().getTime(), d.getY() ,d.getUpper_alarm(),d.getUpper_warn() ));
        }
        return result;
    }


}


