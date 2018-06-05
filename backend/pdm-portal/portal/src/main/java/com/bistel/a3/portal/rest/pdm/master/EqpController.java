package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.service.pdm.IMasterService;
import com.bistel.a3.portal.service.pdm.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}/areas/{areaId}/eqps")
public class EqpController {
    @Autowired
    private IMasterService masterService;

    @Autowired
    private IReportService reportService;


    @RequestMapping(value = "paramNameByEqpIds",method = RequestMethod.POST)
    public List<String> getParams(@PathVariable String fabId, @RequestBody  List<Long> eqpIds) {
        return masterService.getParamNamesByEqps(fabId, eqpIds);
    }
    @RequestMapping(value = "eqpsByAreaIds",method = RequestMethod.POST)
    public Object getEqpsByAreaIds(@PathVariable String fabId, @RequestBody  List<Long> areaIds) {
        return masterService.getEqpsByAreaIds(fabId, areaIds);
    }


    @RequestMapping
    public Object getEqps(@PathVariable String fabId, @PathVariable Long areaId) {
        return masterService.getEqps(fabId, areaId);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void removeEqps(@PathVariable String fabId, @PathVariable Long areaId, @RequestParam Long[] eqpIds) {
        masterService.removeEqps(fabId, areaId, eqpIds);
    }

    @RequestMapping("{eqpId}")
    public Object getEqp(@PathVariable String fabId, @PathVariable Long areaId, @PathVariable Long eqpId) {
        return masterService.getEqp(fabId, areaId, eqpId);
    }
    @RequestMapping("{eqpId}/paramInfo")
    public List<ParamWithCommon> getParamWtihTypeByEqp(@PathVariable String fabId, @PathVariable Long areaId, @PathVariable Long eqpId) {
        return reportService.getParamWtihTypeByEqp(fabId,eqpId);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public void setEqp(Principal user,@PathVariable String fabId, @RequestBody EqpWithEtc eqp) {
        eqp.setUserName(user.getName());
        masterService.setEqp(fabId, eqp);
    }

    @RequestMapping(value = "{eqpId}", method = RequestMethod.DELETE)
    public void removeEqp( @PathVariable String fabId, @PathVariable Long areaId, @PathVariable Long eqpId) {
        masterService.removeEqp(fabId, areaId, eqpId);
    }
    @RequestMapping(value="/{eqpId}/eqpCopy", method = RequestMethod.POST)
    public void eqpCopy(Principal user, @PathVariable String fabId, @PathVariable Long eqpId,  @RequestBody List<String> toEqpNames ) {
        masterService.eqpCopy(user.getName(),fabId, eqpId, toEqpNames);
    }

}
