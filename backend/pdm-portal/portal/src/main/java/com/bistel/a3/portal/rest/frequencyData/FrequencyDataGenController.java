package com.bistel.a3.portal.rest.frequencyData;

import com.bistel.a3.portal.domain.pdm.master.AreaWithChildren;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.bistel.a3.portal.service.pdm.IMasterService;
import com.bistel.a3.portal.service.pdm.impl.ulsan.FrequencyDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/datagenerator")
public class FrequencyDataGenController {
    @Autowired
    FrequencyDataService frequencyDataService;

    @Autowired
    private IMasterService masterService;


    @RequestMapping(value = "/dataGenConfigs",method = RequestMethod.POST)
    HashMap<String,Object> createDateGenConfig(@RequestBody HashMap<String,Object> bodyDatas) {

        long eqpId =Long.valueOf( bodyDatas.get("eqpId").toString());
        long paramId =Long.valueOf( bodyDatas.get("paramId").toString());
        Double samplingTime =Double.valueOf( bodyDatas.get("samplingTime").toString());
        int samplingCount =Integer.valueOf( bodyDatas.get("samplingCount").toString());
        long duration =Long.valueOf( bodyDatas.get("duration").toString());
        long rpm =Long.valueOf( bodyDatas.get("rpm").toString());

        return frequencyDataService.createDateGenConfig(eqpId,paramId,samplingTime,samplingCount,duration,rpm);
    }
    @RequestMapping(value = "/dataGenConfigs",method = RequestMethod.PUT)
    HashMap<String,Object> modifyDataGenConfigs(@RequestBody HashMap<String,Object> bodyDatas) {

        long rawid =Long.valueOf( bodyDatas.get("rawid").toString());
        long eqpId =Long.valueOf(bodyDatas.get("eqpId").toString());
        long paramId =Long.valueOf(bodyDatas.get("paramId").toString());
        Double samplingTime =Double.valueOf(bodyDatas.get("samplingTime").toString());
        int samplingCount =Integer.valueOf( bodyDatas.get("samplingCount").toString());
        long duration =Long.valueOf( bodyDatas.get("duration").toString());
        long rpm =Long.valueOf( bodyDatas.get("rpm").toString());

        return frequencyDataService.modifyDataGenConfigs(rawid,eqpId,paramId,samplingTime,samplingCount,duration,rpm);
    }

    @RequestMapping(value = "/dataGenConfigs",method = RequestMethod.GET)
    HashMap<String,Object> getDataGenConfigs(@RequestParam Map<String, Object> allRequestParams) {
        return frequencyDataService.getDataGenConfigs();
    }

    @Transactional
    @RequestMapping(value = "/dataGenConfigs/{rawid}",method = RequestMethod.DELETE)
    HashMap<String,Object> deleteDataGenConfigs(@PathVariable Long rawid,@RequestParam Map<String, Object> allRequestParams) {
        return frequencyDataService.deleteDataGenConfigs(rawid);
    }

    @RequestMapping(value = "/dataGenConfigs/{rawid}/dataGenHarmonicConfigs",method = RequestMethod.POST)
    HashMap<String,Object> createDataGenHarmonicCongis(@PathVariable Long rawid,
                                                       @RequestBody HashMap<String,Object> bodyDatas) {


        String harmonicName = (String) bodyDatas.get("harmonicName");
        Double harmonicFrequency = Double.valueOf((String) bodyDatas.get("harmonicFrequency"));
        Double amplitude_start = Double.valueOf((String)  bodyDatas.get("amplitude_start"));
        Double amplitude_end = Double.valueOf((String)  bodyDatas.get("amplitude_end"));

        return  frequencyDataService.createDataGenHarmonicCongis(rawid,harmonicName,harmonicFrequency,amplitude_start,amplitude_end);
    }
    @RequestMapping(value = "/dataGenConfigs/{frequency_data_config_rawid}/dataGenHarmonicConfigs",method = RequestMethod.PUT)
    HashMap<String,Object> modifyDataGenHarmonicCongis(@PathVariable Long frequency_data_config_rawid,
                                                       @RequestBody HashMap<String,Object> bodyDatas) {

        String harmonicName = (String) bodyDatas.get("harmonicName");
        Double harmonicFrequency = Double.valueOf( bodyDatas.get("harmonicFrequency").toString());
        Double amplitude_start = Double.valueOf(bodyDatas.get("amplitude_start").toString());
        Double amplitude_end = Double.valueOf( bodyDatas.get("amplitude_end").toString());

        return frequencyDataService.modifyDataGenHarmonicCongis(frequency_data_config_rawid,harmonicName,harmonicFrequency,amplitude_start,amplitude_end);

    }

