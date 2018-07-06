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
            //To do : Area선택 됐을때
            return null;
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
    public List<WorstEquipmentList> worstEquipmentList(String fabId, Long areaId, Date fromdate, Date todate) {

        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        List<WorstEquipmentList> worstEquipmentLists = new ArrayList<>();

            //
            WorstEquipmentList worstEquipmentList1=new WorstEquipmentList();


                ArrayList<WorstEqupmentListChartData> worstEqupmentListChartDataList1= new ArrayList<>();

                        WorstEqupmentListChartData worstEqupmentListChartData1=new WorstEqupmentListChartData();
                        worstEqupmentListChartData1.setType("Alarm");
                        Date start=null;
                        Date end=null;
                        String sStart="2018-05-25 00:00:00";
                        String sEnd="2018-05-25 12:00:00";
                        try {
                        start=dtDate.parse(sStart);
                        end=dtDate.parse(sEnd);
                        } catch (ParseException e) {
                        e.printStackTrace();
                        }
                        worstEqupmentListChartData1.setStart(start);
                        worstEqupmentListChartData1.setEnd(end);


                        WorstEqupmentListChartData worstEqupmentListChartData2=new WorstEqupmentListChartData();
                        worstEqupmentListChartData2.setType("Warning");
                        start=null;
                        end=null;
                        sStart="2018-05-25 12:00:00";
                        sEnd="2018-05-26 00:00:00";
                        try {
                        start=dtDate.parse(sStart);
                        end=dtDate.parse(sEnd);
                        } catch (ParseException e) {
                        e.printStackTrace();
                        }
                        worstEqupmentListChartData2.setStart(start);
                        worstEqupmentListChartData2.setEnd(end);



                worstEqupmentListChartDataList1.add(worstEqupmentListChartData1);
                worstEqupmentListChartDataList1.add(worstEqupmentListChartData2);

            worstEquipmentList1.setDatas(worstEqupmentListChartDataList1);
            worstEquipmentList1.setEqp_name("EQP34");
            worstEquipmentList1.setScore(Double.parseDouble(String.format("%.2f",Math.random())));
            worstEquipmentList1.setArea_rawid(200L);

            //


        WorstEquipmentList worstEquipmentList2=new WorstEquipmentList();


                ArrayList<WorstEqupmentListChartData> worstEqupmentListChartDataList2= new ArrayList<>();

                WorstEqupmentListChartData worstEqupmentListChartData3=new WorstEqupmentListChartData();
                worstEqupmentListChartData3.setType("Warning");
                start=null;
                end=null;
                sStart="2018-05-25 00:00:00";
                sEnd="2018-05-25 06:00:00";
                try {
                    start=dtDate.parse(sStart);
                    end=dtDate.parse(sEnd);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                worstEqupmentListChartData3.setStart(start);
                worstEqupmentListChartData3.setEnd(end);


                WorstEqupmentListChartData worstEqupmentListChartData4=new WorstEqupmentListChartData();
                worstEqupmentListChartData4.setType("Normal");
                start=null;
                end=null;
                sStart="2018-05-25 06:00:00";
                sEnd="2018-05-25 12:00:00";
                try {
                    start=dtDate.parse(sStart);
                    end=dtDate.parse(sEnd);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                worstEqupmentListChartData4.setStart(start);
                worstEqupmentListChartData4.setEnd(end);


                WorstEqupmentListChartData worstEqupmentListChartData5=new WorstEqupmentListChartData();
                worstEqupmentListChartData5.setType("Offline");
                start=null;
                end=null;
                sStart="2018-05-25 12:00:00";
                sEnd="2018-05-26 00:00:00";
                try {
                    start=dtDate.parse(sStart);
                    end=dtDate.parse(sEnd);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                worstEqupmentListChartData5.setStart(start);
                worstEqupmentListChartData5.setEnd(end);



        worstEqupmentListChartDataList2.add(worstEqupmentListChartData3);
        worstEqupmentListChartDataList2.add(worstEqupmentListChartData4);
        worstEqupmentListChartDataList2.add(worstEqupmentListChartData5);

        worstEquipmentList2.setDatas(worstEqupmentListChartDataList2);
        worstEquipmentList2.setEqp_name("EQP51");
        worstEquipmentList2.setScore(Double.parseDouble(String.format("%.2f",Math.random())));
        worstEquipmentList2.setArea_rawid(200L);













        worstEquipmentLists.add(worstEquipmentList1);
        worstEquipmentLists.add(worstEquipmentList2);

        return worstEquipmentLists;
    }
}
