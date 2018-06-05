package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.pdm.db.ProcedureMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDAreaMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDEqpMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDParamMapper;
import com.bistel.a3.portal.dao.pdm.std.report.STDAlarmTrxMapper;
import com.bistel.a3.portal.dao.pdm.std.report.STDReportMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDHealthMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceDataMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceRawDataMapper;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;
import com.bistel.a3.portal.util.pdm.Outlier;
import com.j256.simplemagic.ContentInfo;
import com.j256.simplemagic.ContentInfoUtil;
import jersey.repackaged.com.google.common.collect.Lists;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.math3.stat.StatUtils;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.freehep.graphicsio.emf.EMFInputStream;
import org.freehep.graphicsio.emf.EMFRenderer;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@ConditionalOnExpression("${run.standard}")
public class ReportService implements IReportService {
    private static Logger logger = LoggerFactory.getLogger(ReportService.class);


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

    @Value("${rms.over.count}")
    private int rmsOverCount;

    @Value("${rms.summary.period}")
    private int rmsSummaryPeriod;

    @Value("${summary.hampelFilter.enable}")
    private boolean hampelFilterEnable;


    public List<Fab> getFabs() {
        List<Fab> result = new ArrayList<>();

        String[] fabs = fabList.split(",");
        String[] fabNames = fabNameList.split(",");

        for(int i=0; i<fabs.length; i++) {
            result.add(new Fab(fabs[i], fabNames[i]));
        }
        return result;
    }


