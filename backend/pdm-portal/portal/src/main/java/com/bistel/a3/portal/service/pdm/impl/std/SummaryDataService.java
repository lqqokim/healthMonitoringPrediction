package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.pdm.std.summary.STDSummaryMapper;
import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.apache.commons.lang3.time.DateUtils;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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
            List<EqpHealthIndex> eqpHealthIndexMasterInfo = stdSummaryMapper.selectEqpHealthIndexMasterInfo(fromdate, todate);
            List<EqpHealthIndex> eqpHealthIndexInfo = stdSummaryMapper.selectEqpHealthIndexInfo(fromdate, todate);

            for (int i = 0; i < eqpHealthIndexMasterInfo.size(); i++) {


                Long eqp_id_master=eqpHealthIndexMasterInfo.get(i).getEqp_id();

                for (int j = 0; j < eqpHealthIndexInfo.size(); j++) {

                    Long eqp_id_Info=eqpHealthIndexInfo.get(j).getEqp_id();
                    int logic_number=eqpHealthIndexInfo.get(j).getHealth_logic_mst_rawid();


                    if (eqp_id_master.equals(eqp_id_Info) && logic_number==1 )
                    {
                        eqpHealthIndexMasterInfo.get(i).setLogic1(eqpHealthIndexInfo.get(j).getScore());
                    }
                    else if (eqp_id_master.equals(eqp_id_Info) && logic_number==2 )
                    {
                        eqpHealthIndexMasterInfo.get(i).setLogic2(eqpHealthIndexInfo.get(j).getScore());
                    }
                    else if (eqp_id_master.equals(eqp_id_Info) && logic_number==3 )
                    {
                        eqpHealthIndexMasterInfo.get(i).setLogic3(eqpHealthIndexInfo.get(j).getScore());
                    }
                    else if (eqp_id_master.equals(eqp_id_Info) && logic_number==4 )
                    {
                        eqpHealthIndexMasterInfo.get(i).setLogic4(eqpHealthIndexInfo.get(j).getScore());
                    }

                }

                ArrayList<Double> logics = new ArrayList<>();
                double logic1=eqpHealthIndexMasterInfo.get(i).getLogic1();
                double logic2=eqpHealthIndexMasterInfo.get(i).getLogic2();
                double logic3=eqpHealthIndexMasterInfo.get(i).getLogic3();
                double logic4=eqpHealthIndexMasterInfo.get(i).getLogic4();
                logics.add(logic1);
                logics.add(logic2);
                logics.add(logic3);
                logics.add(logic4);
                Collections.sort(logics);
                eqpHealthIndexMasterInfo.get(i).setHealth_index(logics.get(logics.size()-1));

                System.out.println("Hi");
            }

            return eqpHealthIndexMasterInfo;




        }
        else
        {
            return stdSummaryMapper.selectEqpHealthIndexByAreaId(fromdate, todate, areaId);
        }


    }


    public EqpStatisticsData eqpHealthTrendChartWithAVG(String fabId, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData){

        EqpStatisticsData eqpStatisticsData=new EqpStatisticsData();
        eqpStatisticsData.setEqpHealthTrendData(eqpHealthTrendData);

        //90d일 평균
        Date previdous_date=DateUtils.addDays(from, -90);
        eqpStatisticsData.setPrevious_date(previdous_date);

        List<List<Object>> trendData=eqpStatisticsData.getEqpHealthTrendData();
        Long previousDate = previdous_date.getTime();
        Long fromDate = from.getTime() ;
        Long toDate = to.getTime();

        Double previous_sum=0.0;
        int previous_count=0;
        for (int i = 0; i < trendData.size(); i++)
        { //90일 이전 평균구하기

            Long time= (Long) trendData.get(i).get(0); //시간들

            if (time>= previousDate && time <=fromDate)
            {
                previous_sum+=(Double)trendData.get(i).get(1);
                previous_count++;
            }

        }
        Double previous_avg=previous_sum/previous_count;
        eqpStatisticsData.setPrevious_avg(previous_avg);
        //
        //기간 평균구하기
        Double period_sum=0.0;
        int period_count=0;
        for (int i = 0; i < trendData.size(); i++)
        { //90일 이전 평균구하기

            Long time= (Long) trendData.get(i).get(0); //시간들

            if (time>= fromDate && time <=toDate)
            {
                period_sum+=(Double)trendData.get(i).get(1);
                period_count++;
            }
        }
        Double period_avg=period_sum/period_count;
        eqpStatisticsData.setPeriod_avg(period_avg);

        //sigma설정
        eqpStatisticsData.setSigma(5.3);

        return eqpStatisticsData;
    }

    @Override
    public EqpHealthRUL eqpHealthTrendChartWithRUL(String fabId, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData) {

        EqpHealthRUL eqpHealthRUL = new EqpHealthRUL();
        eqpHealthRUL.setEqpHealthTrendData(eqpHealthTrendData);

        Long start_date=(Long)eqpHealthTrendData.get(0).get(0);
        double start_value=(double)eqpHealthTrendData.get(0).get(1);

        Date end_date=new Date((Long)eqpHealthTrendData.get(eqpHealthTrendData.size()-1).get(0));
        Date alarm_date= DateUtils.addDays(from, 35);

        Long tAlarm_date=alarm_date.getTime();



        System.out.println("hi");




        return eqpHealthRUL;
    }


}


