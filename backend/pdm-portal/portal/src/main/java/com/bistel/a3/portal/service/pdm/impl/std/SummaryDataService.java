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
    public List<WorstEquipmentList> worstEquipmentList(String fabId, Long areaId, Date fromdate, Date todate) {

        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);

        SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String start_dtts=dtDate.format(fromdate);
        String end_dtts=dtDate.format(todate);

        if (areaId==null)
        {
            List<WorstEquipmentList> worstEquipmentLists = stdSummaryMapper.selectWorstEquipmentList(start_dtts,end_dtts);
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
}