    public List<AreaWithStatus> getAreaStatus(String fabId, Long fromdate, Long todate) {
        STDAreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAreaMapper.class);
        List<AreaWithTree> areas = mapper.selectAreaWithTree();
        STDReportMapper reportMapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        STDEqpMapper eqpMapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);

        Map<Long, AreaWithStatus> allStatus = new HashMap<>();
        for(AreaWithTree area : areas) {
            AreaWithStatus status;
            if(area.getLeaf() == 1) {
                status = reportMapper.selectAreaStatusByAreaId(area.getArea_id(), new Date(fromdate), new Date(todate));
                List<EqpWithArea> eqps = eqpMapper.selectEqpsByArea(area.getArea_id());
//                LegacyState legacyState = STDReportMapper.selectState(eqps, new Date(fromdate), new Date(todate));
//                if(legacyState == null) {
                status.setNormal((long) eqps.size());
//                } else {
//                    status.setAlarm(legacyState.getAlarm());
//                    status.setWarning(legacyState.getWarning());
//                    status.setInactive(legacyState.getInactive());
//                    status.setNormal(eqps.size() - legacyState.getAlarm() - legacyState.getWarning() - legacyState.getInactive());
//                }
            } else {
                status = new AreaWithStatus();
            }
            BeanUtils.copyProperties(area, status);
            if(status.getScore() == null) {
                status.setScore(new Score());
            }
            allStatus.put(status.getArea_id(), status);
        }

        List<AreaWithStatus> result = makeTree(areas, allStatus);
        return calcTotal(result);
    }

    private List<AreaWithStatus> calcTotal(List<AreaWithStatus> result) {
        List<AreaWithStatus> calcResult = new ArrayList<>();
        for(AreaWithStatus status : result) {
            calcResult.add(calcScore(status, status.getChildren()));
        }
        return calcResult;
    }

    private AreaWithStatus calcScore(AreaWithStatus parent, List<AreaWithStatus> children) {
        Score parentScore = parent.getScore();
        for(AreaWithStatus child : children) {
            if(child.getChildren().isEmpty()) {
                addScore(parentScore, child);
                parent.setInactive(parent.getInactive() + child.getInactive());
                parent.setAlarm(parent.getAlarm() + child.getAlarm());
                parent.setWarning(parent.getWarning() + child.getWarning());
                parent.setNormal(parent.getNormal() + child.getNormal());
            } else {
                AreaWithStatus returnChild = calcScore(child, child.getChildren());
                addScore(parentScore, returnChild);
                parent.setInactive(parent.getInactive() + returnChild.getInactive());
                parent.setAlarm(parent.getAlarm() + returnChild.getAlarm());
                parent.setWarning(parent.getWarning() + returnChild.getWarning());
                parent.setNormal(parent.getNormal() + returnChild.getNormal());
            }
        }
        return parent;
    }

    private void addScore(Score score, AreaWithStatus s) {
        Score cScore = s.getScore();
        score.setP0(score.getP0() + cScore.getP0());
        score.setP7(score.getP7() + cScore.getP7());
        score.setP8(score.getP8() + cScore.getP8());
        score.setP9(score.getP9() + cScore.getP9());
    }

    private List<AreaWithStatus> makeTree(List<AreaWithTree> areas, Map<Long, AreaWithStatus> allStatus) {
        List<AreaWithStatus> result = new ArrayList<>();
        for(AreaWithTree r : areas) {
            AreaWithStatus rStatus = allStatus.get(r.getArea_id());
            setChildren(allStatus, rStatus);

            if(rStatus.getParent_id() == 0) {
                result.add(rStatus);
            }
        }
        return result;
    }

    private void setChildren(Map<Long, AreaWithStatus> allStatus, AreaWithStatus status) {
        List<AreaWithStatus> children = getChildren(allStatus.values(), status);
        status.setChildren(children);
        if(!children.isEmpty()) {
            for(AreaWithStatus c : children) {
                setChildren(allStatus, c);
            }
        }
    }

    private List<AreaWithStatus> getChildren(Collection<AreaWithStatus> allStatus, AreaWithStatus status) {
        List<AreaWithStatus> children = new ArrayList<>();
        for(AreaWithStatus s : allStatus) {
            if(Objects.equals(s.getParent_id(), status.getArea_id())) {
                children.add(s);
            }
        }
        return children;
    }


    public List<EqpStatus> getEqpStatus(String fabId, Long areaId, Long fromdate, Long todate, Integer regressionDays) {
        STDEqpMapper eqpMapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        STDReportMapper reportMapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        List<EqpWithArea> eqps = eqpMapper.selectEqpsByArea(areaId);

        Date start = new Date(fromdate);
        Date end = new Date(todate);
        Date from90 = DateUtils.addDays(start, -90);

        List<EqpStatus> allStatus = new ArrayList<>();
        for(EqpWithArea eqp: eqps) {
            EqpStatus eqpStatus = reportMapper.selecEqpStatusByEqpId(eqp.getEqp_id(), start, end, from90);
            eqpStatus.setAreaName(eqp.getShopName());
//            LegacyState legacyState = STDReportMapper.selectStateByEqpId(eqp.getEqp_id(), start, end);

//            if(legacyState == null) {
            eqpStatus.setNormal("O");
//            } else {
//                eqpStatus.setAlarm(legacyState.getAlarm() > 0 ? "O" : "-");
//                eqpStatus.setWarning(legacyState.getWarning() > 0 ? "O" : "-");
//                eqpStatus.setInactive(legacyState.getInactive() > 0 ? "O" : "-");
//                eqpStatus.setNormal(legacyState.getAlarm() + legacyState.getWarning() + legacyState.getInactive() > 0 ? "-" : "O");
//            }

            allStatus.add(eqpStatus);
        }
        allStatus.sort((o1, o2) -> {
            Double o1score = o1.getScore() == null ? Double.MIN_VALUE : o1.getScore();
            Double o2score = o2.getScore() == null ? Double.MIN_VALUE : o2.getScore();
            return o1score < o2score ? 1 : Objects.equals(o1score, o2score) ? 0 : -1;
        });
        return allStatus;
    }

    public void checkOverSpec(String fabId, Date start, Date end, HealthStat stat) {
        STDHealthMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);

        Long eqpId = stat.getEqp_id();
        Long overCnt = stat.getAlarm_cnt() + stat.getWarn_cnt();
        if(overCnt > 0L) {
            List<HealthModel> models = mapper.selectModel(eqpId);
            if(models.isEmpty()) return;

            List<HealthDaily> healthList = mapper.selectHealthIndexes(eqpId, start, end);
            HealthModel model = models.get(0);

            stat.setAlarm(checkValues(stat, healthList, model, model.getAlarm_spec()) ? 1 : 0);
            stat.setWarn(checkValues(stat, healthList, model, model.getWarn_spec()) ? 1 : 0);
        }
    }


    public Eqp getEqpById(String fabId, Long eqpId) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        return mapper.selectEqpById(eqpId);
    }


    public Eqp getEqpByMeasureTrxId(String fabId, Long measureTrxId) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        return mapper.selectEqpByMeasureTrxId(measureTrxId);
    }


    public List<Eqp> getEqps(String fabId) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        return mapper.selectEqps();
    }

    private boolean checkValues(HealthStat stat, List<HealthDaily> healthList, HealthModel model, Double checkSpec) {
        Double alarmSpec = model.getAlarm_spec();

        List<Double> overValues = new ArrayList<>();
        List<Double> tmpOverValues = new ArrayList<>();
        for(HealthDaily health : healthList) {
            Double value = health.getValue();
            if(value >= checkSpec) {
                tmpOverValues.add(value);
            } else {
                if(tmpOverValues.size() >= overCount) {
                    overValues.addAll(tmpOverValues);
                }
                tmpOverValues.clear();
            }
        }
        if(!tmpOverValues.isEmpty()){
            if(tmpOverValues.size() >= overCount) {
                overValues.addAll(tmpOverValues);
            }
            tmpOverValues.clear();
        }

        boolean result = false;

        if(!overValues.isEmpty()) {
            double[] overVs = overValues.stream().mapToDouble(x -> x).toArray();
            Double newScore = StatUtils.mean(overVs) * 0.9 / alarmSpec;
            if(newScore > stat.getScore()) {
                stat.setScore(newScore);
                result = true;
            }
        }
        return result;
    }


    public List<Node> getEqpTree(String fabId) {
        STDAreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAreaMapper.class);
        List<Node> nodes = mapper.selectNodes();

        List<Node> result = new ArrayList<>();
        Node root = null;
        for(Node n : nodes) {
            if(n.getParent_id() == 0) {
                result.add(n);
            }
            findChildren(n, nodes);
        }
        return result;
    }

    private void findChildren(Node parent, List<Node> nodes) {
//        List<Node> children = nodes.stream().filter(n -> Objects.equals(n.getParent_id(), parent.getNode_id())).sorted(Comparator.comparingInt(Node::getSort_order)).collect(Collectors.toList());
        List<Node> children = nodes.stream().filter(n -> Objects.equals(n.getParent_id(), parent.getNode_id())).collect(Collectors.toList());
        parent.setChildren(children);
    }


    public EqpInfo getEqpInfo(String fabId, Long eqpId) {
        STDEqpMapper eqpMapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        EqpInfo eqpInfo =  eqpMapper.selectEqpInfo(eqpId);
        if(eqpInfo.getBinaryImage() == null) return  eqpInfo;

        try {
            checkImageType(eqpInfo);
        } catch (IOException e) {
            logger.error("file trans error : {}", e.getMessage());
            return eqpInfo;
        }
        eqpInfo.setEqpImage(Base64.getEncoder().encodeToString(eqpInfo.getBinaryImage()));
        return eqpInfo;
    }

    private void checkImageType(EqpInfo eqpInfo) throws IOException {
        ContentInfo info = new ContentInfoUtil().findMatch(eqpInfo.getBinaryImage());
        if (info == null) {
            eqpInfo.setImageType("unknown");
        } else {
            eqpInfo.setImageType(info.getName());
        }

        if(eqpInfo.getImageType().equals("version") && info.getMessage().contains("EMF")) {
            String fileType = "png";

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            EMFRenderer emfRenderer = new EMFRenderer(new EMFInputStream(new ByteArrayInputStream(eqpInfo.getBinaryImage())));

            Dimension dim = emfRenderer.getSize();
            BufferedImage image = new BufferedImage(dim.width, dim.height, BufferedImage.TYPE_INT_BGR);
            Graphics2D g = image.createGraphics();
            emfRenderer.paint(g);

            Dimension dim2 = new Dimension();
            dim2.setSize(500, dim.height*500/dim.width);

            BufferedImage img = new BufferedImage(dim2.width, dim2.height, BufferedImage.TYPE_INT_BGR);
            Graphics2D gg = img.createGraphics();
            gg.drawImage(image, 0, 0, dim2.width, dim2.height, null);

            ImageIO.write(img, fileType, out);

            eqpInfo.setImageType(fileType);
            eqpInfo.setBinaryImage(out.toByteArray());
        }
    }


    public List<EqpVariance> getVariances(String fabId, Long areaId, Date baseStart, Date baseEnd, Date now) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        STDTraceDataMapper traceDataMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        List<EqpVariance> result = new ArrayList<>();
        List<EqpWithArea> eqps = mapper.selectEqpsByArea(areaId);
        for(EqpWithArea eqp : eqps) {
            Long eqp_id = eqp.getEqp_id();
            EqpVariance eqpVariance = getEqpVariance(baseStart, baseEnd, now, traceDataMapper, eqp_id);
            result.add(eqpVariance);
        }
        return result;
    }


    public EqpVariance getVariance(String fabId, Long areaId, Long eqpId, Date baseStart, Date baseEnd, Date now) {
        STDTraceDataMapper STDTraceDataMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        return getEqpVariance(baseStart, baseEnd, now, STDTraceDataMapper, eqpId);
    }


    public List<UnivariateVariation> getUnivariatevariation(String fabId, Long eqpId, Date start, Date end) {
        STDReportMapper STDReportMapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return STDReportMapper.selectUnivariatevariation(eqpId, start, end);
    }


    public void caculateAvg90(String fabId, Date before90, Date date, Set<Long> eqpIds) {
        STDReportMapper STDReportMapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);

        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            STDReportMapper.deleteCalculateAvg90(date, eqpIds);
            STDReportMapper.insertCalculateAvg90(before90, date, eqpIds);
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }


    public void createPartiton(String fabId, Date from, int count) {
        ProcedureMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ProcedureMapper.class);
        for(int i=0; i<count; i++) {
            createPartitionByTableName(from, mapper, "OVERALL_MINUTE_TRX_PDM");
            createPartitionByTableName(from, mapper, "HEALTH_DAILY_TRX_PDM");
            from = DateUtils.addMonths(from,1);
        }
    }

    private void createPartitionByTableName(Date from, ProcedureMapper mapper, String tableName) {
        String partitionDate = DateFormatUtils.format(from, "yyyyMM");
        mapper.createPartition(partitionDate, tableName);
        logger.info("create partition date:{}, tableName:{}", partitionDate, tableName);
    }

    private EqpVariance getEqpVariance(Date baseStart, Date baseEnd, Date now, STDTraceDataMapper STDTraceDataMapper, Long eqp_id) {
        EqpVariance eqpVariance = new EqpVariance();
        List<ParamVariance> paramVariances = STDTraceDataMapper.selectParamVariance(eqp_id, baseStart, baseEnd, now);
        eqpVariance.setEqp_id(eqp_id);
        eqpVariance.setParams(paramVariances);
        if(!paramVariances.isEmpty()) {
            paramVariances.sort(Comparator.comparing(x -> Math.abs(x.getVariance())));
            eqpVariance.setVariance(paramVariances.get(paramVariances.size() - 1).getVariance());
        }
        return eqpVariance;
    }


    public List<EqpStatusData> getAlarmWarningEqps(String fabId, Date from, Date to) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return mapper.selectAlarmWarningEqps(null, from, to);
    }


    public List<EqpStatusData> getGoodFiveEqps(String fabId, Date from, Date to) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return mapper.selectGoodFiveEqps(from, to);
    }


    public List<EqpStatusData> getBadFiveEqps(String fabId, Date from, Date to) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return mapper.selectBadFiveEqps(from, to);
    }

    @Override
    public List<EqpStatusData> getNumberOfWorstEqps(String fabId, Date from, Date to, Integer numberOfWorst) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return mapper.selectNumberOfWorstEqps(from, to,numberOfWorst);
    }

    @Override
    public List<STDTraceData> getTraceData(String fabId, Long eqpId, Date fromdate, Date todate, String normalizeType) {
        STDTraceDataMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);
        List<HashMap<String,Object>> traceDatas = mapper.selectTraceData(eqpId,fromdate,todate,normalizeType);

        HashMap<Long,STDTraceData> paramTraceDatas = new HashMap<>();

        for (int i = 0; i < traceDatas.size(); i++) {
            HashMap<String,Object> traceData = traceDatas.get(i);

            STDTraceData stdTraceData  = new STDTraceData();
            if(traceData.get("ALARM_SPEC")==null ) continue;
            Double alarm_spec =(Double)traceData.get("ALARM_SPEC");
            Double warning_spec =(Double)traceData.get("WARNING_SPEC");
            Long param_id =Long.valueOf(traceData.get("PARAM_ID").toString());
            Long eqp_id =Long.valueOf(traceData.get("EQP_ID").toString());
            String param_name=traceData.get("PARAM_NAME").toString();
            String eqp_name=traceData.get("EQP_NAME").toString();
            Long event_dtts = java.sql.Timestamp.valueOf(traceData.get("EVENT_DTTS").toString()).getTime();
            Double value = (Double)traceData.get("VALUE");
            if(normalizeType.equals("alarm")){
                value = value /alarm_spec;
            }else{
                value = value /warning_spec;
            }


            stdTraceData = paramTraceDatas.get(param_id);
            if(stdTraceData==null) {
                stdTraceData = new STDTraceData();
                stdTraceData.setAlarm_spec(alarm_spec);
                stdTraceData.setWarning_spec(warning_spec);
                stdTraceData.setEqp_id(eqp_id);
                stdTraceData.setParam_id(param_id);
                stdTraceData.setEqp_name(eqp_name);
                stdTraceData.setParam_name(param_name);
                List<Object> data = new ArrayList<>();
                data.add(event_dtts);
                data.add(value);
                stdTraceData.getDatas().add(data);
                paramTraceDatas.put(param_id,stdTraceData);
            }else{
                List<Object> data = new ArrayList<>();
                data.add(event_dtts);
                data.add(value);
                stdTraceData.getDatas().add(data);
            }
        }

        List<STDTraceData> stdTraceDataList = new ArrayList<>();
        for(Long key :paramTraceDatas.keySet()){
                stdTraceDataList.add(paramTraceDatas.get(key));
        }

        return stdTraceDataList;
    }

    @Override
    public Set<Long> selectExpectedAlarmWarningEqps(String fabId, Date from, Date to) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return mapper.selectExpectedAlarmWarningEqps(from,to,rmsOverCount);
    }

    public List<ParamClassificationData> getParamClassifications(String fabId, Long eqpId, Date from, Date to) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        List<ParamClassificationData> result = mapper.selectRadar(eqpId, from, to);

        List<HashMap<String,Object>> causes= mapper.selectDailyAnalysisCause(eqpId,from,to);
        HashMap<Long,List<String>> paramCauses = new HashMap<>();
        for (int i = 0; i < causes.size(); i++) {
            if(causes.get(i).get("CAUSE")==null) continue;
            String sCause = causes.get(i).get("CAUSE").toString();
            String [] cause = sCause.split("\\^");
            if(sCause==null || sCause.isEmpty()) continue;

            List<String> causeList = new ArrayList<String>(Arrays.asList(cause));
            Long paramId =Long.valueOf( causes.get(i).get("PARAM_ID").toString());
            if(paramCauses.containsKey(paramId)){
                paramCauses.get(paramId).addAll(causeList);
            }else{

                paramCauses.put(paramId,causeList);
            }

        }

        for(ParamClassificationData data : result) {
            convertToRateData(data);
            List<String> cause = paramCauses.get(data.getParam_id());
            if(cause!=null){
                data.setClassifications(cause);
            }

        }

