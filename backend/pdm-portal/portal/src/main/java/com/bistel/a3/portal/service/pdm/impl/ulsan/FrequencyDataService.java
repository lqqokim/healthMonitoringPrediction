package com.bistel.a3.portal.service.pdm.impl.ulsan;

import com.bistel.a3.portal.dao.pdm.db.SKFPumpMapper;
import com.bistel.a3.portal.dao.pdm.frequencyDataGenerator.FrequencyDataGenMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.MeasureTrxMapper;
import com.bistel.a3.portal.domain.frequencyData.FrequencyDataGenConfig;
import com.bistel.a3.portal.domain.frequencyData.FrequencyDataGenHarmonicConfig;
import com.bistel.a3.portal.domain.frequencyData.FrequencyDataGenDatas;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrxBin;
import com.bistel.a3.portal.domain.pdm.db.OverallMinuteTrx;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.frequencyData.*;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.bistel.a3.portal.util.frequencyData.FrequencyUtil.doubleToByteArray;

@Service
public class FrequencyDataService {

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    String fabId = "fab1";


    public HashMap<String, Object> createDateGenConfig(long eqpId, long paramId, Double samplingTime, int samplingCount, long duration, long rpm) {
        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);


        FrequencyDataGenConfig dataGenConfig = new FrequencyDataGenConfig();
        dataGenConfig.setEqpId(eqpId);
        dataGenConfig.setDuration(duration);
        dataGenConfig.setParamId(paramId);
        dataGenConfig.setSamplingTime(samplingTime);
        dataGenConfig.setSamplingCount(samplingCount);
        dataGenConfig.setRpm(rpm);

