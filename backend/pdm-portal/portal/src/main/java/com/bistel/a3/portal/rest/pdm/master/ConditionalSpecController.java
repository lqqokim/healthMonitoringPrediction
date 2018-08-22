package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.domain.pdm.std.master.STDConditionalSpec;
import com.bistel.a3.portal.service.pdm.IMasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class ConditionalSpecController {
    @Autowired
    private IMasterService service;


    //*********************************************
    //      Conditional Spec Model Management
    //*********************************************
    //2
    @RequestMapping(value="models",method = RequestMethod.GET)
    public Object getModels(@PathVariable String fabId) {
        return service.getModels(fabId);
    }
    //3
    @RequestMapping(value="models/{model}",method = RequestMethod.GET)
    public Object getConditionsByModel(@PathVariable String fabId, @PathVariable String model) {
        return service.getConditionsByModel(fabId, model);
    }
    //4
    @RequestMapping(value="models/{model}/specs/{rule}",method = RequestMethod.GET)
    public Object getSpecByRule(@PathVariable String fabId, @PathVariable String model, @PathVariable Long rule) {

        return service.getSpecByRule(fabId, model, rule);

    }
    @RequestMapping(value="models/{model}/specs",method = RequestMethod.GET)
    public Object getSpec(@PathVariable String fabId, @PathVariable String model) {

        Long rule=0L;
        return service.getSpecByRule(fabId, model, rule);

    }

    //5
    @RequestMapping(value="models/{model}/paramList",method = RequestMethod.GET)
    public Object getAllParametersByModel(@PathVariable String fabId, @PathVariable String model) {
        return service.getAllParametersByModel(fabId, model);
    }

    //6
    @RequestMapping(value="models/setModel", method = RequestMethod.PUT)
    public void setModel(Principal user, @PathVariable String fabId, @RequestBody STDConditionalSpec model) {

        model.setUserName(user.getName());
        service.setModel(fabId, model);
    }

    @RequestMapping(value="models/rule/{rule}/deleteModel", method = RequestMethod.DELETE)
    public void deleteModel(Principal user, @PathVariable String fabId,  @PathVariable Long rule) {

        service.deleteModel(fabId, rule);
    }



    @RequestMapping(value="models/{model}/{rule}",method = RequestMethod.GET)
    public Object getConditionsByModelAndRule(@PathVariable String fabId, @PathVariable String model, @PathVariable String rule) {
        return service.getConditionsByModelAndRule(fabId, model, rule);
    }

    //*********************************************
    //      Conditional Spec EQP Management
    //*********************************************

    @RequestMapping(value="eqps/{eqpId}/conditions",method = RequestMethod.GET)
    public Object getConditionsByEqpId(@PathVariable String fabId, @PathVariable Long eqpId) {
        return service.getConditionsByEqpId(fabId, eqpId);
    }

    @RequestMapping(value="eqps/{eqpId}/setEqpRule", method = RequestMethod.PUT)
    public void setEqpRule(Principal user, @PathVariable String fabId, @PathVariable Long eqpId,  @RequestBody List<STDConditionalSpec> eqpRuleList) {

        for (int i = 0; i < eqpRuleList.size(); i++) {
            eqpRuleList.get(i).setUserName(user.getName());
        }
        service.setEqpRule(fabId, eqpId,eqpRuleList);

    }

    @RequestMapping(value="/eqps/{eqpId}/conditions/{rule}/specs",method = RequestMethod.GET)
    public Object getSpecByEqpIdAndRule(@PathVariable String fabId, @PathVariable Long eqpId, @PathVariable Long rule) {
        return service.getSpecByEqpIdAndRule(fabId, eqpId, rule);
    }



}
