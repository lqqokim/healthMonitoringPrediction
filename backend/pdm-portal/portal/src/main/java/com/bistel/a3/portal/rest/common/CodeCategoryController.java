package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.CodeCategoryMapper;
import com.bistel.a3.portal.dao.common.CodeMapper;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.common.CodeCategory;
import com.bistel.a3.portal.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Created by yohan on 15. 11. 17.
 */
@RestController
@RequestMapping("/apps/{appName}/codecategories")
@Transactional
public class CodeCategoryController {
    @Autowired
    private CodeCategoryMapper codeCategoryMapper;

    @Autowired
    private CodeMapper codeMapper;

    @RequestMapping
    public List<CodeCategory> gets(@PathVariable String appName) {
        return codeCategoryMapper.selectByAppName(appName);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public void set(@PathVariable String appName, @RequestBody CodeCategory codeCategory) {
        codeCategoryMapper.insert(appName, codeCategory);
    }

    @RequestMapping("/{categoryName}")
    public CodeCategory gets(@PathVariable String appName, @PathVariable String categoryName) {
        return codeCategoryMapper.selectByName(appName, categoryName);
    }

    @RequestMapping(value = "/{categoryName}", method = RequestMethod.PUT)
    public void set(@PathVariable String appName, @PathVariable String categoryName, @RequestBody CodeCategory codeCategory) {
        CodeCategory cate = codeCategoryMapper.selectByName(appName, categoryName);
        cate.setName(codeCategory.getName());
        codeCategoryMapper.update(cate);
    }

    @RequestMapping(value = "/{categoryName}", method = RequestMethod.DELETE)
    public void remove(@PathVariable String appName, @PathVariable String categoryName) {
        CodeCategory cate = codeCategoryMapper.selectByName(appName, categoryName);
        codeMapper.deleteByCategoryId(cate.getCodeCategoryId());
        codeCategoryMapper.delete(cate);
    }

    @RequestMapping("/{categoryName}/codes")
    public List<Code> getCodes(@PathVariable String appName, @PathVariable String categoryName, @RequestParam Map<String, String> params) {
        if(params.isEmpty()) {
            return codeMapper.selectByCategoryName(appName, categoryName, null);
        } else {
            return codeMapper.selectByCategoryName(appName, categoryName, StringUtil.parseBoolean(params.get("used")));
        }
    }

    @RequestMapping(value = "/{categoryName}/codes", method = RequestMethod.PUT)
    public void setCodes(@PathVariable String appName, @PathVariable String categoryName, @RequestBody List<Code> codes) {
        CodeCategory codeCategory = codeCategoryMapper.selectByName(appName, categoryName);
        for(Code code : codes) {
            code.setCodeCategoryId(codeCategory.getCodeCategoryId());
            codeMapper.insert(code);
        }
    }

    @RequestMapping(value = "/{categoryName}/codes", method = RequestMethod.DELETE)
    public void removeCodes(@RequestBody List<Code> codes) {
        for(Code code : codes) {
            codeMapper.delete(code);
        }
    }
}