//        data.setClassifications(new ArrayList<>(causes));

//        List<EqpStatusData> list = mapper.selectAlarmWarningEqps(eqpId, from, to);
//        for(ParamClassificationData data : result) {
//            convertToRateData(data);
//
//            if(!list.isEmpty()) {
//                checkCauses(fabId, from, to, data, list.get(0));
//            }
//        }

        return result;
    }

    private List<String> checkCauses(String fabId, Date from, Date to, Long paramId) {
//        List<MeasureTrx> measureTrxes = measureService.getMeasureTrxData(fabId, data.getParam_id(), eqpStatusData.getStart_dtts(), to);
//        Set<String> causes = new HashSet<>();
//        for(MeasureTrx measure: measureTrxes) {
//            CauseAnalysisResult causeAnalysisResult = measureService.getCauseAnalysis(fabId, null, measure.getMeasure_trx_id());
//            if(causeAnalysisResult==null) continue;
//            causes.addAll(causeAnalysisResult.getCauses());
//            if(causes.size() > 0) break;
//        }
//        data.setClassifications(new ArrayList<>(causes));

        Set<String> causes = new HashSet<>();
        STDTraceRawDataMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceRawDataMapper.class);

        List<HashMap<String,Object>> datas =  mapper.selectWarningRateMeasureTrxId(paramId,from,to,1.0);

        for (int i = 0; i < datas.size(); i++) {
            long measure_trx_id = Long.valueOf(datas.get(i).get("TRACE_TRX_RAWID").toString());

            CauseAnalysisResult causeAnalysisResult = measureService.getCauseAnalysis(fabId, null, measure_trx_id);
            if(causeAnalysisResult==null || causeAnalysisResult.getCauses().size()==0) continue;
            causes.addAll(causeAnalysisResult.getCauses());
            if(causes.size() > 0) break;
        }
        return new ArrayList<>(causes);

    }

    private void convertToRateData(ParamClassificationData data) {
        Double alarm = data.getAlarm();
        if(alarm == null) return;

        data.setAlarm(1D);
        data.setWarn(data.getWarn() == null ? null : data.getWarn()/alarm);
        data.setAvg_spec(data.getAvg_spec() == null ? null : data.getAvg_spec()/alarm);
        data.setAvg_daily(data.getAvg_daily() == null ? null : data.getAvg_daily()/alarm);
        data.setAvg_with_aw(data.getAvg_with_aw() == null ? null : data.getAvg_with_aw()/alarm);
        data.setVariation(data.getVariation() == null ? null : data.getVariation()/alarm);
    }


    public void getDuration(String fabId, List<EqpStatusData> list, Date from, Date to) {
        STDAlarmTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAlarmTrxMapper.class);
        for(EqpStatusData data : list) {
            if(data.getStatus() == null) continue;
            EqpAlarmTrx alarm = mapper.selectStartAlarm(data.getEqp_id(), data.getStatus(), from, to);
            data.setStart_dtts(alarm.getAlarm_dtts());

            switch(data.getStatus()) {
                case 128:
                    data.setType("Warning"); break;
                case 256:
                    data.setType("Alarm"); break;
                case -1:
                    data.setType("Inactive"); break;
                default:
            }
        }
    }


    public Overall getOverall(String fabId, Long eqpId, Long paramId, Long fromdate, Long todate) {
        Overall result = new Overall();

        OverallSpec spec = getOverallSpec(fabId, paramId);
        List<List<Object>> data = overallService.getOverallMinuteTrx(fabId, paramId, fromdate, todate);
        result.setAlarm(spec.getAlarm());
        result.setWarn(spec.getWarn());
        result.setData(data);

        result.setDay3(calculateRegression(fabId, paramId, todate, result.getAlarm(), 3));
        result.setDay7(calculateRegression(fabId, paramId, todate, result.getAlarm(), 7));
        result.setDay14(calculateRegression(fabId, paramId, todate, result.getAlarm(), 14));
        return result;
    }

    private Long calculateRegression(String fabId, Long paramId, Long todate, Double alarm, Integer regressionDays) {
        Date to = new Date(todate);
        Date from = DateUtils.addDays(to, regressionDays * -1);

        List<List<Object>> regressionData = overallService.getOverallMinuteTrx(fabId, paramId, from.getTime(), to.getTime());

        SimpleRegression regression = new SimpleRegression();
        for(List<Object> record : regressionData) {
            regression.addData((Long) record.get(0), (Double) record.get(1));
        }

        double intercept = regression.getIntercept();
        double slope = regression.getSlope();
        if(Double.isNaN(intercept) || Double.isNaN(slope) || slope <=0) return null;

        double x = (alarm - intercept)/slope;
        return TimeUnit.DAYS.convert((long) x - to.getTime(), TimeUnit.MILLISECONDS);
    }



    public List<ReportAlarm> getAlarms(String fabId, Long fromdate, Long todate) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        List<ReportAlarm> list = mapper.selectReportAlarm(new Date(fromdate), new Date(todate));
        List<Code> codes = codeService.getCode("PDM", "REPORT_STATUS", true);
        setCodeName(list, codes);
        return list;
    }

    private void setCodeName(List<ReportAlarm> list, List<Code> codes) {
        for(ReportAlarm r : list) {
            String code = r.getState_cd();
            String name = getName(code, codes);
            r.setState_name(name);
        }
    }

    private String getName(String code, List<Code> codes) {
        for(Code c : codes) {
            if(c.getCode().equals(code)) return c.getName();
        }
        return null;
    }


    public void updateAlarm(String fabId, ReportAlarm alarmReport) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        mapper.updateReportAlarm(alarmReport);
    }


    public List<MaintenanceHst> getAlarmsByEqpId(String fabId, Long eqpId, Long fromdate, Long todate) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return mapper.selectReportAlarmByEqpId(eqpId, new Date(fromdate), new Date(todate));
    }




    public List<ParamStatus> getParamStatus(String fabId, Long eqpId, Long fromdate, Long todate) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        return mapper.selectParamStatusByEqpId(eqpId, new Date(fromdate), new Date(todate));
    }


    public List<ParamWithCommon> getParamWtihTypeByEqp(String fabId, Long eqpId) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return mapper.selectParamWtihInfoByEqp(eqpId);
    }


    public ParamWithCommon getParamWithComm(String fabId, Long paramId) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return mapper.selectParamWithInfo(paramId);
    }


    public Spec getOverallMinuteTrxSpec(String fabId, Long paramId, Long fromdate, Long todate) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        List<BasicData> data = mapper.selectData(paramId, new Date(fromdate), new Date(todate));
        List<Double> values = getValues(data);

        Spec spec = new Spec();
        double average = values.stream().mapToDouble(x -> x).summaryStatistics().getAverage();
        double rawSum = values.stream().mapToDouble(x -> Math.pow(x - average, 2.0)).sum();
        double stddev = Math.sqrt(rawSum / (values.size() - 1));
        spec.setTarget(average);
        spec.setWarn(average + stddev * 2);
        spec.setAlarm(average + stddev * 3);
        return spec;
    }


    public Spec getOverallMinuteTrxSpecConfig(String fabId, Long paramId) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return mapper.selectSpec(paramId);
    }


    public void calculateSummary(String userName,String fabId, Date overallSummarySpecDate, Date from, Date to, Long eqpId) {
        STDParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        STDReportMapper reportMapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        STDAlarmTrxMapper alarmTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDAlarmTrxMapper.class);
        List<ParamWithCommon> params = paramMapper.selectParamWtihInfoByEqp(eqpId);