    @RequestMapping(value = "/dataGenConfigs/{rawid}/dataGenHarmonicConfigs",method = RequestMethod.GET)
    HashMap<String,Object> getDataGenHarmonicConfigs(@PathVariable Long rawid,@RequestParam Map<String, Object> allRequestParams) {
        return frequencyDataService.getDataGenHarmonicConfigs(rawid);
    }
    @Transactional
    @RequestMapping(value = "/dataGenConfigs/dataGenHarmonicConfigs/{frequency_data_config_rawid}/{harmonicName}",method = RequestMethod.DELETE)
    HashMap<String,Object> deleteDataGenHarmonicConfigs(@PathVariable Long frequency_data_config_rawid,@PathVariable String harmonicName,
            @RequestParam Map<String, Object> allRequestParams) {

        return frequencyDataService.deleteDataGenHarmonicConfigs(frequency_data_config_rawid,harmonicName);
    }


    @RequestMapping(value = "/dataGenConfigs/dataGenHarmonicConfigs/simulation",method = RequestMethod.GET)
    HashMap<String,Object> getDataGenHarmonicConfigsSimulation(
            @RequestParam Map<String, Object> allRequestParams) {

        Long rawid = Long.valueOf(allRequestParams.get("rawid").toString());
        String dataType = (String)allRequestParams.get("dataType");
        Double amplitude_min = Double.valueOf( allRequestParams.get("amplitude_min").toString());
        Double amplitude_max = Double.valueOf( allRequestParams.get("amplitude_max").toString());
        Double rpm = Double.valueOf( allRequestParams.get("rpm").toString());
        Double bearing_1x = Double.valueOf( allRequestParams.get("bearing_1x").toString());

        return frequencyDataService.getDataGenHarmonicConfigsSimulation(rawid,dataType,amplitude_min,amplitude_max,rpm,bearing_1x);
    }
    @Transactional
    @RequestMapping(value = "/dataGenConfigs/dataGenHarmonicConfigs/autoConfig",method = RequestMethod.POST)
    HashMap<String,Object> getDataGenHarmonicConfigsAutoConfig(
            @RequestBody Map<String, Object> bodyDatas) {


        Long rawid = Long.valueOf(bodyDatas.get("rawid").toString());
        String dataType = (String) bodyDatas.get("dataType");
        Double amplitude_min = Double.valueOf(bodyDatas.get("amplitude_min").toString());
        Double amplitude_max = Double.valueOf(bodyDatas.get("amplitude_max").toString());
        Double rpm = Double.valueOf(bodyDatas.get("rpm").toString());
        Double bearing_1x = Double.valueOf(bodyDatas.get("bearing_1x").toString());

        return frequencyDataService.getDataGenHarmonicConfigsautoConfig(rawid,dataType,amplitude_min,amplitude_max,rpm,bearing_1x);
    }

    @RequestMapping(value = "/frequencyDatas",method = RequestMethod.POST)
    HashMap<String,Object> generatorFrequencyDataByPeriod(@RequestBody Map<String, Object> bodyDatas) {
        String fabId= bodyDatas.get("fabId").toString();
        long eqpId=Long.valueOf( bodyDatas.get("eqpId").toString());
        long paramId=Long.valueOf( bodyDatas.get("paramId").toString());
        long fromDate =Long.valueOf( bodyDatas.get("fromDate").toString());
        long toDate =Long.valueOf( bodyDatas.get("toDate").toString());
        int overallIntervalMinute =Integer.valueOf( bodyDatas.get("overallInterval").toString());
        int frequencyIntervalMinute =Integer.valueOf( bodyDatas.get("frequencyInterval").toString());

        return frequencyDataService.frequencyDataGeneratorByPeriod(fabId,eqpId,paramId,new Date(fromDate),new Date(toDate),overallIntervalMinute,frequencyIntervalMinute);
    }

    @RequestMapping(value = "pdm/fabs/{fabId}/areas",method = RequestMethod.GET)
    HashMap<String,Object> getAreas(@PathVariable String fabId,
            @RequestParam Map<String, Object> allRequestParams) {

        List<AreaWithChildren> areaWithChildren = masterService.getAreas(fabId,(long)1);
        HashMap<String,Object> result = new HashMap<>();
        result.put("result","success");
        result.put("data",areaWithChildren);
        return result;

    }
    @RequestMapping(value = "pdm/fabs/{fabId}/areas/{areaId}/eqps",method = RequestMethod.GET)
    HashMap<String,Object> getEqps(@PathVariable String fabId,@PathVariable long areaId,
                                    @RequestParam Map<String, Object> allRequestParams) {

        List<EqpWithEtc> eqpWithEtcs = masterService.getEqps(fabId,areaId);
        HashMap<String,Object> result = new HashMap<>();
        result.put("result","success");
        result.put("data",eqpWithEtcs);
        return result;

    }
    @RequestMapping(value = "pdm/fabs/{fabId}/eqps/{eqpId}/params",method = RequestMethod.GET)
    HashMap<String,Object> getParams(@PathVariable String fabId,@PathVariable long eqpId,
                                    @RequestParam Map<String, Object> allRequestParams) {

        List<ParamWithCommonWithRpm> paramWithCommonWithRpms = masterService.getParams(fabId,eqpId);
        HashMap<String,Object> result = new HashMap<>();
        result.put("result","success");
        result.put("data",paramWithCommonWithRpms);
        return result;

    }


}
