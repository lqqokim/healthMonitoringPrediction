package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.dao.pdm.std.master.STDEqpMapper;
import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.domain.pdm.std.master.STDConditionalSpec;
import com.bistel.a3.portal.service.pdm.IMasterService;
import com.bistel.a3.portal.util.ApacheHttpClientGet;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class ConditionalSpecController {
    @Autowired private IMasterService service;

    @Autowired private ApacheHttpClientGet apacheHttpClientGet;

    @Autowired private Map<String, SqlSessionTemplate> sessions;


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
        //request to Kafka
    }

    @RequestMapping(value="/eqps/{eqpId}/conditions/{rule}/specs",method = RequestMethod.GET)
    public Object getSpecByEqpIdAndRule(@PathVariable String fabId, @PathVariable Long eqpId, @PathVariable Long rule) {
        return service.getSpecByEqpIdAndRule(fabId, eqpId, rule);
    }

    @RequestMapping(value="eqps/setEqpParamSpec", method = RequestMethod.PUT)
    public void setEqpParamSpec(Principal user, @PathVariable String fabId, @RequestBody List<STDConditionalSpec> eqpParamSpecList) {

        for (int i = 0; i < eqpParamSpecList.size(); i++) {
            eqpParamSpecList.get(i).setUserName(user.getName());
        }
        service.setEqpParamSpec(fabId, eqpParamSpecList);
        //request to Kafka

    }

    @RequestMapping(value="eqps/setEqpParamSpec/rule/{ruleId}/paramName/{param_name}/eqpSpecLinkId/{eqp_spec_link_mst_rawid}/getModelEqpSpec", method = RequestMethod.GET)
    public Object getModelEqpSpec(Principal user, @PathVariable String fabId, @PathVariable String param_name, @PathVariable Long eqp_spec_link_mst_rawid, @PathVariable Long ruleId ) {
        return service.getModelEqpSpec(fabId, param_name, eqp_spec_link_mst_rawid, ruleId);

    }

    @RequestMapping(value="eqps/setEqpParamSpec/paramName/{param_name}/eqpSpecLinkId/{eqp_spec_link_mst_rawid}/revertToModelSpec", method = RequestMethod.DELETE)
    public void revertToModelSpec(Principal user, @PathVariable String fabId, @PathVariable String param_name, @PathVariable Long eqp_spec_link_mst_rawid ) {
        service.revertToModelSpec(fabId, param_name, eqp_spec_link_mst_rawid);

    }


}