//        HashMap<Long, String> paramClassificationDataHashMap = getCalssifications(fabId, from, to, eqpId, reportMapper);

        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            alarmTrxMapper.deleteAlarmByEqpId(eqpId,from,to);
            reportMapper.deleteDailySummaryTrxByEqpId(eqpId,from,to);

            for(ParamWithCommon param: params) {
                String classification = getCalssifications(fabId, from, to, eqpId, reportMapper,param.getParam_id());
                calculateParamSummary(userName,reportMapper,paramMapper, param, overallSummarySpecDate, from, to, fabId,classification);
            }
            saveEqpAlarmTrx(userName,fabId, eqpId, from, to);

            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }

    private String getCalssifications(String fabId, Date from, Date to, Long eqpId, STDReportMapper reportMapper,Long paramId) {

        List<String> causes = checkCauses(fabId, from, to, paramId);


        if(causes!=null) {
            String sClassifications = String.join("^", causes);
            return sClassifications;
        }

        return "";
    }

    public void calculateRealTimeSummary(String userName,String fabId, Date from, Date to, Long eqpId) {
        STDParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        STDReportMapper reportMapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        List<ParamWithCommon> params = paramMapper.selectParamWtihInfoByEqp(eqpId);

        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for(ParamWithCommon param: params) {
                calculateRealTimeParamSummary(userName,reportMapper,paramMapper, param, from, to, fabId);
            }
            saveEqpAlarmTrx(userName,fabId, eqpId, from, to);

            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }


    public OverallSpec getOverallSpec(String fabId, Long paramId) {
        STDParamMapper paramMapper= SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return paramMapper.selectTraceDataSpec(paramId);
    }


    private void saveEqpAlarmTrx(String userName,String fabId, Long eqpId, Date from, Date to) {
        STDAlarmTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAlarmTrxMapper.class);
        mapper.deleteEqpAlarm(eqpId, from, to);
        mapper.insertEqpAlarm(userName,eqpId, from, to);
    }

    private void calculateParamSummary(String userName,STDReportMapper reportMapper, STDParamMapper paramMapper, ParamWithCommon param, Date trendSummarySpecDate, Date from, Date to, String fabId,String classification) {
        //spec
        OverallSpec spec = paramMapper.selectTraceDataSpec(param.getParam_id());
        if(spec == null) {
            logger.info("No overalls specification value. - {}({})", param.getName(), param.getParam_id());
            spec = new OverallSpec();
        }

        //90avg
//        List<BasicData> specData = STDReportMapper.selectData(param.getParam_id(), trendSummarySpecDate, from);
//        List<Double[]> specHampel = Outlier.runHampelFilter(Outlier.getListFromBasicData(specData), 30, 2d);
//        Double specAvg = StatUtils.mean(Outlier.filterBasicData(specData, specHampel));

        Double specAvg = null;
        List<Double> prevPeriodAVGs = reportMapper.selectPrevPeriodAVG(param.getParam_id(), trendSummarySpecDate, from);
        if(!prevPeriodAVGs.isEmpty()){
            specAvg = prevPeriodAVGs.get(0);
        }

        if(specAvg == null) {
            logger.info("No data for {}-day averaging. - {}({})", rmsSummaryPeriod, param.getName(), param.getParam_id());
//            specAvg = null;
        }

        //avg
        List<BasicData> dailyData = reportMapper.selectData(param.getParam_id(), from, to);
        Double dailyAvg;
        if(hampelFilterEnable) {
            List<Double[]> dailyHampel = Outlier.runHampelFilter(Outlier.getListFromBasicData(dailyData), 30, 2d);
            dailyAvg = StatUtils.mean(Outlier.filterBasicData(dailyData, dailyHampel));
        }else{
            double[] datas = new double[dailyData.size()];
            int i=0;
            for(BasicData d : dailyData) {
                datas[i++]= d.getY();
            }
            dailyAvg = StatUtils.mean(datas);
        }

        if(Double.isNaN(dailyAvg)) {
            logger.info("No data for average calculation per day. - {}({})", param.getName(), param.getParam_id());
            dailyAvg = null;
            return;
        }

        //check alarm, warning
        //double[] result = checkSpec(dailyData, spec.getAlarm());
        double[] result = checkSpec(dailyData, "alarm",spec.getAlarm());
        int alarmCode = 0;

        Double avgWithAW = dailyAvg;

        if(Double.isNaN(result[0])) {
            //result = checkSpec(dailyData, spec.getWarn());
            result = checkSpec(dailyData, "warning",spec.getWarn());

            if(!Double.isNaN(result[0])) {
                avgWithAW = result[1];
                alarmCode = 128;
                if(spec.getAlarm()==null){
                    spec.setAlarm(dailyData.get(0).getAlarm());
                    spec.setWarn(dailyData.get(0).getWarn());
                }
            }

        } else {
            alarmCode = 256;
            avgWithAW=result[1];
            if(spec.getAlarm()==null){
                spec.setAlarm(dailyData.get(0).getAlarm());
                spec.setWarn(dailyData.get(0).getWarn());
            }
        }



        //save alarm
        if(alarmCode > 0) {
            Long startDate = Double.isNaN(result[0]) ? null : (long) result[0];
            saveAlarmTrx(userName,fabId, param.getParam_id(), startDate, alarmCode, avgWithAW, spec);
        }

        Double variation = specAvg == null || dailyAvg == null ? null : dailyAvg -specAvg;
        //save summary
        saveOverallSummary(userName,fabId, param.getParam_id(), from, spec.getAlarm(), spec.getWarn(), specAvg, dailyAvg, avgWithAW, variation,classification);
    }


    private void calculateRealTimeParamSummary(String userName,STDReportMapper reportMapper, STDParamMapper paramMapper, ParamWithCommon param,  Date from, Date to, String fabId) {
        //spec
        OverallSpec spec = paramMapper.selectTraceDataSpec(param.getParam_id());
        if(spec == null) {
            logger.info("No specification value. - {}({})", param.getName(), param.getParam_id());
            spec = new OverallSpec();
            return;
        }

        //avg
        List<BasicData> dailyData = reportMapper.selectData(param.getParam_id(), from, to);
//        List<Double[]> dailyHampel = Outlier.runHampelFilter(Outlier.getListFromBasicData(dailyData), 30, 2d);
//        Double dailyAvg = StatUtils.mean(Outlier.filterBasicData(dailyData, dailyHampel));
        double[] datas = dailyData.stream().mapToDouble(element-> element.getY()).toArray();
        Double dailyAvg = StatUtils.mean(datas);
        if(Double.isNaN(dailyAvg)) {
            logger.info("No data for average calculation per day. - {}({})", param.getName(), param.getParam_id());
            dailyAvg = null;
        }

        //check alarm, warning
        //double[] result = checkSpec(dailyData, spec.getAlarm());
        double[] result = checkSpec(dailyData, "alarm",spec.getAlarm());
        int alarmCode = 0;

        Double avgWithAW = dailyAvg;

        if(Double.isNaN(result[0])) {
            //result = checkSpec(dailyData, spec.getWarn());
            result = checkSpec(dailyData, "warning",spec.getWarn());

            if(!Double.isNaN(result[0])) {
                avgWithAW = result[1];
                alarmCode = 128;
            }

        } else {
            alarmCode = 256;
            avgWithAW=result[1];
        }



        //save alarm
        if(alarmCode > 0) {
            Long startDate = Double.isNaN(result[0]) ? null : (long) result[0];
            saveAlarmTrx(userName,fabId, param.getParam_id(), startDate, alarmCode, avgWithAW, spec);
        }

//        Double variation = specAvg == null || dailyAvg == null ? null : dailyAvg -specAvg;
        //save summary
//        saveRealTimeSummary(userName,fabId, param.getParam_id(), from, spec.getAlarm(), spec.getWarn(),  dailyAvg, avgWithAW);
    }

    private void saveRealTimeSummary(String userName,String fabId, Long paramId, Date read, Double alarm, Double warn, Double dailyAvg, Double avgWithAW) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);

        OverallMinuteSummaryTrx summaryTrx = new OverallMinuteSummaryTrx();
        summaryTrx.setParam_id(paramId);
        summaryTrx.setRead_dtts(read);
        summaryTrx.setAlarm(alarm);
        summaryTrx.setWarn(warn);
