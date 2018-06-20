package com.bistel.a3.portal.service.pdm.impl.ulsan;

import com.bistel.a3.portal.dao.pdm.ulsan.MeasureTrxMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.ParamDataMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.PartDataMapper;
import com.bistel.a3.portal.domain.common.FilterCriteriaData;
import com.bistel.a3.portal.domain.common.FilterTraceRequest;
import com.bistel.a3.portal.domain.common.HeadDatas;
import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.enums.EuType;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.module.pdm.RpmDataComponent;
import com.bistel.a3.portal.service.pdm.IDataMigrationService;
import com.bistel.a3.portal.service.pdm.ITraceRawDataService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.pdm.Outlier;
import org.apache.commons.math3.stat.StatUtils;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.bistel.a3.portal.domain.pdm.enums.FaultFreqsType.*;

@Service
@ConditionalOnExpression("!${run.standard}")
public class TraceDataService implements com.bistel.a3.portal.service.pdm.ITraceDataService {
    private static Logger logger = LoggerFactory.getLogger(TraceDataService.class);

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private RpmDataComponent rpmDataComponent;

    @Autowired
    private ReportService fabService;

    @Value("${spectrum.causeMessageFormat}")
    private String causeMessageFormat = "'%s' %s: %s";

    @Value("${spectrum.overallWidth}")
    private int overallWidth;
    @Value("${spectrum.nbw}")
    private double nbw;

    @Value("${spectrum.ubalanceRatio}")
    private double ubalanceRatio;
    @Value("${spectrum.ubalanceMin}")
    private double ubalanceMin;
    @Value("${spectrum.misalignmentRatio}")
    private double misalignmentRatio;
    @Value("${spectrum.misalignmentMin}")
    private double misalignmentMin;
    @Value("${spectrum.bearingRatio}")
    private double bearingRatio;
    @Value("${spectrum.bearingMin}")
    private double bearingMin;
    @Value("${spectrum.bearingModelRatio}")
    private double bearingModelRatio;

    @Autowired
    private BeanFactory factory;

    @Autowired
    private IDataMigrationService dataCollectService;

    @Autowired
    private ITraceRawDataService traceRawDataService;
    
