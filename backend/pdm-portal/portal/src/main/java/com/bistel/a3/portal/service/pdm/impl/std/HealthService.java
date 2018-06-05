package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.common.util.JsonUtil;
import com.bistel.a3.common.util.Pivot;
import com.bistel.a3.common.util.imageChart.ImageChart;
import com.bistel.a3.portal.dao.pdm.std.master.STDEqpMapper;
import com.bistel.a3.portal.dao.pdm.std.report.STDReportMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDHealthMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceDataMapper;
import com.bistel.a3.portal.domain.pdm.DataWithSpec;
import com.bistel.a3.portal.domain.pdm.EqpWithHealthModel;
import com.bistel.a3.portal.domain.pdm.db.HealthDaily;
import com.bistel.a3.portal.domain.pdm.db.HealthModel;
import com.bistel.a3.portal.domain.pdm.db.HealthStat;
import com.bistel.a3.portal.domain.pdm.db.ReportAlarm;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.module.common.RJavaComponent;
import com.bistel.a3.portal.service.pdm.IHealthService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;
import com.bistel.algo.core.decisiontree.RandomForest;
import com.bistel.algo.core.stat.MVA.MSPC;
import com.bistel.algo.core.stat.MVA.PCAWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@ConditionalOnExpression("${run.standard}")
public class HealthService implements IHealthService {
    private static Logger logger = LoggerFactory.getLogger(HealthService.class);

    private enum KEY {
        STATUS, SPEC_ALARM, SPEC_WARNING, DATA, MESSAGE
    }

    private enum RDATA_KEY {
        time, healthindex
    }

