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

        List<AreaFaultCountSummary> areaFaultCountSummaryList = new ArrayList<>();

        AreaFaultCountSummary areaFaultCountSummary1=new AreaFaultCountSummary();
        Date firstDay = new Date();
        firstDay = DateUtils.addDays(firstDay, -6);//yesterday
        firstDay = DateUtils.truncate(firstDay, Calendar.DATE);
        areaFaultCountSummary1.setArea_name("line1");
        areaFaultCountSummary1.setStart_time(firstDay);
        areaFaultCountSummary1.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary1.setWarning_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary2=new AreaFaultCountSummary();
        Date secondDay = new Date();
        secondDay = DateUtils.addDays(secondDay, -5);//yesterday
        secondDay = DateUtils.truncate(secondDay, Calendar.DATE);
        areaFaultCountSummary2.setArea_name("line1");
        areaFaultCountSummary2.setStart_time(secondDay);
        areaFaultCountSummary2.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary2.setWarning_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary3=new AreaFaultCountSummary();
        Date thirdDay = new Date();
        thirdDay = DateUtils.addDays(thirdDay, -4);//yesterday
        thirdDay = DateUtils.truncate(thirdDay, Calendar.DATE);
        areaFaultCountSummary3.setArea_name("line1");
        areaFaultCountSummary3.setStart_time(thirdDay);
        areaFaultCountSummary3.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary3.setWarning_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary4=new AreaFaultCountSummary();
        Date fourthDay = new Date();
        fourthDay = DateUtils.addDays(fourthDay, -3);//yesterday
        fourthDay = DateUtils.truncate(fourthDay, Calendar.DATE);
        areaFaultCountSummary4.setArea_name("line1");
        areaFaultCountSummary4.setStart_time(fourthDay);
        areaFaultCountSummary4.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary4.setWarning_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary5=new AreaFaultCountSummary();
        Date fifthDay = new Date();
        fifthDay = DateUtils.addDays(fifthDay, -2);//yesterday
        fifthDay = DateUtils.truncate(fifthDay, Calendar.DATE);
        areaFaultCountSummary5.setArea_name("line1");
        areaFaultCountSummary5.setStart_time(fifthDay);
        areaFaultCountSummary5.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary5.setWarning_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary6=new AreaFaultCountSummary();
        Date sixthDay = new Date();
        sixthDay = DateUtils.addDays(sixthDay, -1);//yesterday
        sixthDay = DateUtils.truncate(sixthDay, Calendar.DATE);
        areaFaultCountSummary6.setArea_name("line1");
        areaFaultCountSummary6.setStart_time(sixthDay);
        areaFaultCountSummary6.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary6.setWarning_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary7=new AreaFaultCountSummary();
        Date seventhDay = new Date();
        seventhDay = DateUtils.addDays(seventhDay, 0);//yesterday
        seventhDay = DateUtils.truncate(seventhDay, Calendar.DATE);
        areaFaultCountSummary7.setArea_name("line1");
        areaFaultCountSummary7.setStart_time(seventhDay);
        areaFaultCountSummary7.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary7.setWarning_count((int) ((Math.random())*100)+0);


        areaFaultCountSummaryList.add(areaFaultCountSummary1);
        areaFaultCountSummaryList.add(areaFaultCountSummary2);
        areaFaultCountSummaryList.add(areaFaultCountSummary3);
        areaFaultCountSummaryList.add(areaFaultCountSummary4);
        areaFaultCountSummaryList.add(areaFaultCountSummary5);
        areaFaultCountSummaryList.add(areaFaultCountSummary6);
        areaFaultCountSummaryList.add(areaFaultCountSummary7);

        return areaFaultCountSummaryList;
    }

    @Override
    public AlarmClassification getAlarmClassificationSummary(String fabId, Long areaId, Date fromdate, Date todate) {

        AlarmClassification alarmClassification = new AlarmClassification();
        alarmClassification.setUnbalance((int) ((Math.random())*100)+0);
        alarmClassification.setMisalignment((int) ((Math.random())*100)+0);
        alarmClassification.setBearing((int) ((Math.random())*100)+0);
        alarmClassification.setLublication((int) ((Math.random())*100)+0);
        alarmClassification.setEtc((int) ((Math.random())*100)+0);


        return alarmClassification;
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
        else if(areaId!=null && eqpId!=null)//eqp기준
        {
            return stdSummaryMapper.selectAlarmHistoryByEqpId(fromdate, todate, areaId, eqpId);
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

        List<AreaFaultCountSummary> areaFaultCountSummaryList = new ArrayList<>();

        AreaFaultCountSummary areaFaultCountSummary1= new AreaFaultCountSummary();
        Date firstDay = new Date();
        firstDay = DateUtils.addDays(firstDay, -6);//yesterday
        firstDay = DateUtils.truncate(firstDay, Calendar.DATE);
        areaFaultCountSummary1.setArea_name("line1");
        areaFaultCountSummary1.setStart_time(firstDay);
        areaFaultCountSummary1.setNormal_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary1.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary1.setWarning_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary1.setOffline_count((int) ((Math.random())*100)+0);


        AreaFaultCountSummary areaFaultCountSummary2= new AreaFaultCountSummary();
        Date secondDay = new Date();
        secondDay = DateUtils.addDays(secondDay, -5);//yesterday
        secondDay = DateUtils.truncate(secondDay, Calendar.DATE);
        areaFaultCountSummary2.setArea_name("line1");
        areaFaultCountSummary2.setStart_time(secondDay);
        areaFaultCountSummary2.setNormal_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary2.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary2.setWarning_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary2.setOffline_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary3= new AreaFaultCountSummary();
        Date thirdday = new Date();
        thirdday = DateUtils.addDays(thirdday, -4);//yesterday
        thirdday = DateUtils.truncate(thirdday, Calendar.DATE);
        areaFaultCountSummary3.setArea_name("line1");
        areaFaultCountSummary3.setStart_time(thirdday);
        areaFaultCountSummary3.setNormal_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary3.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary3.setWarning_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary3.setOffline_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary4= new AreaFaultCountSummary();
        Date fourthday = new Date();
        fourthday = DateUtils.addDays(fourthday, -3);//yesterday
        fourthday = DateUtils.truncate(fourthday, Calendar.DATE);
        areaFaultCountSummary4.setArea_name("line1");
        areaFaultCountSummary4.setStart_time(fourthday);
        areaFaultCountSummary4.setNormal_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary4.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary4.setWarning_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary4.setOffline_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary5= new AreaFaultCountSummary();
        Date fifthDay = new Date();
        fifthDay = DateUtils.addDays(fifthDay, -2);//yesterday
        fifthDay = DateUtils.truncate(fifthDay, Calendar.DATE);
        areaFaultCountSummary5.setArea_name("line1");
        areaFaultCountSummary5.setStart_time(fifthDay);
        areaFaultCountSummary5.setNormal_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary5.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary5.setWarning_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary5.setOffline_count((int) ((Math.random())*100)+0);


        AreaFaultCountSummary areaFaultCountSummary6= new AreaFaultCountSummary();
        Date sixthDay = new Date();
        sixthDay = DateUtils.addDays(sixthDay, -1);//yesterday
        sixthDay = DateUtils.truncate(sixthDay, Calendar.DATE);
        areaFaultCountSummary6.setArea_name("line1");
        areaFaultCountSummary6.setStart_time(sixthDay);
        areaFaultCountSummary6.setNormal_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary6.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary6.setWarning_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary6.setOffline_count((int) ((Math.random())*100)+0);

        AreaFaultCountSummary areaFaultCountSummary7= new AreaFaultCountSummary();
        Date seventhDay = new Date();
        seventhDay = DateUtils.addDays(seventhDay, 0);//yesterday
        seventhDay = DateUtils.truncate(seventhDay, Calendar.DATE);
        areaFaultCountSummary7.setArea_name("line1");
        areaFaultCountSummary7.setStart_time(seventhDay);
        areaFaultCountSummary7.setNormal_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary7.setAlarm_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary7.setWarning_count((int) ((Math.random())*100)+0);
        areaFaultCountSummary7.setOffline_count((int) ((Math.random())*100)+0);

        areaFaultCountSummaryList.add(areaFaultCountSummary1);
        areaFaultCountSummaryList.add(areaFaultCountSummary2);
        areaFaultCountSummaryList.add(areaFaultCountSummary3);
        areaFaultCountSummaryList.add(areaFaultCountSummary4);
        areaFaultCountSummaryList.add(areaFaultCountSummary5);
        areaFaultCountSummaryList.add(areaFaultCountSummary6);
        areaFaultCountSummaryList.add(areaFaultCountSummary7);


        return areaFaultCountSummaryList;
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
