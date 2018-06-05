package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.std.master.STDCode;
import com.bistel.a3.portal.service.pdm.IPDMCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("pdm")
public class CodeController {
    @Autowired private IPDMCodeService codeService;

    @Autowired private com.bistel.a3.portal.service.pdm.impl.std.CodeService pdmCodeService;

    @RequestMapping("category/{codeCategory}")
    public Object code(@PathVariable String codeCategory) {
        return codeService.getCode("PDM", codeCategory, true);
    }



//    PDM Code

    @RequestMapping("fabs/{fabId}/std/categories/{category}")
    public Object STDCode(@PathVariable String fabId, @PathVariable String category) {
        return pdmCodeService.getCode(fabId,category, true);
    }

    //Allen 2018-04-02

    //get codeList
    @RequestMapping(value = "fabs/{fabId}/std/codes", method = RequestMethod.GET)
    public Object STDGetCodeList(@PathVariable String fabId) {
        return pdmCodeService.getCodeList(fabId);
    }

    //get codecategory list
    @RequestMapping(value="fabs/{fabId}/std/categories", method = RequestMethod.GET)
    public Object STDGetCategories(@PathVariable String fabId) {
        return pdmCodeService.getCategories(fabId);
    }


    @RequestMapping(value="fabs/{fabId}/std/codes")
    public Object getCodesByCategory(@RequestParam("category") String category,@PathVariable String fabId)
    {
        return pdmCodeService.getCodesByCategory(fabId,category);
    }


    //post(insert) code
    @RequestMapping(value="fabs/{fabId}/std/codes",method = RequestMethod.POST)
    public void STDAddCode(Principal user, @RequestBody STDCode code, @PathVariable String fabId) {
        //code.setUserName(user.getName());

        code.setUser_name(user.getName());
        pdmCodeService.addCode(fabId,code);
    }

    //put(update) code
    @RequestMapping(value="fabs/{fabId}/std/codes/rawId/{rawId}",method = RequestMethod.PUT)
    public void STDupdateCode(Principal user,@RequestBody STDCode code,@PathVariable String fabId,@PathVariable Long rawId) {

        code.setUser_name(user.getName());
        pdmCodeService.updateCode(fabId,code,rawId);
    }

    //put(update) ordering
    @RequestMapping(value="fabs/{fabId}/std/codes/ordering",method = RequestMethod.PUT)
    public void STDupdateOrder(Principal user, @PathVariable String fabId, @RequestBody List<STDCode> codes) {

        for (int i = 0; i <codes.size() ; i++) {
            codes.get(i).setUser_name(user.getName());
        }
        pdmCodeService.updateOrdering(fabId,codes);
    }


    //delete code
    @RequestMapping(value="fabs/{fabId}/std/codes/rawId/{rawId}",method = RequestMethod.DELETE)
    public void STDDeleteCode(@PathVariable Long rawId,@PathVariable String fabId) {

        pdmCodeService.deleteCode(fabId,rawId);
    }
    /*
    @RequestMapping(value="/{eqpId}/eqpCopy", method = RequestMethod.POST)
    public void eqpCopy(@PathVariable String fabId, @PathVariable Long eqpId,  @RequestBody List<String> toEqpNames ) {
        service.eqpCopy(fabId, eqpId, toEqpNames);
    }
    */


}
