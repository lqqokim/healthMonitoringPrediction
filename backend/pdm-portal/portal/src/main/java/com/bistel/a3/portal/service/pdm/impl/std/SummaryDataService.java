package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.pdm.std.summary.STDSummaryMapper;
import com.bistel.a3.portal.domain.pdm.AlarmClassification;
import com.bistel.a3.portal.domain.pdm.AlarmHistory;
import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import com.bistel.a3.portal.domain.pdm.WorstEquipmentList;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
    public List<AreaFaultCountSummary> getAlarmCountTrend(String fabId, String areaId, Date fromdate, Date todate) {

        AreaFaultCountSummary areaFaultCountSummary=new AreaFaultCountSummary();



        return null;
    }

    @Override
    public AlarmClassification getAlarmClassificationSummary(String fabId, Date fromdate, Date todate) {

        AlarmClassification alarmClassification = new AlarmClassification();
        alarmClassification.setUnbalance(20);
        alarmClassification.setMisalignment(30);
        alarmClassification.setBearing(50);
        alarmClassification.setLublication(90);
        alarmClassification.setEtc(10);
        alarmClassification.setTotal(200);


        return alarmClassification;
    }

    @Override
    public List<AlarmHistory> getAlarmHistory(String fabId, Date fromdate, Date todate) {
        //HardCoding

        List<AlarmHistory> alarmHistoryList=new ArrayList<>();

        AlarmHistory alarmHistory1= new AlarmHistory();
        alarmHistory1.setTime(new Date());
        alarmHistory1.setEqp_name("EQP34");
        alarmHistory1.setParam("Vibration1");
        alarmHistory1.setCategory("Alarm");
        alarmHistory1.setFault_class("Unbalance");

        AlarmHistory alarmHistory2= new AlarmHistory();
        alarmHistory2.setTime(new Date());
        alarmHistory2.setEqp_name("EQP36");
        alarmHistory2.setParam("Temp");
        alarmHistory2.setCategory("Alarm");
        alarmHistory2.setFault_class("N/A");

        AlarmHistory alarmHistory3= new AlarmHistory();
        alarmHistory3.setTime(new Date());
        alarmHistory3.setEqp_name("EQP34");
        alarmHistory3.setParam("Vibration1");
        alarmHistory3.setCategory("Alarm");
        alarmHistory3.setFault_class("N/A");

        AlarmHistory alarmHistory4= new AlarmHistory();
        alarmHistory4.setTime(new Date());
        alarmHistory4.setEqp_name("EQP34");
        alarmHistory4.setParam("Pressure");
        alarmHistory4.setCategory("Warning");
        alarmHistory4.setFault_class("N/A");

        AlarmHistory alarmHistory5= new AlarmHistory();
        alarmHistory5.setTime(new Date());
        alarmHistory5.setEqp_name("EQP34");
        alarmHistory5.setParam("Vibration1");
        alarmHistory5.setCategory("alarm");
        alarmHistory5.setFault_class("N/A");

        alarmHistoryList.add(alarmHistory1);
        alarmHistoryList.add(alarmHistory2);
        alarmHistoryList.add(alarmHistory3);
        alarmHistoryList.add(alarmHistory4);
        alarmHistoryList.add(alarmHistory5);



        return alarmHistoryList;
    }


    //Done
    @Override
    public List<AreaFaultCountSummary> lineStatusSummary(String fabId, Date fromdate, Date todate) {

        STDSummaryMapper stdSummaryMapper= SqlSessionUtil.getMapper(sessions, fabId, STDSummaryMapper.class);


        return stdSummaryMapper.selectStatusCountSummary(fromdate, todate);
    }

    @Override
    public List<AreaFaultCountSummary> lineStatusTrend(String fabId, String areaId, Date fromdate, Date todate) {
        return null;
    }

    @Override
    public List<WorstEquipmentList> worstEquipmentList(String fabId, Date fromdate, Date todate) {
        return null;
    }
}
