package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.service.pdm.IElectricCurrentSerivce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("pdm")
public class CurrentContoller {
    @Autowired
    private IElectricCurrentSerivce currentService;


    @RequestMapping(method = RequestMethod.POST, value = "/currentpattern")
    public HashMap<String, Object> getCurrentPattern(
            @RequestParam Map<String, Object> allRequestParams,
            @RequestBody HashMap<String, Object> keyValues) {

        int iWindow = Integer.valueOf((String) allRequestParams.get("window"));
        int iNearCount = Integer.valueOf((String)allRequestParams.get("nearcount"));
        int iFarCount =  Integer.valueOf((String)allRequestParams.get("farcount"));

        List<Long> times = (List<Long>) keyValues.get("time");
        List<Double> values = (List<Double>) keyValues.get("values");
        return currentService.getCurrentPattern(iWindow,iNearCount,iFarCount,times,values);

    }




}