    @Override
    public List<MeasureTrx> getMeasureTrxData(String fabId, Long paramId, Long fromdate, Long todate) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        return mapper.selectMeasureTrx(paramId, new Date(fromdate), new Date(todate+1));
    }

    
    @Override
    public List<MeasureTrx> getMeasureTrxData(String fabId, Long paramId, Date from, Date to) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        return mapper.selectMeasureTrx(paramId, from, to);
    }


    
    @Override
    public MeasureTrx getLastMeasureTrx(String fabId, Long paramId, Long fromdate, Long todate) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        return mapper.selectLastMeasureTrx(paramId, new Date(fromdate), new Date(todate+1));
    }

    
    @Override
    public RpmWithPart getRpmData(String fabId, Long measureTrxId)
    {
            MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
            MeasureTrx m = mapper.selectMeasureTrxById(measureTrxId);
            RpmWithPart rpmWithPart = mapper.selectRpmByMeasureTrxId(measureTrxId);
            if(rpmWithPart == null) return null;
            if(rpmWithPart.getRpm() == 0d) {
                Double rpm = mapper.selectListRpmByMeasureId(rpmWithPart.getParam_id(), rpmWithPart.getMeasure_dtts());
                rpmWithPart.setRpm(rpm);
        }

//        Eqp eqp = fabService.getEqpByMeasureTrxId(fabId, measureTrxId);
//        TraceRawDataService binaryService = BeanFactoryAnnotationUtils.qualifiedBeanOfType(factory, TraceRawDataService.class, eqp.getData_type() + "MeasureTrxBinService");
        //List<List<Double>> spectrum = binaryService.getSpectrumData(fabId, measureTrxId);
        List<List<Double>> spectrum = dataCollectService.getSpectrumData(fabId, measureTrxId);
        rpmWithPart.setSpectrum(spectrum);
        checkThreshold(rpmWithPart, spectrum, 1.0d, 0.6d);
        getPartNxData(fabId, rpmWithPart, spectrum, m);
        return rpmWithPart;
    }

    private void checkThreshold(RpmWithPart rpmWithPart, List<List<Double>> spectrum, double vibration, double amplitude) {
        boolean overVibration = false;
        boolean overAmplitude = false;
        for(List<Double> s : spectrum) {
            if(s.get(1) > vibration) {
                overVibration = true;
            }
            if(s.get(1) > amplitude) {
                overAmplitude = true;
            }
        }
        rpmWithPart.setOverVibration(overVibration);
        rpmWithPart.setOverAmplitude(overAmplitude);
    }

    
    @Override
    public CauseAnalysisResult getCauseAnalysis(String fabId, ParamWithCommon paramWithComm, Long measureTrxId) {
        CauseAnalysisResult result = new CauseAnalysisResult();

        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);

        if(paramWithComm == null) {
            MeasureTrx measureTrx = mapper.selectMeasureTrxById(measureTrxId);
            ParamDataMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, ParamDataMapper.class);
            paramWithComm = paramMapper.selectParamWithInfo(measureTrx.getParam_id());
        }

        MeasureTrx m = mapper.selectMeasureTrxById(measureTrxId);
        result.setParamId(m.getParam_id());
        result.setMeasureTrxId(measureTrxId);

        checkImbalanceNmisalignment(fabId, paramWithComm, measureTrxId, result, mapper);
        checkBearing(fabId, paramWithComm, measureTrxId, result, mapper);
        checkLubrication(fabId, paramWithComm, measureTrxId, result, mapper);
        if(result.getCauses().isEmpty()) {
            result = new CauseAnalysisResult();
            result.setParamId(m.getParam_id());
            result.setMeasureTrxId(measureTrxId);
        }
        return result;
    }
    
    @Override
    public List<CauseAnalysisResult> getCauseAnalysisByParamId(String fabId, Long paramId, Date fromdate, Date todate, Double rate) {

        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);

        ParamDataMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, ParamDataMapper.class);
        ParamWithCommon paramWithComm = paramMapper.selectParamWithInfo(paramId);

        List<CauseAnalysisResult> results = new ArrayList<>();

        //List<HashMap<String,Object>> datas =  mapper.selectSpecOutMeasureTrxId(paramId,fromdate,todate);
        List<HashMap<String,Object>> datas =  mapper.selectWarningRateMeasureTrxId(paramId,fromdate,todate,rate);
        SimpleDateFormat dt = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss.S");

        String prev_Cause="";
        Date prev_date = null;
        for (int i = 0; i < datas.size(); i++) {
            long measure_trx_id =Long.valueOf( datas.get(i).get("MEASURE_TRX_ID").toString());
            Date measure_date = null;
            try {
                measure_date = dt.parse(datas.get(i).get("MEASURE_DTTS").toString());
            } catch (ParseException e) {
                e.printStackTrace();
            }
            CauseAnalysisResult causeAnalysisResult = this.getCauseAnalysis(fabId,paramWithComm,measure_trx_id);
            if(causeAnalysisResult.getCauses().size()!=0) {
                if(prev_Cause.isEmpty()){
                    prev_Cause =getCauseMessageString(causeAnalysisResult.getCauses());
                    prev_date = measure_date;
                    causeAnalysisResult.setMeasure_dtts(measure_date);
                    results.add(causeAnalysisResult);
                }else{
                    if((measure_date.getTime()-prev_date.getTime())/ (24 * 60 * 60 * 1000)>7){ // 차이가 7일 이상이면
                        causeAnalysisResult.setMeasure_dtts(measure_date);
                        results.add(causeAnalysisResult);

                    }else if(!prev_Cause.equals( getCauseMessageString(causeAnalysisResult.getCauses()))) {
                        causeAnalysisResult.setMeasure_dtts(measure_date);
                        results.add(causeAnalysisResult);
                    }
                    prev_Cause =getCauseMessageString(causeAnalysisResult.getCauses());
                    prev_date = measure_date;
                }
            }
        }
        if(results.size()==0)
            return null;

        return results;
    }

    
    @Override
    public String createMeasureData(HttpServletRequest request, String fabId, Long eqpId, Date start, Date end) {
        MeasureTrxMapper measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
         measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);

        ParamDataMapper paramDataMapper = SqlSessionUtil.getMapper(sessions, fabId, ParamDataMapper.class);
        List<ParamWithCommon> params = paramDataMapper.selectParamWtihInfoByEqp(eqpId);

        Eqp eqp = fabService.getEqpById(fabId, eqpId);
        //TraceRawDataService binaryService = BeanFactoryAnnotationUtils.qualifiedBeanOfType(factory, TraceRawDataService.class, eqp.getData_type() +"MeasureTrxBinService");

        for (int i = 0; i < params.size(); i++) {

            List<MeasureTrx> measureTrxes =  measureTrxMapper.selectMeasureTrx(params.get(i).getParam_id(),start,end);
            for (int j = 0; j < measureTrxes.size(); j++) {
                List<List<Double>> datas =  traceRawDataService.getSpectrumData(fabId, measureTrxes.get(j).getMeasure_trx_id());
                createFile(request, fabId,eqpId,params.get(i).getParam_id(),measureTrxes.get(j).getMeasure_trx_id(),
                        datas);
            }



        }



        return "Finish";
    }

    private void createFile(HttpServletRequest request,String fabId, Long eqpId, Long paramId,
                            Long measure_trx_id, List<List<Double>> datas) {
        HttpSession session = request.getSession();
        String root_path = session.getServletContext().getRealPath(""); // 웹서비스 root 경로
        String storedFolderPath = root_path + File.separator + fabId;
        File saveFile = new File(storedFolderPath);
        if(saveFile.exists() == false){
            saveFile.mkdirs();
        }

        storedFolderPath += File.separator+eqpId ;
        saveFile = new File(storedFolderPath);
        if(saveFile.exists() == false){
            saveFile.mkdirs();
        }

        storedFolderPath +=File.separator+paramId;
        saveFile = new File(storedFolderPath);
        if(saveFile.exists() == false){
            saveFile.mkdirs();
        }

        BufferedWriter file = null;
        try {

            file = new BufferedWriter(new FileWriter(storedFolderPath+File.separator+measure_trx_id,true));
            for (int i = 0; i < datas.size(); i++) {
                file.write(datas.get(i).get(0)+","+datas.get(i).get(1));
                file.newLine();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }finally {

            try {

                if (file != null)
                    file.close();

                if (file != null)
                    file.close();

            } catch (IOException ex) {

                ex.printStackTrace();

            }

        }

    }

    private String getCauseMessageString(List<String> causes){
        String retVal = "";
        for (int i = 0; i < causes.size(); i++) {
            retVal+=","+causes.get(i);
        }
        if(retVal.length()>0){
            retVal = retVal.substring(1);
        }
        return retVal;
    }


    private void checkLubrication(String fabId, ParamWithCommon paramWithComm, Long measureTrxId, CauseAnalysisResult result, MeasureTrxMapper mapper) {
        if(paramWithComm != null && paramWithComm.getEu_type() != EuType.Acceleration.eutype()) return;

        MeasureTrx measurement = mapper.selectMeasureTrxByEutype(measureTrxId, EuType.Acceleration.eutype());
        if(measurement == null) return;

        Eqp eqp = fabService.getEqpByMeasureTrxId(fabId, measureTrxId);
//        TraceRawDataService binaryService = BeanFactoryAnnotationUtils.qualifiedBeanOfType(factory, TraceRawDataService.class, eqp.getData_type() + "MeasureTrxBinService");
        List<List<Double>> spectrum = traceRawDataService.getSpectrumData(fabId, measureTrxId);
        lubrication(paramWithComm.getName(), result, spectrum);
    }

    private void lubrication(String paramName, CauseAnalysisResult result, List<List<Double>> spectrum) {
        double[] data = spectrum.stream().mapToDouble(x -> x.get(1)).toArray();
        double overall = StatUtils.sumSq(data)/nbw;

        //TODO check threshold overall with alarm lvl

        List<Double[]> hampel = Outlier.runHampelFilter(spectrum, 30, 2d);
        Double threshold = StatUtils.percentile(hampel.stream().mapToDouble(x -> x[0]).toArray(), 50) * 1.5d;

        int index1500 = getIndex(spectrum, 1500d);
        if(index1500 == -1) return;

        List<List<Integer>> overGroup = getOverGroup(hampel, threshold, index1500);
        if(overGroup.isEmpty()) return;

        List<Integer> maxLengthOver = overGroup.stream().max(Comparator.comparingInt(List::size)).get();
        Double maxHz = spectrum.get(spectrum.size()-1).get(0);
        Double checkHz = spectrum.get(maxLengthOver.get(maxLengthOver.size()-1)).get(0) - spectrum.get(maxLengthOver.get(0)).get(0);
        if(checkHz/maxHz > 0.2d) {
            result.addCause(String.format(causeMessageFormat, paramName, "Lubrication", "Defect"));
        }
    }

    private List<List<Integer>> getOverGroup(List<Double[]> hampel, Double threshold, int index1500) {
        List<List<Integer>> overGroup = new ArrayList<>();
        List<Integer> over = new ArrayList<>();
        for(int i = index1500; i<hampel.size(); i++) {
            if(hampel.get(i)[0] > threshold) {
                over.add(i);
            } else {
                if(!over.isEmpty()) {
                    overGroup.add(over);
                    over = new ArrayList<>();
                }
            }
        }
        if(!over.isEmpty()) {
            overGroup.add(over);
        }
        return overGroup;
    }

    private int getIndex(List<List<Double>> spectrum, double target) {
        for(int i=0; i<spectrum.size(); i++) {
            if(spectrum.get(i).get(0) >= target) {
                return i;
            }
        }
        return -1;
    }

    private void checkBearing(String fabId, ParamWithCommon paramWithComm, Long measureTrxId, CauseAnalysisResult result, MeasureTrxMapper mapper) {
        if(paramWithComm != null && paramWithComm.getEu_type() != EuType.Envelop.eutype()) return;

        MeasureTrx measurement = mapper.selectMeasureTrxByEutype(measureTrxId, EuType.Envelop.eutype());
        if(measurement == null) return;

        RpmWithPart rpm = getRpmData(fabId, measureTrxId);
        if(!rpm.isOverAmplitude()) return;

        List<Long> partIdList = getFilteredPartList(rpm.getPartType(), 2);//bearing
        for(Long partyId: partIdList) {
            checkPartBearing(rpm, partyId, result);
        }
    }

    private void checkPartBearing(RpmWithPart rpm, Long partId, CauseAnalysisResult result) {
        Double overall = rpm.getOverall();
        Map<String, Map<Double, Double>> nxMap = rpm.getNxPart().get(partId);

        Double rpmValue = rpm.getRpm();
        Double df = rpm.getDf();

        List<List<Double>> spectrum = rpm.getSpectrum();
        List<Double[]> spec = Outlier.runHampelFilter(spectrum, 30, 1.8d);

        for(String alias : nxMap.keySet()) {
            if(alias.endsWith("BSF")) continue;
            if(alias.endsWith("TF")) continue;

            Map<Double, Double> nx = nxMap.get(alias);
            int count = 0;
            for(Double d : nx.values()) {
                int startIndex = (int) Math.round(d-rpmValue / df) - 1;
                int endIndex = (int) Math.round(d+rpmValue / df) - 1;

                startIndex = startIndex < 0 ? 0 : startIndex;
                endIndex= endIndex >= nx.size() ? nx.size()-1 : endIndex;

                count += checkSpec(spectrum, spec, count, startIndex, endIndex);
            }
            if(count > 1) {
                result.addCause(String.format(causeMessageFormat, rpm.getName(), alias, "Defect"));
            }
        }
    }

    private int checkSpec(List<List<Double>> spectrum, List<Double[]> spec, int count, int startIndex, int endIndex) {
        for(int i=startIndex; i<=endIndex; i++) {
            double val = spectrum.get(i).get(1);
            if(val > spec.get(i)[0] || val < spec.get(i)[1]) {
                return 1;
            }
        }
        return 0;
    }

    private void checkImbalanceNmisalignment(String fabId, ParamWithCommon paramWithComm, Long measureTrxId, CauseAnalysisResult result, MeasureTrxMapper mapper) {
        if(paramWithComm != null && paramWithComm.getEu_type() != EuType.Speed.eutype()) return; //

        MeasureTrx measurement = mapper.selectMeasureTrxByEutype(measureTrxId, EuType.Speed.eutype());
        if(measurement == null) return;

        RpmWithPart rpm = getRpmData(fabId, measureTrxId);
        if(!rpm.isOverVibration()) return;

        List<Long> partIdList = getFilteredPartList(rpm.getPartType(), 0);//moter, pan
        for(Long partyId: partIdList) {
            checkPartImbalanceNmisalignment(rpm, partyId, result);
        }
    }

    private void checkPartImbalanceNmisalignment(RpmWithPart rpm, Long partId, CauseAnalysisResult result) {
        Double overall = rpm.getOverall();
        Map<Long, String> partNameMap = rpm.getPartName();
        Map<String, Map<Double, Double>> nxMap = rpm.getNxPart().get(partId);
        Map<String, Map<Double, Double>> subnxMap = rpm.getSubNxPart().get(partId);

        if(nxMap.isEmpty()) return;

        for(String alias : nxMap.keySet()) {
            Map<Double, Double> nx = nxMap.get(alias);
            Map<Double, Double> subnx = subnxMap.get(alias);
            Double sumNx = nx.values().stream().mapToDouble(Double::doubleValue).sum();
            Double sumSubNx = subnx.values().stream().mapToDouble(Double::doubleValue).sum();
            if(sumNx <= sumSubNx) return;
            if(sumNx/overall <= 0.8) return;

            Double sum3Nx = new ArrayList<>(nx.values()).subList(0, 3).stream().mapToDouble(Double::doubleValue).sum();
            if(sum3Nx/overall <= 0.8) return;

            Double oneX = nx.values().iterator().next();
            if(oneX/overall > 0.8) {
                result.addCause(String.format(causeMessageFormat, rpm.getName(), alias, "Unbalance"));
            } else {
                result.addCause(String.format(causeMessageFormat, rpm.getName(), alias, "Misalignment"));
            }
        }
    }

    private List<Long> getFilteredPartList(Map<Long, Integer> partType, int partTypeId) {
        List<Long> result = new ArrayList<>();
        for(Map.Entry<Long, Integer> e : partType.entrySet()) {
            if(e.getValue() == partTypeId) {
                result.add(e.getKey());
            }
        }
        return result;
    }

    
    @Override
    public MeasureTrx getModelMeasureTrx(String fabId, Long measurementId) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        return mapper.selectModelMeasureTrx(measurementId);
    }

    
    @Override
    public List<MeasureTrx> getMeasureTrxData(String fabId, Date from, Date to) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        return mapper.selectMeasureTrxData(from, to);
    }

    
    @Override
    public List<String> manualClassification(ManualClassification request) {
        RpmWithPart rpmWithPart = new RpmWithPart();
        rpmWithPart.setRpm(request.getRpm());
        rpmWithPart.setName("TEST");
        rpmWithPart.setSpectrum(request.getSpectrum());
        rpmWithPart.setDf(request.getEndFreq()*1.0/request.getSpectraLines()*1.0);
        calcStat(rpmWithPart, request.getSpectrum());
        checkThreshold(rpmWithPart, rpmWithPart.getSpectrum(), request.getVibrationT(), request.getEnvelopingT());

        Part part = new Part();
        part.setPart_id(1l);
        part.setName("MANUAL");

        CauseAnalysisResult result = new CauseAnalysisResult();
        if(request.getType() == EuType.Speed) {
            calcNxWithSubNx(rpmWithPart, part, null, rpmWithPart.getRpm()/60, request.getSpectrum(), rpmWithPart.getDf());
            checkPartImbalanceNmisalignment(rpmWithPart, part.getPart_id(), result);
        } else if(request.getType() == EuType.Envelop) {
            calcNxWithSubNx(rpmWithPart, part, "BPFI", request.getRpm() * request.getBpfi()/60, request.getSpectrum(), rpmWithPart.getDf());
            calcNxWithSubNx(rpmWithPart, part, "BPFO", request.getRpm() * request.getBpfo()/60, request.getSpectrum(), rpmWithPart.getDf());
            checkPartBearing(rpmWithPart, part.getPart_id(), result);
        } else if(request.getType() == EuType.Acceleration) {
            lubrication(rpmWithPart.getName(), result, request.getSpectrum());
        }

        return result.getCauses();
    }


    private void getPartNxData(String fabId, RpmWithPart rpmWithPart, List<List<Double>> spectrum, MeasureTrx m) {
        PartDataMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartDataMapper.class);
        if(rpmWithPart.getRpm() == null) return;

        calcStat(rpmWithPart, spectrum); // set overall, mean, stddev into RpmWithPart

        List<Part> parts = mapper.selectPartsByEqpWithPartType(rpmWithPart.getParam_id(), null);
        addPartNx(fabId, mapper, rpmWithPart, parts, spectrum, m);
    }

    private void addPartNx(String fabId, PartDataMapper mapper, RpmWithPart rpmWithPart, List<Part> parts, List<List<Double>> spectrum, MeasureTrx m) {
        Double df = m.getEnd_freq() * 1.0 / m.getSpectra_line() * 1.0;
        rpmWithPart.setDf(df);

        for(Part part : parts) {
            Double rpm = getPartRpm(fabId, rpmWithPart, part);
            Double oneX = rpm / 60;

            int parttype = part.getPart_type_id();
            if(parttype == shaft.type() || parttype == disc.type() || parttype == belt.type()) {
                calcNxWithSubNx(rpmWithPart, part, null, oneX, spectrum, df);
            } else if(parttype == bearing.type()) {
                String modelNumber = part.getModel_number();
                String manufacture = part.getManufacture();
                if(modelNumber == null || manufacture == null) continue;

                Bearing bearing = mapper.selectBearingInfo(manufacture, modelNumber);
                calcNxWithSubNx(rpmWithPart, part, "BPFI", rpm * bearing.getBpfi()/60, spectrum, df);
                calcNxWithSubNx(rpmWithPart, part, "BPFO", rpm * bearing.getBpfo()/60, spectrum, df);
                calcNxWithSubNx(rpmWithPart, part, "BSF", rpm * bearing.getBsf()/60,  spectrum, df);
                calcNxWithSubNx(rpmWithPart, part, "TF", rpm * bearing.getFtf()/60,  spectrum, df);
            } else if(parttype == gearWheel.type() || parttype == impeller.type() || parttype == pumpWeel.type()) {
                Double fPar1 =  part.getNpar1();
                calcNxWithSubNx(rpmWithPart, part, null, oneX * fPar1, spectrum, df);
            } else if(parttype == electricalRotor.type() || parttype == electricalStator.type()) {
                Double fPar1 =  part.getNpar1();
                calcNxWithSubNx(rpmWithPart, part, "Rotor bars", oneX * fPar1, spectrum, df);
                calcNxWithSubNx(rpmWithPart, part, "Grid freq", part.getNpar2(), spectrum, df);
            }
        }
    }

    private void calcNxWithSubNx(RpmWithPart rpmWithPart, Part part, String alias, Double xValue, List<List<Double>> spectrum, Double df) {
        int nxIndex = 0;
        int maxIndex = spectrum.size()-1;

        Map<Double, Double> subNx = new TreeMap<>();
        Map<Double, Double> nx = new TreeMap<>();

        int spectrumIndex = 0;
        double sum;
        while(true) {
            int xIndex = (int) Math.round(xValue * (nxIndex + 1) / df) - 1;
            if(xIndex < 0 || xIndex > maxIndex) break;

            sum = 0d;
            int start = xIndex-overallWidth; start = start<0 ? 0 : start;
            int end = xIndex+overallWidth; end = end>maxIndex? maxIndex: end;

            for(int i = spectrumIndex; i<start; i++) {
                sum += Math.pow(spectrum.get(i).get(1), 2);
            }
            subNx.put(spectrum.get(xIndex).get(0), Math.sqrt(sum/nbw));

            sum = 0d;
            for(int i = start; i<=end; i++) {
                sum += Math.pow(spectrum.get(i).get(1), 2);
            }
            nx.put(spectrum.get(xIndex).get(0), Math.sqrt(sum/nbw));

            spectrumIndex = end+1;
            nxIndex++;
        }
        sum = 0d;
        for(int i=spectrumIndex; i<=maxIndex; i++) {
            sum += Math.pow(spectrum.get(i).get(1), 2);
        }
        if(sum > 0d) {
            subNx.put(xValue * (nxIndex + 1), Math.sqrt(sum/nbw));
        }

        alias = alias == null ? part.getName() : String.format("%s %s", part.getName(), alias);
        rpmWithPart.addSubNxPart(part.getPart_id(), alias, subNx);
        rpmWithPart.addNxPart(part.getPart_id(), part.getName(), alias, part.getPart_type_id(), nx);
    }

    private Double getPartRpm(String fabId, RpmWithPart rpmWithPart, Part mp) {
        Double r = rpmWithPart.getRpm();
        if(r == 0d) {
            r = rpmDataComponent.getSpeed(fabId, mp.getSpeed_param_id());
            rpmWithPart.setRpm(r);
        }
        return mp.getRatio() * r;
    }

    private void calcStat(RpmWithPart rpmWithPart, List<List<Double>> spectrum) {
        double[] data = spectrum.stream().mapToDouble(x -> x.get(1)).toArray();
        double mean = StatUtils.mean(data);
        double stddev = Math.sqrt(StatUtils.variance(data));
        double overall = StatUtils.sumSq(data);

        rpmWithPart.setOverall(Math.sqrt(overall/nbw));
        rpmWithPart.setMean(mean);
        rpmWithPart.setStddev(stddev);
    }

    @Override
    public List<List<Object>> getTraceData(String fabId, Long paramId, Long fromdate, Long todate) {
        ParamDataMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ParamDataMapper.class);
        List<BasicData> data = mapper.selectData(paramId, new Date(fromdate), new Date(todate));
        return changeList(data);
    }

    @Override
    public List<HashMap<String, Object>> getFilterTraceData(String fabId, List<Long> eqpIds, List<String> paramNames, Date from, Date to) {
        return null;
    }
    @Override
    public List<HashMap<String, Object>> getEqpIdsParamIdsInFilterTraceData(String fabId, List<Long> eqpIds, List<String> paramNames, Date from, Date to,List<FilterCriteriaData> filterDatas) {
        return null;
    }

    @Override
    public List<STDTraceTrx> getFilterTraceDataByEqpIdParamNames(String fabId, Long eqpId, List<Long> paramIds, Date from, Date to) {
        return null;
    }

    @Override
    public List<STDTraceTrx> getFilterTraceDataByEqpIdParamId(String fabId, Long eqpId, Long paramId, Date from, Date to, FilterTraceRequest filterTraceRequest) {
        return null;
    }

    @Override
    public List<EqpParamDatas> getFilterTraceDataByEqpIdParamIds(String fabId, Long eqpId,String eqpName, List<Long> paramIds, List<String> paramNames, Date from, Date to, FilterTraceRequest bodyData) {
        return null;
    }

    @Override
    public Object getEventSimulation(String fabId, Long paramId, Long fromdate, Long todate, Float condition) {
        return null;
    }

    @Override
    public Object getEventSimulationByConditionValue(String fabId,Long paramId,Long fromdate,Long todate,Long conditionParamId,Float conditonValue,String eventType,List<String> adHocFunctions,Integer adHocTime){
        return null;
    }
    private List<List<Object>> changeList(List<BasicData> data) {
        List<List<Object>> result = new ArrayList<>();
        for(BasicData d : data) {
            result.add(Arrays.asList(d.getX().getTime(), d.getY() ,d.getAlarm(),d.getWarn() ));
        }
        return result;
    }
}