//        summaryTrx.setAvg_spec(specAvg);
        summaryTrx.setAvg_daily(dailyAvg);
        summaryTrx.setAvg_with_aw(avgWithAW);
//        summaryTrx.setVariation(variation);
        summaryTrx.setUserName(userName);

        mapper.deleteSummaryTrx(summaryTrx);
        mapper.insertSummaryTrx(summaryTrx);
    }


    private void saveOverallSummary(String userName,String fabId, Long paramId, Date read, Double alarm, Double warn, Double specAvg, Double dailyAvg, Double avgWithAW, Double variation,String classification) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);

        OverallMinuteSummaryTrx summaryTrx = new OverallMinuteSummaryTrx();
        summaryTrx.setParam_id(paramId);
        summaryTrx.setRead_dtts(read);
        summaryTrx.setAlarm(alarm);
        summaryTrx.setWarn(warn);
        summaryTrx.setAvg_spec(specAvg);
        summaryTrx.setAvg_daily(dailyAvg);
        summaryTrx.setAvg_with_aw(avgWithAW);
        summaryTrx.setVariation(variation);
        summaryTrx.setUserName(userName);
        summaryTrx.setCause(classification);

        mapper.deleteSummaryTrx(summaryTrx);
        mapper.insertSummaryTrx(summaryTrx);
    }

    private void saveAlarmTrx(String userName,String fabId, Long paramId, long date, int alarmCode, Double avgWithAW, OverallSpec spec) {
        STDAlarmTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAlarmTrxMapper.class);

        AlarmTrx alarmTrx = new AlarmTrx();
        alarmTrx.setParam_id(paramId);
        alarmTrx.setAlarm_dtts(new Date(date));
        alarmTrx.setStatus_cd((long)alarmCode);
        alarmTrx.setValue(avgWithAW);
        alarmTrx.setAlarm(spec.getAlarm());
        alarmTrx.setWarn(spec.getWarn());
        alarmTrx.setUserName(userName);

        mapper.deleteAlarm(alarmTrx);
        mapper.insertAlarm(alarmTrx);
    }

    private double[] checkSpec(List<BasicData> targetData, String type,Double passCheckValue) {
        List<Date> overTimes = new ArrayList<>();
        List<Double> overValues = new ArrayList<>();
        List<Date> tmpOverTimes = new ArrayList<>();
        List<Double> tmpOverValues = new ArrayList<>();
        for(BasicData d : targetData) {
            Double value = d.getY();
            Double checkValue =passCheckValue;
            if(type.equals("alarm")){
                if(d.getAlarm()!=null) {
                    checkValue = d.getAlarm();
                }
            }else if(d.getWarn()!=null){
                checkValue = d.getWarn();
            }
            if(value >= checkValue) {
                tmpOverValues.add(value);
                tmpOverTimes.add(d.getX());
            } else {
                if(tmpOverValues.size() >= rmsOverCount) {
                    overValues.addAll(tmpOverValues);
                    overTimes.addAll(tmpOverTimes);
                }
                tmpOverValues.clear();
            }
        }
        if(!tmpOverValues.isEmpty()){
            if(tmpOverValues.size() >= rmsOverCount) {
                overValues.addAll(tmpOverValues);
                overTimes.addAll(tmpOverTimes);
            }else if(tmpOverValues.size() == targetData.size() ){ //총 Data가 overallOverCount이하인 경우 모두가 Alarm이나 Warning이면 반영 해 줌
                overValues.addAll(tmpOverValues);
                overTimes.addAll(tmpOverTimes);
            }
            tmpOverValues.clear();
        }

        if(!overValues.isEmpty()) {
            double[] overVs = overValues.stream().mapToDouble(x -> x).toArray();
            //return new double[] {overTimes.get(0).getTime(), StatUtils.mean(overVs)};
            return new double[] {overTimes.get(0).getTime(), median(overVs)};
        }
        return new double[] { Double.NaN, Double.NaN };
    }
    private double median(double[] scores){
        if(scores.length==1){
            return scores[0];
        }
        Arrays.sort(scores);

        double median = 0;
        double pos1 = Math.floor((scores.length-1.0)/2.0);
        double pos2 = Math.ceil((scores.length-1.0)/2.0);

        if(pos1==pos2){
            median = scores[(int)pos1];
        }else{
            median = (scores[(int)pos1] + scores[(int)pos2])/2.0;
        }
        return median;
    }

    private List<Double> getValues(List<BasicData> data) {
        List<Double> values = new ArrayList<>();
        for(BasicData d : data) {
            values.add(d.getY());
        }
        return values;
    }

}
