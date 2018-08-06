package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;

import com.bistel.a3.portal.service.pdm.IMasterService;
import com.bistel.a3.portal.util.ApacheHttpClientGet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("pdm/fabs/{fabId}/eqps/{eqpId}/params")
public class ParamController {
    @Autowired
    private IMasterService service;


    @RequestMapping
    public Object getParams(@PathVariable String fabId, @PathVariable Long eqpId) {
        return service.getParams(fabId, eqpId);
    }

    @RequestMapping("{paramId}")
    public Object getParam(@PathVariable String fabId, @PathVariable Long paramId) {
        return service.getParam(fabId, paramId);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void removeParams( @PathVariable String fabId, @PathVariable Long eqpId, @RequestParam Long[] paramIds) {
        service.removeParams(fabId, eqpId, paramIds);

    }

    @RequestMapping(method = RequestMethod.PUT)
    public void setParam(Principal user,@PathVariable String fabId, @PathVariable Long eqpId, @RequestBody ParamWithCommonWithRpm param) {
        param.setUserName(user.getName());
        service.setParam(fabId, eqpId ,param);
    }

    @RequestMapping(value = "{paramId}", method = RequestMethod.DELETE)
    public void removeParam(@PathVariable String fabId, @PathVariable Long eqpId, @PathVariable Long paramId) {
        service.removeParam(fabId, eqpId, paramId);
    }

}