        frequencyDataGenMapper.insertDataGenConfig(dataGenConfig);

        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    public HashMap<String, Object> modifyDataGenConfigs(long rawid, long eqpId, long paramId, Double samplingTime, int samplingCount, long duration, long rpm) {
        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        frequencyDataGenMapper.updateDataGenConfig(rawid, eqpId, paramId,new Date(), samplingTime, samplingCount, duration, rpm);

        HashMap<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    public HashMap<String, Object> getDataGenConfigs() {
        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        List<FrequencyDataGenConfig> datas = frequencyDataGenMapper.getDataGenConfig();

        HashMap<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("data", datas);
        return result;
    }

    @Transactional
    public HashMap<String, Object> deleteDataGenConfigs(Long rawid) {
        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        frequencyDataGenMapper.deleteDataGenHarmonicConfigByParentId(rawid);
        frequencyDataGenMapper.deleteDataGenConfig(rawid);

        HashMap<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    public HashMap<String, Object> createDataGenHarmonicCongis(Long frequency_data_config_rawid,
                                                               String harmonicName, Double harmonicFrequency, Double amplitude_start, Double amplitude_end) {

        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        FrequencyDataGenHarmonicConfig dataGenHarmonicConfig = new FrequencyDataGenHarmonicConfig();

        dataGenHarmonicConfig.setHarmonicFrequency(harmonicFrequency);
        dataGenHarmonicConfig.setHarmonicName(harmonicName);
        dataGenHarmonicConfig.setAmplitude_current(amplitude_start);
        dataGenHarmonicConfig.setAmplitude_start(amplitude_start);
        dataGenHarmonicConfig.setAmplitude_end(amplitude_end);
        dataGenHarmonicConfig.setFrequency_data_config_rawid(frequency_data_config_rawid);

        frequencyDataGenMapper.insertDataGenHarmonicConfig(dataGenHarmonicConfig);

        HashMap<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    public HashMap<String, Object> modifyDataGenHarmonicCongis(Long freqeuncyDataGenConfigRawid,
                                                               String harmonicName, Double harmonicFrequency, Double amplitude_start, Double amplitude_end) {

        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        FrequencyDataGenHarmonicConfig dataGenHarmonicConfig = new FrequencyDataGenHarmonicConfig();

        dataGenHarmonicConfig.setHarmonicFrequency(harmonicFrequency);
        dataGenHarmonicConfig.setHarmonicName(harmonicName);
        dataGenHarmonicConfig.setAmplitude_current(amplitude_start);
        dataGenHarmonicConfig.setAmplitude_start(amplitude_start);
        dataGenHarmonicConfig.setAmplitude_end(amplitude_end);
        dataGenHarmonicConfig.setFrequency_data_config_rawid(freqeuncyDataGenConfigRawid);

        frequencyDataGenMapper.updateDataGenHarmonicConfig(harmonicName, harmonicFrequency, amplitude_start, amplitude_start, amplitude_end, freqeuncyDataGenConfigRawid);

        HashMap<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    public HashMap<String, Object> getDataGenHarmonicConfigs(Long rawid) {
        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        List<FrequencyDataGenHarmonicConfig> datas = frequencyDataGenMapper.getDataGenHarmonicConfig(rawid);

        HashMap<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("data", datas);
        return result;
    }

    public HashMap<String, Object> deleteDataGenHarmonicConfigs(long frequency_data_config_rawid, String harmonicName) {
        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        frequencyDataGenMapper.deleteDataGenHarmonicConfig(frequency_data_config_rawid, harmonicName);

        HashMap<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("data", "");
        return result;
    }


    public HashMap<String, Object> getDataGenHarmonicConfigsSimulation(
            Long rawid, String dataType, Double amplitude_min, Double amplitude_max, Double rpm, Double bearing_1x) {

        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        List<FrequencyDataGenConfig> dataGenConfigs = frequencyDataGenMapper.getDataGenConfigByRawid(rawid);
        FrequencyDataGenConfig dataGenConfig = dataGenConfigs.get(0);

        FrequencyDataGenDatas datas = getGenHarmonicDataSimulation(dataGenConfig.getEqpId(), dataGenConfig.getParamId(), dataType, amplitude_min, amplitude_max, rpm, bearing_1x,
                dataGenConfig.getSamplingTime(), dataGenConfig.getSamplingCount());


        HashMap<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("data", datas);
        return result;
    }

    @Transactional
    public HashMap<String, Object> getDataGenHarmonicConfigsautoConfig(
            Long rawid, String dataType, Double amplitude_min, Double amplitude_max, Double rpm, Double bearing_1x) {

        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        HashMap<String, Object> result = new HashMap<>();

        try {

            List<FrequencyDataGenConfig> dataGenConfigs = frequencyDataGenMapper.getDataGenConfigByRawid(rawid);
            FrequencyDataGenConfig dataGenConfig = dataGenConfigs.get(0);

            List<FrequencyHarmonic> harmonics = FrequencyDataGenerator.getAutoGenHarmonics(dataType, dataGenConfig.getSamplingTime(), dataGenConfig.getSamplingCount(), amplitude_min, amplitude_max, rpm, bearing_1x);

            frequencyDataGenMapper.deleteDataGenHarmonicConfigByParentId(dataGenConfig.getRawid());

            for (int i = 0; i < harmonics.size(); i++) {
                FrequencyHarmonic harmonic = harmonics.get(i);

                FrequencyDataGenHarmonicConfig dataGenHarmonicConfig = new FrequencyDataGenHarmonicConfig();

                dataGenHarmonicConfig.setHarmonicFrequency(harmonic.getFrequency());
                dataGenHarmonicConfig.setHarmonicName(harmonic.getName());
                dataGenHarmonicConfig.setAmplitude_current(harmonic.getAmplitude_start());
                dataGenHarmonicConfig.setAmplitude_start(harmonic.getAmplitude_start());
                dataGenHarmonicConfig.setAmplitude_end(harmonic.getAmplitude_end());
                dataGenHarmonicConfig.setFrequency_data_config_rawid(dataGenConfig.getRawid());

                frequencyDataGenMapper.insertDataGenHarmonicConfig(dataGenHarmonicConfig);
            }
        } catch (Exception err) {
            result.put("result", "fail");
            result.put("data", err.getMessage());
            return result;
        }

        result.put("result", "success");
        result.put("data", "");
        return result;
    }

    public FrequencyDataGenDatas getGenHarmonicDataSimulation(long eqpId, long paramId, String dataType, Double amplitude_min, Double amplitude_max, Double rpm, Double bearing_1x, double samplingTime, int samplingCount) {

        double frequencyInterval = 1 / samplingTime;

        FrequencyData frequencyData = FrequencyDataGenerator.getGenHarmonicDataSimulation(dataType, amplitude_min, amplitude_max, rpm, bearing_1x, samplingTime, samplingCount);

        FrequencyDataGenDatas datas = new FrequencyDataGenDatas();
        datas.setEqpId(eqpId);
        datas.setdFrequency(frequencyData.getFrequencyData());
        datas.setdTimeWave(frequencyData.getTimeWaveData());
        datas.setParamId(paramId);
        datas.setFrequencyInterval(frequencyInterval);


        return datas;
    }

    //    @Scheduled(cron="*/30 * * * * *")
    public void runGenerator() {
        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, this.fabId, FrequencyDataGenMapper.class);

        SKFPumpMapper pumpMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);


        List<FrequencyDataGenConfig> dataGenConfigs = frequencyDataGenMapper.getDataGenConfig();
        Random rnd = new Random(new Date().getTime());

        for (int i = 0; i < dataGenConfigs.size(); i++) {

            FrequencyDataGenConfig dataGenConfig = dataGenConfigs.get(i);
            List<FrequencyHarmonic> harmonics = new ArrayList<>();
            Date now = new Date();
            long difMillisecond = now.getTime() - dataGenConfig.getModify_dtts().getTime();

            double intervalRate = 0;
            if (difMillisecond / 1000 / 60 > dataGenConfig.getDuration()) {
                //update update_dtts
                intervalRate = 0;

                frequencyDataGenMapper.updateDataGenConfig(dataGenConfig.getRawid(), null, null,new Date(), null, null, null, null);
            } else {
                intervalRate = difMillisecond / 1000 / 60.0 / dataGenConfig.getDuration();
            }

            List<FrequencyDataGenHarmonicConfig> dataGenHarmonicConfigs = frequencyDataGenMapper.getDataGenHarmonicConfig(dataGenConfig.getRawid());

            for (int j = 0; j < dataGenHarmonicConfigs.size(); j++) {
                FrequencyDataGenHarmonicConfig dataGenHarmonicConfig = dataGenHarmonicConfigs.get(j);
                FrequencyHarmonic harmonic = new FrequencyHarmonic();
                harmonic.setFrequency(dataGenHarmonicConfig.getHarmonicFrequency());
                harmonic.setName(dataGenHarmonicConfig.getHarmonicName());
                harmonic.setAmplitude_start(dataGenHarmonicConfig.getAmplitude_start());
                harmonic.setAmplitude_end(dataGenHarmonicConfig.getAmplitude_end());

                double interval = (dataGenHarmonicConfig.getAmplitude_end() - dataGenHarmonicConfig.getAmplitude_start()) * intervalRate;
                double randomVariable = (dataGenHarmonicConfig.getAmplitude_end() - dataGenHarmonicConfig.getAmplitude_start()) * 0.1 * (rnd.nextBoolean() ? 1 : -1);
                double newAmplitude = harmonic.getAmplitude_start() + interval + randomVariable;
                if (newAmplitude > harmonic.getAmplitude_end()) {
                    newAmplitude = harmonic.getAmplitude_end();
                }
                harmonic.setAmplitude(newAmplitude);

                System.out.println(String.format("EqpId:%s ParamName:%s Amplitude:%s", dataGenConfig.getEqpId(), dataGenConfig.getParamId(), newAmplitude));


                harmonics.add(harmonic);

            }
            FrequencyData frequencyData = FrequencyDataGenerator.getFrequencyData(dataGenConfig.getSamplingTime(), dataGenConfig.getSamplingCount(), harmonics);

            Date date = new Date();

            OverallMinuteTrx overallMinuteTrx = new OverallMinuteTrx();
            overallMinuteTrx.setParam_id(dataGenConfig.getParamId());
            overallMinuteTrx.setRead_dtts(date);
            overallMinuteTrx.setRpm(dataGenConfig.getRpm());
            overallMinuteTrx.setValue(frequencyData.getOverall());
            pumpMapper.insertOverallMinuteTrx(overallMinuteTrx);

            MeasureTrx measureTrx = new MeasureTrx();
            measureTrx.setMeasure_dtts(date);
            measureTrx.setParam_id(dataGenConfig.getParamId());
            measureTrx.setRpm(Double.valueOf(String.valueOf(dataGenConfig.getRpm())));
            measureTrx.setSpectra_line(dataGenConfig.getSamplingCount());
            measureTrx.setEnd_freq(Long.valueOf(String.valueOf(dataGenConfig.getSamplingCount() / 2.0 / dataGenConfig.getSamplingTime())));
            measureTrx.setValue(frequencyData.getOverall());
            pumpMapper.insertMeasureTrx(measureTrx);

            //TimeWave
            MeasureTrxBin measureTrxBin = new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("0");
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            measureTrxBin.setScale_factor(0.0);
            measureTrxBin.setBinary(doubleToByteArray(frequencyData.getTimeWaveData()));
            pumpMapper.insertMeasureTrxBin(measureTrxBin);

            //Frequency
            measureTrxBin = new MeasureTrxBin();
            measureTrxBin.setBin_data_type_cd("1");
            measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
            measureTrxBin.setScale_factor(0.0);
            measureTrxBin.setBinary(doubleToByteArray(frequencyData.getFrequencyData()));
            pumpMapper.insertMeasureTrxBin(measureTrxBin);


        }

    }

    public HashMap<String, Object> frequencyDataGeneratorByPeriod(String fabId, long eqpId, long paramId, Date fromDate, Date toDate, int overallCreateIntervalMinute, int frequencyCreateIntervalMinute) {
        HashMap<String, Object> result = new HashMap<>();

        FrequencyDataGenMapper frequencyDataGenMapper = SqlSessionUtil.getMapper(sessions, fabId, FrequencyDataGenMapper.class);

        SKFPumpMapper pumpMapper = SqlSessionUtil.getMapper(sessions, fabId, SKFPumpMapper.class);

        MeasureTrxMapper measureTrxMapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);

        pumpMapper.deleteMeasureTrxBinByParamId(paramId,fromDate,toDate);
        pumpMapper.deleteMeasureTrxByParamId(paramId,fromDate,toDate);

        pumpMapper.deleteOverallMinuteTrxByParamId(paramId,fromDate,toDate);

        long measureIdCount = measureTrxMapper.selectMaxMeasureTrxId();

        measureIdCount += 1;

        List<FrequencyDataGenConfig> dataGenConfigs = frequencyDataGenMapper.getDataGenConfigByEqpIdParamId(eqpId, paramId);

        if (dataGenConfigs.size() == 0) {
            result.put("result", "fail");
            result.put("data", "There is no data.");
            return result;
        }
        if (overallCreateIntervalMinute > frequencyCreateIntervalMinute) {
            result.put("result", "fail");
            result.put("data", "measureCreateIntervalMinute is more than frequencyCreateIntervalMinut.");
            return result;
        }

        Random rnd = new Random(new Date().getTime());

        long lToDate = toDate.getTime();
        long startDate = fromDate.getTime();
        long lastFrequency = fromDate.getTime();
        long lastModifyDate = startDate;
        boolean isFirst = true;

        int directCount =0;
        int direct = 1;

        while (startDate <= lToDate) {
            boolean isFrequencyTime = false;
            if(startDate -lastFrequency >= frequencyCreateIntervalMinute*1000*60){
                lastFrequency = startDate;
                isFrequencyTime = true;
            }

            if(directCount<=0){
                directCount =rnd.nextInt(50-1+1)+1;
                 direct = (rnd.nextInt()>3 ? 1 : -1);
            }
            directCount=directCount - 1;
            for (int i = 0; i < dataGenConfigs.size(); i++) {

                System.out.println(String.format("Current:%s",new Date(startDate)));
                FrequencyDataGenConfig dataGenConfig = dataGenConfigs.get(i);
                List<FrequencyHarmonic> harmonics = new ArrayList<>();

//                long difMillisecond = startDate - dataGenConfig.getModify_dtts().getTime();
                long difMillisecond = startDate - lastModifyDate;

                double intervalRate = 0;
                if (isFirst || difMillisecond / 1000 / 60 > dataGenConfig.getDuration()) {
                    //update update_dtts
                    intervalRate = 0;
                    isFirst = false;

//                    frequencyDataGenMapper.updateDataGenConfig(dataGenConfig.getRawid(), null, null,new  Date( startDate), null, null, null, null);
                    lastFrequency=startDate;
                    lastModifyDate = startDate;
                } else {
                    intervalRate = difMillisecond / 1000 / 60.0 / dataGenConfig.getDuration();
                }

                List<FrequencyDataGenHarmonicConfig> dataGenHarmonicConfigs = frequencyDataGenMapper.getDataGenHarmonicConfig(dataGenConfig.getRawid());


                double randomrate = rnd.nextDouble()*0.1;
                for (int j = 0; j < dataGenHarmonicConfigs.size(); j++) {
                    FrequencyDataGenHarmonicConfig dataGenHarmonicConfig = dataGenHarmonicConfigs.get(j);
                    FrequencyHarmonic harmonic = new FrequencyHarmonic();
                    harmonic.setFrequency(dataGenHarmonicConfig.getHarmonicFrequency());
                    harmonic.setName(dataGenHarmonicConfig.getHarmonicName());
                    harmonic.setAmplitude_start(dataGenHarmonicConfig.getAmplitude_start());
                    harmonic.setAmplitude_end(dataGenHarmonicConfig.getAmplitude_end());
//
                    double interval = (dataGenHarmonicConfig.getAmplitude_end() - dataGenHarmonicConfig.getAmplitude_start()) * intervalRate;
                    double randomVariable =(harmonic.getAmplitude_end()- harmonic.getAmplitude_start())* (0.01+ randomrate)  * direct ;
                    double newAmplitude = harmonic.getAmplitude_start() + interval + randomVariable;
//                    double newAmplitude = harmonic.getAmplitude_start() + interval;
                    if (newAmplitude > harmonic.getAmplitude_end()) {
                        newAmplitude = harmonic.getAmplitude_end();
                    }
                    harmonic.setAmplitude(newAmplitude);

//                    System.out.println(String.format("EqpId:%s ParamName:%s Amplitude:%s intervalRate:%s interval:%s ", dataGenConfig.getEqpId(), dataGenConfig.getParamId(), newAmplitude,intervalRate,interval));


                    harmonics.add(harmonic);

                }
                FrequencyData frequencyData = FrequencyDataGenerator.getFrequencyData(dataGenConfig.getSamplingTime(), dataGenConfig.getSamplingCount(), harmonics);


                OverallMinuteTrx overallMinuteTrx = new OverallMinuteTrx();
                overallMinuteTrx.setParam_id(dataGenConfig.getParamId());
                overallMinuteTrx.setRead_dtts(new Date(startDate));
                overallMinuteTrx.setRpm(dataGenConfig.getRpm());
                overallMinuteTrx.setValue(frequencyData.getOverall());
                pumpMapper.insertOverallMinuteTrx(overallMinuteTrx);

                if(isFrequencyTime) {
                    MeasureTrx measureTrx = new MeasureTrx();
                    measureTrx.setMeasure_dtts(new Date(startDate));
                    measureTrx.setParam_id(dataGenConfig.getParamId());
                    measureTrx.setRpm(Double.valueOf(String.valueOf(dataGenConfig.getRpm())));
                    measureTrx.setSpectra_line(dataGenConfig.getSamplingCount());
                    measureTrx.setEnd_freq(Long.valueOf( Math.round( dataGenConfig.getSamplingCount() / 2.0 / dataGenConfig.getSamplingTime())));
                    measureTrx.setValue(frequencyData.getOverall());
                    measureTrx.setMeasure_trx_id(measureIdCount++);
                    pumpMapper.insertMeasureTrx(measureTrx);

                    //TimeWave
                    MeasureTrxBin measureTrxBin = new MeasureTrxBin();
                    measureTrxBin.setBin_data_type_cd("2");
                    measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
                    measureTrxBin.setScale_factor(0.0);
                    measureTrxBin.setBinary(doubleToByteArray(frequencyData.getTimeWaveData()));
                    pumpMapper.insertMeasureTrxBin(measureTrxBin);

                    //Frequency
                    measureTrxBin = new MeasureTrxBin();
                    measureTrxBin.setBin_data_type_cd("0");
                    measureTrxBin.setMeasure_trx_id(measureTrx.getMeasure_trx_id());
                    measureTrxBin.setScale_factor(0.0);
                    measureTrxBin.setBinary(doubleToByteArray(frequencyData.getFrequencyData()));
                    pumpMapper.insertMeasureTrxBin(measureTrxBin);
                }

            }
            startDate += overallCreateIntervalMinute*1000*60;
        }
        result.put("result", "success");
        result.put("data", "");
        return result;
    }

}