    private double[] getRandomArray(int size) {
        Random r = new Random();
        double[] result = new double[size];
        for(int i=0; i<size; i++) {
            result[i] = r.nextDouble();
        }
        return result;
    }
    private ReportAlarm makeAlarmReport(HealthStat h) {
        ReportAlarm r = new ReportAlarm();

        r.setEqp_id(h.getEqp_id());
        r.setParam_id(h.getParamId());
        r.setMeasure_trx_id(h.getMeasureTrxId());
        r.setOccur_dtts(h.getMeasure_dtts());
        r.setScore(h.getScore());
        r.setState_cd("0");
        r.setCause1(h.getCause1());
        r.setCause2(h.getCause2());
        r.setCause3(h.getCause3());

        return r;
    }
    private List<HashMap<String,Object>>  getTrendDataToPivot(String fabId, Long eqpId, Date from, Date to) throws Exception {
        logger.info("Start getTrendDataToPivot fabId:{} eqpId:{}",fabId,eqpId);
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        List<HashMap<String, Object>> pdmRawData = null;
        pdmRawData = STDHealthMapper.selectOverallByTime(eqpId,from,to);

        if(pdmRawData.size()==0){

            throw new Exception("There is no data");
        }

        Pivot pivoitData = new Pivot();

        try {
            List<List<String>> resultData = pivoitData.getPivotDataByTime(pdmRawData, "time", "name");
            List<String> headers = resultData.get(0);
            List<List<String>> headerDatas = new ArrayList<>();

            for (int i = 0; i < headers.size(); i++) {
                headerDatas.add(new ArrayList<String>());
            }

            for (int i = 1; i < resultData.size(); i++) {
                List<String> rowData = resultData.get(i);
                for (int j = 0; j < rowData.size(); j++) {
                    headerDatas.get(j).add(rowData.get(j));
                }
            }
            List<HashMap<String,Object>> parameters = new ArrayList<HashMap<String,Object>>();

            //time
            HashMap<String,Object> parameter = new HashMap<String,Object>();
            parameter.put("name",headers.get(0));
            List<Long> timeValues = new ArrayList<>();
            for (int i = 0; i < headerDatas.get(0).size(); i++) {
                timeValues.add(Long.valueOf( headerDatas.get(0).get(i)));
            }
            parameter.put("values",timeValues);
            parameters.add(parameter);

            for (int i = 1; i < headerDatas.size(); i++) {
                parameter = new HashMap<>();
                List<Object> paramValues = new ArrayList<>();
                for (int j = 0; j < headerDatas.get(i).size(); j++) {
                    paramValues.add(headerDatas.get(i).get(j));
                }
                for (int j = 0; j < headerDatas.get(i).size(); j++) {
                    checkNullAndFill(paramValues, j);
                }
                boolean allDataNull = true;
                for(int j=0; j<paramValues.size(); j++) {
                    if(paramValues.get(j) != null) {
                        paramValues.set(j, Double.valueOf((String) paramValues.get(j)));
                        allDataNull = false;
                    }
                }
                if(allDataNull) {
                    throw new Exception("There is a parameter to null all the data");
                }

                parameter.put("name",headers.get(i));
                parameter.put("values",paramValues);
                parameters.add(parameter);

            }
            logger.info("End getTrendDataToPivot fabId:{} eqpId:{}",fabId,eqpId);
            return parameters;

        } catch (ParseException e) {
            throw new Exception("There is no data");
        }
    }
    private HashMap<String, Object> getBuildAndHealthByDataForAutoModeler(String fabId,long eqpId, long fromDate, long toDate, List<String> model_params, List<HashMap<String,Object>> datas) {

        HashMap<String, Object> result = new HashMap<String, Object>();

        int iIndex =model_params.indexOf("time");
        if(iIndex>=0){
            model_params.remove(iIndex);
        }

        TrainingDataAB trainingDataAB=null;

        try {
            trainingDataAB = getFilterData(datas,fromDate,toDate,model_params,true);
        } catch (Exception e) {
            result.put("result", "fail");
            result.put("data", e.getMessage());
            return result;
        }

        double [][] newTrainingData = trainingDataAB.getTrainingData();
        TrainingDataAB trainingDataABAll = getTransDataRemoveTime(datas,model_params);

        //PCABasedMSPC pc = new PCABasedMSPC(newTrainingData);
        MSPC pc = new MSPC(newTrainingData);
        String mspcModelString = pc.saveModel();

        PCAWrapper pcaWrapper = new PCAWrapper(newTrainingData);
        String pcaModelString = pcaWrapper.saveModel();

        Double alarmSpec=null;
        try {
            alarmSpec =Math.log(getSpec(fabId,eqpId,pc,model_params));
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
            alarmSpec = pc.getUCL();
        }

        HashMap<String,Object> retDatas = new HashMap<String,Object>();

        HashMap<String,Object> model  = new HashMap<String,Object>();
        model.put("model",mspcModelString);
        model.put("pca_model",pcaModelString);
        model.put("model_params",model_params);
        model.put("model_fromDate",fromDate);
        model.put("model_toDate",toDate);
        model.put("model_alarm_spec",alarmSpec);
        model.put("model_warning_spec",alarmSpec*80/90); //80점을 warning으로 하기 위한 조치

        retDatas.put("model",model);

        result.put("result", "success");
        result.put("data", retDatas);

        return result;
    }
    private List<Long> getTimes(List<HashMap<String, Object>> datas){
        for (int i = 0; i < datas.size(); i++) {
            HashMap<String,Object> parameter = datas.get(i);
            String name =(String) parameter.get("name");
            if(name.equals("time")){
                return (List<Long>)parameter.get("values");
            }
        }
        return new ArrayList<>();
    }
    private TrainingDataAB getTransDataRemoveTime(List<HashMap<String, Object>> datas, List<String> filterNames) {
        List<List<Double>> newDatas = new ArrayList<>();
        List<String> names = new ArrayList<String>();

        HashMap<String,String> filterNamesKeys = new HashMap<String,String>();
        for (int i = 0; i < filterNames.size(); i++) {
            String key = filterNames.get(i);
            filterNamesKeys.put(key,key);
        }

        for (int i = 0; i < datas.size(); i++) {
            HashMap<String,Object> parameter = datas.get(i);
            String name =(String) parameter.get("name");
            if(filterNamesKeys.containsKey(name)){
                newDatas.add((List<Double>)parameter.get("values"));
                names.add(name);
            }
        }
        TrainingDataAB trainingDataAB = new TrainingDataAB();
        trainingDataAB.setTrainingData(transDataWithString(newDatas));
        trainingDataAB.setNames(names);
        return trainingDataAB;
    }
    private TrainingDataAB getFilterData(List<HashMap<String, Object>> datas, long fromDate, long toDate,List<String> params,boolean isSameDataCheck) throws Exception {
        return getFilterDataMore(false,datas,fromDate,toDate,0,0,true,params,isSameDataCheck);
    }
    private TrainingDataAB getFilterDataMore(boolean isMultiRange,List<HashMap<String, Object>> datas, long a_fromDate, long a_toDate, long b_fromDate, long b_toDate,boolean isTempDataFill,List<String> params,boolean isSameDataCheck) throws Exception {
        logger.info("Start getFilterDataMore");
        //data format
        //[
        //  {name:"time",values:[1,2,3,4,]},
        //  {name:"param1",values:[1,2,3,4,]},
        //]
        List<Object> times= new ArrayList<>();
        List<String> names = new ArrayList<String>();
        //1. time data만 가져 온다.
        //2. fromDate 와 toDate의 Data만 Filter.
        List<Integer > aFilterDataRows = new ArrayList<Integer>();
        List<Integer > bFilterDataRows = new ArrayList<Integer>();
        for (int i = 0; i < datas.size(); i++) {
            HashMap<String,Object> parameter = datas.get(i);
            String name = parameter.get("name").toString();

            if(name.equals("time")){
                List<Long> timeDatas=(List<Long>) parameter.get("values");
                for (int j = 0; j < timeDatas.size(); j++) {
                    Long timeValue = timeDatas.get(j);
                    if(a_fromDate==0 && a_toDate==0){
                        aFilterDataRows.add(j);
                        times.add(timeValue);
                    }
                    else if (a_fromDate <= timeValue && timeValue <= a_toDate) {
                        aFilterDataRows.add(j);
                        times.add(timeValue);
                    }else if(isMultiRange && b_fromDate <= timeValue && timeValue <= b_toDate) {
                        bFilterDataRows.add(j);
                        times.add(timeValue);
                    }
                }
                break;
            }
        }

        HashMap<String,String> paramsKeys = new HashMap<String,String>();
        for (int i = 0; i < params.size(); i++) {
            String key = params.get(i);
            paramsKeys.put(key,key);
        }

        List<List<Double>> trainingParamDatasList = new ArrayList<List<Double>>();

        for (int i = 0; i < datas.size(); i++) {
            HashMap<String, Object> parameter = datas.get(i);
            String name = parameter.get("name").toString();

            if (!name.equals("time") & paramsKeys.containsKey(name)) {
                names.add(name);
                List<Object> parameterValues =(List<Object>) parameter.get("values");

                List<Double> dRowDataValues = new ArrayList<Double>();
                for (int j = 0; j < aFilterDataRows.size(); j++) {
                    int dataRowIndex = aFilterDataRows.get(j);
                    checkNullAndFill(parameterValues,dataRowIndex);
                    Double value = (Double) parameterValues.get(dataRowIndex);
                    dRowDataValues.add(value);
                }
                for (int j = 0; j < bFilterDataRows.size(); j++) {
                    int dataRowIndex = bFilterDataRows.get(j);
                    checkNullAndFill(parameterValues,dataRowIndex);
                    Double value = (Double) parameterValues.get(dataRowIndex);
                    dRowDataValues.add(value);
                }
                trainingParamDatasList.add(dRowDataValues);
            }
        }

        TrainingDataAB trainingDataAB = new TrainingDataAB();
        trainingDataAB.setaSize(aFilterDataRows.size());
        trainingDataAB.setbSize(bFilterDataRows.size());

        if(isSameDataCheck) {
            List<String> sameValueVariables = getSameValueVariable(trainingParamDatasList, names);
            if (sameValueVariables.size() > 0) {
                throw new Exception("Please remove the follwing parameters(all same values).[" + StringUtils.join(sameValueVariables) + "]");
            }
        }

        double[][] newTrainingData = transData(trainingParamDatasList);
        trainingDataAB.setTrainingData(newTrainingData);
        trainingDataAB.setNames(names);
        trainingDataAB.setTimes(times);

        logger.info("End getFilterDataMore");
        return trainingDataAB;
    }
    private void checkNullAndFill(List<Object> parameterValues, int columnIndex) {
        if(parameterValues.get(columnIndex)==null){
            if(columnIndex==0){
                for (int i = columnIndex+1; i < parameterValues.size(); i++) {
                    if(parameterValues.get(i)!=null){
                        parameterValues.set(columnIndex, parameterValues.get(i));
                        break;
                    }
                }
            }else{
                parameterValues.set(columnIndex, parameterValues.get(columnIndex-1));
            }
        }
    }
    private void copyValueWithOutlier(List<Long> times, List<Double> parameterValues, int columnIndex, long startX, long endX, double startY, double endY) {
        logger.info("Start copyValueWithOutlier");
        if(columnIndex==0){
            for (int i = columnIndex+1; i < parameterValues.size(); i++) {

                if(parameterValues.get(i)!=null && !(startX <= times.get(i) && times.get(i) <=endX && startY<=parameterValues.get(i) &&parameterValues.get(i) <= endY  )){
                    parameterValues.set(columnIndex, parameterValues.get(i));
                    break;
                }
            }
        }else{
            parameterValues.set(columnIndex, parameterValues.get(columnIndex-1));
        }
        logger.info("End copyValueWithOutlier");
    }
    private double[][] transData(List<List<Double>> datas) {

        int parameterCount = datas.get(0).size();
        double[][] retDatas = new double[parameterCount][];

        for (int i = 0; i < parameterCount ; i++) {
            double[] values = new double[datas.size()];
            for (int j = 0; j < datas.size(); j++) {
                values[j] = datas.get(j).get(i);
            }
            retDatas[i] = values;
        }
        return retDatas;
    }
    private double[][] transDataWithString(List<List<Double>> datas) {

        int parameterCount = datas.get(0).size();
        double[][] retDatas = new double[parameterCount][];

        for (int i = 0; i < parameterCount ; i++) {
            double[] values = new double[datas.size()];
            for (int j = 0; j < datas.size(); j++) {
                values[j] = datas.get(j).get(i);
            }
            retDatas[i] = values;
        }
        return retDatas;
    }
    private HashMap<String, Object> saveModelForAutoModeler(String fabId, Long eqpId, String model,String pca_model, List<String> model_params, long fromDate, long toDate,String userId,String description,String create_type_cd,double alarm_spec,double warn_spec) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);

        StringWriter sw =new StringWriter();
        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writeValue(sw, model_params);
        } catch (IOException e) {
            e.printStackTrace();
        }

        String sParams = sw.toString();

        List<HealthModel> result = STDHealthMapper.selectModel(eqpId);
        if(result.size()>0){
            STDHealthMapper.updateHealthModel(eqpId,model,pca_model,new Date(fromDate),new Date(toDate),userId,description,create_type_cd,alarm_spec,warn_spec,sParams);
            List<HashMap<String,Object>> historyResult = STDHealthMapper.selectMaxVersionHealthModelHst(eqpId);
            if(historyResult.get(0)!=null){
                long version = Long.valueOf( historyResult.get(0).get("VERSION").toString())+1;
                STDHealthMapper.insertHealthModelHst(eqpId,model,pca_model,new Date(fromDate),new Date(toDate),userId,description,create_type_cd,alarm_spec,warn_spec,sParams ,version);
            }else{
                STDHealthMapper.insertHealthModelHst(eqpId,model,pca_model,new Date(fromDate),new Date(toDate),userId,description,create_type_cd,alarm_spec,warn_spec,sParams ,(long)1);
            }

        }else{
            STDHealthMapper.insertHealthModel(eqpId,model,pca_model,new Date(fromDate),new Date(toDate),userId,description,create_type_cd,alarm_spec,warn_spec,sParams);
            STDHealthMapper.insertHealthModelHst(eqpId,model,pca_model,new Date(fromDate),new Date(toDate),userId,description,create_type_cd,alarm_spec,warn_spec,sParams ,(long)1);
        }
        return null;
    }
    private HashMap<String, Object> getServerAnalysisDataForAutoModeler(String fabId, Long eqpId, Date fromDate, Date toDate) {

        HashMap<String, Object> result = new HashMap<String, Object>();
        List<HashMap<String, Object>> dataObject = null;
        try {
            dataObject = getTrendDataToPivot(fabId, eqpId, fromDate, toDate);
        } catch (Exception e) {
            result.put("result", "fail");
            result.put("data", e.getMessage());
            return result;
        }
        HashMap<String,Object> parameterDatas = new HashMap<>();
        parameterDatas.put("parameters",dataObject);

        result.put("result", "fail");
        result.put("data", parameterDatas);

        return result;
    }
    private double getSpec(String fabId,long eqpId, MSPC pc, List<String> parameters) throws Exception {
        STDTraceDataMapper overallMinuteTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, STDTraceDataMapper.class);

        List<HashMap<String,Object>> datas = overallMinuteTrxMapper.selectSpecByEqpId(eqpId);
        HashMap<String,Double> paramDatas = new HashMap<>();
        for (int i = 0; i < datas.size(); i++) {
            String name = (String)datas.get(i).get("NAME");
            Double value = (Double)datas.get(i).get("ALARM");
            paramDatas.put(name,value);
        }

        double[][] specDatas = new double[1][parameters.size()];
        for (int i = 0; i < parameters.size(); i++) {
            specDatas[0][i] = paramDatas.get(getOnlyParam(parameters.get(i)));
        }


        MSPC.MSPCPredictResult preDicResult =  pc.predict(specDatas);
        return Double.valueOf( preDicResult.getT2Distance()[0]);
    }
    private String getOnlyParam(String param) {
        try {
            int iPosition = param.lastIndexOf("_");
            return param.substring(0, iPosition );
        }catch(Exception e){
            return param;
        }

    }
    private HashMap<String, Object> getChartImage(List<String> parameters, int width, int height, List<HashMap<String, Object>> datas,Double yMin,Double yMax,Double alarmSpec,Double warningSpec,Double healthIndexAlarmSpec,Long fromDate,Long toDate) {
        logger.info("Start getChartImage");
        HashMap<String, Object> result = new HashMap<String, Object>();

        List<Long> times =(List<Long>) datas.get(0).get("values");

        long xMin = times.get(0);
        long xMax = times.get(times.size()-1);

        if(yMin==null) {
            yMin = 0.0;
            yMax = 0.0;

            for (int i = 1; i < datas.size(); i++) {
                String name = (String) datas.get(i).get("name");
                if(parameters.indexOf(name) >=0) {
                    List<Double> values = (List<Double>) datas.get(i).get("values");
                    for (int j = 0; j < values.size(); j++) {
                        Double value = values.get(j);
                        if (yMin > value) {
                            yMin = value;
                        } else if (yMax < value) {
                            yMax = value;
                        }
                    }
                }
            }
            if(alarmSpec!=null) {
                if (alarmSpec > yMax) yMax = alarmSpec;
                if (warningSpec < yMin) yMin = warningSpec;
            }
        }

        HashMap<String,Object > chartData = new HashMap<>();
        List<HashMap<String,Object>> serieses = new ArrayList<>();
        int colors[] = new int[]{};
        BufferedImage bufferedImage = null;
        int colorIndex =0;
        for (int i = 1; i < datas.size(); i++) {
            String name =(String)datas.get(i).get("name");
            if(parameters.indexOf(name) >=0) {

                int color = ImageChart.getDefIntColor(colorIndex);
                ImageChart imageChart = new ImageChart(width, height, xMin, xMax, yMin, yMax, color, 1);

                if(((List<Object>) datas.get(i).get("values")).size()>0 &&
                        ((List<Object>) datas.get(i).get("values")).get(0).getClass().toString().equals("class java.lang.Double")){
                    List<Double> data = (List<Double>) datas.get(i).get("values");
                    for (int iSeriesData = 0; iSeriesData < data.size(); iSeriesData++) {
                        double x = times.get(iSeriesData);
                        double y = data.get(iSeriesData);
                        imageChart.addPoint(x, y);
                    }
                }else{
                    List<String> data = (List<String>) datas.get(i).get("values");
                    for (int iSeriesData = 0; iSeriesData < data.size(); iSeriesData++) {
                        double x = Double.valueOf(times.get(iSeriesData));
                        double y = Double.valueOf(data.get(iSeriesData));
                        imageChart.addPoint(x, y);
                    }
                }

                if (bufferedImage == null) {
                    if(alarmSpec!=null) {
                        imageChart.addLine(xMin, alarmSpec, xMax, alarmSpec, ImageChart.getColor(255, 0, 0, 255));
                        imageChart.addLine(xMin, warningSpec, xMax, warningSpec, ImageChart.getColor(255, 255, 0, 255));
                    }
                    if(healthIndexAlarmSpec!=null){
                        imageChart.addLine(xMin, healthIndexAlarmSpec, xMax, healthIndexAlarmSpec, ImageChart.getColor(255,0,255,255));
                    }
                    bufferedImage = imageChart.getBufferdImage();

                    if(fromDate!=null){ // Model set point
                        color = ImageChart.getColor(0,255,0,255);//lime
                        ImageChart imageChartModel = new ImageChart(width, height, xMin, xMax, yMin, yMax, color, 1);
                        List<Double> data = (List<Double>) datas.get(i).get("values");
                        for (int j = 0; j <data.size() ; j++) {
                            long x = times.get(j);
                            if(fromDate<=x && x<=toDate) {
                                double y = data.get(j);
                                imageChartModel.addPoint(x,y);
                            }
                        }
                        bufferedImage = ImageChart.attachImages(bufferedImage,imageChartModel.getBufferdImage());
                    }
                } else {
                    bufferedImage = ImageChart.attachImages(bufferedImage, imageChart.getBufferdImage());
                }
                HashMap<String,Object > series = new HashMap<>();
                series.put("name", name);
                series.put("color", ImageChart.getDefHexColor(colorIndex++));
                serieses.add(series);
            }
        }

        String imageString = ImageChart.getImageConvertText(bufferedImage);

        chartData.put("xMin",xMin);
        chartData.put("xMax",xMax);
        chartData.put("yMin",yMin);
        chartData.put("yMax",yMax);
        chartData.put("chartImage",imageString);
        chartData.put("series",serieses);
        chartData.put("alarmSpec",alarmSpec);

        result.put("result", "success");
        result.put("data", chartData);

        logger.info("End getChartImage");

        return result;
    }
    private List<HashMap<String, Object>> getScale(List<HashMap<String, Object>> datas) {
        List<HashMap<String,Object>> newDatas = new ArrayList<>();
        newDatas.add(datas.get(0));
        for (int i = 1; i < datas.size(); i++) {
            List<Double> values = (List<Double>) datas.get(i).get("values");
            double min =0;
            double max =0;
            List<Double> newValues = new ArrayList<>();
            for (int j = 0; j < values.size(); j++) {
                double value =values.get(j);
                if(value>max){
                    max = value;
                }else if(value<min){
                    min =value;
                }
                newValues.add(value);
            }
            HashMap<String,Object> param = new HashMap<>();
            param.put("name",datas.get(i).get("name"));
            double diff = max-min;
            List<Double> scaleValues = new ArrayList<>();
            for (int j = 0; j < newValues.size(); j++) {
                double value = (newValues.get(j)-min)/diff;
                scaleValues.add( value);
            }
            param.put("values",scaleValues);

            newDatas.add(param);

        }
        return newDatas;
    }
    private List<HashMap<String, Object>> getFilterDataFromFile(String dataId, long lFromDate, long lToDate, List<String> parameters) throws Exception {
        logger.info("Start getFilterDataFromFile dataId:{}",dataId);
        List<HashMap<String,Object>> datas = readData(dataId);

        List<HashMap<String,Object>> returnVal = new ArrayList<>();

        List<Long> times = new ArrayList<>();
        List<Integer> rowIndexes = new ArrayList<>();

        List<Long> values =(List<Long>) datas.get(0).get("values");
        for (int i = 0; i <values.size() ; i++) {
            Long timeValue =values.get(i);
            if(timeValue>= lFromDate && timeValue <=lToDate){
                times.add(timeValue);
                rowIndexes.add(i);
            }
        }
        HashMap<String,Object> retData = new HashMap<>();
        retData.put("name","time");
        retData.put("values",times);
        returnVal.add(retData);

        for (int i = 1; i < datas.size(); i++) {
            List<Double> data =( List<Double>) datas.get(i).get("values");
            String name = (String)datas.get(i).get("name");
            List<Double> newData  = new ArrayList<>();
            for (int j = 0; j < rowIndexes.size(); j++) {
                newData.add(data.get(rowIndexes.get(j)));
            }

            retData = new HashMap<>();
            retData.put("name",name);
            retData.put("values",newData);
            returnVal.add(retData);
        }
        logger.info("End getFilterDataFromFile dataId:{}",dataId);

        return returnVal;
    }
    private List<HashMap<String, Object>> getFilterDataFromFileOutlier(String dataId,String type, long lFromDate, long lToDate, List<String> parameters, long startX,long endX,double startY,double endY) throws Exception {
        logger.info("Start getFilterDataFromFileOutlier dataId:{}",dataId);

        List<HashMap<String,Object>> returnVal = new ArrayList<>();
        List<HashMap<String, Object>> saveVal = new ArrayList<>();

        List<HashMap<String,Object>> datas = readData(dataId);
        List<Long> times = new ArrayList<>();
        List<Long> saveTimes = new ArrayList<>();
        List<Integer> rowIndexes = new ArrayList<>();
        List<Long> timeValues =(List<Long>) datas.get(0).get("values");
        for (int i = 0; i <timeValues.size() ; i++) {
            Long timeValue =timeValues.get(i);
            if(timeValue>= lFromDate && timeValue <=lToDate){
                times.add(timeValue);
                rowIndexes.add(i);
            }
            saveTimes.add(timeValue);
        }
        HashMap<String,Object> retData = new HashMap<>();
        retData.put("name","time");
        retData.put("values",times);
        returnVal.add(retData);

        HashMap<String, Object> saveData = new HashMap<>();
        saveData.put("name", "time");
        saveData.put("values", saveTimes);
        saveVal.add(saveData);

        for (int i = 1; i < datas.size(); i++) {
            List<Double> data =( List<Double>) datas.get(i).get("values");
            String name = (String)datas.get(i).get("name");
            List<Double> newData  = new ArrayList<>();

            for(int j=0; j<timeValues.size(); j++) {
                newData.add(data.get(j));
            }
            if(type.equals("copy")){
                for (int j = 0; j < newData.size(); j++) {
                    double value =newData.get(j);
                    if(startX <= saveTimes.get(j) && saveTimes.get(j)<=endX && startY <=value && value<=endY ){
                        copyValueWithOutlier(saveTimes, newData,j,startX,endX,startY,endY);
                    }
                }
            }

            saveData = new HashMap<>();
            saveData.put("name", name);
            saveData.put("values", newData);
            saveVal.add(saveData);


            List<Double> retNewData = new ArrayList<>();
            for(int j=0; j<rowIndexes.size(); j++) {
                retNewData.add(newData.get(rowIndexes.get(j)));
            }
            retData = new HashMap<>();
            retData.put("name",name);
            retData.put("values", retNewData);
            returnVal.add(retData);

        }
        if(type.equals("delete")){
            returnVal = deleteValueWithOutlier(returnVal,startX,endX,startY,endY);
        }

        saveData(saveVal, dataId);

        logger.info("End getFilterDataFromFileOutlier dataId:{}",dataId);
        return returnVal;
    }
    private List<HashMap<String, Object>> deleteValueWithOutlier(List<HashMap<String, Object>> datas, long startX, long endX, double startY, double endY) {
        logger.info("Start deleteValueWithOutlier");
        HashMap<String,Integer> removeRows = new HashMap<>();
        List<Long> times =(List<Long>) datas.get(0).get("values");
        for (int i = 1; i <datas.size() ; i++) {
            List<Double> values = (List<Double>) datas.get(i).get("values");
            for (int j = 0; j < values.size(); j++) {
                if(startX<= times.get(j) && times.get(j)<=endX && startY <= values.get(j)&  values.get(j)<endY){
                    String sIndex = String.valueOf(j);
                    if(!removeRows.containsKey(sIndex)){
                        removeRows.put(sIndex,j);
                    }
                }
            }
        }
        List<Integer> iRows = new ArrayList<>();
        for(String key :removeRows.keySet()){
            iRows.add(removeRows.get(key));
        }

        Collections.sort(iRows);

        for (int j = 0; j < datas.size(); j++) {
            List<Double> values =(List<Double>) datas.get(j).get("values");
            for (int i = iRows.size()-1; i >=0 ; i--) {
                int index =iRows.get(i);
                values.remove(index);
            }
            datas.get(j).put("values",values);
        }

        logger.info("End deleteValueWithOutlier");
        return datas;
    }
    private List<HashMap<String, Object>>  readData(String fileName) throws Exception {
        logger.info("Start readData FileName:{}",fileName);

        String currentPath =new File("").getAbsolutePath();
        String file = fileName;
        String path = currentPath +"/pdm_data/"+ file;

        List<HashMap<String, Object>> datas= new ArrayList<>();
        BufferedReader fileReader = null;

        try {
            fileReader = new BufferedReader(new FileReader(path));
            String line="";
            datas = new ArrayList<>();

            //time
            line = fileReader.readLine();
            String[] tokens = line.split(",");
            if (tokens.length > 0) {
                HashMap<String,Object> param = new HashMap<>();
                param.put("name",tokens[0]);

                List<Long> paramValues = new ArrayList<>();
                for (int i = 1; i < tokens.length; i++) {
                    paramValues.add(Long.valueOf( tokens[i]));
                }
                param.put("values",paramValues);
                datas.add(param);
            }

            while ((line = fileReader.readLine()) != null) {
                tokens = line.split(",");
                if (tokens.length > 0) {
                    HashMap<String,Object> param = new HashMap<>();
                    param.put("name",tokens[0]);

                    List<Double> paramValues = new ArrayList<>();
                    for (int i = 1; i < tokens.length; i++) {
                        paramValues.add(Double.valueOf( tokens[i]));
                    }
                    param.put("values",paramValues);
                    datas.add(param);
                }
            }
        }
        catch (Exception e) {
            System.out.println("Error in CsvFileReader !!!");
            throw new Exception(e);
        } finally {
            try {
                fileReader.close();
            } catch (IOException e) {
                System.out.println("Error while closing fileReader !!!");
                e.printStackTrace();
            }
        }
        logger.info("End readData FileName:{}",fileName);
        return datas;
    }
    private void saveHealthIndexData(String fileName,double alarm,double warning,double healthIndexAlarm, List<Long> times, List<Double> healthIndexes,long modelFrom,long modelTo) throws Exception {
        logger.info("Start saveHealthIndexData FileName:{}",fileName);

        String currentPath =new File("").getAbsolutePath();
        String file = fileName;
        String path = currentPath +"/pdm_data/";

        File directory = new File(path);
        if(!directory.exists()){
            directory.mkdir();
        }
        path += file+".health";
        FileWriter fileWriter = null;
        try {

            fileWriter = new FileWriter(path);
            fileWriter.append(alarm+","+warning+","+healthIndexAlarm+","+modelFrom+","+modelTo);
            fileWriter.append("\n");

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < times.size(); i++) {
                sb.append(","+String.valueOf(times.get(i)));
            }

            fileWriter.append(sb.toString().substring(1));
            fileWriter.append("\n");

            sb = new StringBuilder();
            for (int i = 0; i < healthIndexes.size(); i++) {
                sb.append(","+String.valueOf( healthIndexes.get(i)));
            }

            fileWriter.append( sb.toString().substring(1));
            fileWriter.append("\n");
        } catch (Exception e) {

            System.out.println("Error in FileWriter !!!");
            throw new Exception(e);

        } finally {

            try {

                fileWriter.flush();
                fileWriter.close();
                logger.info("End saveHealthIndexData FileName:{}",fileName);

            } catch (IOException e) {

                System.out.println("Error while flushing/closing fileWriter !!!");

                throw new Exception(e);
            }

        }
    }
    private  List<HashMap<String,Object>>  getFilterDataFromFileHealthIndex(String fileName,Long lFromDate,Long lToDate) throws Exception {
        logger.info("Start getFilterDataFromFileHealthIndex FileName:{}",fileName);
        String currentPath =new File("").getAbsolutePath();
        String file = fileName;
        String path = currentPath +"/pdm_data/"+ file+".health";

        List<HashMap<String,Object>> datas= new ArrayList<>();
        BufferedReader fileReader = null;

        try {
            fileReader = new BufferedReader(new FileReader(path));
            String line="";
            datas = new ArrayList<>();

            //alarmSpec,warningSpec,modelFrom,modelTo
            line = fileReader.readLine();
            String[] tokens = line.split(",");
            HashMap<String,Object> infos =new HashMap<>();
            infos.put("alarm",tokens[0]);
            infos.put("warning",tokens[1]);
            infos.put("healthIndexAlarm",tokens[2]);
            infos.put("modelFrom",tokens[3]);
            infos.put("modelTo",tokens[4]);
            datas.add(infos);

            //times
            line = fileReader.readLine();
            tokens = line.split(",");

            List<Integer> rowIndexes = new ArrayList<>();
            if (tokens.length > 0) {
                List<Object> times = new ArrayList<>();
                for (int i = 1; i < tokens.length; i++) {
                    long value = Long.valueOf( tokens[i]);
                    if(lFromDate<= value && value<lToDate){
                        times.add(value);
                        rowIndexes.add(i);
                    }
                }
                HashMap<String,Object> paramObj = new HashMap<>();
                paramObj.put("name","time");
                paramObj.put("values",times);
                datas.add(paramObj);
            }

            //HealthIndex
            line = fileReader.readLine();
            tokens = line.split(",");
            if (tokens.length > 0) {
                List<Object> healthes = new ArrayList<>();
                for (int i = 0; i < rowIndexes.size(); i++) {
                    healthes.add(Double.valueOf(tokens[rowIndexes.get(i)]));
                }
                HashMap<String,Object> paramObj = new HashMap<>();
                paramObj.put("name","healthIndex");
                paramObj.put("values",healthes);
                datas.add(paramObj);
            }
        }
        catch (Exception e) {
            System.out.println("Error in CsvFileReader !!!");
            e.printStackTrace();
            throw  new Exception(e);

        } finally {
            try {
                fileReader.close();
                logger.info("End getFilterDataFromFileHealthIndex FileName:{}",fileName);
            } catch (IOException e) {
                System.out.println("Error while closing fileReader !!!");
                e.printStackTrace();
            }

        }
        return datas;
    }
    private  void saveData(List<HashMap<String, Object>> datas, String fileName) throws Exception {
        logger.info("Start saveData FileName:{}",fileName);
        String currentPath =new File("").getAbsolutePath();
        String file = fileName;
        String path = currentPath +"/pdm_data/";

        deleteOldFiles(path);

        File directory = new File(path);
        if(!directory.exists()){
            directory.mkdir();
        }

        path += file;

        FileWriter fileWriter = null;

        try {
            fileWriter = new FileWriter(path);
            HashMap<String,Object> param = datas.get(0);
            List<Long> timeValues = (List<Long>)param.get("values");
            StringBuilder sb = new StringBuilder();
            sb.append(param.get("name"));
            for (int i = 0; i < timeValues.size(); i++) {
                sb.append(","+ String.valueOf(timeValues.get(i)));
            }
            fileWriter.append(sb.toString());
            fileWriter.append("\n");

            for (int i = 1; i < datas.size(); i++) {
                param = datas.get(i);
                List<Double> paramValues = (List<Double>)param.get("values");
                sb = new StringBuilder();
                sb.append(param.get("name"));
                for (int j = 0; j < paramValues.size(); j++) {
                    sb.append(","+ String.valueOf(paramValues.get(j)));
                }
                fileWriter.append(sb.toString());
                fileWriter.append("\n");
            }

        } catch (Exception e) {
            System.out.println("Error in FileWriter !!!");
            throw new Exception(e);
        } finally {
            try {
                fileWriter.flush();
                fileWriter.close();
                logger.info("End saveData FileName:{}",fileName);
            } catch (IOException e) {
                System.out.println("Error while flushing/closing fileWriter !!!");
                throw new Exception(e);
            }
        }
    }
    private void deleteOldFiles(String currentPath) {
        long cut = LocalDateTime.now().minusHours(12).toEpochSecond(ZoneOffset.UTC);
        Path path = Paths.get(currentPath);
        try {
            Files.list(path)
                    .filter(n -> {
                        try {
                            return Files.getLastModifiedTime(n)
                                    .to(TimeUnit.SECONDS) < cut;
                        } catch (IOException ex) {
                            //handle exception
                            return false;
                        }
                    })
                    .forEach(n -> {
                        try {
                            Files.delete(n);
                        } catch (IOException ex) {
                            //handle exception
                        }
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private  void saveModelData(HashMap<String,Object> model, String fileName) throws Exception {
        logger.info("Start saveModelData FileName:{}",fileName);
        String currentPath =new File("").getAbsolutePath();
        String file = fileName;
        String path = currentPath +"/pdm_data/";

        File directory = new File(path);
        if(!directory.exists()){
            directory.mkdir();
        }

        path += file+".model";
        String modelString = JsonUtil.toString(model);
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(path);
            fileWriter.append(modelString);
        } catch (Exception e) {
            System.out.println("Error in FileWriter !!!");
            throw new Exception(e);

        } finally {
            try {
                fileWriter.flush();
                fileWriter.close();
                logger.info("End saveModelData FileName:{}",fileName);
            } catch (IOException e) {
                System.out.println("Error while flushing/closing fileWriter !!!");
                throw new Exception(e);
            }
        }
    }
    private  HashMap<String,Object>  readModelData(String fileName) throws Exception {
        logger.info("Start readModelData FileName:{}",fileName);
        String currentPath =new File("").getAbsolutePath();
        String file = fileName;
        String path = currentPath +"/pdm_data/"+ file+".model";

        List<HashMap<String, Object>> datas= new ArrayList<>();
        BufferedReader fileReader = null;
        try {
            fileReader = new BufferedReader(new FileReader(path));
            String line="";

            datas = new ArrayList<>();
            line = fileReader.readLine();
            return JsonUtil.toObject(line,HashMap.class);
        }
        catch (Exception e) {
            System.out.println("Error in CsvFileReader !!!");
            throw new Exception(e);

        } finally {
            try {
                fileReader.close();
                logger.info("End readModelData FileName:{}",fileName);
            } catch (IOException e) {
                System.out.println("Error while closing fileReader !!!");
                e.printStackTrace();
            }
        }
    }
    private void saveFile(String fileName,String data) throws Exception {
        String currentPath =new File("").getAbsolutePath();
        String path = currentPath +"/pdm_data/";
        try {
            ////////////////////////////////////////////////////////////////
            BufferedWriter out = new BufferedWriter(new FileWriter(path+fileName));
            out.write(data);
            out.close();
            ////////////////////////////////////////////////////////////////
        } catch (IOException e) {
            System.err.println(e); // 에러가 있다면 메시지 출력
            throw new Exception(e);
        }
    }
    private List<String> readFile(String fileName) throws Exception {
        String currentPath =new File("").getAbsolutePath();
        String path = currentPath +"/pdm_data/";
        BufferedReader br = null;
        List<String> retValues = new ArrayList<>();
        try {
            br = new BufferedReader(new FileReader(path+fileName));
            String data="";
            String line;
            while ((line = br.readLine()) != null) {
                retValues.add(line);

            }
            return retValues;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            throw new Exception(e);
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception(e);
        }finally {
            if(br != null) try {br.close(); } catch (IOException e) {}
        }

    }
    private List<String> getSameValueVariable(List<List<Double>> datas,List<String> headers) {

        List<String> sameDataVariableHeader = new ArrayList<String>();


        for (int i = 0; i < datas.size(); i++) {
            List<Double> paramDatas = datas.get(i);
            double prevValue = 0;
            prevValue = paramDatas.get(0);
            for (int j = 1; j < paramDatas.size(); j++) {
                double currValue = paramDatas.get(j);
                if(prevValue!=currValue){
                    break;
                }else if(j==paramDatas.size()-1){
                    sameDataVariableHeader.add(headers.get(i));
                }
            }
        }

        return sameDataVariableHeader;
    }
    private class TrainingDataAB{
        private int aSize;
        private int bSize;
        private double[][] trainingData;
        private List<String> names;
        private List<Object> times;

        public int getaSize() {
            return aSize;
        }

        public void setaSize(int aSize) {
            this.aSize = aSize;
        }

        public int getbSize() {
            return bSize;
        }

        public void setbSize(int bSize) {
            this.bSize = bSize;
        }

        public double[][] getTrainingData() {
            return trainingData;
        }

        public void setTrainingData(double[][] trainingData) {
            this.trainingData = trainingData;
        }


        public List<String> getNames() {
            return names;
        }

        public void setNames(List<String> names) {
            this.names = names;
        }

        public List<Object> getTimes() {
            return times;
        }

        public void setTimes(List<Object> times) {
            this.times = times;
        }
    }

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Autowired
    private RJavaComponent rComponent;


    public List<List<Object>> getHealthByAlgo(String fabId, Long eqpId, Long fromdate, Long todate,HealthModel model) throws IOException, ParseException, ExecutionException, InterruptedException {
        //Health Create시는 Raw Data로 Health를 구함.
        List<List<Object>> result = new ArrayList<List<Object>>();

        //Get Data
        List<HashMap<String, Object>> dataObject = null;
        try {
            Date dFromDate = new Date(fromdate);
            Date dToDate = new Date(todate);
            dataObject = getTrendDataToPivot(fabId, eqpId, dFromDate, dToDate);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }


        TrainingDataAB trainingDataAB=null;

        ObjectMapper mapper = new ObjectMapper();

        List  params = null;
        try {
            params = mapper.readValue(model.getModel_params(),ArrayList.class);
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            trainingDataAB = getFilterData(dataObject,fromdate,todate,params,false);


        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }

        double [][] newTrainingData = trainingDataAB.getTrainingData();


        List<Long> times = getTimes(dataObject);

        MSPC pc = null;
        try {
            pc = new MSPC(model.getModel_obj());

            // predict 결과
            MSPC.MSPCPredictResult preDicResult = null;

            // predict 호출
            preDicResult = pc.predict(newTrainingData);
            for (int i = 0; i < preDicResult.getT2Distance().length; i++) {
//                healthIndexes.add(String.valueOf(preDicResult.getT2Distance()[i]));
                result.add(Arrays.asList(times.get(i),String.valueOf(Math.log( preDicResult.getT2Distance()[i]))));
            }
//            System.out.println(new Matrix(preDicResult.getT2Distance()));
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }


        return result;

    }


    public void saveHealth(String fabId, HealthModel model, List<List<Object>> data) {
        STDHealthMapper healthIndexMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);

        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (List<Object> d : data) {
//                HealthIndexPDM h = makeHealthIndexPDM(model, d);
                HealthDaily h = new HealthDaily();
                h.setMeasure_dtts( new Date(Long.valueOf( d.get(0).toString())));
                Double value = Double.valueOf(d.get(1).toString());
                h.setValue(value);
                h.setEqp_id(model.getEqp_id());

                Double score = 0.9*value/model.getAlarm_spec();
                h.setScore(score);


                //if (h == null) continue;
                healthIndexMapper.deleteHealthDaily(h);
                healthIndexMapper.insertHealthDaily(h);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }


    public List<EqpWithHealthModel> getEqpsWithModel(String fabId) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        return STDHealthMapper.selectEqpsWithModel();
    }


    public void saveHealthStatWithReport(String fabId, List<HealthStat> records) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        STDReportMapper reportMapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);

        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (HealthStat healthStat : records) {
                STDHealthMapper.deleteHealthStat(healthStat);
                STDHealthMapper.insertHealthStat(healthStat);

                if(healthStat.getCause1() != null) {
                    ReportAlarm report = makeAlarmReport(healthStat);
                    reportMapper.deleteReportAlarm(report);
                    reportMapper.insertReportAlarm(report);
                }
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }


    public HealthStat getDailyScore(String fabId, Long eqpId, Date from, Date to, Date from90) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        return STDHealthMapper.selectScoreByEqpId(eqpId, from, to, from90);
    }


    public HealthModel getModelByEqpId(String fabId, Long eqpId) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        return STDHealthMapper.selectModelByEqpId(eqpId);
    }


    public List<HealthDaily> getHealth(String fabId, Long eqpId, Date from, Date to) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        return STDHealthMapper.selectHealthIndexes(eqpId, from, to);
    }


    public Map<String, List<Object>> getContribution(String fabId, Long eqpId, Long fromdate, Long todate) throws IOException, ExecutionException, InterruptedException {
        Map<String, List<Object>> result = new HashMap<>();

        //Get Data
        List<HashMap<String, Object>> dataObject = null;
        try {
            Date dFromDate = new Date(fromdate);
            Date dToDate = new Date(todate);
            dataObject = getTrendDataToPivot(fabId, eqpId, dFromDate, dToDate);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return result;
        }


        TrainingDataAB trainingDataAB=null;

        ObjectMapper mapper = new ObjectMapper();

        HealthModel healthModel =getModelByEqpId(fabId,eqpId);

        //yohan healthmodel이 없는경우 (??)
        if(healthModel == null) return result;

        List  params = null;
        try {
            params = mapper.readValue(healthModel.getModel_params(),ArrayList.class);
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            trainingDataAB = getFilterData(dataObject,fromdate,todate,params,false);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }

        double [][] newTrainingData = trainingDataAB.getTrainingData();

        List<Long> times = getTimes(dataObject);

        MSPC pc = null;
        try {

            if(params.size()!=newTrainingData[0].length){
                throw new Exception("The modeled parameter and the current parameter are different!");
            }

            pc = new MSPC(healthModel.getModel_obj());

            // predict 결과
            MSPC.MSPCPredictResult preDicResult = null;

            // predict 호출
            preDicResult = pc.predict(newTrainingData);

            double[][] contributes = preDicResult.getT2contributionRatio();

//            HashMap<String,List<Double>> contributeResult = new HashMap<String, List<Double>>();
            result.put("time",trainingDataAB.getTimes());
            HashMap<String,List<List<String>>> resultDatas = new HashMap<>();

            for (int i = 0; i < params.size(); i++) {
                List<String> datas = new ArrayList<>();
                for (int j = 0; j < contributes.length; j++) {
                    datas.add(String.valueOf( contributes[j][i]));
                }
                //result.put(params.get(i).toString(),datas);
                String param = params.get(i).toString().split("_")[0];
                if(resultDatas.containsKey(param)){
                    List<List<String>> paramDatas  = resultDatas.get(param);
                    paramDatas.add(datas);
                    resultDatas.put(param,paramDatas);
                }else{
                    List<List<String>> paramDatas  = new ArrayList<>();
                    paramDatas.add(datas);
                    resultDatas.put(param,paramDatas);
                }
            }

            for(String key :resultDatas.keySet()){
                List<List<String>> datas = resultDatas.get(key);
                List<Object> paramData = new ArrayList<>();
                for (int j = 0; j < datas.get(0).size(); j++) {
                    Double sumData = 0.0;
                    for (int i = 0; i < datas.size(); i++) {
                        sumData+=Double.valueOf( datas.get(i).get(j));
                    }
                    paramData.add(sumData);
                }
                result.put(key,paramData);
            }


//            System.out.println(new Matrix(contributes));
        } catch (Exception e) {
            logger.error(e.getMessage());
            return result;
        }


        return result;

    }


    public List<HealthModel> getModels(String fabId) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        return STDHealthMapper.selectModels();
    }


    public HashMap<String, Object> autoModeler(Principal user,String fabId, Date fromDate, Date toDate, boolean isUnModeled, int monthRange) {
        STDEqpMapper STDEqpMapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);

        List<String> alreadyModeled = new ArrayList<>();
        List<String> failModeling = new ArrayList<>();
        List<String> successModeling = new ArrayList<>();
        Date startTime = new Date();

        saveAutomodelerStatus("start",startTime,fromDate,toDate,isUnModeled,monthRange,user,fabId,0,0,alreadyModeled,failModeling);

        HashMap<String,String> healthModelEqpIds = new HashMap<>();
        if(isUnModeled) {
            List<HealthModel> healthModels = STDHealthMapper.selectModels();
            for (int i = 0; i < healthModels.size(); i++) {
                String eqp_id = healthModels.get(i).getEqp_id().toString();
                healthModelEqpIds.put(eqp_id, eqp_id);
            }
        }

        List<EqpWithEtc> eqps = STDEqpMapper.selectList(null);
        saveAutomodelerStatus("processing",startTime,fromDate,toDate,isUnModeled,monthRange,user,fabId,0,eqps.size()-1,alreadyModeled,failModeling);
        for (int i = 0; i < eqps.size(); i++) {
            EqpWithEtc eqpWithEtc = eqps.get(i);
            Long eqpId = eqpWithEtc.getEqp_id();
            String eqpName = eqpWithEtc.getName();
            if(isUnModeled && healthModelEqpIds.containsKey(eqpId.toString())){
                logger.info("#### {}/{} #### eqpId:{} eqpName:{} Already modeling", i, eqps.size()-1, eqpId, eqpName);
                alreadyModeled.add(eqpName);
            }else {
                try {
                    List<HashMap<String, Object>> avgs = STDHealthMapper.selectAvgByMonthlyForMinute(eqpId, fromDate, toDate);
                    Date modelFromDate = new SimpleDateFormat("yyyy-MM-dd").parse(avgs.get(0).get("M_TIME")+"-01");
                    Date modelToDate = DateUtil.add(modelFromDate, Calendar.MONTH, monthRange);

                    HashMap<String, Object> results = this.getServerAnalysisDataForAutoModeler(fabId, eqpId, modelFromDate, modelToDate);
                    List<HashMap<String, Object>> datas = (List<HashMap<String, Object>>) (((HashMap<String, Object>) results.get("data")).get("parameters"));
                    List<String> params = new ArrayList<>();
                    for (int j = 0; j < datas.size(); j++) {
                        params.add((String) datas.get(j).get("name"));
                    }
                    HashMap<String, Object> healthModel = this.getBuildAndHealthByDataForAutoModeler(fabId, eqpId,modelFromDate.getTime(), modelToDate.getTime(), params, datas);
                    HashMap<String, Object> modelObj = (HashMap<String, Object>) ((HashMap<String, Object>) healthModel.get("data")).get("model");


                    double alarm_spec =(Double) modelObj.get("model_alarm_spec");
                    double warining_spec = (Double) modelObj.get("model_warning_spec");
                    String pcaModelString =(String)modelObj.get("pca_model");
                    String modelString =(String) modelObj.get("model");

                    this.saveModelForAutoModeler(fabId, eqpId,modelString ,pcaModelString, params, modelFromDate.getTime(), modelToDate.getTime(), "MACHINE", "Create model by machine", "A", alarm_spec, warining_spec);
                    successModeling.add(eqpName);
                    logger.info("#### {}/{} #### eqpId:{} eqpName:{} ", i, eqps.size()-1, eqpId, eqpName);
                } catch (Exception err) {
                    logger.info("#### {}/{} #### eqpId:{} eqpName:{} Error Message:{}", i, eqps.size()-1, eqpId, eqpName, err.getMessage());
                    failModeling.add(eqpName+ " error:"+err.getMessage());
                }
            }
            saveAutomodelerStatus("processing",startTime,fromDate,toDate,isUnModeled,monthRange,user,fabId,i,eqps.size()-1,alreadyModeled,failModeling);
        }

        saveAutomodelerStatus("finish",startTime,fromDate,toDate,isUnModeled,monthRange,user,fabId,eqps.size()-1,eqps.size()-1,alreadyModeled,failModeling);

        HashMap<String,Object> result = new HashMap<>();
        if(successModeling.size()==0){
            result.put("result","fail");
        }else{
            result.put("result","success");
        }
        HashMap<String,Object> datas = new HashMap<>();
        datas.put("success",successModeling);
        datas.put("alreadymodeled",alreadyModeled);
        datas.put("fail",failModeling);

        result.put("data",datas);

        return result;
    }

    public HashMap<String, Object> autoModelerStatus(Principal user,String fabId) {
        HashMap<String, Object> result = new HashMap<>();
        List<String> resultDatas = new ArrayList<>();
        try {
            String currentPath =new File("").getAbsolutePath();
            String path = currentPath +"/pdm_data/";
            File files = new File(path);
            File[] listFiles = files.listFiles();
            for (File file:listFiles) {
                if(file.getName().indexOf("automodeler.")>=0) {
                    List<String> data = readFile(file.getName());
                    resultDatas.add(data.get(0));
                }
            }

            result.put("result","success");
            result.put("data",resultDatas);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("result", "fail");
            result.put("data", e.getMessage());
        }

        return result;
    }
    private void saveAutomodelerStatus(String status,Date startTime, Date fromDate, Date toDate, boolean isUnModeled, int monthRange,
                                       Principal user,String fabId, int currentCount, int totalCount,
                                       List<String> alreadyModeled, List<String> failModeling) {
        String sAlreadyModeling = alreadyModeled.stream()
                .map(n -> String.valueOf(n))
                .collect(Collectors.joining(","));
        String sFailModeling = failModeling.stream()
                .map(n -> String.valueOf(n))
                .collect(Collectors.joining(","));

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String sFromDate = formatter.format(fromDate);
        String sToDate = formatter.format(toDate);
        formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sStartTime = formatter.format(startTime);

        String data = String.format("{\"fabId\":\"%s\",\"status\":\"%s\",\"startTime\":\"%s\",\"fromDate\":\"%s\",\"toDate\":\"%s\",\"unModeling\":\"%s\",\"monthRange\":\"%s\",\"currentCount\":\"%s\",\"totalCount\":\"%s\",\"alreadyModeling\":\"[%s]\",\"failModeling\":\"[%s]\" }"
                ,fabId,status,sStartTime, sFromDate,sToDate,isUnModeled,monthRange,currentCount,totalCount,sAlreadyModeling,sFailModeling);
        try {
            String fileName ="automodeler."+ user.getName()+"_"+fabId+"_"+sFromDate+"_"+sToDate ;
            saveFile(fileName,data);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
        }
    }


    public HashMap<String, Object> getModelDataByEqpId(String fabId, long eqpId) {
        HealthModel healthModel = this.getModelByEqpId(fabId,eqpId);

        HashMap<String,Object> result = new HashMap<>();

        if(healthModel == null) {
            result.put("result", "fail");
            result.put("data", "There is no data");
            return result;
        }

        HashMap<String,Object> retDatas = new HashMap<String,Object>();

        HashMap<String,Object> model  = new HashMap<String,Object>();
        model.put("model",healthModel.getModel_obj());
        model.put("pca_model",healthModel.getPca_model_obj());
        model.put("model_params", JsonUtil.toObject(healthModel.getModel_params(),ArrayList.class));
        model.put("model_fromDate",healthModel.getStart_dtts());
        model.put("model_toDate",healthModel.getEnd_dtts());
        model.put("model_alarm_spec",healthModel.getAlarm_spec());
        //model.put("model_warning_spec",pc.getUCL());
        model.put("model_warning_spec",healthModel.getWarn_spec()); //80점을 warning으로 하기 위한 조치

        retDatas.put("model",model);

        result.put("result", "success");
        result.put("data", retDatas);

        return result;
    }


    public HashMap<String, Object> getServerAnalysisData(String fabId, Long eqpId, Date fromDate, Date toDate) {
        //분석용 data라서 평균값을 사용함 (1시간)
        HashMap<String, Object> result = new HashMap<String, Object>();


        //HashMap<String, Object> dataObject = null;
        List<HashMap<String, Object>> dataObject = null;
        try {
            dataObject = getTrendDataToPivot(fabId, eqpId, fromDate, toDate);
        } catch (Exception e) {
            result.put("result", "fail");
            result.put("data", e.getMessage());
            return result;
        }

        UUID uuid=UUID.randomUUID();
        String guid = uuid.toString();

        List<List<String>> datas = new ArrayList<List<String>>();
        HashMap<String,Object> retData = new HashMap<String,Object>();
        List<String> parameters = new ArrayList<>();
        for (int i = 1; i < dataObject.size(); i++) {
            parameters.add(dataObject.get(i).get("name").toString());
        }


//        saveFileData(guid,dataObject);
        try {
            saveData(dataObject,guid);
            saveData(dataObject,guid+".origin");

            retData.put("dataId",guid);
            retData.put("parameters",parameters);

            result.put("result", "success");
            result.put("data", retData);

        } catch (Exception e) {
            e.printStackTrace();
            result.put("result", "fail");
            result.put("data", e.getMessage());
        }

        return result;
    }


    public HashMap<String, Object> getServerBuildAndHealth(String fabId,long eqpId,String dataId, long lFromDate, long lToDate,List<String> parameters,int width,int height) {
        HashMap<String, Object> result = new HashMap<String, Object>();

        int iIndex =parameters.indexOf("time");
        if(iIndex>=0){
            parameters.remove(iIndex);
        }

        try {
            List<HashMap<String, Object>> datas = readData(dataId);
            TrainingDataAB trainingDataAB = null;
            trainingDataAB = getFilterData(datas, lFromDate, lToDate, parameters, true);

            double[][] newTrainingData = trainingDataAB.getTrainingData();

            List<HashMap<String, Object>> datasOrigin = readData(dataId+".origin");
            TrainingDataAB trainingDataABAll = getTransDataRemoveTime(datasOrigin, parameters);
            double[][] newTrainingAllData = trainingDataABAll.getTrainingData();

            List<Double> healthIndexes = new ArrayList<Double>();

            MSPC pc = new MSPC(newTrainingData);

            PCAWrapper pcaWarpper = new PCAWrapper(newTrainingData);

            String mspcModelString = pc.saveModel();

            String pcaModelString = pcaWarpper.saveModel();

            // predict 결과
            double dYMax = 0;
            double dYMin = 0;
            MSPC.MSPCPredictResult preDicResult = null;

            double alarmSpec = 0.0;
            double warningSpec = 0.0;
            double healthAlarmSpec = 0.0;

            alarmSpec = Math.log(getSpec(fabId, eqpId, pc, parameters));

            // predict 호출

            preDicResult = pc.predict(newTrainingAllData);
            healthAlarmSpec = Math.log(pc.getUSL());
            warningSpec = alarmSpec * 80 / 90;
            for (int i = 0; i < preDicResult.getT2Distance().length; i++) {
                double value = Math.log(Double.valueOf(preDicResult.getT2Distance()[i]));
                healthIndexes.add(value);
                if (dYMax < value) {
                    dYMax = value;

                } else if (dYMin > value) {
                    dYMin = value;
                }
            }
            if (alarmSpec > dYMax) dYMax = alarmSpec;
            if (warningSpec < dYMin) dYMin = warningSpec;

            HashMap<String, Object> model = new HashMap<String, Object>();
            model.put("model", mspcModelString);
            model.put("pca_model", pcaModelString);
            model.put("model_params", parameters);
            model.put("model_fromDate", lFromDate);
            model.put("model_toDate", lToDate);
            model.put("model_alarm_spec", alarmSpec);
            model.put("model_warning_spec", warningSpec); //80점을 warning으로 하기 위한 조치
            model.put("eqpId", eqpId);
            model.put("healthIndexAlarm", healthAlarmSpec);

            saveModelData(model, dataId);

            List<Long> times = getTimes(datas);
            List<String> healthParameter = new ArrayList<>();
            healthParameter.add("healthIndex");

            List<HashMap<String, Object>> healthDatas = new ArrayList<>();
            HashMap<String, Object> paramObj = new HashMap<>();
            paramObj.put("name", "time");
            paramObj.put("values", times);
            healthDatas.add(paramObj);

            paramObj = new HashMap<>();
            paramObj.put("name", "healthIndex");
            paramObj.put("values", healthIndexes);
            healthDatas.add(paramObj);

            result = getChartImage(healthParameter, width, height, healthDatas, dYMin, dYMax, alarmSpec, warningSpec, healthAlarmSpec, lFromDate, lToDate);
            saveHealthIndexData(dataId, alarmSpec, warningSpec, healthAlarmSpec, times, healthIndexes, lFromDate, lToDate);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("result", "fail");
            result.put("data", e);
            return result;
        }
        return result;
    }


    public HashMap<String, Object> getServerPCA(String dataId, String fabId, long a_fromDate, long a_toDate, long b_fromDate, long b_toDate) {
        HashMap<String, Object> result = new HashMap<String, Object>();
        HashMap<String,Object> modelObject = null;
        String pca_model = null;
        List<HashMap<String,Object>> datas = null;
        List<String> model_params = null;
        TrainingDataAB trainingDataAB = null;
        PCAWrapper pc = null;
        try {
            modelObject =  readModelData(dataId);
            pca_model = (String) modelObject.get("pca_model");
            datas = readData(dataId);
            model_params = (List<String>) modelObject.get("model_params");

            pc = new PCAWrapper(pca_model);

            trainingDataAB = getFilterDataMore(true,datas,a_fromDate,a_toDate,b_fromDate,b_toDate,false,model_params,false);

        } catch (Exception e) {
            result.put("result", "fail");
            result.put("data", e.getMessage());
            return result;
        }
        if(trainingDataAB.getTrainingData().length==0){
            result.put("result", "fail");
            result.put("data", "There is no data.");
            return result;

        }

        // predict 결과
        PCAWrapper.PCAWrapperPredictResult preDicResult = null;
        try {
            // predict 호출
            preDicResult = pc.predict(trainingDataAB.trainingData);
        } catch (Exception e) {
            e.printStackTrace();
        }
        double [][] pcaResult = preDicResult.getPcScore();

        List<String> pc1 = new ArrayList<String>();
        List<String> pc2 = new ArrayList<String>();
        List<String> classes = new ArrayList<String>();
        int len = 0;

        for(int i=0;i<pcaResult.length;i++) {
            pc1.add(String.valueOf( pcaResult[i][0]));
            pc2.add(String.valueOf( pcaResult[i][1]));
        }

        for(int i=0;i<trainingDataAB.aSize;i++) {
            classes.add("ClassA");
        }
        int iCountStart = trainingDataAB.aSize;
        for(int i=0;i<trainingDataAB.bSize;i++) {
            classes.add("ClassB");
        }

        result.put("result", "success");
        HashMap<String,Object> retDatas = new HashMap<String,Object>();
        retDatas.put("PC1",pc1);
        retDatas.put("PC2",pc2);
        retDatas.put("CLASS",classes);
        result.put("data", retDatas);

        return result;
    }


    public HashMap<String, Object> saveSeverModel(String fabId, String userId, String dataId) {
        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);

        HashMap<String,Object> result = new HashMap<>();
        HashMap<String,Object> modelObject = null;

        try {
            modelObject = readModelData(dataId);

            List<String > model_params =(List<String >) modelObject.get("model_params");
            long eqpId =Long.valueOf( modelObject.get("eqpId").toString());
            long fromDate = (Long)modelObject.get("model_fromDate");
            long toDate =(Long) modelObject.get("model_toDate");
            String create_type_cd="M";
            String description ="";
            double alarm_spec =(Double) modelObject.get("model_alarm_spec");
            double warn_spec = (Double) modelObject.get("model_warning_spec");
            String model = (String)modelObject.get("model");
            String pcaModel  = (String)modelObject.get("pca_model");

            StringWriter sw =new StringWriter();
            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(sw, model_params);
            String sParams = sw.toString();

            List<HealthModel> healthModels = STDHealthMapper.selectModel(eqpId);

            if (healthModels.size() > 0) {
                STDHealthMapper.updateHealthModel(eqpId, model,pcaModel, new Date(fromDate), new Date(toDate), userId, description, create_type_cd, alarm_spec, warn_spec, sParams);
                List<HashMap<String, Object>> historyResult = STDHealthMapper.selectMaxVersionHealthModelHst(eqpId);
                if (historyResult.get(0) != null) {
                    long version = Long.valueOf(historyResult.get(0).get("VERSION").toString()) + 1;
                    STDHealthMapper.insertHealthModelHst(eqpId, model,pcaModel, new Date(fromDate), new Date(toDate), userId, description, create_type_cd, alarm_spec, warn_spec, sParams, version);
                } else {
                    STDHealthMapper.insertHealthModelHst(eqpId, model,pcaModel, new Date(fromDate), new Date(toDate), userId, description, create_type_cd, alarm_spec, warn_spec, sParams, (long) 1);
                }
            } else {
                STDHealthMapper.insertHealthModel(eqpId, model,pcaModel, new Date(fromDate), new Date(toDate), userId, description, create_type_cd, alarm_spec, warn_spec, sParams);
                STDHealthMapper.insertHealthModelHst(eqpId, model,pcaModel, new Date(fromDate), new Date(toDate), userId, description, create_type_cd, alarm_spec, warn_spec, sParams, (long) 1);
            }
        }catch (Exception e){
            e.printStackTrace();
            result.put("result","fail");
            result.put("data",e.getMessage());
            return result;
        }

        result.put("result","success");
        result.put("data","");
        return result;
    }


    public HashMap<String, Object> getServerChart( String dataId, String chartType, long lFromDate, long lToDate, List<String> parameters, int width, int height) {


        int iIndex =parameters.indexOf("time");
        if(iIndex>=0){
            parameters.remove(iIndex);
        }

        List<HashMap<String,Object>>  datas = null;
        try {
            datas = getFilterDataFromFile(dataId,lFromDate,lToDate,parameters);
        } catch (Exception e) {
            e.printStackTrace();
            HashMap<String,Object> result = new HashMap<>();
            result.put("result", "fail");
            result.put("data", e.getMessage());
            return result;

        }
        if(((ArrayList<Long>)datas.get(0).get("values")).size()==0){
            HashMap<String,Object> result = new HashMap<>();
            result.put("result", "fail");
            result.put("data", "There is no data");
            return result;
        }

        if(chartType.equals("scale")){
            datas = getScale(datas);
        }

        return getChartImage(parameters,width, height, datas,null,null,null,null,null,null,null);
    }

    public HashMap<String, Object> getServerHealthIndexChart( String dataId, long lFromDate, long lToDate, int width, int height,Double yMin,Double yMax) {

        HashMap<String,Object> result = new HashMap<>();

        List<HashMap<String,Object>>  datas = null;
        try {
               datas = getFilterDataFromFileHealthIndex(dataId,lFromDate,lToDate);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("result", "fail");
            result.put("data", e.getMessage());
            return result;
        }
        List<String> parameters = new ArrayList<>();
        parameters.add("healthIndex");
        double alarm = Double.valueOf((String) datas.get(0).get("alarm"));
        double warning = Double.valueOf((String) datas.get(0).get("warning"));
        double healthIndexAlarmSpec = Double.valueOf((String) datas.get(0).get("healthIndexAlarm"));
        long modelFrom = Long.valueOf((String) datas.get(0).get("modelFrom"));
        long modelTo = Long.valueOf((String) datas.get(0).get("modelTo"));

        datas.remove(0);

        return getChartImage(parameters,width, height,datas ,yMin,yMax,alarm,warning,healthIndexAlarmSpec,modelFrom,modelTo);
    }


    public HashMap<String, Object> getServerHealthIndexChartByModel(String fabId,Long eqpId, String dataId, long lFromDate, long lToDate, int width, int height) {
        HashMap<String,Object> result = new HashMap<>();
        TrainingDataAB trainingDataAB=null;
        ObjectMapper mapper = new ObjectMapper();
        double dYMax = 0;
        double dYMin = 0;
        double alarmSpec = 0;
        double warningSpec = 0;
        double healthIndexAlarmSpec = 0.0;
        List<HashMap<String, Object>> healthIndexChartDatas = new ArrayList<>();
        HealthModel healthModel = null;
        try {
            healthModel = getModelByEqpId(fabId, eqpId);

            //yohan healthmodel이 없는경우 (??)
            if (healthModel == null) {
                result.put("result", "fail");
                result.put("data", "There is no model");
                return result;
            }

            List params = null;
            params = mapper.readValue(healthModel.getModel_params(), ArrayList.class);

            List<HashMap<String, Object>> datas = readData(dataId);
            trainingDataAB = getFilterData(datas, lFromDate, lToDate, params, false);

            double[][] newTrainingData = trainingDataAB.getTrainingData();


            healthIndexChartDatas.add(datas.get(0));

            MSPC.MSPCPredictResult preDicResult = null;

            List<Double> healthIndexes = new ArrayList<>();

            MSPC pc = new MSPC(healthModel.getModel_obj());
            alarmSpec = healthModel.getAlarm_spec();
            warningSpec = healthModel.getWarn_spec();
            healthIndexAlarmSpec = Math.log(pc.getUCL());

            preDicResult = pc.predict(newTrainingData);
            for (int i = 0; i < preDicResult.getT2Distance().length; i++) {
                double value = Math.log(Double.valueOf(preDicResult.getT2Distance()[i]));
                healthIndexes.add(value);
                if (dYMax < value) {
                    dYMax = value;

                } else if (dYMin > value) {
                    dYMin = value;
                }
            }
            if (alarmSpec > dYMax) dYMax = alarmSpec;
            if (warningSpec < dYMin) dYMin = warningSpec;

            HashMap<String, Object> paramObject = new HashMap<>();
            paramObject.put("name", "healthIndex");
            paramObject.put("values", healthIndexes);
            healthIndexChartDatas.add(paramObject);

            List<Long> times = (List<Long>) datas.get(0).get("values");

            saveHealthIndexData(dataId, alarmSpec, warningSpec, healthIndexAlarmSpec, times, healthIndexes, healthModel.getStart_dtts().getTime(), healthModel.getEnd_dtts().getTime());

            HashMap<String, Object> model = new HashMap<String, Object>();
            model.put("model", healthModel.getModel_obj());
            model.put("pca_model", healthModel.getPca_model_obj());
            model.put("model_params", params);
            model.put("model_fromDate", healthModel.getStart_dtts());
            model.put("model_toDate", healthModel.getEnd_dtts());
            model.put("model_alarm_spec", alarmSpec);
            model.put("model_warning_spec", warningSpec); //80점을 warning으로 하기 위한 조치
            model.put("eqpId", eqpId);

            saveModelData(model, dataId);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("result", "fail");
            result.put("data", e);
            return result;
        }
        List<String> healthParam = new ArrayList<>();
        healthParam.add("healthIndex");

        return getChartImage(healthParam,width, height,healthIndexChartDatas ,null,null,alarmSpec,warningSpec,healthIndexAlarmSpec,healthModel.getStart_dtts().getTime(),healthModel.getEnd_dtts().getTime());
    }


    public HashMap<String, Object> getServerOutlier( String dataId,String type, long lFromDate, long lToDate, List<String> parameters, int width, int height, long startX,long endX,double startY,double endY) {
        int iIndex =parameters.indexOf("time");
        if(iIndex>=0){
            parameters.remove(iIndex);
        }

        List<HashMap<String,Object>>  datas =null;
        try {
            datas =getFilterDataFromFileOutlier(dataId,type,lFromDate,lToDate,parameters, startX, endX, startY, endY);

        } catch (Exception e) {
            e.printStackTrace();
            HashMap<String,Object> result = new HashMap<>();
            result.put("result", "success");
            result.put("data", e.getMessage());
            return result;
        }

        return getChartImage(parameters, width, height, datas,null,null,null,null,null,null,null);
    }


    public HashMap<String, Object> getServerAnalysis(String dataId, long a_fromDate, long a_toDate, long b_fromDate, long b_toDate) {

        HashMap<String,Object> result = new HashMap<String,Object>();
        List<HashMap<String,Object>> datas = null;
        HashMap<String,Object> modelObject = null;
        List<String> params = null;
        TrainingDataAB trainingDataAB = null;


        try {
            datas = readData(dataId);
            modelObject= readModelData(dataId);
            params = (List<String>) modelObject.get("model_params");
            trainingDataAB = getFilterDataMore(true,datas,a_fromDate,a_toDate,b_fromDate,b_toDate,true,params,false);
        } catch (Exception e) {
            result.put("result", "fail");
            result.put("data", e.getMessage());
            return result;

        }
        if(trainingDataAB.getTrainingData().length==0){
            result.put("result", "fail");
            result.put("data", "There is no data.");
            return result;
        }

        double [] category = new double[trainingDataAB.getaSize()+trainingDataAB.getbSize()] ;
        for (int i = 0; i < trainingDataAB.getaSize(); i++) {
            category[i] =1;
        }
        for (int i = trainingDataAB.getaSize(); i < trainingDataAB.getaSize()+trainingDataAB.getbSize(); i++) {
            category[i] =2;
        }

        double[] importance = RandomForest.run(trainingDataAB.trainingData, category, 500, 100, 5, 2);
        HashMap<String,Double> data = new HashMap<String,Double>();
        for (int i = 0; i < trainingDataAB.getNames().size(); i++) {
            data.put(trainingDataAB.getNames().get(i),importance[i]);
        }

        result.put("result", "success");
        result.put("data", data);
        return result;
    }

    //UI에서 Health Index요청시 사용 함. Daily 계산된 HealthIndex값을 Return

    public DataWithSpec getDailyHealth(String fabId, Long eqpId, Long fromdate, Long todate) throws IOException, ParseException, ExecutionException, InterruptedException {
        DataWithSpec result = new DataWithSpec();

        STDHealthMapper STDHealthMapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        Date dFromDate = new Date(fromdate);
        Date dToDate = new Date(todate);

        List<HealthDaily> healthDailies = STDHealthMapper.selectHealthIndexes(eqpId,dFromDate,dToDate);
        List<List<Object>> record = new ArrayList<>();
        for (int i = 0; i < healthDailies.size(); i++) {
            HealthDaily healthDaily = healthDailies.get(i);
            record.add(Arrays.asList( healthDaily.getMeasure_dtts().getTime(), healthDaily.getValue()));
        }
        result.setData(record);

        List<HealthModel> retVal = STDHealthMapper.selectModel(eqpId);
        if(retVal.size()>0){
            result.setAlarm(retVal.get(0).getAlarm_spec());
            result.setWarn(retVal.get(0).getWarn_spec());
        }

        return result;

    }



}
